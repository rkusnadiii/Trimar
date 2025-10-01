"use client";

import Image from "next/image";
import Link from "next/link";



export default function Footer() {
  return (
<section className="relative py-16 bg-black text-white overflow-hidden">
  {/* Background logo samar dengan animasi geser */}
  {/* <div className="absolute top-0 left-0 w-full overflow-hidden -z-0">
    <motion.div
      className="flex text-white text-8xl font-extrabold opacity-25 whitespace-nowrap"
      animate={{ x: ["-50%", "0%"] }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {Array(20).fill("TRIMAR PRODUCTION").map((text, i) => (
        <span key={i} className="mr-16">
          {text}
        </span>
      ))}
    </motion.div>
  </div> */}

  {/* Konten footer */}
<div className="relative mt-15 max-w-6xl mx-auto px-8 sm:px-10 lg:px-16 flex flex-col gap-8 z-10 text-left">
  {/* Logo */}
  {/* <div className="h-30 w-30 relative ">
    <Link href="/">
      <Image
        src="/images/logos.png"
        alt="Logo TRIMAR"
        fill
        className="object-contain"
      />
    </Link>
  </div> */}

  {/* Title */}
  <h2 className="text-5xl sm:text-6xl font-semibold mt-[-25]">Get In Touch</h2>

  {/* Kontak dan sosmed */}
  <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-6">
    {/* Kiri: Email & WA */}
    <div className="flex flex-col sm:flex-row gap-6 text-2xl sm:text-2xl ">
      <a
        href="mailto:trimarpro@gmail.com"
        className="text-base sm:text-xl transition-all duration-300 font-bold ease-in-out hover:text-[#fcefb4]"
      >
        trimarpro@gmail.com
      </a>
      <a
        href="https://wa.me/628118181812"
        target="_blank"
        rel="noopener noreferrer"
        className="text-base sm:text-xl transition-all duration-300 font-bold ease-in-out hover:text-[#fcefb4]"
      >
        +62 811-8181-812
      </a>
    </div>

    {/* Kanan: Sosmed */}
    <div className="flex gap-4 text-sm">
      <a
        href="https://instagram.com/trimar_production"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 border border-white rounded-full hover:bg-white/30 transition"
      >
        INSTAGRAM
      </a>
      <a
        href="https://www.linkedin.com/company/pt-trimar-music-indonesia/posts/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 border border-white rounded-full hover:bg-white/30 transition"
      >
        LINKEDIN
      </a>
    </div>
  </div>
</div>

{/* Garis bawah + copyright */}
<div className="mt-12 border-t border-white/30 w-full" />
<div className="mt-4 max-w-6xl mx-auto px-4 text-center text-md text-white/60 mt-8">
  © {new Date().getFullYear()} TRIMAR Production. All rights reserved.
</div>

</section>

  );
}
