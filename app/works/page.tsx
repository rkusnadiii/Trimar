"use client";

// app/works/page.tsx
import Image from "next/image";
import Link from "next/link";
import PageLoaderWrapper from "@/components/PageLoaderWrapper";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 9;

// Fetch data client-side
async function getWorks() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/works`, {
      cache: "no-store", // biar selalu fresh
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch works: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching works:', error);
    // Return empty array as fallback
    return [];
  }
}

export default function WorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const worksData = await getWorks();
        setWorks(worksData);
      } catch (error) {
        console.error('Error fetching works:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  if (loading) {
    return (
      <PageLoaderWrapper>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </PageLoaderWrapper>
    );
  }

  const totalPages = Math.ceil(works.length / ITEMS_PER_PAGE);
  const currentPage = 1; // default halaman awal
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentWorks = works.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <PageLoaderWrapper>
      <div className="min-h-screen bg-black text-white flex flex-col relative">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero2.webp"
            alt="Background"
            fill
            priority
            className="object-cover blur-sm opacity-20"
          />
        </div>

        <section className="flex-1 py-12 px-4 pt-70 relative z-10">
          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-extrabold text-center animate-in slide-in-from-top-10 duration-700">
            <span className="text-white">Our </span>
            <span className="text-yellow-400">Works</span>
          </h1>

          {/* Grid Portfolio */}
          {currentWorks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[10px] max-w-[1080px] mx-auto pt-20">
              {currentWorks.map((work: any, i: number) => (
              <Link key={work.id} href={`/works/${work.slug}`}>
                <div className="relative overflow-hidden group cursor-pointer w-full h-60 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                  {/* Thumbnail Work */}
                  <Image
                    src={work.thumbnail_url || work.img || "/images/gallery1.webp"}
                    alt={work.name || "Work"}
                    width={500}
                    height={300}
                    priority={i === 0}
                    className="object-cover w-full h-full rounded
                               md:grayscale md:group-hover:grayscale-0
                               transition-all duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute bottom-0 left-0 w-full">
                    <div
                      className="flex items-center gap-2 
                                 bg-gray-900/50 
                                 transition-all duration-500 
                                 h-12 
                                 w-full md:w-[52px] md:group-hover:w-full
                                 overflow-hidden
                                 rounded"
                    >
                      {(work.logo_url || work.logo) && (
                        <Image
                          src={work.logo_url || work.logo}
                          alt={work.name || "Logo"}
                          width={40}
                          height={40}
                          className="flex-shrink-0 ml-2
                                     md:grayscale md:group-hover:grayscale-0
                                     transition-all duration-500"
                        />
                      )}
                      <span
                        className="text-white font-bold text-sm sm:text-base leading-snug
                                   opacity-100 translate-x-0
                                   md:opacity-0 md:-translate-x-5 
                                   md:group-hover:opacity-100 md:group-hover:translate-x-0
                                   transition-all duration-500 delay-100 ml-5"
                      >
                        {work.name || "Untitled Work"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            </div>
          ) : (
            <div className="text-center pt-20">
              <p className="text-gray-400 text-lg">No works found. Please check back later.</p>
            </div>
          )}

          {/* Pagination (sementara static, bisa ditambah client-side) */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <span key={page} className="flex items-center">
                  <button
                    disabled={page === currentPage}
                    className={`
                      w-10 h-10 flex items-center justify-center rounded font-bold
                      ${
                        currentPage === page
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                      }
                    `}
                  >
                    {page}
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageLoaderWrapper>
  );
}
