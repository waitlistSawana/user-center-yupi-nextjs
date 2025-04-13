/**
 * 用户服务
 *
 * @author Sawana Huang
 *
 * @see userRegister 用户注册功能，包括账号和密码的合法性校验
 * @see userLogin 用户登录功能，验证用户账号密码，以及生成登录凭证
 * @see userSearchByParams 用户搜索功能，支持按用户名和性别搜索
 * @see userSearchByUserAccount
 * @see userDeleteByUserId 用户删除功能，需要管理员权限
 */

import {
  deleteUserById,
  getLoginUserByUserAccount,
  insertUser,
  isUserAdminByUserAccount,
  isUserExistByUserAccount,
  searchUsers,
  selectUserByUserAcount,
} from "../repositories/user";
import { hashPassword } from "../utils/hash";
import { createSession, getCurrentUserBySession } from "../utils/session";
import type { SafeUser } from "../db/types";

/**
 * 用户注册功能
 *
 * @description 实现用户注册功能，包括账号和密码的合法性校验。
 * 注册成功后返回新用户信息，失败则抛出对应的错误信息。
 *
 * @param {Object} params - 注册参数对象
 * @param {string} params.userAccount - 用户账号，长度6-20位，由字母、数字组成
 * @param {string} params.email - 用户邮箱
 * @param {string} params.userPassword - 用户密码，长度8-20位，需包含字母和数字
 * @param {string} params.checkPassword - 确认密码，必须与userPassword一致
 *
 * @returns {Promise<{userId: number, message: string}>} 返回注册成功的用户信息 成功为 userId 失败为 -1
 */
export async function userRegister({
  userAccount,
  email,
  userPassword,
  checkPassword,
}: {
  userAccount: string;
  email: string;
  userPassword: string;
  checkPassword: string;
}): Promise<{ userId: number; message: string }> {
  // 1。 校验
  if (!userAccount || !email || !userPassword || !checkPassword) {
    return {
      userId: -1,
      message:
        "Missing required fields: userAccount, email, userPassword, or checkPassword",
    };
  }
  if (userAccount.length < 6) {
    return {
      userId: -1,
      message: "User account must be at least 6 characters long",
    };
  }
  if (userPassword.length < 8 || checkPassword.length < 8) {
    return {
      userId: -1,
      message: "Password must be at least 8 characters long",
    };
  }
  // 校验账户不能包含特殊字符
  const matchResult = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.exec(userAccount);
  if (!matchResult) {
    return {
      userId: -1,
      message:
        "User account must start with a letter and can only contain letters, numbers, and underscores",
    };
  }
  // 密码和校验密码是否一致（类型判断，长度，格式）
  if (userPassword.localeCompare(checkPassword) !== 0) {
    return { userId: -1, message: "Passwords do not match" };
  }
  // 账户不能重复 - 数据库访问
  const isDuplicate = await isUserExistByUserAccount(userAccount);
  if (isDuplicate) {
    return { userId: -1, message: "User account already exists" };
  }

  // 2. 加密密码
  const hashedPassword = await hashPassword(userPassword);

  // 3. 存入数据库
  const insertedUserId = await insertUser(userAccount, email, hashedPassword);
  if (insertedUserId === -1) {
    return { userId: -1, message: "Failed to create user account" };
  }

  // 通过校验
  return { userId: insertedUserId, message: "User registration successful" };
}

/**
 * 用户登录功能
 *
 * @description 实现用户登录功能，验证用户账号密码，以及生成登录凭证。
 *
 * @param userAccount 用户账号
 * @param userPassword 用户密码
 *
 * @returns {Promise<{code: 0 | 1 | 2, message: string, user: SafeUser | null}>}
 * 返回登录结果：
 * - code: 0 成功，1 校验不通过，2 获取登录用户信息失败
 * - message: 结果描述
 * - user: 成功时返回用户信息，失败时为 null
 */
