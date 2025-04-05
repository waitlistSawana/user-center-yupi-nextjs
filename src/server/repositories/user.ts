/**
 * 用户表访问
 *
 * @author Sawana Huang
 */

import "server-only";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { verifyPassword } from "../utils/hash";
import type { SafeUser } from "../db/types";

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
): Promise<number> {
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

/**
 * 判断用户登录，根据用户名和密码
 *
 * @param userAccount 用户名
 * @param plainPassword 明文密码
 *
 * @returns  code: -1 表示未知错误，0 表示成功，1 表示用户不存在，2 表示密码错误
 *           user: 用户信息 { id: number, userAccount: string }
 */
export async function getLoginUser(
  userAccount: string,
  plainPassword: string,
): Promise<{
  code: -1 | 0 | 1 | 2;
  user: SafeUser | null;
  message: string;
}> {
  // 1. 查找当前用户是否在数据库 返回 userId 、 userAccount 和 userPassword
  const user = await db.query.users.findFirst({
    where: eq(users.userAccount, userAccount),
    columns: {
      id: true,
      userAccount: true,
      userPassword: true,
      username: true,
      avatarUrl: true,
      gender: true,
      userRole: true,
      userStatus: true,
      isDelete: true,
      planetCode: true,
      createTime: true,
      updateTime: true,
    },
  });
  if (!user)
    return {
      code: 1,
      message: "user login failed, userAccount not found.",
      user: null,
    };

  // 2. 比较密码是否通过
  const isPasswordMatch = await verifyPassword(
    plainPassword,
    user.userPassword,
  );
  if (!isPasswordMatch)
    return {
      code: 2,
      message: "user login failed, userPassword not match.",
      user: null,
    };

  // 成功获取用户
  if (user)
    return {
      code: 0,
      message: "user login success.",
      user: {
        id: user.id,
        userAccount: user.userAccount,
        username: user.username,
        avatarUrl: user.avatarUrl,
        gender: user.gender,
        userRole: user.userRole,
        userStatus: user.userStatus,
        isDelete: user.isDelete,
        planetCode: user.planetCode,
        createTime: user.createTime,
        updateTime: user.updateTime,
      },
    };

  // 默认返回错误
  return {
    code: -1,
    message: "user login failed, unknown error, default return.",
    user: null,
  };
}
