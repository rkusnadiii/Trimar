"use client";

import Image from "next/image";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="w-20 h-20 animate-pulse-scale">
        <Image
          src="/images/loader.png"
          alt="Logo"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
    </div>
  );
}
