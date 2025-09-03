// src/components/layout/Navbar.tsx
"use client";

// Dark-mode only: CMS-driven navigation
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { client } from "@/lib/sanityClient";
import { SITE_SETTINGS_QUERY } from "@/features/settings/queries";
import type { SiteSettings } from "@/features/settings/types";

const Navbar = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  useEffect(() => {
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY).then(setSettings).catch(() => setSettings(null));
  }, []);
  const logoSrc = settings?.logoUrl || '/logo-light.jpg';
  const navItems = settings?.navigation?.length ? settings!.navigation! : [
    { label: 'Home', href: '/' },
    { label: 'Juices', href: '/juice-bar' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'VR Tour', href: '/tour' },
    { label: 'Classes', href: '/classes' },
    { label: 'Coaches', href: '/coaches' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Tools', href: '/tools' },
    { label: 'Community', href: '/community' },
    { label: 'FAQ', href: '/faq' },
  ];

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
          {navItems.map(({href, label}, i) => (
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
          <Link href={settings?.stickyCta?.href || '/pricing'} className="hidden rounded-full bg-cyan-500 px-6 py-2 font-bold text-black transition-colors hover:bg-cyan-400 sm:block">
            {settings?.stickyCta?.label || 'Claim Free 3-Day Pass'}
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
              {navItems.map(({href, label}) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-white/90 hover:bg-white/10">
                  {label}
                </Link>
              ))}
              <Link href={settings?.stickyCta?.href || '/pricing'} onClick={() => setOpen(false)} className="mt-3 block rounded-full bg-cyan-500 px-4 py-2 text-center font-bold text-black">
                {settings?.stickyCta?.label || 'Claim Free 3-Day Pass'}
              </Link>
            </nav>
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
