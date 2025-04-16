import { Skeleton } from "@/components/ui/skeleton";

export function SignupFormSkeleton() {
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      {/* 标题和副标题骨架 */}
      <Skeleton className="h-7 w-48" />
      <Skeleton className="mt-2 h-5 w-96" />

      {/* 表单骨架 */}
      <div className="my-8">
        {/* 用户名输入框骨架 */}
        <div className="mb-4">
          <Skeleton className="mb-2 h-5 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>

        {/* 邮箱输入框骨架 */}
        <div className="mb-4">
          <Skeleton className="mb-2 h-5 w-28" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>

        {/* 密码输入框骨架 */}
        <div className="mb-4">
          <Skeleton className="mb-2 h-5 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>

        {/* 重复密码输入框骨架 */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-5 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>

        {/* 注册按钮骨架 */}
        <Skeleton className="h-10 w-full" />

        {/* 登录链接骨架 */}
        <div className="mt-4">
          <Skeleton className="mx-auto h-5 w-64" />
        </div>

        {/* 分割线 */}
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        {/* OAuth 按钮骨架 */}
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}