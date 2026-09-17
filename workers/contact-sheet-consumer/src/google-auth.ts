import { z } from "zod";

import { readBoundedJson } from "./bounded-json";
import { parseRetryAfterSeconds, UpstreamRequestError } from "./errors";

export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_SHEETS_SCOPE =
  "https://www.googleapis.com/auth/spreadsheets";
const googleOauthTimeoutMs = 10_000;
const maxGoogleOauthResponseBytes = 64 * 1_024;
const privateKeyProperty = "private_key" as const;
const privateKeyIdProperty = "private_key_id" as const;
const accessTokenProperty = "access_token" as const;

const credentialsSchema = z
  .object({
    type: z.literal("service_account"),
    client_email: z.email(),
    [privateKeyProperty]: z.string().min(1),
    [privateKeyIdProperty]: z.string().min(1).optional(),
    token_uri: z.literal(GOOGLE_TOKEN_URL),
  })
  .passthrough();

const tokenResponseSchema = z.strictObject({
  [accessTokenProperty]: z.string().min(1),
  token_type: z.literal("Bearer"),
  expires_in: z.number().int().positive().max(3_600),
});

type AuthDependencies = Readonly<{
  fetch?: typeof fetch;
  now?: () => Date;
  crypto?: Crypto;
}>;

function parseCredentials(credentialsJson: string) {
  try {
    const parsed: unknown = JSON.parse(credentialsJson);
    const result = credentialsSchema.safeParse(parsed);
    if (!result.success) throw new Error("invalid credentials");
    return result.data;
  } catch {
    throw new Error("invalid Google service-account credentials");
  }
}

function decodePemPrivateKey(pem: string): ArrayBuffer {
  const beginMarker = ["-----BEGIN", "PRIVATE KEY-----"].join(" ");
  const endMarker = ["-----END", "PRIVATE KEY-----"].join(" ");
  const base64 = pem
    .replace(beginMarker, "")
    .replace(endMarker, "")
    .replace(/\s/g, "");
  try {
    const binary = atob(base64);
    return Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    ).buffer;
  } catch {
    throw new Error("invalid Google service-account credentials");
  }
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function encodeJson(value: unknown): string {
  return toBase64Url(new TextEncoder().encode(JSON.stringify(value)));
}

async function createAssertion(
  credentials: z.infer<typeof credentialsSchema>,
  now: Date,
  cryptoApi: Crypto,
): Promise<string> {
  const issuedAt = Math.floor(now.getTime() / 1_000);
  const header = {
    alg: "RS256",
    typ: "JWT",
    ...(credentials[privateKeyIdProperty]
      ? { kid: credentials[privateKeyIdProperty] }
      : {}),
  };
  const claims = {
    iss: credentials.client_email,
    scope: GOOGLE_SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    iat: issuedAt,
    exp: issuedAt + 3_600,
  };
  const signingInput = `${encodeJson(header)}.${encodeJson(claims)}`;
  const signingKey = await cryptoApi.subtle.importKey(
    "pkcs8",
    decodePemPrivateKey(credentials[privateKeyProperty]),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await cryptoApi.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    signingKey,
    new TextEncoder().encode(signingInput),
  );
  return `${signingInput}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function getGoogleAccessToken(
  credentialsJson: string,
  dependencies: AuthDependencies = {},
): Promise<string> {
  const fetchApi = dependencies.fetch ?? globalThis.fetch;
  const cryptoApi = dependencies.crypto ?? crypto;
  const credentials = parseCredentials(credentialsJson);
  const assertion = await createAssertion(
    credentials,
    dependencies.now?.() ?? new Date(),
    cryptoApi,
  );

  let response: Response;
  try {
    response = await fetchApi(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
      signal: AbortSignal.timeout(googleOauthTimeoutMs),
    });
  } catch (cause) {
    throw new UpstreamRequestError("Google OAuth request failed", { cause });
  }
  if (!response.ok) {
    throw new UpstreamRequestError("Google OAuth request failed", {
      status: response.status,
      retryAfterSeconds: parseRetryAfterSeconds(
        response.headers.get("retry-after"),
      ),
    });
  }

  const payload = await readBoundedJson(response, {
    maxBytes: maxGoogleOauthResponseBytes,
    invalidMessage: "Google OAuth response was invalid",
  });
  const parsed = tokenResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new UpstreamRequestError("Google OAuth response was invalid", {
      status: response.status,
    });
  }
  return parsed.data[accessTokenProperty];
}
