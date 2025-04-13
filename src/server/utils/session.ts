/**
 * @description 会话
 *
 * @author Sawana Huang
 *
 * @see encrypt 加密
 * @see decrypt 解密
 * @see createSession 创建会话
 * @see updateSession 更新会话
 * @see deleteSession 删除会话
 * @see getCurrentUserBySession 通过会话获取当前用户
 *
 * @date 2025-04-04
 *
 * 参考 nextjs 文档： https://nextjs.org/docs/app/building-your-application/authentication#session-management
 */

import "server-only";

import { cookies } from "next/headers";
import { env } from "@/env";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

import { SESSION_COOKIE_NAME } from "@/lib/constant/server";

const secretKey = env.SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * 创建加密后的 session
 *
 * @description 利用 JWT (JSON Web Token) 对用户会话数据进行加密
 *
 * @param payload - JWT 标准载荷
 * @param [payload.iss] - 签发者（Issuer）
 * @param [payload.sub] - 主题（Subject）
 * @param [payload.aud] - 受众（Audience）
 * @param [payload.exp] - 过期时间（Expiration Time）
 * @param [payload.nbf] - 生效时间（Not Before）
 * @param [payload.iat] - 签发时间（Issued At）
 * @param [payload.jti] - JWT ID
 *
 * @returns Promise<string> 返回加密后的 JWT 字符串
 *
 * @throws {Error} 如果加密过程失败
 *
 * @example
 * const token = await encrypt({
 *   sub: "user123",
 *   iat: Math.floor(Date.now() / 1000)
 * });
 */
export async function encrypt(payload: JWTPayload): Promise<string> {
  /**
   * 生成 JWT (json web token)
   * xxxxx.yyyyy.zzzzz
   * 头部  载荷  签名
   */
  const sessionJwt = new SignJWT(payload) // 设置主体对象，传入用户数据
    .setProtectedHeader({ alg: "HS256" }) // 头部信息
    .setIssuedAt() // 签发时间 iat 默认当前时间
    .setExpirationTime("4w") // 过期时间 exp 默认 4 周
    .sign(encodedKey); // 使用密钥加密
  return sessionJwt;
}

/**
 * 解密 session token
 *
 * @description 验证并解密 JWT token，获取原始载荷数据
 *
 * @param session - JWT token 字符串
 * @returns Promise<JWTPayload | undefined> 解密后的载荷数据，验证失败时返回 undefined
 *
 * TODO: 错误处理
 * @throws {JWTExpired} Token 已过期
 * @throws {JWTInvalid} Token 格式无效
 * @throws {JWTClaimValidationFailed} Token 声明验证失败
 *
 * @example
 * const payload = await decrypt("eyJhbGciOiJIUzI1...");
 * if (payload) {
 *   const { sub, exp } = payload;
 *   // 使用解密后的数据
 * }
 */
export async function decrypt(
  session: string | undefined = "",
): Promise<JWTPayload | undefined> {
  try {
    // 解密： session 由 encrypt 生成
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
  }
}

/**
 * 创建用户会话
 *
 * @description 为用户创建新的会话，生成 JWT token 并设置到 Cookie 中
 *
 * @param {string} subject - 用户唯一标识：{string} userAccount
 *
 * @returns Promise<boolean> 返回是否创建成功
 *
 * @example
 * // 用户登录后创建会话
 * await createSession("12345");
 */
export async function createSession(subject: string): Promise<boolean> {
  try {
    const expiresAt = new Date(Date.now() + 7 * 4 * 24 * 60 * 60 * 1000);
    const session = await encrypt({
      sub: subject,
      exp: Math.floor(expiresAt.getTime() / 1000),
    });
    const cookieStore = await cookies();

    /**
     * 设置 cookie
     * set( 名称， 值， 配置选项 )
     */
    cookieStore.set(SESSION_COOKIE_NAME, session, {
      httpOnly: true, // 仅服务器
      secure: true, // 仅 https
      expires: expiresAt, // 过期时间
      sameSite: "lax", // 限制跨域 ’lax' 允许跨站请求
      path: "/", // 作用路径 '/' 表示整个网站
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 更新用户会话
 *
 * @description 刷新现有会话的 Cookie，保持用户登录状态。
 * 使用 JWT payload 中的过期时间来保持 Cookie 同步。
 * 自动延长会话过期时间
 *
 * @returns {Promise<boolean>} 如果会话无效或已过期则返回 false
 *
 * @example
 * // 在需要延长用户会话时调用
 * await updateSession();
 */
export async function updateSession(): Promise<boolean> {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const payload = await decrypt(session);
  if (!session || !payload) {
    return false;
  }

  const subject = payload.sub;
  if (!subject) {
    return false;
  }

  const expires = Math.floor(Date.now() / 1000 + 4 * 7 * 24 * 60 * 60);

  const newSession = await encrypt({
    sub: subject,
    exp: expires,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, newSession, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });

  return true;
}

/**
 * 删除用户会话
 *
 * @description 清除用户的会话 Cookie，用于用户登出操作。
 * 调用此函数后，用户需要重新登录才能访问受保护的资源。
 *
 * @example
 * // 用户登出时调用
 * await deleteSession();
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * 获取当前用户信息
 *
 * @description 从 Cookie 中获取并解析会话信息，用于验证用户登录状态
 *
 * @returns Promise<{
 *   userAccount: string | null;
 *   isUserLogin: boolean;
 * }>
 *
 * @example
 * // 在 API 路由中使用
 * const { userId, isUserLogin } = await getCurrentUserBySession();
 * if (!isUserLogin) {
 *   // 处理未登录情况
 * }
 */
export async function getCurrentUserBySession(): Promise<{
  userAccount: string | null;
  isUserLogin: boolean;
}> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const payload = await decrypt(session);
    const userAccount = payload?.sub;

    if (!session || !payload || !userAccount) {
      return {
        userAccount: null,
        isUserLogin: false,
      };
    }

    return {
      userAccount: userAccount,
      isUserLogin: true,
    };
  } catch (error) {
    return {
      userAccount: null,
      isUserLogin: false,
    };
  }
}
