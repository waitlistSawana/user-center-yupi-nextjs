"use client";

import { handleLogout, handleLogoutClick } from "@/components/logout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MAX_RETRIES = 3; // 最大重试次数
const RETRY_DELAY = 1500; // 重试间隔（毫秒）

export default function LogoutPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("正在退出登录...");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isManually, setIsManually] = useState<boolean>(false);

  useEffect(() => {
    const handleLogoutUseEffect = async () => {
      if (!isLoading) return;

      const success = await handleLogout();

      if (success) {
        setIsLoading(false);
        router.push("/");
        router.refresh();
      } else if (retryCount < MAX_RETRIES) {
        setError("抱歉，遇到了一点小问题，正在为您重新尝试...");
        setRetryCount(retryCount + 1);
      } else {
        setError("抱歉，遇到了一点小问题，您可以尝试手动操作。");
        setIsManually(true);
        setIsLoading(false);
      }
    };

    void handleLogoutUseEffect();
  }, [isLoading, retryCount]);

  return (
    <div id="LogoutPage">
      <div className="space-y-4 text-center">
        <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />

        <h1 className="text-xl font-semibold">
          {isLoading ? "正在退出登录..." : error}
        </h1>

        {isManually && (
          <div className="space-x-4">
            <Button
              variant="default"
              onClick={() => {
                setRetryCount(0);
                setIsLoading(true);
              }}
            >
              重新尝试
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              返回首页
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// 登出流程
// 1. 进入后开始运行删除
// 2. 删除成功后跳转到主页
// 3. 如果删除失败，则重新来
