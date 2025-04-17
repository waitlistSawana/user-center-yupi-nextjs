import type { SafeUser } from "@/server/db/types";
import { userSearchByUserAccount } from "@/server/services/user";
import { TRPCErrorToNextResponse } from "@/server/utils/error-handling";
import { getCurrentUserBySession } from "@/server/utils/session";
import { TRPCError } from "@trpc/server";
import { NextResponse, type NextRequest } from "next/server";

export interface UserCurrentGetSuccessResponse {
  code: 0;
  message: string;
  user: SafeUser
}

/**
 * 查看当前用户信息
 *
 * @description 检查当前用户是否登录，并查询数据库返回用户信息。
 * 如果用户未登录返回 401，用户不存在返回 404，参数错误返回 400。
 *
 * @returns {Promise<NextResponse>} 返回用户信息或错误响应
 * 成功响应：
 * {
 *   code: 0,
 *   message: string,
 *   user: SafeUser
 * }
 *
 * 错误响应：
 * - 401: 用户未登录
 * - 404: 用户不存在
 * - 400: 请求参数错误
 */
export async function GET(): Promise<NextResponse> {
  // 1. 获取 cookie 和 session 中的 userAccount
  const { userAccount, isUserLogin } = await getCurrentUserBySession();
  if (!isUserLogin || !userAccount) {
    return TRPCErrorToNextResponse(
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "unauthorized: user not login",
      }),
    );
  }

  // 2. 查询数据库获取用户数据
  const { code, message, user } = await userSearchByUserAccount(userAccount);
  if (code === 2) {
    return TRPCErrorToNextResponse(
      new TRPCError({
        code: "NOT_FOUND",
        message: message,
      }),
    );
  }
  if (code === 1) {
    return TRPCErrorToNextResponse(
      new TRPCError({
        code: "BAD_REQUEST",
        message: message,
      }),
    );
  }

  if (!user) {
    return TRPCErrorToNextResponse(
      new TRPCError({
        code: "NOT_FOUND",
        message: "user not found",
      }),
    );
  }

  return NextResponse.json({
    code: code,
    message: message,
    user: user,
  } as UserCurrentGetSuccessResponse);
}
