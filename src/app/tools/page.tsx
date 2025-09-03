"use client";

import { useMemo, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";

type ActivityKey = "sedentary" | "light" | "moderate" | "active" | "very";

const ACTIVITY: Record<ActivityKey, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very: 1.9,
};

type Category =
  | "Nutrition & Body Composition"
  | "Strength, Lifting & Gym Math"
  | "Cardio, Conditioning & Endurance"
  | "Programming, Timers & Session Tools"
  | "Mobility, Rehab & Recovery"
  | "Utility & Converters";

type ToolDef = {
  id: string;
  title: string;
  category: Category;
  keywords?: string[];
  component?: () => JSX.Element;
  description?: string;
};

const CATEGORIES: Category[] = [
  "Nutrition & Body Composition",
  "Strength, Lifting & Gym Math",
  "Cardio, Conditioning & Endurance",
  "Programming, Timers & Session Tools",
  "Mobility, Rehab & Recovery",
  "Utility & Converters",
];

const TOOLS: ToolDef[] = [
  // Nutrition & Body Composition (implemented examples)
  { id: "bmi", title: "BMI Calculator", category: "Nutrition & Body Composition", keywords: ["body mass index"], component: BMICard },
  { id: "macros", title: "Daily Macros & TDEE", category: "Nutrition & Body Composition", keywords: ["tdee","calories","protein","carbs","fat"], component: MacrosCard },
  // Placeholders (coming soon)
  { id: "goal-kcal", title: "Goal Calories (Cut/Recomp/Bulk)", category: "Nutrition & Body Composition", component: GoalCaloriesCard, description: "TDEE + target rate → cutting/recomp/bulk kcal (+ weekly change)." },
  { id: "navy-bf", title: "Navy Body‑Fat %", category: "Nutrition & Body Composition", component: NavyBfCard, description: "Height, neck, waist (+ hips for women) → BF%, fat mass, lean mass." },
  { id: "skinfold", title: "Jackson–Pollock Skinfold", category: "Nutrition & Body Composition", description: "3/7‑site calipers → body‑fat % (Siri)." },
  { id: "rfm", title: "Relative Fat Mass (RFM)", category: "Nutrition & Body Composition", description: "Height + waist → BF% (Woolcott)." },
  { id: "wthr", title: "Waist‑to‑Height Ratio", category: "Nutrition & Body Composition", component: WhtrCard, description: "Risk band from waist/height." },
  { id: "whr", title: "Waist‑Hip Ratio (WHR)", category: "Nutrition & Body Composition", component: WhrCard, description: "Risk band from waist/hip." },
  { id: "ffmi", title: "FFMI / Normalized FFMI", category: "Nutrition & Body Composition", component: FfmiCard, description: "Weight, height, BF% → fat‑free mass index (normed)." },
  { id: "ibw", title: "Ideal Body Weight", category: "Nutrition & Body Composition", description: "Devine/Hamwi/Robinson formulas." },
  { id: "protein", title: "Protein Intake Planner", category: "Nutrition & Body Composition", description: "Weight/goal/training days → daily protein range." },
  { id: "carb-cycling", title: "Carb Cycling Helper", category: "Nutrition & Body Composition", description: "TDEE + split → high/low day macros." },
  { id: "hydration", title: "Hydration & Electrolytes", category: "Nutrition & Body Composition", component: HydrationCard, description: "Weight, climate, session length → L/day + Na/K/Mg targets." },
  { id: "caffeine", title: "Caffeine Timing/Dose", category: "Nutrition & Body Composition", description: "Body weight + session time → mg & cut‑off time." },
  { id: "creatine", title: "Creatine Dosing", category: "Nutrition & Body Composition", description: "Weight → loading/maintenance plan (or 3–5 g/day)." },
  { id: "fiber", title: "Fiber Intake", category: "Nutrition & Body Composition", description: "kcal/weight → g/day target (14 g per 1000 kcal)." },
  { id: "alcohol", title: "Alcohol Calories Impact", category: "Nutrition & Body Composition", description: "Drinks → kcal and macro swap." },

  // Strength & lifting (placeholders)
  { id: "1rm", title: "1‑Rep Max (Epley/Brzycki)", category: "Strength, Lifting & Gym Math", component: OneRmCard, description: "Load & reps → 1RM via two formulas." },
  { id: "rep-table", title: "Rep Max Table (2–12RM)", category: "Strength, Lifting & Gym Math", component: RepTableCard, description: "1RM → predicted 2–12RM and %1RM." },
  { id: "rpe-converter", title: "RPE ↔ %1RM Converter", category: "Strength, Lifting & Gym Math", description: "RPE & reps → %1RM (Helms)." },
  { id: "warmup", title: "Warm‑Up Set Generator", category: "Strength, Lifting & Gym Math", description: "Top set target → ramping scheme." },
  { id: "prilepin", title: "Prilepin Planner", category: "Strength, Lifting & Gym Math", component: PrilepinCard, description: "Intensity zone → optimal total reps." },
  { id: "tonnage", title: "Volume Load Tracker", category: "Strength, Lifting & Gym Math", component: VolumeLoadCard, description: "Sets × reps × weight → tonnage." },
  { id: "progression", title: "Weekly Progression", category: "Strength, Lifting & Gym Math", description: "% jumps / double‑progression → targets." },
  { id: "plates", title: "Plate Math", category: "Strength, Lifting & Gym Math", component: PlatesCard, description: "Target weight → per‑side stack (kg/lb)." },
  { id: "db-bb", title: "DB↔BB Equivalents", category: "Strength, Lifting & Gym Math", description: "Estimate DB pair ↔ BB load." },
  { id: "smith", title: "Smith Machine Correction", category: "Strength, Lifting & Gym Math", description: "Guide‑bar angle/assist → true load." },
  { id: "cable", title: "Cable Stack True Load", category: "Strength, Lifting & Gym Math", description: "Pulley ratio → actual resistance." },
  { id: "power-bw", title: "Power‑to‑Bodyweight", category: "Strength, Lifting & Gym Math", description: "1RM/BW → relative strength." },
  { id: "points", title: "Powerlifting Points", category: "Strength, Lifting & Gym Math", description: "Wilks / IPF / Goodlift." },
  { id: "sinclair", title: "Sinclair (WL)", category: "Strength, Lifting & Gym Math", description: "Bodyweight & total → Sinclair." },
  { id: "kb-progress", title: "Kettlebell Progression", category: "Strength, Lifting & Gym Math", description: "Current bell & RPE → next bell." },

  // Cardio & endurance (placeholders)
  { id: "hr-zones", title: "Heart‑Rate Zones", category: "Cardio, Conditioning & Endurance", component: HrZonesCard, description: "Karvonen/Tanaka → Z1–Z5." },
  { id: "met-kcal", title: "Calorie Burn (MET)", category: "Cardio, Conditioning & Endurance", component: MetKcalCard, description: "Activity, weight, duration → kcal." },
  { id: "pace-conv", title: "Run Pace/Speed/Time", category: "Cardio, Conditioning & Endurance", component: PaceConverterCard, description: "Any two → solve the third." },
  { id: "race-predict", title: "Race Time Predictor", category: "Cardio, Conditioning & Endurance", component: RacePredictorCard, description: "Riegel 1.06." },
  { id: "vo2max", title: "VO₂max (Field Tests)", category: "Cardio, Conditioning & Endurance", description: "Cooper/Rockport/1.5‑mile." },
  { id: "treadmill", title: "Treadmill Grade Equivalence", category: "Cardio, Conditioning & Endurance", description: "Speed + incline → flat pace." },
  { id: "ftp-zones", title: "Cycling FTP Zones", category: "Cardio, Conditioning & Endurance", component: FtpZonesCard, description: "Z1–Z7 power/HR ranges." },
  { id: "rower", title: "Rowing Pace ↔ Watts", category: "Cardio, Conditioning & Endurance", component: RowerCard, description: "Concept2 formula." },
  { id: "steps", title: "Steps → Distance/Calories", category: "Cardio, Conditioning & Endurance", component: StepsCard, description: "Steps + stride → km/mi & kcal." },
  { id: "run-walk", title: "Run‑Walk Ratio", category: "Cardio, Conditioning & Endurance", description: "Galloway intervals." },

  // Programming & session tools (placeholders)
  { id: "timers", title: "EMOM/AMRAP/Tabata Timers", category: "Programming, Timers & Session Tools", description: "Big digits, sound, presets." },
  { id: "interval", title: "Interval Builder", category: "Programming, Timers & Session Tools", description: "Custom work/rest rounds." },
  { id: "srpe", title: "Session RPE Load", category: "Programming, Timers & Session Tools", component: SrpeCard, description: "Duration × sRPE → training load." },
  { id: "polarized", title: "Polarized Split Planner", category: "Programming, Timers & Session Tools", component: PolarizedCard, description: "80/20 weekly distribution." },
  { id: "deload", title: "Deload Week Planner", category: "Programming, Timers & Session Tools", component: DeloadCard, description: "−30–50% recipe." },
  { id: "recovery-day", title: "Recovery Day Selector", category: "Programming, Timers & Session Tools", description: "Soreness/sleep/HRR → easy/skip." },

  // Mobility & recovery (placeholders)
  { id: "mobility-timer", title: "Mobility Timer", category: "Mobility, Rehab & Recovery", description: "Holds & sides countdowns." },
  { id: "stretch-dose", title: "Stretch Dose Planner", category: "Mobility, Rehab & Recovery", component: StretchDoseCard, description: "Tightness → sets×seconds." },
  { id: "cold-heat", title: "Cold/Heat Timing Helper", category: "Mobility, Rehab & Recovery", description: "Goal → minutes & order." },
  { id: "sleep", title: "Sleep Need Estimator", category: "Mobility, Rehab & Recovery", component: SleepNeedCard, description: "Load + wake → bedtime window." },

  // Utilities (placeholders)
  { id: "units", title: "Unit Converters", category: "Utility & Converters", component: UnitConverterCard, description: "kg↔lb, cm↔in, km↔mi, kcal↔kJ." },
  { id: "measure", title: "Body Measurements Tracker", category: "Utility & Converters", description: "Waist/hips/chest/arms timeline." },
  { id: "before-after", title: "Before/After Photo Frame", category: "Utility & Converters", description: "Side‑by‑side crop grid." },
  { id: "bag", title: "Gym Bag Checklist", category: "Utility & Converters", description: "Activity → checklist PDF." },
];

