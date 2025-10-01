"use client";

import { motion } from "framer-motion";

export default function HowWeMakeItHappen() {
  return (
    <section className="px-10 py-20 max-w-6xl mx-auto text-center relative">
      {/* Ornamen kapsul kuning */}
<div className="absolute top-10 -right-60 w-[500px] h-[200px] rounded-full border-8 border-yellow-400/80 blur-sm z-0 animate-borderBig" />
<div className="absolute top-60 -right-40 w-[600px] h-[220px] rounded-full border-8 border-yellow-400/80 blur-sm z-0 animate-borderBig" />


      
      <h2 className="text-3xl font-bold text-yellow-400 mb-12">HOW WE MAKE IT HAPPEN</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
        {[1, 2, 3].map((item, index) => (
          <motion.div
            key={index}
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-neutral-900/70 p-6 rounded-xl shadow-lg backdrop-blur-md"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
              {item}
            </div>
            <h3 className="text-xl font-semibold mb-2">SADDAM SUNGKAR</h3>
            <p className="text-gray-300">
              BUMI GONJANG GANJING
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
