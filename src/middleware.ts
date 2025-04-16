import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/constant/server";
import { SEARCH_PARAMS_FROM } from "./lib/constant/shared";

export function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const sessionAuth = cookies.get(SESSION_COOKIE_NAME);

  // console.log({ sessionAuth, message: "middleware", url: request.url });

  // 如果是 api 或 trpc 路径，直接返回
  const isApiPath = request.nextUrl.pathname.startsWith("/api");
  const isTrpcPath = request.nextUrl.pathname.startsWith("/trpc");
  if (isApiPath || isTrpcPath) {
    return NextResponse.next();
  }

  // 1. 如果是公开路径，直接返回
  const publicPaths = ["/login", "/register", "/"];
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path,
  );

  if (isPublicPath) {
    // console.log("isPublicPath");
    return NextResponse.next();
  }

  // 2. 如果是登录路径，且未登录，跳转到 /login
  // 用 from 关键字记录当前路径 pathname
  if (!sessionAuth?.value) {
    const fromPath = request.nextUrl.pathname;
    const loginPath = new URL("/login", request.url);
    loginPath.searchParams.set(SEARCH_PARAMS_FROM, fromPath);
    return NextResponse.redirect(loginPath);
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
