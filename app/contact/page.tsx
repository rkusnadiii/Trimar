"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PageLoaderWrapper from "@/components/PageLoaderWrapper";

export default function Contact() {
  return (
    <PageLoaderWrapper>
      <div className="relative min-h-screen bg-black text-white flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1587560699334-cc4ff634909a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0"
            alt="Background"
            fill
            priority
            className="object-cover blur-sm opacity-30"
          />
        </div>

        <section className="px-6 md:px-12 lg:px-20 pt-45 relative z-10">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-transparent text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-extrabold text-center outline-text"
          >
            CONTACTS
          </motion.h1>

          {/* Garis Pembatas */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="border-t border-white mt-6"
          />

          <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-x-12">
            {/* Left side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center md:text-left"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ">
                Elevate Your <br /> Event Experience
              </h2>
            </motion.div>

            {/* Right side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-6 text-gray-200 text-base sm:text-lg md:text-xl"
            >
              {/* Location */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
                <p className="font-semibold text-lg sm:text-2xl">Location</p>
                <p className="sm:col-span-2 text-base sm:text-xl">
                  Gd. Menara Jamsostek Tower Utara Lt. 3A, Jl. Gatot Subroto
                  No.Kav. 38, West Kuningan, Mampang Prapatan, South Jakarta City
                </p>
              </div>

              {/* Phone */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
                <p className="font-semibold text-lg sm:text-2xl">Phone</p>
                <a
                  href="https://wa.me/628118181812"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:col-span-2 text-base sm:text-xl hover:text-yellow-400 transition"
                >
                +62 811-8181-812
                </a>
              </div>

              {/* Working Hours */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
                <p className="font-semibold text-lg sm:text-2xl">Working Hours</p>
                <p className="sm:col-span-2 text-base sm:text-xl">
                  Mon – Fri: 10.00 – 19.00 WIB
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageLoaderWrapper>
  );
}
