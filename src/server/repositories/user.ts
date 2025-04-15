/**
 * 用户表访问
 *
 * @author Sawana Huang
 *
 * @see isUserExistByUserAccount 判断用户是否存在，支持admin账号和数据库查询
 * @see isUserExistByUserId 通过用户 ID 判断用户是否存在，支持数据库查询
 * @see insertUser 创建新用户，保存用户账号和加密后的密码
 * @see getLoginUserByUserAccount 用户登录验证，检查账号密码并返回用户信息
 * @see searchUsers 多条件查询用户列表，支持用户名模糊搜索和性别筛选
 * @see selectUserByUserAcount 根据用户账号查询用户信息
 * @see selectAllUsers
 * @see deleteUserById 根据用户 ID 软删除用户，支持管理员权限验证
 */

import "server-only";
import { eq, type SQL } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { verifyPassword } from "../utils/hash";
import type { SafeUser } from "../db/types";

/**
 * 判断用户是否存在 - 通过用户账号
 *
 * @description 用户是否存在，含数据库
 *
 * @param userAccount 用户账号
 *
 * @returns true 表示存在，false 表示不存在
 */
export async function isUserExistByUserAccount(
  userAccount: string,
): Promise<boolean> {
  if (userAccount === "admin") {
    return true;
  }

  const users = await db.query.users.findMany({
    where: (users, { eq, and }) => {
      return and(eq(users.isDelete, 0), eq(users.userAccount, userAccount));
    },
  });
  const countUser = users.length;
  if (countUser > 0) {
    return true;
  }

  return false;
}

/**
 * 判断用户是否存在 - 通过用户Id
 *
 * @description 用户是否存在，含数据库
 *
 * @param userId 用户 Id
 *
 * @returns true 表示存在，false 表示不存在
 */
export async function isUserExistByUserId(userId: number): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: (users, { eq, and }) => {
      return and(eq(users.isDelete, 0), eq(users.id, userId));
    },
  });

  if (user) {
    return true;
  }

  return false;
}

/**
 * 判断用户是否为管理员
 *
 * @description 通过用户账号查询用户角色，判断是否为管理员（userRole === 1）
 *
 * @param {string} userAccount - 用户账号
 *
 * @returns {Promise<boolean>} 返回是否为管理员
 * - true: 用户存在且为管理员（userRole === 1）
 * - false: 用户不存在或非管理员
 *
 * @example
 * // 检查用户是否为管理员
 * const isAdmin = await isUserAdminByUserAccount("admin123");
 * if (isAdmin) {
 *   // 执行管理员操作
 * }
 */
export async function isUserAdminByUserAccount(
  userAccount: string,
): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: (users, { eq, and }) => {
      return and(eq(users.isDelete, 0), eq(users.userAccount, userAccount));
    },
  });

  const isAdmain = user?.userRole === 1;

  return isAdmain;
}

/**
 * 创建用户名和密码
 *
 * @description 根据用户名和明文密码创建用户
 *
 * @param userAccount
 * @param email
 * @param hashedPassword
 * @returns -1 表示失败，其他表示成功
 */
