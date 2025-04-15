// TankstackQuery doc https://tanstack.com/query/latest/docs/framework/react/overview
// QueryClientProvider has been set at trpc
"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function TankstackQueryDevtools() {
  return (
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
  );
}
