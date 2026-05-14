import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import { getEnv } from "../env";
import * as schema from "./schema";

type Database = PostgresJsDatabase<typeof schema>;

let _sql: Sql | null = null;
let _db: Database | null = null;

// Lazy singleton. Build-time imports do not open a connection, so
// `next build` succeeds without DATABASE_URL. The connection opens on
// the first repository call at request time.
export function getDb(): Database {
  if (_db) return _db;
  const { DATABASE_URL } = getEnv();
  _sql = postgres(DATABASE_URL, { prepare: false });
  _db = drizzle(_sql, { schema });
  return _db;
}
