// src/components/layout/Navbar.tsx
"use client";

// Dark-mode only: theme context removed
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  // Dark-mode only logo
  const logoSrc = '/logo-light.jpg';

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full backdrop-blur-sm transition-colors ${
        scrolled ? "bg-black/70 shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* Logo Section */}
        <Link href="/" className="relative block h-8 w-32">
          <Image src={logoSrc} alt="Train Fitness Logo" fill style={{ objectFit: 'contain' }} />
        </Link>

        {/* Navigation Links */}
        <ul className="hidden items-center space-x-6 md:flex">
          {[
            ["/", "Home"],
            ["/juice-bar", "Juices"],
            ["/about", "About"],
            ["/blog", "Blog"],
            ["/tour", "VR Tour"],
            ["/classes", "Classes"],
            ["/coaches", "Coaches"],
            ["/pricing", "Pricing"],
            ["/transformations", "Transformations"],
            ["/community", "Community"],
            ["/faq", "FAQ"],
          ].map(([href, label], i) => (
            <motion.li key={href}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={href} className="relative font-medium text-white/90 transition-colors hover:text-cyan-400">
                {label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-cyan-400 transition-all group-hover:w-full" />
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* CTA and Theme Toggle */}
        <div className="flex items-center space-x-3">
          <Link href="/pricing" className="hidden rounded-full bg-cyan-500 px-6 py-2 font-bold text-black transition-colors hover:bg-cyan-400 sm:block">
            Join Now
          </Link>
          {/* Theme toggle removed for dark-only site */}
          {/* Mobile menu button */}
          <button
            className="grid h-10 w-10 place-items-center rounded-md border border-white/20 text-white md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span className="h-0.5 w-5 bg-white" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="absolute right-0 top-0 h-full w-80 bg-black p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="relative h-8 w-28">
                <Image src={logoSrc} alt="Train Fitness Logo" fill style={{ objectFit: 'contain' }} />
              </div>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-md border border-white/20 text-white" aria-label="Close menu">×</button>
            </div>
            <nav className="space-y-2">
              {[
                ["/", "Home"],
                ["/juice-bar", "Juices"],
                ["/about", "About"],
                ["/blog", "Blog"],
                ["/tour", "VR Tour"],
                ["/classes", "Classes"],
                ["/coaches", "Coaches"],
                ["/pricing", "Pricing"],
                ["/transformations", "Transformations"],
                ["/community", "Community"],
                ["/faq", "FAQ"],
              ].map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-white/90 hover:bg-white/10">
                  {label}
                </Link>
              ))}
              <Link href="/pricing" onClick={() => setOpen(false)} className="mt-3 block rounded-full bg-cyan-500 px-4 py-2 text-center font-bold text-black">
                Join Now
              </Link>
            </nav>
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
