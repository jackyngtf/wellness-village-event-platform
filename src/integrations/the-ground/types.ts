export type TheGroundMode = "demo" | "live";

export interface TheGroundConfig {
  readonly mode: TheGroundMode;
  readonly organizationId: string | null;
}

export type HktDateTime = `${string}+08:00`;

export type TheGroundEventPrice =
  | Readonly<{ kind: "free" }>
  | Readonly<{
      kind: "paid";
      amount: number;
      currency: string;
      sourceDisplay: string;
    }>
  | Readonly<{ kind: "unknown"; sourceDisplay: string | null }>;

export interface TheGroundEvent {
  readonly source: "the-ground";
  readonly eventId: string;
  readonly title: string;
  readonly startsAt: HktDateTime;
  readonly endsAt: HktDateTime;
  readonly location: string | null;
  readonly imageUrl: string | null;
  readonly registrationUrl: string;
  readonly price: TheGroundEventPrice;
  readonly registration: Readonly<{
    isOpen: boolean;
    deadline: HktDateTime | null;
  }>;
  readonly availability: Readonly<{
    visibility: "public" | "hidden";
    capacity: number | null;
    joinedCount: number | null;
  }>;
}

export interface TheGroundCatalog {
  readonly events: readonly TheGroundEvent[];
}

export interface TheGroundCatalogResult {
  readonly mode: TheGroundMode;
  readonly freshness: "demo" | "fresh" | "stale";
  readonly fetchedAt: string;
  readonly data: TheGroundCatalog;
}
