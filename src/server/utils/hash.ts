/**
 * 仅服务端使用 密码工具函数
 *
 * @author Sawana Huang
 * 
 * @see hashPassword 加密密码
 * @see verifyPassword 验证密码
 */

import "server-only";

import bcrypt from "bcrypt";

/**
 * 加密密码
 *
 * @description 工具函数，加密密码
 *
 * @param plainPassword 明文密码
 * @returns 加密密码
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

/**
 * 验证密码
 *
 * @description 工具函数，验证密码
 *
 * @param plainPassword 明文密码
 * @param hashedPassword 加密后的密码
 *
 * @returns {boolean} 验证结果: true | false
 *
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
