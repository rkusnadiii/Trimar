"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

const items = [
  { id: 1, img: "/images/gallery1.webp" },
  { id: 2, img: "/images/gallery2.webp" },
  { id: 3, img: "/images/gallery3.webp" },
  { id: 4, img: "/images/gallery4.webp" },
  { id: 5, img: "/images/gallery5.webp" },
  { id: 6, img: "/images/gallery6.webp" },
  { id: 7, img: "/images/gallery7.webp" },
  { id: 8, img: "/images/gallery8.webp" },
];


export default function Gallery() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const prevSlide = () => {
    setDirection("left");
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  const nextSlide = () => {
    setDirection("right");
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const getVisibleIndexes = () => {
    const prev = (current - 1 + items.length) % items.length;
    const next = (current + 1) % items.length;
    return [prev, current, next];
  };

  const visibleIndexes = getVisibleIndexes();

  return (
    <section className="relative py-20 bg-black text-white h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
            {/* Background */}
            <Image
              src="https://images.unsplash.com/photo-1496670013738-4f730477bfdb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Backdrop"
              fill
              priority
              sizes="100vw"
              className="object-cover blur-sm brightness-[0.45]"
            />
      {/* Ornamen kapsul kuning */}
      <div className="absolute top-20 -right-20 w-[500px] h-[200px] rounded-full border-8 border-yellow-400/80 blur-sm z-0 rotate-12" />
      <div className="absolute top-80 -right-10 w-[600px] h-[220px] rounded-full border-8 border-yellow-400/80 blur-sm z-0 rotate-12" />

      <h2 className="text-center text-3xl md:text-4xl font-bold mb-8 relative z-10">
        Crafting Your Experience
      </h2>

      <div
        className="relative h-full flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        <div className="flex w-full max-w-full justify-center items-center gap-4 md:gap-6 relative h-full">
          {visibleIndexes.map((idx, i) => {
            const item = items[idx];
            const isActive = i === 1;

            const widthClass = isActive
              ? "w-[80%] md:w-[70%]"
              : "w-[20%] md:w-[25%]";

            const scale = isActive
              ? "scale-105 opacity-100 z-20"
              : "scale-90 opacity-80 z-0";

            const positionClass =
              i === 0
                ? "rotate-y-[-25deg] translate-x-[-40px] translate-z-[-80px]"
                : i === 2
                ? "rotate-y-[25deg] translate-x-[40px] translate-z-[-80px]"
                : "";

            const animationClass =
              isActive && direction ? "animate-slideInFromTop" : "";

            return (
              <div
                key={item.id}
                className={`relative transition-all duration-700 ease-in-out ${widthClass} ${scale} ${positionClass} ${animationClass} h-[250px] md:h-full rounded-xl shadow-2xl`}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Gambar */}
                <div className="absolute inset-0 backface-hidden">
                  <Image
                    src={item.img}
                    alt={`Slide ${item.id}`}
                    fill
                    className={`object-cover rounded-xl transition duration-500
                      ${
                        isActive
                          ? "grayscale-0 cursor-pointer"
                          : "grayscale hover:grayscale-0 cursor-pointer"
                      }`}
                    unoptimized
                    priority={isActive}
                    onClick={() =>
                      isActive
                        ? setLightbox(item.img)
                        : setCurrent(idx)
                    }
                  />
                </div>

                {/* sisi belakang biar solid */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gray-900 rounded-xl backface-hidden transform rotate-y-180" />
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 z-20 bg-white/20 hover:bg-white/40 p-3 rounded-full transition"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 z-20 bg-white/20 hover:bg-white/40 p-3 rounded-full transition"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image
              src={lightbox}
              alt="Lightbox"
              fill
              className="object-contain rounded-lg"
              unoptimized
            />
          </div>
        </div>
      )}
    </section>
  );
}
