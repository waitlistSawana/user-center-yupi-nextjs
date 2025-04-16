/**
 * @description 生成测试用户会话工具
 *
 * @author Sawana Huang
 *
 * @see generateAdminSession 生成管理员会话
 * @see generateTestUserSession 生成测试用户会话
 * @see generateWrongUserSession 生成错误用户会话
 *
 */

import { encrypt } from "@/server/utils/session";

/**
 * 生成管理员会话
 *
 * @description 创建管理员用户的会话token
 * @returns {Promise<string>} 生成的会话token
 */
export async function generateAdminSession(): Promise<string> {
  return encrypt({ sub: "admin" });
}

/**
 * 生成测试用户会话
 *
 * @description 创建测试用户的会话token
 * @returns {Promise<string>} 生成的会话token
 */
export async function generateTestUserSession(): Promise<string> {
  return encrypt({ sub: "testuser26" });
}

/**
 * 生成错误用户会话
 *
 * @description 创建一个无效用户的会话token，用于测试权限验证
 * @returns {Promise<string>} 生成的会话token
 */
export async function generateWrongUserSession(): Promise<string> {
  return encrypt({ sub: "wrongUser" });
}

/**
 * 主函数
 *
 * @description 运行生成测试会话token
 */
async function main() {
  console.log("生成管理员会话token...");
  const adminToken = await generateAdminSession();
  console.log("管理员会话token:", adminToken);
  console.log();

  console.log("生成测试用户会话token...");
  const userToken = await generateTestUserSession();
  console.log("测试用户会话token:", userToken);
  console.log();

  console.log("生成错误用户会话token...");
  const wrongToken = await generateWrongUserSession();
  console.log("错误用户会话token:", wrongToken);
}

// 执行主函数
main().catch(console.error);
