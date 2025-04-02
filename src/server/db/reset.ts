// 清空示例数据
// npx tsx --env-file .env src/server/db/reset.ts

import { db } from "./index";
import { users } from "./schema";
import { reset } from "drizzle-seed";

async function resetUsers() {
  try {
    await reset(db, { users });
    console.log("示例用户数据清空成功");
  } catch (error) {
    console.error("清空示例用户数据失败:", error);
  }
}

resetUsers()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("种子脚本执行失败:", error);
    process.exit(1);
  });
