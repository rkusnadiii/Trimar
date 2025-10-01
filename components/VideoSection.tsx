"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function VideoSection() {
  return (
    <section id="video-section" className="relative py-16">
      {/* Background */}
      <Image
        src="https://images.unsplash.com/photo-1747155827634-012749f4eca1?q=80&w=1631&auto=format&fit=crop"
        alt="Backdrop"
        fill
        priority
        sizes="100vw"
        className="object-cover blur-sm brightness-[0.45]"
      />

      {/* Yellow Circle Overlay */}
      <div className="absolute left-[70%] top-[-10%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-yellow-300/30 blur-2xl z-[1]" />

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-10 items-center relative z-20">
        {/* Left: Video */}
        <motion.div
          className="md:col-span-7 w-full flex justify-center md:justify-start"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="relative w-full max-w-[605px] aspect-video">
            <iframe
              src="https://drive.google.com/file/d/1_5PRw7NTFMyb70w1EKCs3_WP0Uvo5PIr/preview"
              title="Promo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full rounded-md relative z-10"
            ></iframe>

            {/* Border animasi */}
            <motion.div
              className="absolute inset-0 border-4 border-yellow-400/70 rounded-sm z-[20] pointer-events-none"
              initial={{ x: 0, y: 0 }}
              animate={{ x: -12, y: -12 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        </motion.div>

        {/* Right: Copy */}
        <motion.div
          className="md:col-span-5 flex flex-col justify-center mt-10 md:mt-0"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h3 className="tracking-wide font-bold flex flex-col items-start">
            <span className="text-xl md:text-2xl">Elevating Brands Since</span>
            <span className="text-yellow-400 text-5xl md:text-8xl leading-none">
              2011
            </span>
          </h3>

          <p className="mt-3 text-white/70 text-sm md:text-base leading-relaxed font-bold text-justify">
            From our first stage in 2011 to today, Trimar has been helping
            brands tell their stories, connect with audiences, and create
            unforgettable experiences.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
