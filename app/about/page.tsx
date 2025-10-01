"use client";

import PageLoaderWrapper from "@/components/PageLoaderWrapper";
import WhoWeAre from "./components/WhoAreWe";
import OurVision from "./components/OurVision";
import Image from "next/image";

export default function AboutPage() {
  return (
    <PageLoaderWrapper>
      <div className="min-h-screen relative bg-black text-white">
        {/* Background image blur */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1470&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover blur-sm opacity-70"
            priority
          />
        </div>

        {/* Overlay hitam transparan */}
        <div className="absolute inset-0 bg-black/70" />

        <main className="relative z-10">
          <WhoWeAre />
          <OurVision />
        </main>
      </div>
    </PageLoaderWrapper>
  );
}
