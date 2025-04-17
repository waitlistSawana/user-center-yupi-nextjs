"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { type SafeUser } from "@/server/db/types";
import { useQuery } from "@tanstack/react-query";
import type { UserCurrentGetSuccessResponse } from "@/app/api/v1/user/current/route";
import { toast } from "sonner";
import axios from "axios";

type WelcomePageComponentProps = {
  className?: string;
};

export default function WelcomePageComponent({
  className,
  ...props
}: React.ComponentProps<"div"> & WelcomePageComponentProps) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      try {
        const respondse = await axios.get<UserCurrentGetSuccessResponse>(
          "/api/v1/user/current",
        );
        console.log("get user successfully");

        const user = respondse.data.user;
        return user;
      } catch (error) {
        console.error(error);
        toast.error("get user info failed");
        throw error;
      }
    },
  });

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {user?.username
              ? `欢迎回来，${user.username}！今天也是元气满满的一天哦~`
              : `欢迎加入我们的大家庭！`}
          </CardTitle>
          <CardDescription>
            {user?.username
              ? "这是专属于您的个人空间，一切准备就绪"
              : "让我们开始您的探索之旅吧"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatarUrl ?? ""} />
              <AvatarFallback>
                {user?.username?.charAt(0) ?? user?.userAccount.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-medium">
                {user?.username ?? "待设置昵称"}
              </h3>
              <p className="text-muted-foreground text-sm">
                {`账号: ${user?.userAccount}`} •
                {`星球编号: ${user?.planetCode}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
