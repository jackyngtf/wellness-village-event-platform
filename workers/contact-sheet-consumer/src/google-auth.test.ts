import { describe, expect, it, vi } from "vitest";

import {
  GOOGLE_SHEETS_SCOPE,
  GOOGLE_TOKEN_URL,
  getGoogleAccessToken,
} from "./google-auth";

function toPem(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const base64 = btoa(binary).match(/.{1,64}/g)?.join("\n") ?? "";
  const beginMarker = ["-----BEGIN", "PRIVATE KEY-----"].join(" ");
  const endMarker = ["-----END", "PRIVATE KEY-----"].join(" ");
  return `${beginMarker}\n${base64}\n${endMarker}`;
}

async function createCredentials(
  changes: Readonly<Record<string, unknown>> = {},
): Promise<string> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2_048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
  if (!("privateKey" in keyPair)) throw new Error("expected an RSA key pair");
  const signingKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  if (!(signingKey instanceof ArrayBuffer)) {
    throw new Error("expected a PKCS8 key");
  }
  return JSON.stringify({
    type: "service_account",
    client_email: "portfolio-demo@example.com",
    ["private_key"]: toPem(signingKey),
    token_uri: GOOGLE_TOKEN_URL,
    ...changes,
  });
}

function decodeJwtPart(value: string): Record<string, unknown> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    Math.ceil(value.length / 4) * 4,
    "=",
  );
  return JSON.parse(atob(padded)) as Record<string, unknown>;
}

describe("Google service-account OAuth", () => {
  it("signs an RS256 JWT for the strict token URI and least Sheets scope", async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (input, init) => {
      expect(String(input)).toBe(GOOGLE_TOKEN_URL);
      expect(init?.method).toBe("POST");
      const body = new URLSearchParams(String(init?.body));
      expect(body.get("grant_type")).toBe(
        "urn:ietf:params:oauth:grant-type:jwt-bearer",
      );
      const [headerPart, claimsPart, signaturePart] = (
        body.get("assertion") ?? ""
      ).split(".");
      expect(decodeJwtPart(headerPart ?? "")).toMatchObject({
        alg: "RS256",
        typ: "JWT",
      });
      expect(decodeJwtPart(claimsPart ?? "")).toMatchObject({
        iss: "portfolio-demo@example.com",
        scope: GOOGLE_SHEETS_SCOPE,
        aud: GOOGLE_TOKEN_URL,
        iat: 1_908_151_384,
        exp: 1_908_154_984,
      });
      expect(signaturePart).toBeTruthy();
      return Response.json({
        ["access_token"]: "example-access-token",
        token_type: "Bearer",
        expires_in: 3_600,
      });
    });

    await expect(
      getGoogleAccessToken(await createCredentials(), {
        fetch: fetcher,
        now: () => new Date("2030-06-20T02:03:04.000Z"),
      }),
    ).resolves.toBe("example-access-token");
  });

  it("rejects a non-canonical token URI before making a request", async () => {
    const fetcher = vi.fn<typeof fetch>();
    await expect(
      getGoogleAccessToken(
        await createCredentials({ token_uri: "https://oauth.example.com/token" }),
        { fetch: fetcher },
      ),
    ).rejects.toThrow("invalid Google service-account credentials");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([
    ["non-JSON", new Response("not json")],
    ["wrong token type", Response.json({ ["access_token"]: "example-token", token_type: "MAC", expires_in: 3600 })],
    ["missing expiry", Response.json({ ["access_token"]: "example-token", token_type: "Bearer" })],
    ["upstream status", Response.json({}, { status: 503 })],
    ["oversized JSON", new Response(JSON.stringify({ ["access_token"]: "x".repeat(65_537) }))],
  ])("fails closed for %s", async (_label, response) => {
    await expect(
      getGoogleAccessToken(await createCredentials(), {
        fetch: vi.fn<typeof fetch>().mockResolvedValue(response),
      }),
    ).rejects.toThrow();
  });
});
