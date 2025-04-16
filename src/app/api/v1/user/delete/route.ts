import { userDeleteByUserId } from "@/server/services/user";
import { TRPCErrorToNextResponse } from "@/server/utils/error-handling";
import { TRPCError } from "@trpc/server";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";

interface UserDeleteRequestBody {
  userId: number;
}

/**
 * 用户删除接口
 *
 * @description 处理用户删除请求，需要管理员权限。
 *
 * @route POST /api/v1/user/delete
 *
 * @param {UserDeleteRequestBody} req.body - 请求体
 * @param {number} req.body.userId - 要删除的用户ID
 *
 * @returns {Promise<NextResponse>} 返回处理结果
 * - 成功: { success: true, userId: number }
 * - 失败:
 *   - UNAUTHORIZED (401): 用户未登录
 *   - FORBIDDEN (403): 无权限操作
 *   - INTERNAL_SERVER_ERROR (500): 服务器错误
 *
 * @throws {NextResponse}
 * - 当请求体解析失败时
 * - 当服务器内部错误时
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = (await req.json()) as UserDeleteRequestBody;

    const { suceess, code, message } = await userDeleteByUserId(userId);

    if (!suceess && !(code === 0)) {
      const errorMap = {
        1: "UNAUTHORIZED",
        2: "FORBIDDEN",
      } as const;
      return TRPCErrorToNextResponse(
        new TRPCError({
          code: errorMap[code],
          message: message,
        }),
      );
    }

    return NextResponse.json(
      { suceess: true, userId: userId },
      { status: 200 },
    );
  } catch (error) {
    return TRPCErrorToNextResponse(
      new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
        cause: error,
      }),
    );
  }
}
