"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function OurVision() {
  return (
    <section className="px-6 md:px-10 py-20 max-w-6xl mx-auto relative">
      <div className="absolute -right-[20%] top-[20%] w-[400px] h-[400px] rounded-full bg-yellow-300/20 blur-2xl z-[1]" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Tulisan */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="order-2 md:order-1"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
            The Future We Create
          </h2>
          <p className="text-gray-300 leading-relaxed font-semibold text-base md:text-xl text-justify">
            Today, with over decade of experience, Trimar specializes in corporate events. Creating innovative, extraordinary events, and memorable experiences. Proving that every great business can grow form simple beginnings to remarkable achievements.
          </p>
        </motion.div>

        {/* Gambar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative max-h-[350px] inline-block order-1 md:order-2"
        >
          <Image
            src="/images/vision.webp"
            alt="Our Vision"
            width={600}
            height={400}
            className="w-full h-full object-cover relative z-10 rounded-lg"
            priority
          />
          <motion.div
            className="absolute top-0 left-0 w-full h-full border-4 border-yellow-500 rounded-lg z-20"
            animate={{ x: [0, 16, 0], y: [0, 16, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

    </section>
  );
}
