"use client";

import type {
  UserRegisterPostRequestBody,
  UserRegisterSuccessPostResponse,
} from "@/app/api/v1/user/register/route";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TRPCError } from "@trpc/server";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "./aceternity/input";
import { Label } from "./aceternity/label";
import { IconGithub, IconGoogle } from "./icons";
import { useForm } from "react-hook-form";
import { Form, FormField, FormMessage } from "./ui/form";
import { redirect } from "next/navigation";

const signUpFormSchema = z
  .object({
    userAccount: z.string().min(2).max(50),
    email: z.string().email({
      message: "please enter a valid email address",
    }),
    password: z
      .string()
      .min(8, { message: "Password should at least 8 characters." }),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });

export function SignupForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const registerRespondse =
        await axios.post<UserRegisterSuccessPostResponse>(
          "/api/v1/user/register",
          {
            userAccount: values.userAccount,
            email: values.email,
            userPassword: values.password,
            checkPassword: values.repeatPassword,
          } as UserRegisterPostRequestBody,
        );

      console.log("Sign-up submit", values);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("sign-up faild:", error.response?.data);
        const trpcError = error.response?.data as TRPCError;
        setError(trpcError.message);

        const isUserExists =
          trpcError.message === "User account already exists";

        if (isUserExists) {
          toast.error(trpcError.code, {
            description: trpcError.message,
            action: {
              label: "Login",
              onClick: () => redirect("/login"),
            },
          });
        } else {
          toast.error(trpcError.code, {
            description: trpcError.message,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      userAccount: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Aceternity
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
                <Label htmlFor="useraccount">User Account</Label>
                <Input
                  id="useraccount"
                  placeholder="username"
                  type="text"
                  {...field}
                />
                <FormMessage />
              </LabelInputContainer>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="projectmayhem@fc.com"
                  type="email"
                  autoComplete="email"
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
                  autoComplete="new-password"
                  {...field}
                />
                <FormMessage />
              </LabelInputContainer>
            )}
          />
          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <LabelInputContainer className="mb-8">
                <Label htmlFor="twitterpassword">Repeat Password</Label>
                <Input
                  id="repeatpassword"
                  placeholder="••••••••"
                  type="password"
                  {...field}
                />
                <FormMessage />
              </LabelInputContainer>
            )}
          />

          <button
            className={cn(
              "group/btn relative mb-6 block h-10 w-full cursor-pointer rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]",
              isLoading ? "cursor-not-allowed opacity-70" : null,
            )}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2Icon className="absolute right-2 animate-spin" />
            ) : null}
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div>
            <p className="text-center opacity-70 transition-all hover:opacity-100">
              <span>Already have an account?</span>
              <a
                href="/login"
                className="ml-1 text-blue-500 underline-offset-1"
              >
                Redirect to Sign-In &rarr;
              </a>
            </p>
          </div>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
            >
              <IconGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                GitHub
              </span>
              <BottomGradient />
            </button>
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
            >
              <IconGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Google
              </span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </Form>
    </div>
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
