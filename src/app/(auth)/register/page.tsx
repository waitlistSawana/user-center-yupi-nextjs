import { SignupFormSkeleton } from "@/components/fallback/signup-form-skeleton";
import { SignupForm } from "@/components/signup-form";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="py-10">
      <Suspense fallback={<SignupFormSkeleton />}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
