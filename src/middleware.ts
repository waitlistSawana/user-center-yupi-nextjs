import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/constant/server";

export function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const sessionAuth = cookies.get(SESSION_COOKIE_NAME);

  // console.log({ sessionAuth, message: "middleware", url: request.url });

  // 1. 如果是 api 或 trpc 路径，直接返回
  const isApiPath = request.nextUrl.pathname.startsWith("/api");
  const isTrpcPath = request.nextUrl.pathname.startsWith("/trpc");
  if (isApiPath || isTrpcPath) {
    return NextResponse.next();
  }

  // 1. 如果是公开路径，直接返回
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 2. 如果是登录路径，且未登录，跳转到 /login
  if (!sessionAuth?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. 默认返回
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Clerk Doc https://clerk.com/docs/references/nextjs/clerk-middleware
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
