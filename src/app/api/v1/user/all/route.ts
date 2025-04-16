import type { SafeUser } from "@/server/db/types";
import { userGetAll } from "@/server/services/user";
import { TRPCErrorToNextResponse } from "@/server/utils/error-handling";
import { TRPCError } from "@trpc/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

export interface UserAllSuccessPostResponse {
  message: string;
  users: SafeUser[];
}

/**
 * 获取所有用户
 *
 * @description 获取所有的用户信息
 *
 * @route GET /api/v1/user/all
 *
 *
 * @returns {Promise<NextResponse>} 返回处理结果
 * - 成功: { data: SafeUser[] | null }
 * - 失败: { code: "INTERNAL_SERVER_ERROR", message: string }
 *
 * @throws {NextResponse}
 * - 当服务器内部错误时
 *
 */
export async function GET(): Promise<NextResponse> {
  try {
    const { code, message, users } = await userGetAll();

    return NextResponse.json({ message: message, users: users });
  } catch (error) {
    return TRPCErrorToNextResponse(
      new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "search users failed.",
        cause: error,
      }),
    );
  }
}
