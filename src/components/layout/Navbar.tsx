// src/components/layout/Navbar.tsx
"use client";

import { useTheme } from "@/components/theme/ThemeContext";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { theme } = useTheme();

  // Define which logo to use based on the current theme
  const logoSrc = theme === 'light'
    ? '/logo-dark.jpg'  // The logo with dark text for light backgrounds
    : '/logo-light.jpg'; // The logo with light text for dark backgrounds

  return (
    <header className="fixed top-0 left-0 z-50 w-full shadow-md bg-brandBgLight/80 dark:bg-brandBgDark/80 backdrop-blur-sm">
      <nav className="container flex items-center justify-between p-4 mx-auto">
        {/* Logo Section */}
        <Link href="/" className="relative block w-32 h-8">
          <Image src={logoSrc} alt="Train Fitness Logo" fill style={{ objectFit: 'contain' }} />
        </Link>

        {/* Navigation Links */}
        <ul className="items-center hidden space-x-6 md:flex">
          <li>
            <Link href="/" className="font-medium text-brandTextLight dark:text-brandTextDark hover:text-brandPrimary">Home</Link>
          </li>
          <li>
            <Link href="/classes" className="font-medium text-brandTextLight dark:text-brandTextDark hover:text-brandPrimary">Classes</Link>
          </li>
          <li>
            <Link href="/coaches" className="font-medium text-brandTextLight dark:text-brandTextDark hover:text-brandPrimary">Coaches</Link>
          </li>
          <li>
            <Link href="/pricing" className="font-medium text-brandTextLight dark:text-brandTextDark hover:text-brandPrimary">Pricing</Link>
          </li>
          <li>
            <Link href="/transformations" className="font-medium text-brandTextLight dark:text-brandTextDark hover:text-brandPrimary">Transformations</Link>
          </li>
          <li>
            <Link href="/faq" className="font-medium text-brandTextLight dark:text-brandTextDark hover:text-brandPrimary">FAQ</Link>
          </li>
        </ul>

        {/* CTA and Theme Toggle */}
        <div className="flex items-center space-x-4">
          <Link href="/pricing" className="hidden px-6 py-2 font-bold text-white transition-all duration-300 rounded-full sm:block bg-brandPrimary hover:bg-brandAccent hover:text-brandDark">
            Join Now
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
