import { userLogout } from "@/server/services/user";
import { TRPCErrorToNextResponse } from "@/server/utils/error-handling";
import { TRPCError } from "@trpc/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

export interface LogoutPostSuccessResponse {
  message: string;
  success: boolean;
}

export async function POST() {
  try {
    await userLogout();

    return NextResponse.json(
      {
        message: "logout success",
        success: true,
      } as LogoutPostSuccessResponse,
      {
        status: 200,
        statusText: "OK",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return TRPCErrorToNextResponse(
      new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error, unknown error",
      }),
    );
  }
}
