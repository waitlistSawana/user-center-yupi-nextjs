// 运行示例数据插入 
// npx tsx --env-file .env src/server/db/seed.ts

import { db } from "./index";
import { seed } from "drizzle-seed";
import { users } from "./schema";

// 插入示例用户数据
async function usersSeed() {
  try {
    await seed(db, { users }, { count: 15 });
    console.log("示例用户数据插入成功");
  } catch (error) {
    console.error("插入示例用户数据失败:", error);
  }
}

// 执行种子脚本
usersSeed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("种子脚本执行失败:", error);
    process.exit(1);
  });
