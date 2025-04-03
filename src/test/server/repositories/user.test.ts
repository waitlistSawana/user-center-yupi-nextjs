import { describe, it, expect } from "vitest";
import { isUserExist, insertUser } from "@/server/repositories/user";

describe("用户仓库函数", () => {
  describe("isUserExist", () => {
    it("用户为admain时 应该返回true当用户存在", async () => {
      const result = await isUserExist("admin");
      expect(result).toBe(true);
    });

    it("用户不存在时 应该返回false当用户不存在", async () => {
      const result = await isUserExist("nonexistent");
      expect(result).toBe(false);
    });

    it("应该处理空字符串输入 返回false", async () => {
      const result = await isUserExist("");
      expect(result).toBe(false);
    });
  });

  describe("insertUser", () => {
    it("应该成功创建用户并返回用户ID", async () => {
      const userAccount = "testuser";
      const hashedPassword = "hashedpassword";
      const result = await insertUser(userAccount, hashedPassword);
      expect(result).toBeGreaterThan(0);
    });

    it("应该返回-1当用户名为空", async () => {
      const result = await insertUser("", "hashedpassword");
      expect(result).toBe(-1);
    });

    it("应该返回-1当密码为空", async () => {
      const result = await insertUser("testuser", "");
      expect(result).toBe(-1);
    });

    it("应该返回-1当输入包含特殊字符", async () => {
      const result = await insertUser("test@user", "hashedpassword");
      expect(result).toBe(-1);
    });

    it("应该返回-1当用户名过长", async () => {
      const longString = "a".repeat(100);
      const result = await insertUser(longString, "hashedpassword");
      expect(result).toBe(-1);
    });
  });
});