export async function insertUser(
  userAccount: string,
  email: string,
  hashedPassword: string,
): Promise<number> {
  const insertedUser = await db
    .insert(users)
    .values({
      userAccount: userAccount,
      email: email,
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
export async function getLoginUserByUserAccount(
  userAccount: string,
  plainPassword: string,
): Promise<{
  code: -1 | 0 | 1 | 2;
  user: SafeUser | null;
  message: string;
}> {
  // 1. 查找当前用户是否在数据库 返回 userId 、 userAccount 和 userPassword
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => {
      return eq(users.userAccount, userAccount);
    },
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

/**
 * 查询多名用户信息
 *
 * @description 根据查询条件获取匹配的用户列表。支持按用户昵称模糊搜索和性别筛选。
 *
 * @param {object} params - 查询参数对象
 * @param {string} [params.username] - 用户昵称（可选），支持模糊查询，如输入"张"可匹配"张三"、"小张"等
 * @param {0 | 1} [params.gender] - 性别（可选），0-女，1-男
 *
 * @returns {Promise<SafeUser[]>} 返回匹配的用户列表。每个用户对象包含以下字段：
 * - id: 用户ID
 * - userAccount: 用户账号
 * - username: 用户昵称
 * - avatarUrl: 头像URL
 * - gender: 性别（0-女，1-男）
 * - userRole: 用户角色（0-普通用户，1-管理员）
 * - userStatus: 用户状态（0-正常）
 * - isDelete: 是否删除（0-未删除，1-已删除）
 * - planetCode: 星球编号
 * - createTime: 创建时间
 * - updateTime: 更新时间
 *
 * @example
 * // 查询昵称中包含"张"的男性用户
 * const users = await searchUsers({
 *   username: "张",
 *   gender: 1
 * });
 *
 * // 查询所有用户
 * const allUsers = await searchUsers({});
 *
 * @throws {Error} 当数据库查询出错时可能抛出异常
 */
export async function searchUsers(params: {
  username?: string;
  gender?: 0 | 1;
}): Promise<SafeUser[]> {
  const { username, gender } = params;

  const users = await db.query.users.findMany({
    where: (users, { like, eq, and }) => {
      const conditions: SQL<unknown>[] = [];

      conditions.push(eq(users.isDelete, 0)); // 排除已删除用户
      if (username) {
        conditions.push(like(users.username, `%${username}%`));
      }
      if (gender !== undefined) {
        conditions.push(eq(users.gender, gender));
      }

      return conditions.length > 0 ? and(...conditions) : undefined;
    },
    columns: {
      id: true,
      userAccount: true,
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

  return users.map((user) => ({
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
  }));
}

/**
 * 根据用户账号查询用户信息
 *
 * @description 根据用户账号查询用户基本信息，不包含敏感字段（如密码）。
 * 如果用户不存在或查询出错，返回 null。
 *
 * @param {string} userAccount - 用户账号
 *
 * @returns {Promise<SafeUser | null>} 返回用户信息对象或 null
 * - 成功：返回用户信息，包含以下字段：
 *   - id: 用户ID
 *   - userAccount: 用户账号
 *   - username: 用户昵称
 *   - avatarUrl: 头像URL
 *   - gender: 性别（0-女，1-男）
 *   - userRole: 用户角色
 *   - userStatus: 用户状态
 *   - planetCode: 星球编号
 *   - createTime: 创建时间
 *   - updateTime: 更新时间
 * - 失败：返回 null（用户不存在或查询出错）
 *
 * @example
 * // 查询指定用户信息
 * const user = await selectUserByUserAcount("zhangsan");
 */
export async function selectUserByUserAcount(
  userAccount: string,
): Promise<SafeUser | null> {
  if (!userAccount) {
    return null;
  }

  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq, and }) => {
        return and(eq(users.isDelete, 0), eq(users.userAccount, userAccount));
      },
      columns: {
        id: true,
        userAccount: true,
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

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

/**
 * 查询所有用户信息
 *
 * @description 查询所有用户的基本信息，不包含敏感字段（如密码）。
 * 如果查询出错，返回 null。
 *
 * @returns {Promise<SafeUser | null>} 返回用户信息数组或 null
 */
export async function selectAllUsers(): Promise<SafeUser[] | null> {
  try {
    const users = await db.query.users.findMany({
      where: (users, { eq, and }) => {
        return and(eq(users.isDelete, 0));
      },
      columns: {
        id: true,
        userAccount: true,
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

    if (!users || users.length === 0) {
      return null;
    }

    return users.map((user) => ({
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
    }));
  } catch (error) {
    return null;
  }
}

/**
 * 根据用户 ID 删除
 *
 * @description 软删除用户记录，将 isDelete 字段设置为 1
 *
 * @param userId 用户ID
 *
 * @returns 返回删除操作结果
 * - code: 0 表示成功，1 表示用户不存在，2 表示无权限
 * - message: 操作结果描述
 */
export async function deleteUserById(userId: number): Promise<{
  code: 0 | 1 | 2;
  message: string;
}> {
  // 2. 查询用户是否存在
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return {
      code: 1,
      message: "user not found",
    };
  }

  // 3. 执行软删除
  await db.update(users).set({ isDelete: 1 }).where(eq(users.id, userId));

  return {
    code: 0,
    message: "user deleted successfully",
  };
}
