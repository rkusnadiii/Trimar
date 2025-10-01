"use client";

import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { scroller } from "react-scroll";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden">
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
      <div className="absolute left-[50%] top-[30%] w-[600px] h-[500px] rounded-full bg-yellow-300/35 blur-2xl z-[1]" />


      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-70 md:pt-60">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          {/* Headline */}
          <div className="md:col-span-6 animate-enterFromLeft flex flex-col justify-center">
            <h1 className="leading-[0.95] font-light text-5xl sm:text-6xl lg:text-[90px] text-white">
              <span
                className="block "
                style={{
                  WebkitTextStroke: "2px rgba(255,255,255,0.65)",
                  color: "transparent",
                }}
              >
                Elevate
              </span>
              <span className="block font-semibold">Your Event</span>
              <span className="block font-semibold">Experience</span>
            </h1>

            <div className="mt-8 animate-bounce">
              <button
                onClick={() =>
                  scroller.scrollTo("video-section", {
                    duration: 800,
                    smooth: "easeInOutQuart",
                    offset: -20,
                  })
                }
                className="inline-flex items-center justify-center h-12 w-12 rounded-full border border-white/40 bg-white/10 hover:bg-white/20 transition"
              >
                <ArrowDownRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

{/* Images Right */}
<div className="md:col-span-6 relative flex flex-col md:flex-row justify-center md:justify-end items-center gap-6 md:gap-8">
  <div className="pointer-events-none absolute -bottom-16 right-10 h-64 w-64 rounded-full bg-gradient-to-t from-yellow-300/30 to-transparent blur-2xl md:block hidden " />

  {/* Small Frame */}
  <div className="relative delay-200 w-[70%] sm:w-[50%] md:w-[580px] h-[400px] mt-19">
    <Image
      src="/images/hero3.webp"
      alt="Cam small"
      fill
      className="relative z-[10] object-cover rounded-xl shadow-lg"
    />
    <div className="absolute left-0 bottom-0 w-full h-full border-4 border-yellow-400/70 rounded-sm z-[20] animate-borderSmall" />
  </div>

  {/* Big Frame */}
  <div className="relative delay-400 w-[80%] sm:w-[60%] md:w-[840px] h-[460px] mt-6 md:mt-0">
    <Image
      src="/images/hero2.webp"
      alt="Cam big"
      fill
      className="relative z-[10] object-cover rounded-xl shadow-lg"
    />
    <div className="absolute top-0 right-0 w-full h-full border-4 border-yellow-400/70 rounded-sm z-[20] animate-borderBig" />
  </div>
</div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes enterFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-100vw);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-enterFromLeft {
          animation: enterFromLeft 1.2s forwards;
        }

        @keyframes enterFromBottom {
          0% {
            opacity: 0;
            transform: translateY(100vh);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-enterFromBottom {
          animation: enterFromBottom 1.2s forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </section>
  );
}
