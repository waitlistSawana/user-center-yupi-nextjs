"use client";

import type {
  UserLoginPostRequestBody,
  UserLoginSuccessPostResponse,
} from "@/app/api/v1/user/login/route";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { TRPCError } from "@trpc/server";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  ButtonOAuthSign,
  ButtonSign,
} from "./aceternity/button-bottom-gradient";
import { Input } from "./aceternity/input";
import { Label } from "./aceternity/label";
import { IconGithub, IconGoogle } from "./icons";
import { Form, FormField, FormMessage } from "./ui/form";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { SEARCH_PARAMS_FROM } from "@/lib/constant/shared";

const signInFormSchema = z.object({
  userAccount: z.string().min(2).max(50),
  password: z
    .string()
    .min(8, { message: "Password should at least 8 characters." }),
});

export function SigninForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get(SEARCH_PARAMS_FROM) ?? "/welcome";

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      userAccount: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof signInFormSchema>) => {
      const loginResponse = await axios.post<UserLoginSuccessPostResponse>(
        "/api/v1/user/login",
        {
          userAccount: values.userAccount,
          userPassword: values.password,
        } as UserLoginPostRequestBody,
      );

      return loginResponse.data;
    },
    onSuccess: (data) => {
      toast.success("login success");
      // 可以在这里处理登录成功后的逻辑，比如存储 token
      console.log("登录成功", data);
      // 重定向
      router.push(from);
      redirect(from);
    },
    onError: (error) => {
      console.log("row error", error);

      if (axios.isAxiosError(error)) {
        const trpcError = error.response?.data as TRPCError;
        toast.error(trpcError.code, {
          description: trpcError.message,
        });
      }
    },
    onSettled(data) {
      if (data?.user?.id) {
        router.push(from);
        redirect(from);
      }
    },
  });

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    mutate({
      userAccount: values.userAccount,
      password: values.password,
    });
  }

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome Back
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Login to aceternity if you can because we don&apos;t have a login flow
        yet
      </p>
      <Form {...form}>
        <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="userAccount"
            render={({ field }) => (
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">User Account</Label>
                <Input
                  id="useraccount"
                  placeholder="usernameexample"
                  type="useraccount"
                  autoComplete="username"
                  {...field}
                />
                <FormMessage />
              </LabelInputContainer>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  {...field}
                />
                <FormMessage />
              </LabelInputContainer>
            )}
          />

          <ButtonSign isLoading={isPending} type="submit">
            Sign In &rarr;
          </ButtonSign>

          <div>
            <p className="text-center opacity-70 transition-all hover:opacity-100">
              <span>Don&apos;t have an account yet?</span>
              <a
                href="/register"
                className="ml-1 text-blue-500 underline-offset-1"
              >
                Redirect to Sign-Up &rarr;
              </a>
            </p>
          </div>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <ButtonOAuthSign type="button">
              <IconGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                GitHub
              </span>
            </ButtonOAuthSign>
            <ButtonOAuthSign type="button">
              <IconGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Google
              </span>
            </ButtonOAuthSign>
          </div>
        </form>
      </Form>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
