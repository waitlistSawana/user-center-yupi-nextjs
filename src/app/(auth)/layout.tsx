import { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function LayoutAuth({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      {children}
    </div>
  );
}
