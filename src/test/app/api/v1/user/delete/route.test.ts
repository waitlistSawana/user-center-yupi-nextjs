// pnpm vitest run src/test/app/api/v1/user/delete/route.test.ts

import { POST } from "@/app/api/v1/user/delete/route";
import { userDeleteByUserId } from "@/server/services/user";
import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

// Mock userDeleteByUserId function
vi.mock("@/server/services/user", () => ({
  userDeleteByUserId: vi.fn(),
}));

describe("DELETE /api/v1/user/delete", () => {
  it("应该成功删除用户", async () => {
    const mockUserId = 3;
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/v1/user/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie:
            "user-center-sawana-session=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc0Mzk0NzkxNywiZXhwIjoxNzQ2MzY3MTE3fQ.w52jgZEM1lNAK2zenJoI9SykI-lrJ-5k_1pq0NwCB7k",
        },
        body: JSON.stringify({ userId: mockUserId }),
      },
    );

    vi.mocked(userDeleteByUserId).mockResolvedValueOnce({
      suceess: true,
      code: 0,
      message: "user deleted successfully",
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      suceess: true,
      userId: mockUserId,
    });
  });

  it("应该在用户未登录时返回401错误", async () => {
    const mockUserId = 4;
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/v1/user/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: mockUserId }),
      },
    );

    vi.mocked(userDeleteByUserId).mockResolvedValueOnce({
      suceess: false,
      code: 1,
      message: "user does not login",
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(401);
  });

  it("应该在用户无权限时返回403错误", async () => {
    const mockUserId = 3;
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/v1/user/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie:
            "user-center-sawana-session=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlcjI2IiwiaWF0IjoxNzQzOTQ3OTE3LCJleHAiOjE3NDYzNjcxMTd9.eCJPsLDBopciNiPSK54uCTLPpUCvMx7qz8IcPozchoI",
        },
        body: JSON.stringify({ userId: mockUserId }),
      },
    );

    vi.mocked(userDeleteByUserId).mockResolvedValueOnce({
      suceess: false,
      code: 2,
      message: "User is not allowed to delete",
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(403);
  });

  it("应该在请求体无效时返回500错误", async () => {
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/v1/user/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie:
            "user-center-sawana-session=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc0Mzk0NzkxNywiZXhwIjoxNzQ2MzY3MTE3fQ.w52jgZEM1lNAK2zenJoI9SykI-lrJ-5k_1pq0NwCB7k",
        },
        body: "invalid json",
      },
    );

    const response = await POST(mockRequest);

    expect(response.status).toBe(500);
  });

  it("应该在用户不存在时返回403错误", async () => {
    const mockUserId = 999;
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/v1/user/delete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie:
            "user-center-sawana-session=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc0Mzk0NzkxNywiZXhwIjoxNzQ2MzY3MTE3fQ.w52jgZEM1lNAK2zenJoI9SykI-lrJ-5k_1pq0NwCB7k",
        },
        body: JSON.stringify({ userId: mockUserId }),
      },
    );

    vi.mocked(userDeleteByUserId).mockResolvedValueOnce({
      suceess: false,
      code: 2,
      message: "user not found",
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(403);
  });
});
