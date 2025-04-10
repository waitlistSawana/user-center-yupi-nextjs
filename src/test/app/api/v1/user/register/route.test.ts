// pnpm vitest run src/test/app/api/v1/user/register/route.test.ts

import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/v1/user/register/route";
import { describe, expect, it } from "vitest";

describe("用户注册接口测试", () => {
  describe("GET /api/v1/user/register", () => {
    it("应该返回欢迎信息", async () => {
      const response = await GET();
      const data = (await response.json()) as { message: string };
      expect(data).toEqual({ message: "hello" });
    });
  });

  describe("POST /api/v1/user/register", () => {
    it("应该成功注册新用户", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/register",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "testuser99",
            email: "test@gmail.com",
            userPassword: "password123",
            checkPassword: "password123",
          }),
        },
      );

      const response = await POST(mockRequest);
      const data = (await response.json()) as {
        userId: number;
        userAccount: string;
      };

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("userId");
      expect(data).toHaveProperty("userAccount", "testuser99");
    });

    it("应该验证账号长度不足", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/register",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "test",
            email: "test@gmail.com",
            userPassword: "password123",
            checkPassword: "password123",
          }),
        },
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty(
        "message",
        "User account must be at least 6 characters long",
      );
    });

    it("应该验证密码不匹配", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/register",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "testuser",
            email: "test@gmail.com",
            userPassword: "password123",
            checkPassword: "password456",
          }),
        },
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("message", "Passwords do not match");
    });

    it("应该验证账号特殊字符", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/register",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "test@user",
            email: "test@gmail.com",
            userPassword: "password123",
            checkPassword: "password123",
          }),
        },
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty(
        "message",
        "User account must start with a letter and can only contain letters, numbers, and underscores",
      );
    });

    it("应该验证密码长度不足", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/register",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "testuser",
            userPassword: "pass",
            checkPassword: "pass",
          }),
        },
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty(
        "message",
        "Password must be at least 8 characters long",
      );
    });

    it("应该处理无效的JSON请求体", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/register",
        {
          method: "POST",
          body: "invalid json",
        },
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("message", "unknown error");
    });
  });
});
