import type { SafeUser } from "@/server/db/types";
import { userLogin } from "@/server/services/user";
import { TRPCErrorToNextResponse } from "@/server/utils/error-handling";
import { TRPCError } from "@trpc/server";
import { NextResponse, type NextRequest } from "next/server";

export interface UserLoginPostRequestBody {
  userAccount: string;
  userPassword: string;
}
export interface UserLoginSuccessPostResponse {
  code: 0;
  message: string;
  user: SafeUser | null;
}

/**
 * 处理用户登录的 POST 请求
 * @route POST /api/v1/user/login
 * @param {NextRequest} req - Next.js 请求对象
 * @throws {NextResponse} BAD_REQUEST - 当用户账号或密码为空时
 * @throws {NextResponse} BAD_REQUEST - 当用户不存在时 (code === 1)
 * @throws {NextResponse} UNAUTHORIZED - 当密码错误时 (code === 2)
 * @throws {NextResponse} INTERNAL_SERVER_ERROR - 当发生未知错误时
 * @returns {Promise<NextResponse>} 返回包含用户信息的响应
 * @example
 * // 请求体示例
 * {
 *   "userAccount": "example",
 *   "userPassword": "password123"
 * }
 *
 * // 成功响应示例
 * {
 *   "user": {
 *     "id": 1,
 *     "userAccount": "example",
 *     // ... 其他用户信息
 *   }
 * }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userAccount, userPassword } =
      (await req.json()) as UserLoginPostRequestBody;

    if (!userAccount || !userPassword) {
      return TRPCErrorToNextResponse(
        new TRPCError({
          code: "BAD_REQUEST",
          message: "userAccount and userPassword are required",
        }),
      );
    }

    const user = await userLogin({
      userPassword,
      userAccount,
    });

    if (user.code === 1)
      return TRPCErrorToNextResponse(
        new TRPCError({
          code: "BAD_REQUEST",
          message: user.message,
        }),
      );

    if (user.code === 2)
      return TRPCErrorToNextResponse(
        new TRPCError({
          code: "UNAUTHORIZED",
          message: user.message,
        }),
      );

    // TODO: set cookie

    return NextResponse.json({
      code: user.code,
      message: user.message,
      user: user.user,
    });
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
