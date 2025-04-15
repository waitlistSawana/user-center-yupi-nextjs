"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/user-manage/data-table-column-header";
import { DataTableRowActions } from "@/components/user-manage/data-table-row-actions";

import type { SafeUser } from "@/server/db/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mars, Venus } from "lucide-react";

export const columns: ColumnDef<SafeUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number" />
    ),
    cell: ({ row }) => {
      const id: SafeUser["id"] = row.getValue("id");
      return <div className="w-[80px]">{id}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      const username: SafeUser["username"] = row.getValue("username");
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{username}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "userAccount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Account" />
    ),
    cell: ({ row }) => {
      const userAccount: SafeUser["userAccount"] = row.getValue("userAccount");
      return (
        <div className="flex w-[100px] items-center truncate">
          {userAccount}
        </div>
      );
    },
  },
  {
    accessorKey: "avatarUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avatar" />
    ),
    cell: ({ row }) => {
      const avatar = {
        url: row.getValue<SafeUser["avatarUrl"]>("avatarUrl"),
        placeholder:
          row.getValue<SafeUser["username"]>("username")?.charAt(0) ?? null,
      };

      return (
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatar.url ?? ""} alt="@shadcn" />
            <AvatarFallback>{avatar.placeholder}</AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const gender: SafeUser["gender"] = row.getValue("gender");
      const genderBadge = () => {
        switch (gender) {
          case 0:
            return <Venus className="h-4 w-4 text-red-500" />;
          case 1:
            return <Mars className="h-4 w-4 text-blue-500" />;
          default:
            return null;
        }
      };

      return <div className="flex w-[100px] items-center">{genderBadge()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
