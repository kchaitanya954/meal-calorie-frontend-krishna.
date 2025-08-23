"use client";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function ClientHeader() {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const logoHref = token ? "/dashboard" : "/";
  return (
    <header className="border-b p-4 flex items-center justify-between">
      <Link href={logoHref} className="font-semibold">Meal Calories</Link>
      <nav className="space-x-4 text-sm flex items-center">
        {!token ? (
          <>
            <Link href="/register" className="underline">Register</Link>
            <Link href="/login" className="underline">Login</Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="underline">Dashboard</Link>
            <Link href="/calories" className="underline">Calories</Link>
            <Link href="/meals" className="underline">Meals</Link>
            <button onClick={() => { logout(); router.push('/login'); }} className="underline">Logout</button>
          </>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
