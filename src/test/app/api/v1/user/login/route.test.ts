// pnpm vitest run src/test/app/api/v1/user/login/route.test.ts

import { NextRequest } from "next/server";
import { POST } from "@/app/api/v1/user/login/route";
import { describe, expect, it } from "vitest";

describe("用户登录接口测试", () => {
  describe("POST /api/v1/user/login", () => {
    it("应该成功登录", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/login",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "testuser64",
            userPassword: "password123",
          }),
        },
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("code", 0);
      expect(data).toHaveProperty("message", "Login successful");
      expect(data.user).toBeDefined();
      expect(data.user).toHaveProperty("userAccount", "testuser64");
    });

    it("应该验证缺少必填参数", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/login",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "",
            userPassword: "",
          }),
        },
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty(
        "message",
        "Missing required fields: userAccount or userPassword",
      );
    });

    it("应该验证账号长度不足", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/login",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "test",
            userPassword: "password123",
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

    it("应该验证密码长度不足", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/login",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "testuser",
            userPassword: "pass",
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

    it("应该验证账号特殊字符", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/login",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "test@user",
            userPassword: "password123",
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

    it("应该验证账号不存在", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/login",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "nonexistent",
            userPassword: "password123",
          }),
        },
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("message", "User account does not exist");
    });

    it("应该验证密码错误", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/login",
        {
          method: "POST",
          body: JSON.stringify({
            userAccount: "testuser64",
            userPassword: "wrongpassword",
          }),
        },
      );

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("message", "Invalid password");
    });

    it("应该处理无效的JSON请求体", async () => {
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/v1/user/login",
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
