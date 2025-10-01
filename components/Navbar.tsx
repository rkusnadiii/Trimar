"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Work", path: "/works" },
  { name: "Team", path: "/team" },
  { name: "Contacts", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const pathname = usePathname();

  // highlight indicator
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [indicatorIdx, setIndicatorIdx] = useState<number | null>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // update indikator posisi
  useEffect(() => {
    const idx = hoveredIdx !== null ? hoveredIdx : menuItems.findIndex((mi) => mi.path === pathname);
    setIndicatorIdx(idx === -1 ? null : idx);
  }, [pathname, hoveredIdx]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
        {/* ✅ Logo ke Home */}
  <Link href="/" className="relative block h-16 w-28 md:h-20 md:w-32 lg:h-24 lg:w-36">
          <Image
            src="/images/logos.png"
            alt="Logo TRIMAR"
            fill
            className="object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center relative">
          <div className="relative flex items-center gap-3 text-[15px] uppercase tracking-wide backdrop-blur-sm border border-white/60 rounded-full px-2 py-2">
            {/* highlight indicator */}
            {indicatorIdx !== null && (
              <motion.div
                layout
                layoutId="navbar-indicator"
                className="absolute top-[5%] bottom-[5%] rounded-full bg-white" 
                initial={false}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                style={{
                  left: (itemsRef.current[indicatorIdx]?.offsetLeft ?? 0) + 6, // geser dikit ke kanan
                  width: (itemsRef.current[indicatorIdx]?.offsetWidth ?? 0) - 12, // kecilin biar nggak full
                }}
              />
            )}

            {menuItems.map((menu, idx) => {
              const isHighlighted = idx === indicatorIdx;
              return (
               <Link
  key={menu.name}
  href={menu.path}
  ref={(el) => {
    itemsRef.current[idx] = el;
  }}
  onMouseEnter={() => setHoveredIdx(idx)}
  onMouseLeave={() => setHoveredIdx(null)}
  className={`relative z-10 px-4 py-2 rounded-full transition-colors duration-300 cursor-pointer ${
    isHighlighted ? "text-black font-semibold" : "text-white"
  }`}
>
  {menu.name}
</Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden relative z-50">
          <button
            className="relative w-6 h-6 flex flex-col justify-between items-center group"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span
              className={`block h-0.5 w-6 bg-white rounded transition-transform duration-300 ease-in-out ${
                mobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white rounded transition-opacity duration-300 ease-in-out ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white rounded transition-transform duration-300 ease-in-out ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="fixed top-20 right-6 w-44 bg-black/90 border border-white/20 rounded-lg flex flex-col p-2 gap-1 z-50 shadow-lg animate-dropdown">
              {menuItems.map((menu) => (
                <Link
                  key={menu.name}
                  href={menu.path}
                  className={`px-4 py-2 rounded transition-colors ${
                    pathname === menu.path
                      ? "bg-white text-black font-semibold"
                      : "text-white hover:bg-white/30"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {menu.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
