// pnpm vitest run src/test/server/repositories/user.test.ts

import { describe, it, expect } from "vitest";
import {
  isUserExistByUserAccount,
  insertUser,
  searchUsers,
} from "@/server/repositories/user";

describe("用户仓库函数", () => {
  describe("isUserExist", () => {
    it("用户为admain时 应该返回true当用户存在", async () => {
      const result = await isUserExistByUserAccount("admin");
      expect(result).toBe(true);
    });

    it("用户不存在时 应该返回false当用户不存在", async () => {
      const result = await isUserExistByUserAccount("nonexistent");
      expect(result).toBe(false);
    });

    it("应该处理空字符串输入 返回false", async () => {
      const result = await isUserExistByUserAccount("");
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

  // TODO: 未通过 服务端组件检查
  describe("searchUsers", () => {
    it("应该返回所有未删除的用户当没有提供查询参数时", async () => {
      const users = await searchUsers({});
      expect(users).toBeInstanceOf(Array);
      users.forEach((user) => {
        expect(user.isDelete).toBe(0);
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("userAccount");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("avatarUrl");
        expect(user).toHaveProperty("gender");
        expect(user).toHaveProperty("userRole");
        expect(user).toHaveProperty("userStatus");
        expect(user).toHaveProperty("planetCode");
        expect(user).toHaveProperty("createTime");
        expect(user).toHaveProperty("updateTime");
      });
    });

    it("应该根据用户名筛选用户", async () => {
      const username = "张";
      const users = await searchUsers({ username });
      expect(users).toBeInstanceOf(Array);
      users.forEach((user) => {
        expect(user.username).toMatch(username);
        expect(user.isDelete).toBe(0);
      });
    });

    it("应该根据性别筛选用户", async () => {
      const gender = 1;
      const users = await searchUsers({ gender });
      expect(users).toBeInstanceOf(Array);
      users.forEach((user) => {
        expect(user.gender).toBe(gender);
        expect(user.isDelete).toBe(0);
      });
    });

    it("应该同时根据用户名和性别筛选用户", async () => {
      const username = "张";
      const gender = 1;
      const users = await searchUsers({ username, gender });
      expect(users).toBeInstanceOf(Array);
      users.forEach((user) => {
        expect(user.username).toMatch(username);
        expect(user.gender).toBe(gender);
        expect(user.isDelete).toBe(0);
      });
    });

    it("应该处理空用户名的情况", async () => {
      const users = await searchUsers({ username: "" });
      expect(users).toBeInstanceOf(Array);
      users.forEach((user) => {
        expect(user.isDelete).toBe(0);
      });
    });

    it("应该返回空数组当查询不存在的用户名时", async () => {
      const users = await searchUsers({ username: "不存在的用户名xyz123" });
      expect(users).toBeInstanceOf(Array);
      expect(users).toHaveLength(0);
    });
  });
});