export async function userLogin({
  userAccount,
  userPassword,
}: {
  userAccount: string;
  userPassword: string;
}): Promise<{
  code: 0 | 1 | 2;
  message: string;
  user: SafeUser | null;
}> {
  // 1。 校验
  if (!userAccount || !userPassword)
    return {
      code: 1,
      message: "Missing required fields: userAccount or userPassword",
      user: null,
    };
  if (userAccount.length < 6)
    return {
      code: 1,
      message: "User account must be at least 6 characters long",
      user: null,
    };
  if (userPassword.length < 8)
    return {
      code: 1,
      message: "Password must be at least 8 characters long",
      user: null,
    };
  // 校验账户不能包含特殊字符
  const matchResult = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.exec(userAccount);
  if (!matchResult)
    return {
      code: 1,
      message:
        "User account must start with a letter and can only contain letters, numbers, and underscores",
      user: null,
    };

  // 2. 获取登录用户信息
  const matchedUserResponse = await getLoginUserByUserAccount(
    userAccount,
    userPassword,
  );
  const { code, user, message } = matchedUserResponse;
  if (code !== 0 || !user)
    return {
      code: 2,
      message: message,
      user: null,
    };

  // 3. 记录用户登录态
  /**
   * 如何知道哪个用户登录了？
   * 1. 连接服务断后，得到一个 session 状态，返回给前端
   * 2. 登录成功后，得到成功登录的 session，并给 session 设置一些值，返回给前端一个设置coookie的命令
   * 3. 前端收到命令后，设置 cookie ，保存到浏览器内
   * 4. 前端再次请求后端时（相同域名），在请求头中带上 cookie 去请求
   * 5. 后端拿到前端传来的 cookie ，找到对应的 sesion
   * 6. 后端从 seesion 中可以取出基于该 session 存储的变量 （用户的登录信息、登录名）
   */
  await createSession(user.id.toString());

  // 通过校验
  return {
    code: 0,
    message: "Login successful",
    user: user,
  };
}

/**
 * 用户搜索功能
 *
 * @description 根据用户名和性别搜索用户，支持模糊匹配用户名。
 * 返回符合条件的用户列表，用户信息不包含敏感字段。
 *
 * @param {Object} params - 搜索参数对象
 * @param {string} [params.username] - 用户名，可选，支持模糊匹配
 * @param {0 | 1} [params.gender] - 性别，可选，0-女性，1-男性
 *
 * @returns {Promise<SafeUser[]>} 返回符合条件的用户列表
 */
export async function userSearchByParams(params: {
  username?: string;
  gender?: 0 | 1;
}): Promise<SafeUser[]> {
  const users = await searchUsers(params);
  return users;
}

/**
 * 通过用户账号获取用户信息
 *
 * @description 根据用户账号查询用户信息，不包含敏感字段。
 * 如果用户账号为空或用户不存在则返回错误信息。
 *
 * @param {string} userAccount - 用户账号
 *
 * @returns {Promise<{code: 0 | 1, message: string, user: SafeUser | null}>} 返回查询结果
 * - code: 0 表示成功，1 表示校验失败, 2 表示用户不存在
 * - message: 结果描述信息
 * - user: 成功时返回用户信息，失败时为 null
 *
 * @example
 * const result = await userSearchByUserAccount("zhangsan");
 * if (result.code === 0) {
 *   console.log("用户信息:", result.user);
 * } else {
 *   console.log("错误:", result.message);
 * }
 */
export async function userSearchByUserAccount(userAccount: string): Promise<{
  code: 0 | 1 | 2;
  message: string;
  user: SafeUser | null;
}> {
  if (!userAccount) {
    return {
      code: 1,
      message: "User account is empty",
      user: null,
    };
  }

  const user = await selectUserByUserAcount(userAccount);

  if (!user) {
    return {
      code: 2,
      message: "User not found",
      user: null,
    };
  }

  return {
    code: 0,
    message: "succcess",
    user: user,
  };
}

/**
 * 用户删除功能
 *
 * @description 实现用户删除功能，需要管理员权限。
 * 通过软删除方式（更新isDelete字段）删除指定用户。
 *
 * @param {number} userId - 要删除的用户ID
 *
 * @returns {Promise<{suceess: boolean, code: 0 | 1 | 2, message: string}>}
 * 返回删除结果：
 * - success: 操作是否成功
 * - code: 0 成功，1 未登录，2 无权限
 * - message: 结果描述
 */
export async function userDeleteByUserId(userId: number): Promise<{
  suceess: boolean;
  code: 0 | 1 | 2;
  message: string;
}> {
  // 1. 验证用户权限
  const { userAccount, isUserLogin } = await getCurrentUserBySession();
  if (!userAccount || !isUserLogin) {
    return {
      suceess: false,
      code: 1,
      message: "User not logged in",
    };
  }
  // 验证是否为管理员
  const isAdmin = await isUserAdminByUserAccount(userAccount);
  if (!isAdmin) {
    return {
      suceess: false,
      code: 2,
      message: "Insufficient permissions",
    };
  }

  // 2. 执行删除操作
  const deleteResult = await deleteUserById(userId);
  if (deleteResult.code !== 0) {
    return {
      suceess: false,
      code: 2,
      message: deleteResult.message,
    };
  }

  return {
    suceess: true,
    code: 0,
    message: "User deleted successfully",
  };
}
