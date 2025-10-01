"use client";

import Image from "next/image";

const logos = [
 "/images/Client/alibaba.png",
  "/images/Client/allianz.png",
  "/images/Client/BNI.png",
  "/images/Client/generali.png",
  "/images/Client/toyota.png",
  "/images/Client/Lexus.png",
  "/images/Client/mandiri.png",
  "/images/Client/shoppee.png",
  "/images/Client/skk.png",
  "/images/Client/TAKEDO.png",
  "/images/Client/telkomsel.png",
  "/images/Client/zurich.png",
  "/images/Client/jafra.png",
  "/images/Client/axa.png",


];

const columns = [logos.slice(0, 5), logos.slice(5, 9), logos.slice(9, 14)];

export default function TrustedBy() {
  return (
    <section className="py-20 bg-black">
      <h2 className="text-center text-2xl md:text-3xl font-semibold mb-12">Trusted By</h2>

      <div className="grid grid-cols-3 gap-0 max-w-6xl mx-auto overflow-hidden">
        {columns.map((col, i) => (
          <div
            key={i}
            className={`relative h-96 overflow-hidden ${
              i === 1 ? "animate-scroll-down" : "animate-scroll-up"
            }`}
          >
            <div className="flex flex-col items-center gap-8">
              {col.concat(col).map((logo, idx) => (
                <Image
                  key={idx}
                  src={logo}
                  alt="Client Logo"
                  width={500}
                  height={250}
                  className="object-contain w-[35vw] max-w-[105px] sm:w-[25vw] sm:max-w-[148px] md:w-[20vw] md:max-w-[178px] h-auto"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
