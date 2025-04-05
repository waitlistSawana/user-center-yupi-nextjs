/**
 * @author Sawana Huang
 */

import type { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { NextResponse } from "next/server";

/**
 * 转换 TRPCError 为标准的 Next.js HTTP 响应
 *
 * @description 将 tRPC 的错误对象转换为标准的 Next.js Response，
 * 保留原始错误信息的同时，确保正确的 HTTP 状态码和状态描述。
 *
 * @param {TRPCError} error - tRPC 错误对象
 * @returns {NextResponse} 返回标准的 Next.js HTTP 响应
 *   - response.status: HTTP 状态码
 *   - response.statusText: 错误类型描述
 *   - response.body: {
 *       name: "TRPCError",
 *       code: TRPC错误码,
 *       message: 错误信息,
 *       cause?: 错误原因
 *     }
 */
export function TRPCErrorToNextResponse(error: TRPCError): NextResponse {
  return NextResponse.json(
    {
      name: error.name,
      code: error.code,
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    },
    { status: getHTTPStatusCodeFromError(error), statusText: error.code },
  );
}
