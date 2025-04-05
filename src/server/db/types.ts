import type { users } from "./schema";

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SafeUser = Omit<User, "userPassword" | "email" | "phone">;
