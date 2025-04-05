import { userRegister } from "@/server/services/user";
import { TRPCErrorToNextResponse } from "@/server/utils/error-handling";
import { TRPCError } from "@trpc/server";
import { NextResponse, type NextRequest } from "next/server";

interface UserRegisterPostRequestBody {
  userAccount: string;
  userPassword: string;
  checkPassword: string;
}

export async function GET() {
  return NextResponse.json({ message: "hello" });
}

export async function POST(req: NextRequest) {
  try {
    const { userAccount, userPassword, checkPassword } =
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

    // TODO: set cookie

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
