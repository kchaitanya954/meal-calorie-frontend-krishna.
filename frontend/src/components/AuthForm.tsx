"use client";
import { useState } from 'react';
import { registerUser, loginUser } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return String(err);
  } catch {
    return 'Unexpected error';
  }
}

type Mode = 'login' | 'register';

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      if (mode === 'register') {
        await registerUser({
          first_name: String(fd.get('first_name') || ''),
          last_name: String(fd.get('last_name') || ''),
          email: String(fd.get('email') || ''),
          password: String(fd.get('password') || ''),
        });
        const token = await loginUser(String(fd.get('email') || ''), String(fd.get('password') || ''));
        setToken(token.access_token);
      } else {
        const token = await loginUser(String(fd.get('email') || ''), String(fd.get('password') || ''));
        setToken(token.access_token);
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-sm w-full">
      {mode === 'register' && (
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col text-sm gap-1">
            <span>First name</span>
            <input className="border p-2 rounded" name="first_name" required />
          </label>
          <label className="flex flex-col text-sm gap-1">
            <span>Last name</span>
            <input className="border p-2 rounded" name="last_name" required />
          </label>
        </div>
      )}
      <label className="flex flex-col text-sm gap-1">
        <span>Email</span>
        <input className="border p-2 rounded w-full" type="email" name="email" required />
      </label>
      <label className="flex flex-col text-sm gap-1">
        <span>Password</span>
        <input className="border p-2 rounded w-full" type="password" name="password" required />
      </label>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded w-full">
        {loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Login'}
      </button>
    </form>
  );
}