export default function ToolsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");

  const visible = TOOLS.filter((t) => {
    const inCat = cat === "all" || t.category === cat;
    const text = (t.title + " " + (t.keywords || []).join(" ")).toLowerCase();
    return inCat && text.includes(q.toLowerCase());
  });

  return (
    <div className="min-h-screen text-white bg-black">
      <section className="container px-4 pt-16 pb-8 mx-auto text-center sm:pt-20">
        <h1 className="text-5xl font-extrabold tracking-tight">Fitness Tools</h1>
        <p className="max-w-2xl mx-auto mt-2 text-sm text-white/80">
          Search, filter, and use calculators for nutrition, strength, endurance, and programming.
        </p>
        {/* Search + category filter */}
        <div className="flex flex-col items-center max-w-3xl gap-3 mx-auto mt-5 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tools…"
            className="w-full px-4 py-2 text-sm border rounded-full outline-none border-white/10 bg-white/5 focus:ring-2 focus:ring-cyan-500"
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as any)}
            className="w-full px-4 py-2 text-sm border rounded-full outline-none border-white/10 bg-white/5 focus:ring-2 focus:ring-cyan-500 sm:w-60"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="container grid gap-6 px-4 pb-20 mx-auto md:grid-cols-2 lg:grid-cols-3">
        {visible.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </section>
    </div>
  );
}

