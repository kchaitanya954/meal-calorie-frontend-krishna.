"use client";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (token) router.replace("/dashboard");
  }, [token, hasHydrated, router]);

  if (!hasHydrated || token) return null;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Meal Calorie App</h1>
      <p className="text-gray-600">Register or login, then try the calorie lookup.</p>
      <div className="flex gap-4 mt-4">
        <Link className="underline" href="/register">Register</Link>
        <Link className="underline" href="/login">Login</Link>
      </div>
    </div>
  );
}
