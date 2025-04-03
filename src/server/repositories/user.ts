/**
 * 用户表访问
 *
 * @author Sawana Huang
 */

import { db } from "../db";
import { users } from "../db/schema";

/**
 * 判断用户是否存在
 *
 * @description 用户是否存在，含数据库
 *
 * @param userAccount 用户账号
 *
 * @returns true 表示存在，false 表示不存在
 */
export async function isUserExist(userAccount: string): Promise<boolean> {
  if (userAccount === "admin") {
    return true;
  }

  const users = await db.query.users.findMany({
    where: (users, { eq }) => eq(users.userAccount, userAccount),
  });
  const countUser = users.length;
  if (countUser > 0) {
    return true;
  }

  return false;
}

/**
 * 创建用户名和密码
 * 
 * @description 根据用户名和明文密码创建用户
 *
 * @param userAccount
 * @param hashedPassword
 * @returns -1 表示失败，其他表示成功
 */
export async function insertUser(
  userAccount: string,
  hashedPassword: string,
): Promise<number | -1> {
  const insertedUser = await db
    .insert(users)
    .values({
      userAccount: userAccount,
      userPassword: hashedPassword,
    })
    .$returningId();

  const userId = insertedUser[0]?.id;
  return userId ?? -1;
}
