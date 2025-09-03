// src/components/home/FeatureTiles.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Tile = { title: string; subtitle?: string; imageUrl?: string; href?: string };

export function FeatureTiles({ tiles }: { tiles: Tile[] }) {
  if (!tiles || tiles.length === 0) return null;

  return (
    <section className="container mx-auto px-4 pt-6 pb-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t, i) => (
          <motion.div
            key={t.title + i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl"
          >
            {t.href ? (
              <Link href={t.href} className="block">
                <TileInner tile={t} />
              </Link>
            ) : (
              <TileInner tile={t} />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TileInner({ tile }: { tile: Tile }) {
  return (
    <div className="relative h-56 w-full sm:h-64">
      {tile.imageUrl ? (
        <Image src={tile.imageUrl} alt={tile.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="h-full w-full bg-white/5" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-2xl font-extrabold text-white">{tile.title}</h3>
        {tile.subtitle && <p className="mt-1 text-sm text-white/80">{tile.subtitle}</p>}
      </div>
    </div>
  );
}
