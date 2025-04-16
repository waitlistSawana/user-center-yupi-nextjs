import { SigninFormSkeleton } from "@/components/fallback/signin-form-skeleton";
import { SigninForm } from "@/components/signin-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div id="LoginPage" className="py-10">
      <Suspense fallback={<SigninFormSkeleton />}>
        <SigninForm />
      </Suspense>
    </div>
  );
}
