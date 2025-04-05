import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// 定义请求体的验证模式
const postSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  age: z.number().min(0, "年龄不能为负数").max(150, "年龄不能超过150岁"),
});

// 模拟的数据存储
const users = [
  {
    name: "user1",
  },
  {
    name: "user2",
  },
];

// GET 请求处理
export async function GET() {
  try {
    return NextResponse.json({
      code: 0,
      data: users,
      message: "获取成功",
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: "服务器内部错误",
      },
      { status: 500 },
    );
  }
}

// POST 请求处理
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as object;

    // 验证请求体
    const validationResult = postSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          code: 400,
          message: "参数验证失败",
          errors: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    // 添加用户
    const newUser = validationResult.data;
    users.push(newUser);

    return NextResponse.json({
      code: 0,
      data: newUser,
      message: "创建成功",
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: "服务器内部错误",
      },
      { status: 500 },
    );
  }
}
