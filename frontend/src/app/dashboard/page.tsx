"use client";
import Link from 'next/link';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function DashboardPage() {
  const authed = useAuthGuard();
  if (!authed) return null;
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-x-4">
        <Link className="underline" href="/calories">Go to Calorie Lookup</Link>
        <Link className="underline" href="/meals">View My Meals</Link>
      </div>
    </div>
  );
}

