"use client";

import { useMemo, useState } from "react";

type ActivityKey = "sedentary" | "light" | "moderate" | "active" | "very";

const ACTIVITY: Record<ActivityKey, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very: 1.9,
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="container mx-auto px-4 pt-16 pb-8 sm:pt-20 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">Fitness Tools</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-white/80">
          Quick calculators to guide your journey. These are estimates — always
          adjust based on real‑world progress and coach input.
        </p>
      </section>

      <section className="container mx-auto grid gap-6 px-4 pb-20 md:grid-cols-2">
        <BMICard />
        <MacrosCard />
      </section>
    </div>
  );
}

function BMICard() {
  const [cm, setCm] = useState(175);
  const [kg, setKg] = useState(70);

  const bmi = useMemo(() => {
    const h = cm / 100;
    if (!h || !kg) return 0;
    return +(kg / (h * h)).toFixed(1);
  }, [cm, kg]);

  const category = useMemo(() => {
    if (!bmi) return "";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  }, [bmi]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-extrabold">BMI Calculator</h2>
      <p className="mt-1 text-sm text-white/80">
        Body Mass Index (kg/m²). A simple ratio of weight to height.
      </p>
      <form className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" onSubmit={(e) => e.preventDefault()}>
        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-xs text-white/70">Height (cm)</span>
          <input
            type="number"
            value={cm}
            onChange={(e) => setCm(+e.target.value)}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
            min={80}
            max={250}
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-xs text-white/70">Weight (kg)</span>
          <input
            type="number"
            value={kg}
            onChange={(e) => setKg(+e.target.value)}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
            min={20}
            max={300}
          />
        </label>
      </form>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
        <div className="text-3xl font-extrabold">{bmi || "—"}</div>
        <div className="text-xs text-white/70">{category}</div>
      </div>
      <p className="mt-3 text-[11px] text-white/60">
        Note: BMI doesn’t distinguish between fat and muscle mass.
      </p>
    </div>
  );
}

function MacrosCard() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(28);
  const [cm, setCm] = useState(175);
  const [kg, setKg] = useState(70);
  const [activity, setActivity] = useState<ActivityKey>("moderate");
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("maintain");

  const { calories, protein, fat, carbs } = useMemo(() => {
    // Mifflin-St Jeor BMR
    const bmr = sex === "male"
      ? 10 * kg + 6.25 * cm - 5 * age + 5
      : 10 * kg + 6.25 * cm - 5 * age - 161;
    let tdee = bmr * ACTIVITY[activity];
    if (goal === "lose") tdee *= 0.85;
    if (goal === "gain") tdee *= 1.1;

    const calories = Math.round(tdee);
    const protein = Math.round(1.8 * kg); // g
    const fat = Math.round((0.25 * calories) / 9); // g
    const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4)); // g
    return { calories, protein, fat, carbs };
  }, [sex, age, cm, kg, activity, goal]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-extrabold">Daily Macros</h2>
      <p className="mt-1 text-sm text-white/80">
        Estimate daily calories and macronutrients using Mifflin‑St Jeor.
      </p>
      <form className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-6" onSubmit={(e) => e.preventDefault()}>
        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-xs text-white/70">Sex</span>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as any)}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-xs text-white/70">Age</span>
          <input type="number" value={age} min={13} max={90} onChange={(e) => setAge(+e.target.value)} className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" />
        </label>
        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-xs text-white/70">Height (cm)</span>
          <input type="number" value={cm} min={80} max={250} onChange={(e) => setCm(+e.target.value)} className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" />
        </label>
        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-xs text-white/70">Weight (kg)</span>
          <input type="number" value={kg} min={20} max={300} onChange={(e) => setKg(+e.target.value)} className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500" />
        </label>
        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-xs text-white/70">Activity</span>
          <select value={activity} onChange={(e) => setActivity(e.target.value as ActivityKey)} className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500">
            <option value="sedentary">Sedentary</option>
            <option value="light">Light (1–3 days/week)</option>
            <option value="moderate">Moderate (3–5)</option>
            <option value="active">Active (6–7)</option>
            <option value="very">Very Active</option>
          </select>
        </label>
        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-xs text-white/70">Goal</span>
          <select value={goal} onChange={(e) => setGoal(e.target.value as any)} className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500">
            <option value="maintain">Maintain</option>
            <option value="lose">Lose</option>
            <option value="gain">Gain</option>
          </select>
        </label>
      </form>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Calories" value={`${calories} kcal`} />
        <Metric label="Protein" value={`${protein} g`} />
        <Metric label="Fat" value={`${fat} g`} />
        <Metric label="Carbs" value={`${carbs} g`} />
      </div>
      <p className="mt-3 text-[11px] text-white/60">
        Defaults: protein 1.8g/kg, fat 25% calories, carbs fill remainder.
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <div className="text-xl font-extrabold">{value}</div>
      <div className="text-xs text-white/70">{label}</div>
    </div>
  );
}

