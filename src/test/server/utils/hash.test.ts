// pnpm vitest run src/test/server/utils/hash.test.ts

import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/server/utils/hash";

describe("密码工具函数", () => {
  describe("hashPassword", () => {
    it("应该成功加密密码", async () => {
      const plainPassword = "test123";
      const hashed = await hashPassword(plainPassword);
      expect(hashed).toBeDefined();
      expect(hashed).not.toEqual(plainPassword);
    });

    it("空密码应该也能加密", async () => {
      const hashed = await hashPassword("");
      expect(hashed).toBeDefined();
    });
  });

  describe("verifyPassword", () => {
    it("应该正确验证密码", async () => {
      const plainPassword = "test123";
      const hashed = await hashPassword(plainPassword);
      const result = await verifyPassword(plainPassword, hashed);
      expect(result).toBe(true);
    });

    it("错误密码应该返回false", async () => {
      const hashed = await hashPassword("test123");
      const result = await verifyPassword("wrong", hashed);
      expect(result).toBe(false);
    });

    it("空密码验证", async () => {
      const hashed = await hashPassword("");
      const result = await verifyPassword("", hashed);
      expect(result).toBe(true);
    });
  });
});
