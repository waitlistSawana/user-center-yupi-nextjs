/**
 * 用户管理页面
 *
 * @description 用于管理用户 只有管理员可以访问。直接用 server react action 来实现
 *
 */

import { HydrateClient } from "@/trpc/server";
import UserTable from "./user-table";

export default function UserManagePage() {
  // TODO:
  // 1. 校验是否登录 已在 middleware 中实现
  // 2. 校验是否为管理员

  return (
    <HydrateClient>
      <div id="ManagePage">
        <UserTable />
      </div>
    </HydrateClient>
  );
}
