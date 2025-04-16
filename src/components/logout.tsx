/**
 * @file 登出组件集合
 * @description 登出组件
 * @module components/logout
 * @author SawanaHuang
 *
 * @see handleLogout 登出方法
 * @see handleLogoutClick 登出处理函数，用于onClick事件
 * @see LogoutButton 默认登出按钮
 * @see LogoutIconButton 带图标的登出按钮
 */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft as IconArrowLeft } from "lucide-react";
import axios from "axios";
import { type LogoutPostSuccessResponse } from "@/app/api/v1/user/logout/route";

// 登出方法
export async function handleLogout() {
  try {
    const { data } = await axios.post<LogoutPostSuccessResponse>(
      "/api/v1/user/logout",
    );

    if (data.success) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("登出失败", error);
    return false;
  }
}

// 登出处理函数
export async function handleLogoutClick(
  router: ReturnType<typeof useRouter>,
  redirectPath = "/",
): Promise<boolean> {
  const success = await handleLogout();

  if (success) {
    toast.success("Logout Successfully");
    router.push(redirectPath);
    router.refresh();

    return true;
  } else {
    toast.error("Logout Failed");
    return false;
  }
}

// 默认登出按钮
export function LogoutButton() {
  const router = useRouter();

  const onClick = async () => {
    await handleLogoutClick(router, "/");
  };

  return (
    <Button variant="outline" onClick={onClick}>
      退出登录
    </Button>
  );
}

// 带图标的登出按钮
export function LogoutIconButton() {
  const router = useRouter();

  const onClick = async () => {
    await handleLogoutClick(router, "/");
  };

  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      <IconArrowLeft className="h-4 w-4" />
    </Button>
  );
}
