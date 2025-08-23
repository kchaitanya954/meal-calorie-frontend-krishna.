"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export function useAuthGuard() {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const router = useRouter();
  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) router.replace('/login');
  }, [token, hasHydrated, router]);
  return hasHydrated && !!token;
}

