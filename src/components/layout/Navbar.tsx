// src/components/layout/Navbar.tsx
"use client";

import { useTheme } from "@/components/theme/ThemeContext";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Image from "next/image";

const Navbar = () => {
  const { theme } = useTheme();

  // Define which logo to use based on the current theme
  const logoSrc = theme === 'light'
    ? '/logo-dark.jpg'  // The logo with dark text for light backgrounds
    : '/logo-light.jpg'; // The logo with light text for dark backgrounds

  return (
    <header className="fixed top-0 left-0 w-full bg-brandBgLight/80 dark:bg-brandBgDark/80 backdrop-blur-sm z-50 shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* Logo Section */}
        <div className="relative w-32 h-8">
          <Image src={logoSrc} alt="Train Fitness Logo" fill style={{ objectFit: 'contain' }} />
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center space-x-6">
            <li><a href="#" className="text-brandTextLight dark:text-brandTextDark hover:text-brandPrimary font-medium">Home</a></li>
            <li><a href="#" className="text-brandTextLight dark:text-brandTextDark hover:text-brandPrimary font-medium">Classes</a></li>
            <li><a href="#" className="text-brandTextLight dark:text-brandTextDark hover:text-brandPrimary font-medium">Contact</a></li>
        </ul>

        {/* CTA and Theme Toggle */}
        <div className="flex items-center space-x-4">
          <button className="hidden sm:block bg-brandPrimary text-white font-bold py-2 px-6 rounded-full hover:bg-brandAccent hover:text-brandDark transition-all duration-300">
            Join Now
          </button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;