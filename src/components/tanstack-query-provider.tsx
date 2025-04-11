// TankstackQuery doc https://tanstack.com/query/latest/docs/framework/react/overview 
// QueryClientProvider has been set at trpc
"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function TankstackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </>
  );
}