function ToolCard({ tool }: { tool: ToolDef }) {
  return tool.component ? (
    <tool.component />
  ) : (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-white/60">
        {tool.category}
      </div>
      <h2 className="text-2xl font-extrabold">{tool.title}</h2>
      {tool.description && (
        <p className="mt-1 text-sm text-white/80">{tool.description}</p>
      )}
      <div className="inline-flex px-4 py-2 mt-4 text-xs border rounded-full cursor-not-allowed border-white/15 text-white/60">
        Coming Soon
      </div>
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
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">BMI Calculator</h2>
      <p className="mt-1 text-sm text-white/80">Body Mass Index (kg/m²). A simple ratio of weight to height.</p>
      <form className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-4" onSubmit={(e) => e.preventDefault()}>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Height (cm)</span>
          <input
            type="number"
            value={cm}
            onChange={(e) => setCm(+e.target.value)}
            className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500"
            min={80}
            max={250}
          />
        </label>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Weight (kg)</span>
          <input
            type="number"
            value={kg}
            onChange={(e) => setKg(+e.target.value)}
            className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500"
            min={20}
            max={300}
          />
        </label>
      </form>
      <CyanPanel title="Results">
        <div className="grid grid-cols-2 gap-3">
          <Metric label="BMI" value={bmi ? `${bmi}` : "—"} />
          <Metric label="Category" value={category || "—"} />
        </div>
      </CyanPanel>
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
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Daily Macros</h2>
      <p className="mt-1 text-sm text-white/80">Estimate daily calories and macronutrients using Mifflin‑St Jeor.</p>
      <form className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-6" onSubmit={(e) => e.preventDefault()}>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Sex</span>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as any)}
            className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Age</span>
          <input type="number" value={age} min={13} max={90} onChange={(e) => setAge(+e.target.value)} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Height (cm)</span>
          <input type="number" value={cm} min={80} max={250} onChange={(e) => setCm(+e.target.value)} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Weight (kg)</span>
          <input type="number" value={kg} min={20} max={300} onChange={(e) => setKg(+e.target.value)} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Activity</span>
          <select value={activity} onChange={(e) => setActivity(e.target.value as ActivityKey)} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500">
            <option value="sedentary">Sedentary</option>
            <option value="light">Light (1–3 days/week)</option>
            <option value="moderate">Moderate (3–5)</option>
            <option value="active">Active (6–7)</option>
            <option value="very">Very Active</option>
          </select>
        </label>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Goal</span>
          <select value={goal} onChange={(e) => setGoal(e.target.value as any)} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500">
            <option value="maintain">Maintain</option>
            <option value="lose">Lose</option>
            <option value="gain">Gain</option>
          </select>
        </label>
      </form>
      <CyanPanel title="Results">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Calories" value={`${calories} kcal`} />
          <Metric label="Protein" value={`${protein} g`} />
          <Metric label="Fat" value={`${fat} g`} />
          <Metric label="Carbs" value={`${carbs} g`} />
        </div>
      </CyanPanel>
      <p className="mt-3 text-[11px] text-white/60">
        Defaults: protein 1.8g/kg, fat 25% calories, carbs fill remainder.
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 text-center border rounded-2xl border-white/10 bg-white/5">
      <div className="text-xl font-extrabold">{value}</div>
      <div className="text-xs text-white/70">{label}</div>
    </div>
  );
}

// ----------------- Additional functional calculators -----------------

function CyanPanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="p-4 mt-4 border rounded-2xl border-cyan-500/30 bg-cyan-500/10">
      <div className="text-xs font-bold tracking-wider uppercase text-cyan-400">{title}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function GoalCaloriesCard() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(28);
  const [cm, setCm] = useState(175);
  const [kg, setKg] = useState(70);
  const [activity, setActivity] = useState<ActivityKey>("moderate");
  const [rate, setRate] = useState(0.25); // kg/week (positive = gain, negative = cut)

  const { tdee, dailyDelta, target } = useMemo(() => {
    const bmr = sex === "male" ? 10 * kg + 6.25 * cm - 5 * age + 5 : 10 * kg + 6.25 * cm - 5 * age - 161;
    const tdee = Math.round(bmr * ACTIVITY[activity]);
    const dailyDelta = Math.round((7700 * rate) / 7); // kcal per day
    const target = tdee + dailyDelta;
    return { tdee, dailyDelta, target };
  }, [sex, age, cm, kg, activity, rate]);

  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Goal Calories</h2>
      <p className="mt-1 text-sm text-white/80">TDEE + weekly rate → cutting / recomp / bulk calories.</p>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e) => e.preventDefault()}>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Sex</span>
          <select value={sex} onChange={(e)=>setSex(e.target.value as any)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Age</span>
          <input type="number" min={13} max={90} value={age} onChange={(e)=>setAge(+e.target.value)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Height (cm)</span>
          <input type="number" min={80} max={250} value={cm} onChange={(e)=>setCm(+e.target.value)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Weight (kg)</span>
          <input type="number" min={20} max={300} value={kg} onChange={(e)=>setKg(+e.target.value)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Activity</span>
          <select value={activity} onChange={(e)=>setActivity(e.target.value as ActivityKey)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500">
            <option value="sedentary">Sedentary</option>
            <option value="light">Light (1–3 days)</option>
            <option value="moderate">Moderate (3–5)</option>
            <option value="active">Active (6–7)</option>
            <option value="very">Very Active</option>
          </select>
        </label>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Rate (kg/week)</span>
          <input type="number" step={0.05} value={rate} onChange={(e)=>setRate(+e.target.value)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
      </form>
      <CyanPanel title="Results">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Maintenance (TDEE)" value={`${tdee} kcal`} />
          <Metric label="Daily Delta" value={`${dailyDelta>0?'+':''}${dailyDelta} kcal`} />
          <Metric label="Target Calories" value={`${target} kcal`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">1 kg ≈ 7700 kcal. For sustainable change, try −0.25 to −0.75 kg/week for cutting or +0.1 to +0.25 kg/week for lean gain.</p>
      </CyanPanel>
    </div>
  );
}

function NavyBfCard() {
  const [sex, setSex] = useState<"male"|"female">("male");
  const [height, setHeight] = useState(175);
  const [neck, setNeck] = useState(38);
  const [waist, setWaist] = useState(80);
  const [hips, setHips] = useState(95);
  const [weight, setWeight] = useState(70);

  const { bf, lean, fat } = useMemo(() => {
    const toIn = (cm:number)=> cm/2.54;
    const h = toIn(height), n = toIn(neck), w = toIn(waist), hp = toIn(hips);
    let bf = 0;
    if (sex === 'male') {
      bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
    } else {
      bf = 163.205 * Math.log10(w + hp - n) - 97.684 * Math.log10(h) - 78.387;
    }
    bf = Math.max(2, Math.min(60, +bf.toFixed(1)));
    // Assume 70kg body mass for composition display? Better: prompt user weight
    const fat = +(weight * (bf/100)).toFixed(1);
    const lean = +(weight - fat).toFixed(1);
    return { bf, lean, fat };
  }, [sex, height, neck, waist, hips, weight]);

  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Navy Body‑Fat %</h2>
      <p className="mt-1 text-sm text-white/80">Tape method (US Navy). Measurements in cm.</p>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Sex</span>
          <select value={sex} onChange={(e)=>setSex(e.target.value as any)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <Num label="Height (cm)" value={height} setValue={setHeight} />
        <Num label="Neck (cm)" value={neck} setValue={setNeck} />
        <Num label="Waist (cm)" value={waist} setValue={setWaist} />
        {sex==='female' && <Num label="Hips (cm)" value={hips} setValue={setHips} />}
        <Num label="Bodyweight (kg)" value={weight} setValue={setWeight} min={20} max={300} />
      </form>
      <CyanPanel title="Results">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Body‑Fat %" value={`${bf} %`} />
          <Metric label="Fat Mass (est)" value={`${fat} kg`} />
          <Metric label="Lean Mass (est)" value={`${lean} kg`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">For precision, use a smart scale or DXA. This is a fast estimate.</p>
      </CyanPanel>
    </div>
  );
}

function OneRmCard() {
  const [load, setLoad] = useState(100);
  const [reps, setReps] = useState(5);
  const epley = useMemo(()=> +(load * (1 + reps/30)).toFixed(1), [load, reps]);
  const brzycki = useMemo(()=> reps>=1 && reps<37 ? +(load * 36/(37-reps)).toFixed(1): 0, [load, reps]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">1‑Rep Max (Epley/Brzycki)</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-4" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Load (kg)" value={load} setValue={setLoad} min={10} max={500} />
        <Num label="Reps" value={reps} setValue={setReps} min={1} max={12} />
      </form>
      <CyanPanel title="Estimates">
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Epley 1RM" value={`${epley} kg`} />
          <Metric label="Brzycki 1RM" value={`${brzycki || '—'} kg`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Use the lower of the two for conservative loading.</p>
      </CyanPanel>
    </div>
  );
}

// Rep Max Table (2–12RM)
function RepTableCard() {
  const [oneRm, setOneRm] = useState(150);
  const rows = useMemo(() => {
    const reps = Array.from({ length: 11 }, (_, i) => i + 2); // 2..12
    return reps.map(r => {
      const pct = 1 / (1 + r / 30);
      const load = Math.round(oneRm * pct);
      return { r, pct: Math.round(pct * 100), load };
    });
  }, [oneRm]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Rep Max Table (2–12RM)</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-4" onSubmit={(e)=>e.preventDefault()}>
        <Num label="1RM (kg)" value={oneRm} setValue={setOneRm} min={20} max={500} />
      </form>
      <CyanPanel title="Predictions (Epley)">
        <div className="grid grid-cols-3 gap-2 text-xs text-center text-white/80">
          {rows.map(({ r, pct, load }) => (
            <div key={r} className="p-3 border rounded-2xl border-white/10 bg-white/5">
              <div className="text-lg font-extrabold text-white">{load} kg</div>
              <div>≈ {r}RM • {pct}% 1RM</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-white/70">Uses Epley percentage curve. Round down for safety.</p>
      </CyanPanel>
    </div>
  );
}

// Prilepin Planner
function PrilepinCard() {
  const [percent, setPercent] = useState(75); // %1RM
  const zone = useMemo(() => {
    const p = percent;
    if (p < 70) return { range: [18, 30], optimal: 24, repsPerSet: "3–6" };
    if (p < 80) return { range: [12, 24], optimal: 18, repsPerSet: "3–6" };
    if (p < 90) return { range: [10, 20], optimal: 15, repsPerSet: "2–4" };
    return { range: [4, 10], optimal: 7, repsPerSet: "1–2" };
  }, [percent]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Prilepin Planner</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-4" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Intensity (%1RM)" value={percent} setValue={setPercent} min={50} max={100} />
      </form>
      <CyanPanel title="Guidelines">
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Reps/Set" value={zone.repsPerSet} />
          <Metric label="Optimal Total" value={`${zone.optimal}`} />
          <Metric label="Range" value={`${zone.range[0]}–${zone.range[1]}`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Use lower end for novices or near‑max lifts; higher for speed work.</p>
      </CyanPanel>
    </div>
  );
}

// Volume Load Tracker
function VolumeLoadCard() {
  const [sets, setSets] = useState(5);
  const [reps, setReps] = useState(5);
  const [weight, setWeight] = useState(100);
  const tonnage = useMemo(() => sets * reps * weight, [sets, reps, weight]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Volume Load Tracker</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Sets" value={sets} setValue={setSets} min={1} max={20} />
        <Num label="Reps/Set" value={reps} setValue={setReps} min={1} max={30} />
        <Num label="Weight (kg)" value={weight} setValue={setWeight} min={1} max={500} />
      </form>
      <CyanPanel title="Result">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Total Reps" value={`${sets * reps}`} />
          <Metric label="Tonnage" value={`${tonnage} kg`} />
          <Metric label="Sets" value={`${sets}`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Tip: Compare session tonnage week‑to‑week for progression.</p>
      </CyanPanel>
    </div>
  );
}

// Plate Math (kg)
function PlatesCard() {
  const [target, setTarget] = useState(180);
  const [bar, setBar] = useState(20);
  const [available, setAvailable] = useState("25,20,15,10,5,2.5,1.25,0.5");
  const perSide = useMemo(() => {
    const plates = available.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)).sort((a,b)=>b-a);
    let side = (target - bar) / 2;
    if (side <= 0) return [] as number[];
    const out: number[] = [];
    for (const p of plates) {
      while (side >= p - 1e-6) { out.push(p); side = +(side - p).toFixed(3); }
    }
    return out;
  }, [target, bar, available]);
  const sumSide = perSide.reduce((a,b)=>a+b,0);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Plate Math</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Target (kg)" value={target} setValue={setTarget} min={bar} max={500} />
        <Num label="Bar (kg)" value={bar} setValue={setBar} min={5} max={50} />
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Plates (kg, comma‑sep)</span>
          <input value={available} onChange={(e)=>setAvailable(e.target.value)} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
      </form>
      <CyanPanel title="Per‑Side Stack">
        <div className="text-sm">
          {perSide.length ? perSide.join(" + ") + " kg" : "—"}
        </div>
        <p className="mt-2 text-[11px] text-white/70">Computed per‑side: {sumSide ? `${sumSide} kg` : '—'} • Total = {sumSide ? `${sumSide*2 + bar} kg` : '—'}</p>
      </CyanPanel>
    </div>
  );
}
function HrZonesCard() {
  const [age, setAge] = useState(30);
  const [rest, setRest] = useState(60);
  const hrmax = useMemo(()=> Math.round(208 - 0.7*age), [age]); // Tanaka
  const hrr = hrmax - rest;
  const zone = (lo:number, hi:number)=> `${Math.round(rest + hrr*lo)}–${Math.round(rest + hrr*hi)} bpm`;
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Heart‑Rate Zones (Karvonen)</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-4" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Age" value={age} setValue={setAge} min={10} max={90} />
        <Num label="Resting HR" value={rest} setValue={setRest} min={35} max={110} />
      </form>
      <CyanPanel title="Zones">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Z1 50–60%" value={zone(0.50,0.60)} />
          <Metric label="Z2 60–70%" value={zone(0.60,0.70)} />
          <Metric label="Z3 70–80%" value={zone(0.70,0.80)} />
          <Metric label="Z4 80–90%" value={zone(0.80,0.90)} />
          <Metric label="Z5 90–100%" value={zone(0.90,1.00)} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">HRmax ≈ {hrmax} bpm • Resting HR = {rest} bpm</p>
      </CyanPanel>
    </div>
  );
}

// Calorie Burn (MET)
function MetKcalCard() {
  const [met, setMet] = useState(8);
  const [kg, setKg] = useState(70);
  const [min, setMin] = useState(45);
  const kcal = useMemo(() => Math.round(met * 3.5 * kg / 200 * min), [met, kg, min]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Calorie Burn (MET)</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="MET" value={met} setValue={setMet} min={1} max={20} />
        <Num label="Weight (kg)" value={kg} setValue={setKg} min={20} max={300} />
        <Num label="Duration (min)" value={min} setValue={setMin} min={1} max={300} />
      </form>
      <CyanPanel title="Result">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Energy" value={`${kcal} kcal`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Formula: kcal = MET × 3.5 × kg / 200 × minutes.</p>
      </CyanPanel>
    </div>
  );
}

// Pace/Speed/Time Converter (running)
function PaceConverterCard() {
  const [distKm, setDistKm] = useState(5);
  const [timeStr, setTimeStr] = useState("00:25:00");
  const totalSec = useMemo(()=> parseTime(timeStr), [timeStr]);
  const paceSecPerKm = useMemo(()=> (distKm>0 && totalSec>0) ? Math.round(totalSec / distKm) : 0, [distKm, totalSec]);
  const speedKmh = useMemo(()=> paceSecPerKm>0 ? +(3.6 * 1000 / paceSecPerKm).toFixed(2) : 0, [paceSecPerKm]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Run Pace / Speed / Time</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Distance (km)" value={distKm} setValue={setDistKm} min={0.1} max={100} />
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Time (HH:MM:SS)</span>
          <input value={timeStr} onChange={(e)=>setTimeStr(e.target.value)} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
      </form>
      <CyanPanel title="Results">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Pace" value={paceSecPerKm? `${formatPace(paceSecPerKm)} /km` : '—'} />
          <Metric label="Speed" value={speedKmh? `${speedKmh} km/h` : '—'} />
      </div>
      </CyanPanel>
    </div>
  );
}

// Race Time Predictor (Riegel)
function RacePredictorCard() {
  const [d1, setD1] = useState(5);
  const [t1, setT1] = useState("00:25:00");
  const [d2, setD2] = useState(21.0975);
  const t2 = useMemo(()=>{
    const sec1 = parseTime(t1);
    if (!sec1 || d1<=0 || d2<=0) return 0;
    const sec2 = sec1 * Math.pow(d2/d1, 1.06);
    return Math.round(sec2);
  }, [d1, t1, d2]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Race Time Predictor</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Known Distance (km)" value={d1} setValue={setD1} min={0.4} max={100} />
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Known Time (HH:MM:SS)</span>
          <input value={t1} onChange={(e)=>setT1(e.target.value)} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
        <Num label="Target Distance (km)" value={d2} setValue={setD2} min={0.8} max={100} />
      </form>
      <CyanPanel title="Prediction (k=1.06)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Predicted Time" value={t2? formatTime(t2) : '—'} />
          <Metric label="Predicted Pace" value={t2 && d2? `${formatPace(Math.round(t2/d2))} /km` : '—'} />
        </div>
      </CyanPanel>
    </div>
  );
}

// FTP Zones (Coggan)
function FtpZonesCard() {
  const [ftp, setFtp] = useState(250); // watts
  const zones = useMemo(() => {
    const z = [
      { name: 'Z1', lo: 0, hi: 0.55 },
      { name: 'Z2', lo: 0.56, hi: 0.75 },
      { name: 'Z3', lo: 0.76, hi: 0.90 },
      { name: 'Z4', lo: 0.91, hi: 1.05 },
      { name: 'Z5', lo: 1.06, hi: 1.20 },
      { name: 'Z6', lo: 1.21, hi: 1.50 },
      { name: 'Z7', lo: 1.51, hi: 3.00 },
    ];
    return z.map(zx => ({ ...zx, loW: Math.round(zx.lo * ftp), hiW: Math.round(zx.hi * ftp) }));
  }, [ftp]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Cycling FTP Zones</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-4" onSubmit={(e)=>e.preventDefault()}>
        <Num label="FTP (W)" value={ftp} setValue={setFtp} min={80} max={500} />
      </form>
      <CyanPanel title="Power Ranges">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {zones.map(z => (
            <div key={z.name} className="p-3 text-center border rounded-2xl border-white/10 bg-white/5">
              <div className="text-lg font-extrabold">{z.name}</div>
              <div className="text-xs text-white/80">{z.loW}–{z.hiW} W</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-white/70">Based on Coggan classic zones from FTP.</p>
      </CyanPanel>
    </div>
  );
}

// Rowing Pace ↔ Watts (Concept2)
function RowerCard() {
  const [pace, setPace] = useState("02:00"); // per 500m
  const [watts, setWatts] = useState(203);
  const paceSec = useMemo(()=> parsePace(pace), [pace]);
  const wattsFromPace = useMemo(() => paceSec? Math.round(2.8 / Math.pow(paceSec/500, 3)) : 0, [paceSec]);
  const paceFromWatts = useMemo(() => watts>0? formatPace(Math.round(500 * Math.pow(2.8 / watts, 1/3))) : "—", [watts]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Rowing Pace ↔ Watts</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Pace (mm:ss / 500m)</span>
          <input value={pace} onChange={(e)=>setPace(e.target.value)} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
        <Num label="Watts" value={watts} setValue={setWatts} min={10} max={1000} />
      </form>
      <CyanPanel title="Results">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Watts (from pace)" value={wattsFromPace? `${wattsFromPace} W` : '—'} />
          <Metric label="Pace (from watts)" value={paceFromWatts} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Concept2: W = 2.8 / (t/500)^3</p>
      </CyanPanel>
    </div>
  );
}

// Steps → Distance/Calories
function StepsCard() {
  const [steps, setSteps] = useState(8000);
  const [strideCm, setStrideCm] = useState(75);
  const [weight, setWeight] = useState(70);
  const distanceKm = useMemo(()=> +(steps * strideCm / 100000).toFixed(2), [steps, strideCm]);
  const kcal = useMemo(()=> Math.round(distanceKm * weight * 0.9), [distanceKm, weight]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Steps → Distance/Calories</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Steps" value={steps} setValue={setSteps} min={0} max={50000} />
        <Num label="Stride (cm)" value={strideCm} setValue={setStrideCm} min={40} max={120} />
        <Num label="Weight (kg)" value={weight} setValue={setWeight} min={20} max={300} />
      </form>
      <CyanPanel title="Results">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Distance" value={`${distanceKm} km`} />
          <Metric label="Calories" value={`${kcal} kcal`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Approx. 0.8–1.0 kcal/kg/km for walking; using 0.9 here.</p>
      </CyanPanel>
    </div>
  );
}

// Session RPE Load
function SrpeCard() {
  const [minutes, setMinutes] = useState(60);
  const [sRpe, setSRpe] = useState(6); // 0–10
  const load = useMemo(()=> minutes * sRpe, [minutes, sRpe]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Session RPE Load</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Duration (min)" value={minutes} setValue={setMinutes} min={5} max={300} />
        <Num label="sRPE (0–10)" value={sRpe} setValue={setSRpe} min={0} max={10} />
      </form>
      <CyanPanel title="Result">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Load" value={`${load} AU`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Load = minutes × sRPE (Borg CR10 scale).</p>
      </CyanPanel>
    </div>
  );
}

// Polarized Split Planner
function PolarizedCard() {
  const [weeklyMin, setWeeklyMin] = useState(300);
  const [easyPct, setEasyPct] = useState(80); // %
  const easy = Math.round(weeklyMin * easyPct / 100);
  const hard = weeklyMin - easy;
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Polarized Split Planner</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Weekly Minutes" value={weeklyMin} setValue={setWeeklyMin} min={60} max={1200} />
        <Num label="Easy %" value={easyPct} setValue={setEasyPct} min={50} max={95} />
      </form>
      <CyanPanel title="Distribution">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Easy (Z1/Z2)" value={`${easy} min`} />
          <Metric label="Hard (Z3+)" value={`${hard} min`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Classic 80/20 split between low‑intensity and moderate/high work.</p>
      </CyanPanel>
    </div>
  );
}

// Deload Week Planner
function DeloadCard() {
  const [sets, setSets] = useState(5);
  const [reps, setReps] = useState(5);
  const [weight, setWeight] = useState(100);
  const [reduce, setReduce] = useState(40); // percent reduction
  const dSets = Math.max(1, Math.round(sets * (100 - reduce) / 100));
  const dReps = Math.max(1, Math.round(reps * (100 - reduce) / 100));
  const dWeight = Math.max(1, Math.round(weight * (100 - reduce) / 100));
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Deload Week Planner</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Sets" value={sets} setValue={setSets} min={1} max={20} />
        <Num label="Reps/Set" value={reps} setValue={setReps} min={1} max={30} />
        <Num label="Weight (kg)" value={weight} setValue={setWeight} min={1} max={500} />
        <Num label="Reduction %" value={reduce} setValue={setReduce} min={20} max={60} />
      </form>
      <CyanPanel title="Suggested Deload">
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Sets" value={`${dSets}`} />
          <Metric label="Reps" value={`${dReps}`} />
          <Metric label="Weight" value={`${dWeight} kg`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Typical deload: reduce volume and/or intensity by 30–50%.</p>
      </CyanPanel>
    </div>
  );
}

// Stretch Dose Planner
function StretchDoseCard() {
  const [tightness, setTightness] = useState(6); // 1..10
  const [areas, setAreas] = useState(2);
  const sets = Math.min(5, Math.max(2, Math.round(tightness / 2)));
  const hold = 15 + tightness * 5; // seconds per set
  const total = sets * hold * areas;
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Stretch Dose Planner</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Tightness (1–10)" value={tightness} setValue={setTightness} min={1} max={10} />
        <Num label="Areas" value={areas} setValue={setAreas} min={1} max={6} />
      </form>
      <CyanPanel title="Suggestion">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Sets/Area" value={`${sets}`} />
          <Metric label="Hold/Set" value={`${hold} s`} />
          <Metric label="Total Time" value={`${total} s`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Hold stretches 30–60s each; breathe and avoid pain.</p>
      </CyanPanel>
    </div>
  );
}

// Sleep Need Estimator
function SleepNeedCard() {
  const [wake, setWake] = useState("06:30");
  const [load, setLoad] = useState(3); // training load 1..5
  const hours = useMemo(()=> 7 + Math.min(2, Math.max(0, load - 2)), [load]); // 7..9
  const windowStart = timeMinusHours(wake, hours + 0.5);
  const windowEnd = timeMinusHours(wake, hours - 0.5);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Sleep Need Estimator</h2>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Wake Time (HH:MM)</span>
          <input value={wake} onChange={(e)=>setWake(e.target.value)} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
        </label>
        <Num label="Training Load (1–5)" value={load} setValue={setLoad} min={1} max={5} />
      </form>
      <CyanPanel title="Bedtime Window">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Target Hours" value={`${hours} h`} />
          <Metric label="Start" value={`${windowStart}`} />
          <Metric label="End" value={`${windowEnd}`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Aim for 7–9 hours; adjust for training and stress.</p>
      </CyanPanel>
    </div>
  );
}

// ---------- helpers ----------
function parseTime(s: string): number {
  // HH:MM:SS or MM:SS
  const parts = s.split(":").map(n=>parseInt(n,10));
  if (parts.some(isNaN)) return 0;
  if (parts.length === 2) return parts[0]*60 + parts[1];
  if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
  return 0;
}
function formatTime(sec: number): string {
  const h = Math.floor(sec/3600); const m = Math.floor((sec%3600)/60); const s = Math.floor(sec%60);
  const pad=(n:number)=> n.toString().padStart(2,'0');
  return h>0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
function parsePace(s: string): number {
  // mm:ss per 500m → seconds per 500m
  const parts = s.split(":").map(n=>parseInt(n,10));
  if (parts.length!==2 || parts.some(isNaN)) return 0;
  return parts[0]*60 + parts[1];
}
function formatPace(secPerKm: number): string {
  const m = Math.floor(secPerKm/60); const s = Math.floor(secPerKm%60);
  return `${m}:${s.toString().padStart(2,'0')}`;
}
function timeMinusHours(wakeHHMM: string, hours: number): string {
  const [H,M] = wakeHHMM.split(":").map(n=>parseInt(n,10));
  if ([H,M].some(isNaN)) return "—";
  const total = H*60 + M - Math.round(hours*60);
  const t = (total % (24*60) + 24*60) % (24*60); // <-- Changed 'let' to 'const'
  const hh = Math.floor(t/60).toString().padStart(2,'0');
  const mm = Math.floor(t%60).toString().padStart(2,'0');
  return `${hh}:${mm}`;
}
function UnitConverterCard() {
  const [kg, setKg] = useState(100);
  const lb = useMemo(()=> +(kg * 2.20462).toFixed(2), [kg]);
  const [cm, setCm] = useState(180);
  const inch = useMemo(()=> +(cm / 2.54).toFixed(2), [cm]);
  const [km, setKm] = useState(5);
  const mi = useMemo(()=> +(km * 0.621371).toFixed(2), [km]);
  const [kcal, setKcal] = useState(2500);
  const kJ = useMemo(()=> Math.round(kcal * 4.184), [kcal]);
  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Unit Converters</h2>
      <div className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-white/70">kg → lb</span>
          <input type="number" value={kg} onChange={(e)=>setKg(+e.target.value)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
          <CyanPanel title="Result"><div className="text-sm font-bold text-cyan-300">{lb} lb</div></CyanPanel>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-white/70">cm → in</span>
          <input type="number" value={cm} onChange={(e)=>setCm(+e.target.value)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
          <CyanPanel title="Result"><div className="text-sm font-bold text-cyan-300">{inch} in</div></CyanPanel>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-white/70">km → mi</span>
          <input type="number" value={km} onChange={(e)=>setKm(+e.target.value)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
          <CyanPanel title="Result"><div className="text-sm font-bold text-cyan-300">{mi} mi</div></CyanPanel>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-white/70">kcal → kJ</span>
          <input type="number" value={kcal} onChange={(e)=>setKcal(+e.target.value)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
          <CyanPanel title="Result"><div className="text-sm font-bold text-cyan-300">{kJ} kJ</div></CyanPanel>
        </label>
      </div>
    </div>
  );
}

function Num({ label, value, setValue, min, max }:{ label:string; value:number; setValue:(n:number)=>void; min?:number; max?:number }) {
  return (
    <label className="flex flex-col col-span-2 gap-1">
      <span className="text-xs text-white/70">{label}</span>
      <input type="number" value={value} onChange={(e)=>setValue(+e.target.value)} min={min} max={max} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500" />
    </label>
  );
}

// Waist‑Hip Ratio
function WhrCard() {
  const [sex, setSex] = useState<"male"|"female">("male");
  const [waist, setWaist] = useState(80); // cm
  const [hips, setHips] = useState(95);  // cm

  const ratio = useMemo(()=> (hips>0 ? +(waist/hips).toFixed(2) : 0), [waist, hips]);
  const band = useMemo(()=>{
    if (!ratio) return "";
    if (sex==='male') {
      if (ratio <= 0.90) return 'Low Risk';
      if (ratio <= 1.00) return 'Moderate Risk';
      return 'High Risk';
    } else {
      if (ratio <= 0.80) return 'Low Risk';
      if (ratio <= 0.85) return 'Moderate Risk';
      return 'High Risk';
    }
  }, [ratio, sex]);

  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Waist‑Hip Ratio (WHR)</h2>
      <p className="mt-1 text-sm text-white/80">Waist / Hips in centimeters. Indicator of central adiposity.</p>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Sex</span>
          <select value={sex} onChange={(e)=>setSex(e.target.value as any)} className="px-3 py-2 border rounded-lg border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <Num label="Waist (cm)" value={waist} setValue={setWaist} min={40} max={200} />
        <Num label="Hips (cm)" value={hips} setValue={setHips} min={40} max={200} />
      </form>
      <CyanPanel title="Results">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="WHR" value={ratio? `${ratio}`:'—'} />
          <Metric label="Risk Band" value={band || '—'} />
        </div>
      </CyanPanel>
    </div>
  );
}

// Waist-to-Height Ratio (WHtR)
function WhtrCard() {
  const [height, setHeight] = useState(175); // cm
  const [waist, setWaist] = useState(80);   // cm

  const ratio = useMemo(() => (height > 0 ? +(waist / height).toFixed(2) : 0), [waist, height]);
  const band = useMemo(() => {
    if (!ratio) return "";
    if (ratio <= 0.40) return "Below Range"; // potentially underweight
    if (ratio <= 0.50) return "Low Risk";    // generally healthy
    if (ratio <= 0.60) return "Moderate Risk";
    return "High Risk";
  }, [ratio]);

  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Waist‑to‑Height Ratio (WHtR)</h2>
      <p className="mt-1 text-sm text-white/80">Waist / Height in centimeters. Simple central adiposity indicator.</p>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Height (cm)" value={height} setValue={setHeight} min={80} max={250} />
        <Num label="Waist (cm)" value={waist} setValue={setWaist} min={40} max={200} />
      </form>
      <CyanPanel title="Results">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="WHtR" value={ratio ? `${ratio}` : "—"} />
          <Metric label="Risk Band" value={band || "—"} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Guideline bands: ≤0.50 generally healthy; ≥0.60 high risk.</p>
      </CyanPanel>
    </div>
  );
}

// FFMI / Normalized FFMI
function FfmiCard() {
  const [weight, setWeight] = useState(75); // kg
  const [height, setHeight] = useState(180); // cm
  const [bf, setBf] = useState(15); // %

  const { ffmi, nffmi, lbm } = useMemo(()=>{
    const h = height/100;
    const lbm = +(weight * (1 - bf/100)).toFixed(1);
    const ffmi = +(lbm / (h*h)).toFixed(2);
    const nffmi = +(ffmi + 6.1*(1.8 - h)).toFixed(2);
    return { ffmi, nffmi, lbm };
  }, [weight, height, bf]);

  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">FFMI / Normalized FFMI</h2>
      <p className="mt-1 text-sm text-white/80">Fat‑free mass index (normalized to 1.8 m). Estimates natural muscularity.</p>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Weight (kg)" value={weight} setValue={setWeight} min={20} max={300} />
        <Num label="Height (cm)" value={height} setValue={setHeight} min={120} max={230} />
        <Num label="Body‑Fat %" value={bf} setValue={setBf} min={2} max={60} />
      </form>
      <CyanPanel title="Results">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="LBM" value={`${lbm} kg`} />
          <Metric label="FFMI" value={`${ffmi}`} />
          <Metric label="Normalized FFMI" value={`${nffmi}`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Typical natural ceiling ≈ 25–26 (individual variance applies).</p>
      </CyanPanel>
    </div>
  );
}

// Hydration & Electrolytes
function HydrationCard() {
  const [weight, setWeight] = useState(75); // kg
  const [climate, setClimate] = useState<"temperate" | "hot">("temperate");
  const [sessionMin, setSessionMin] = useState(60); // minutes of training per day

  const { liters, na, k, mg } = useMemo(() => {
    const baseMlPerKg = climate === "hot" ? 45 : 35; // ml/kg/day
    const baseL = +(weight * baseMlPerKg / 1000).toFixed(1);
    const sweatLPerHr = climate === "hot" ? 1.0 : 0.7; // L/hr typical
    const extraL = +((sessionMin / 60) * sweatLPerHr).toFixed(1);
    const liters = +(Math.max(1.0, baseL + extraL).toFixed(1));
    // Simple electrolyte targets per liter of fluid
    const na = Math.round(liters * 500); // mg (midpoint of 400–700 mg/L)
    const k = Math.round(liters * 200);  // mg
    const mg = Math.round(liters * 30);  // mg
    return { liters, na, k, mg };
  }, [weight, climate, sessionMin]);

  return (
    <div className="p-6 border rounded-3xl border-white/10 bg-white/5">
      <h2 className="text-2xl font-extrabold">Hydration & Electrolytes</h2>
      <p className="mt-1 text-sm text-white/80">Daily fluids plus simple electrolyte guidance based on bodyweight, climate, and training time.</p>
      <form className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-6" onSubmit={(e)=>e.preventDefault()}>
        <Num label="Weight (kg)" value={weight} setValue={setWeight} min={20} max={300} />
        <label className="flex flex-col col-span-2 gap-1">
          <span className="text-xs text-white/70">Climate</span>
          <select value={climate} onChange={(e)=>setClimate(e.target.value as any)} className="px-3 py-2 border rounded-lg outline-none border-white/10 bg-black/40 focus:ring-2 focus:ring-cyan-500">
            <option value="temperate">Temperate</option>
            <option value="hot">Hot</option>
          </select>
        </label>
        <Num label="Training (min/day)" value={sessionMin} setValue={setSessionMin} min={0} max={240} />
      </form>
      <CyanPanel title="Targets">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Fluids" value={`${liters} L/day`} />
          <Metric label="Sodium" value={`${na} mg/day`} />
          <Metric label="Potassium" value={`${k} mg/day`} />
          <Metric label="Magnesium" value={`${mg} mg/day`} />
        </div>
        <p className="mt-2 text-[11px] text-white/70">Rules of thumb: 35–45 ml/kg base + 0.7–1.0 L/hr training; ~500 mg Na, 200 mg K, 30 mg Mg per liter.</p>
      </CyanPanel>
    </div>
  );
}
