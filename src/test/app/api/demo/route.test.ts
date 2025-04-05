import { GET, POST } from "@/app/api/demo/route";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";

interface ApiResponse {
  code: number;
  message: string;
  data?: {
    name: string;
    age: number;
  };
  errors?: Array<{
    message: string;
    path: string[];
    code: string;
  }>;
}

describe("Demo API 路由测试", () => {
  // 在每个测试前重置用户数组
  beforeEach(() => {
    // 由于users是模块级变量，我们需要通过导入的方式重置它
    // 这里我们可以通过调用GET请求后再检查来确认重置
  });

  describe("GET /api/demo", () => {
    it("应该返回空用户列表", async () => {
      const response = await GET();
      const data = (await response.json()) as ApiResponse;

      expect(data).toEqual({
        code: 0,
        data: [],
        message: "获取成功",
      });
    });
  });

  describe("POST /api/demo", () => {
    it("应该成功创建新用户", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/demo", {
        method: "POST",
        body: JSON.stringify({
          name: "张三",
          age: 25,
        }),
      });

      const response = await POST(mockRequest);
      const data = (await response.json()) as ApiResponse;

      expect(data).toEqual({
        code: 0,
        data: {
          name: "张三",
          age: 25,
        },
        message: "创建成功",
      });
    });

    it("应该验证请求体参数 - 名称为空", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/demo", {
        method: "POST",
        body: JSON.stringify({
          name: "",
          age: 25,
        }),
      });

      const response = await POST(mockRequest);
      const data = (await response.json()) as ApiResponse;

      expect(data.code).toBe(400);
      expect(data.message).toBe("参数验证失败");
      expect(data.errors?.[0]?.message).toBe("名称不能为空");
    });

    it("应该验证请求体参数 - 年龄超出范围", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/demo", {
        method: "POST",
        body: JSON.stringify({
          name: "张三",
          age: 151,
        }),
      });

      const response = await POST(mockRequest);
      const data = (await response.json()) as ApiResponse;

      expect(data.code).toBe(400);
      expect(data.message).toBe("参数验证失败");
      expect(data.errors?.[0]?.message).toBe("年龄不能超过150岁");
    });

    it("应该处理无效的JSON请求体", async () => {
      const mockRequest = new NextRequest("http://localhost:3000/api/demo", {
        method: "POST",
        body: "invalid json",
      });

      const response = await POST(mockRequest);
      const data = (await response.json()) as ApiResponse;

      expect(data.code).toBe(500);
      expect(data.message).toBe("服务器内部错误");
    });
  });
});
