import MealForm from '@/components/MealForm';
import ResultCard from '@/components/ResultCard';

export default function CaloriesPage() {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Calorie Lookup</h1>
      <MealForm />
      <ResultCard />
    </div>
  );
}

