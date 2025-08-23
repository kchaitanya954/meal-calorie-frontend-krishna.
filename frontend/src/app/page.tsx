import Link from "next/link";

export default function Home() {
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
