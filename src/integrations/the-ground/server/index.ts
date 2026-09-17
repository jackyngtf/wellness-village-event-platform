import "server-only";

import { resolveTheGroundConfig } from "../config";
import type { TheGroundConfig } from "../types";
import {
  createInMemoryTheGroundSnapshotStore,
  createTheGroundAdapter,
} from "./adapter";

const adapters = new Map<string, ReturnType<typeof createTheGroundAdapter>>();
const sharedSnapshotStore = createInMemoryTheGroundSnapshotStore();

function adapterKey(config: TheGroundConfig): string {
  return config.mode === "demo"
    ? "demo"
    : `live:${config.organizationId ?? "invalid"}`;
}

export async function getTheGroundEventCatalog(
  environment: Readonly<Record<string, string | undefined>> = process.env,
) {
  const config = resolveTheGroundConfig(environment);
  const key = adapterKey(config);
  let adapter = adapters.get(key);

  if (!adapter) {
    adapter = createTheGroundAdapter({ config, snapshotStore: sharedSnapshotStore });
    adapters.set(key, adapter);
  }

  return adapter.getCatalog();
}

export { TheGroundUnavailableError } from "./adapter";
