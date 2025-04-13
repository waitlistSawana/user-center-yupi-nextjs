"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

const buttonSignVariants = cva(
  "group/btn relative mb-6 block h-10 w-full cursor-pointer rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]",
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonSignOAuthVariants = cva(
  "group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]",
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * 登录/注册主按钮
 *
 * @description 规范的输入应该是 text
 */
function ButtonSign({
  children,
  className,
  variant,
  size,
  isLoading = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonSignVariants> & {
    children: React.ReactNode;
    isLoading: boolean;
  }) {
  return (
    <button
      className={cn(
        buttonSignVariants({
          variant,
          size,
          className,
        }),
        isLoading ? "cursor-not-allowed opacity-70" : null,
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2Icon className="absolute right-2 animate-spin" />
      ) : null}
      {children}
      <BottomGradient />
    </button>
  );
}

/**
 * 第三方登录按钮
 *
 * @description 规范的输入应该是 icon + text
 */
function ButtonOAuthSign({
  children,
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonSignOAuthVariants> & {
    children: React.ReactNode;
  }) {
  return (
    <button
      className={cn(
        buttonSignOAuthVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    >
      {children}
      <BottomGradient />
    </button>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

export { BottomGradient, ButtonOAuthSign, ButtonSign };
