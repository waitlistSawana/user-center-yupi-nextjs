"use client";

import type { UserAllSuccessPostResponse } from "@/app/api/v1/user/all/route";
import { columns } from "@/components/user-manage/columns";
import { DataTable } from "@/components/user-manage/data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function UserTable() {
  const { data: users, isPending } = useQuery({
    queryKey: ["seletedUsers"],
    queryFn: () =>
      axios
        .get<UserAllSuccessPostResponse>("/api/v1/user/all")
        .then((respondse) => {
          const users = respondse.data.users;
          return users;
        })
        .catch((error) => {
          console.error(error);
          toast.error("获取用户列表失败");
        }),
  });

  return (
    <div id="UserTable">
      <DataTable data={users ?? []} columns={columns} />
    </div>
  );
}
