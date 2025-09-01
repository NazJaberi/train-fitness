"use client";

import Image from "next/image";

export const LargeInfoItem = ({ text, iconUrl }: { text: string; iconUrl?: string }) => (
  <div className="flex items-center gap-4 p-5 border rounded-xl border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur">
    <div className="relative flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/10">
      {iconUrl ? (
        <Image src={iconUrl} alt="" fill className="object-contain p-3" />
      ) : (
        <span className="sr-only">item</span>
      )}
    </div>
    <span className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">{text}</span>
  </div>
);

