"use client";

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/aceternity/sidebar";
import { cn } from "@/lib/utils";
import {
  ArrowLeft as IconArrowLeft,
  LayoutDashboard as IconBrandTabler,
  Settings as IconSettings,
  User2Icon as IconUserBolt,
  UsersIcon as IconUsers,
  Star as IconStar,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Logo, LogoIcon } from "./logo-icons";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const links = [
    {
      label: "Welcome",
      href: "/welcome",
      icon: (
        <IconStar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "User Manage",
      href: "/user-manage",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border border-neutral-200 md:flex-row dark:border-neutral-700",
        "overflow-hidden",
        // 全屏布局 顶层布局必备 优于 "h-screen w-full"
        "fixed inset-0",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          {open ? <Logo /> : <LogoIcon />}
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    unoptimized
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
}
