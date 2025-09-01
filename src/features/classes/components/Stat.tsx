"use client";

export const Stat = ({ label, value }: { label: string; value?: string | number }) => {
  const display = (() => {
    if (value === undefined || value === null || value === "") return "—";
    if (label === "Duration" && typeof value === "number") return `${value} min`;
    return String(value);
  })();
  return (
    <div className="px-4 py-3 border rounded-xl border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
      <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{display}</div>
    </div>
  );
};

