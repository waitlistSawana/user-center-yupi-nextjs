import { userRegister } from "@/server/services/user";
import { TRPCErrorToNextResponse } from "@/server/utils/error-handling";
import { createSession } from "@/server/utils/session";
import { TRPCError } from "@trpc/server";
import { NextResponse, type NextRequest } from "next/server";

export interface UserRegisterPostRequestBody {
  userAccount: string;
  email: string;
  userPassword: string;
  checkPassword: string;
}
export interface UserRegisterSuccessPostResponse {
  userId: number;
  userAccount: string;
}

export async function GET() {
  return NextResponse.json({ message: "hello" });
}

/**
 * 处理用户注册请求
 * @description 接收用户注册信息，验证并创建新用户
 *
 * @param {NextRequest} req - Next.js 请求对象
 * @returns {Promise<NextResponse<UserRegisterSuccessPostResponse>>} 包含用户ID和账号的JSON响应
 *
 * @throws {Promise<NextResponse>} BAD_REQUEST
 * - 当必填字段缺失时
 * - 当用户注册失败时（userId === -1）
 * @throws {Promise<NextResponse>} INTERNAL_SERVER_ERROR
 * - 当发生未知错误时
 *
 * @example
 * // 请求体示例
 * {
 *   "userAccount": "testuser",
 *   "email": "test@example.com",
 *   "userPassword": "password123",
 *   "checkPassword": "password123"
 * }
 *
 * // 成功响应示例
 * {
 *   "userId": 1,
 *   "userAccount": "testuser"
 * }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userAccount, email, userPassword, checkPassword } =
      (await req.json()) as UserRegisterPostRequestBody;

    if (!userAccount || !userPassword || !checkPassword) {
      return TRPCErrorToNextResponse(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "userAccount, userPassword and checkPassword are required",
        }),
      );
    }

    const { userId, message } = await userRegister({
      userPassword,
      email,
      userAccount,
      checkPassword,
    });

    if (userId === -1) {
      return TRPCErrorToNextResponse(
        new TRPCError({
          code: "BAD_REQUEST",
          message: message,
        }),
      );
    }

    await createSession(userAccount);

    return NextResponse.json({ userId: userId, userAccount: userAccount });
  } catch (error) {
    return TRPCErrorToNextResponse(
      new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "unknown error",
        cause: error,
      }),
    );
  }
}
