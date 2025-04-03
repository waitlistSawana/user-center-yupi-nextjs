// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, mysqlTableCreator } from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator(
  (name) => `user-center-yupi-nextjs_${name}`,
);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().onUpdateNow(),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const users = createTable(
  "user",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(), // 用户ID，主键，自增
    username: d.varchar({ length: 256 }), // 用户昵称
    userAccount: d.varchar({ length: 256 }).notNull(), // 用户账号
    avatarUrl: d.varchar({ length: 1024 }), // 用户头像地址
    gender: d.tinyint(), // 性别（0-女，1-男）
    userPassword: d.varchar({ length: 512 }).notNull(), // 用户密码，不能为空
    phone: d.varchar({ length: 128 }), // 手机号
    email: d.varchar({ length: 512 }), // 邮箱
    userStatus: d.int().default(0).notNull(), // 用户状态（0-正常）
    createTime: d.timestamp().default(sql`CURRENT_TIMESTAMP`), // 创建时间
    updateTime: d.timestamp().default(sql`CURRENT_TIMESTAMP`).onUpdateNow(), // 更新时间
    isDelete: d.tinyint().default(0).notNull(), // 是否删除（0-未删除，1-已删除）
    userRole: d.int().default(0).notNull(), // 用户角色（0-普通用户，1-管理员）
    planetCode: d.varchar({ length: 512 }) // 星球编号
  }),
  (t) => [
    index("username_idx").on(t.username), // 用户名索引
    index("user_account_idx").on(t.userAccount), // 用户账号索引
    index("user_status_idx").on(t.userStatus), // 用户状态索引
    index("user_role_idx").on(t.userRole) // 用户角色索引
  ]
);

