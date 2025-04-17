/**
 * 方案一：MySQL 数据库连接
 *
 * 不可在 edge 运行时运行
 * T3 代码参考：https://github.com/t3-oss/create-t3-app/blob/main/cli/template/extras/src/server/db/index-drizzle/with-mysql.ts
 */
import { drizzle } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2/promise";

import { env } from "@/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn = globalForDb.conn ?? createPool({ uri: env.DATABASE_URL });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, {
  schema,
  mode: "default",
});
