"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhoWeAre() {
  return (
    <section className="px-6 md:px-10 py-20 max-w-6xl mx-auto relative pt-70">
      {/* Yellow Circle Overlay */}
      <div className="absolute -right-[20%] top-[20%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-yellow-300/20 blur-2xl z-[1]" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative w-full"
        >
          {/* Wrapper responsif */}
          <div className="w-full aspect-[10/7] overflow-hidden rounded-lg relative z-10">
            <Image
              src="/images/whoarewe.webp" // perhatikan: tambahkan "/" di depan
              alt="Who we are"
              fill
              className="object-cover object-[50%_60%] rounded-lg"
              priority
            />
          </div>

          {/* Border animasi */}
          <motion.div
            className="absolute inset-0 border-4 border-yellow-500 rounded-lg z-20 pointer-events-none"
            animate={{ x: [-12, 0], y: [12, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Right: Text */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-300 leading-relaxed font-semibold text-base md:text-xl text-justify">
            We are Creative Agency and Event Organizer with more than 10 years
            experience in the creative industry. Passionate in making creative
            and innovative events, from conceptualization to execution.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
