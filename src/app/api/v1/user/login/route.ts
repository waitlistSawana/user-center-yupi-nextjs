import { userLogin } from "@/server/services/user";
import { TRPCErrorToNextResponse } from "@/server/utils/error-handling";
import { TRPCError } from "@trpc/server";
import { NextResponse, type NextRequest } from "next/server";

interface UserLoginPostRequestBody {
  userAccount: string;
  userPassword: string;
}

export async function POST(req: NextRequest) {
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

    return NextResponse.json({ user: user });
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
