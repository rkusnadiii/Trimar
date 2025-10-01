import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import TrustedBy from "@/components/TrustedBy";
import Gallery from "@/components/Gallery";
import PageLoaderWrapper from "@/components/PageLoaderWrapper";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";


export default function Home() {
  return (
    <PageLoaderWrapper>
      <main className="bg-black text-white">
        <Hero />
        <VideoSection />
        <TrustedBy />
        <Gallery />
        <WhatsAppFloatingButton />
      </main>
    </PageLoaderWrapper>
  );
}
