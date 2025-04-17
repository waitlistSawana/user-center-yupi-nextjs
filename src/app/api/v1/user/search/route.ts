import { userSearchByParams } from "@/server/services/user";
import { TRPCErrorToNextResponse } from "@/server/utils/error-handling";
import { TRPCError } from "@trpc/server";
import { NextResponse, type NextRequest } from "next/server";

export const maxDuration = 60;

/**
 * 用户搜索接口
 *
 * @description 根据用户名搜索用户信息
 *
 * @route GET /api/v1/user/search
 *
 * @param {NextRequest} request - 请求对象
 * @param {URLSearchParams} request.searchParams - 查询参数
 * @param {string} [request.searchParams.username] - 用户名关键词，可选
 *
 * @returns {Promise<NextResponse>} 返回处理结果
 * - 成功: { data: SafeUser[] | null }
 * - 失败: { code: "INTERNAL_SERVER_ERROR", message: string }
 *
 * @throws {NextResponse}
 * - 当服务器内部错误时
 *
 * @example
 * // 搜索用户名包含 "test" 的用户
 * GET /api/v1/user/search?username=test
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") ?? undefined;

    const users = await userSearchByParams({ username });

    return NextResponse.json({ data: users });
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
