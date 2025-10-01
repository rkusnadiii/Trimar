"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Work {
  id: number;
  slug: string;
  name: string;
  logo?: string;
  year?: string;
  img?: string;
  description: string;
  banner_url?: string;
  gallery: string[];
  thumbnail_url?: string;
  logo_url?: string;
}

export default function WorkPage({ params }: { params: { slug: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const res = await fetch(`/api/works/${params.slug}`);
        if (!res.ok) {
          throw new Error('Failed to fetch work');
        }
        const workData = await res.json();
        setWork(workData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="p-6 text-white bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="p-6 text-white bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <p className="text-gray-400">{error || 'The requested work could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-6 pt-40 pb-12">
        {/* Logo + Title */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {(work.logo_url || work.logo) && (
            <Image
              src={work.logo_url || work.logo || "/images/placeholder.png"}
              alt={`${work.name} logo`}
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          )}
          <h1 className="text-3xl font-bold">{work.name}</h1>
          {work.year && (
            <span className="text-yellow-400 text-lg">({work.year})</span>
          )}
        </div>

        {/* Banner */}
        {work.img && (
          <div className="mb-12">
            <div className="relative aspect-video max-w-6xl mx-auto rounded-lg overflow-hidden">
              <Image
                src={work.img}
                alt={`${work.name} banner`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Description */}
        <p className="mb-6 max-w-3xl mx-auto text-justify leading-relaxed text-gray-300">
          {work.description}
        </p>

        {/* Gallery */}
        {work.gallery && work.gallery.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {work.gallery.map((src, i) => (
              <div key={i} className="cursor-pointer">
                <Image
                  src={src}
                  alt={`${work.name} gallery ${i + 1}`}
                  width={500}
                  height={350}
                  sizes="(max-width: 768px) 100vw,
                         (max-width: 1200px) 50vw,
                         33vw"
                  className="rounded-lg object-cover w-full h-auto"
                  loading="lazy"
                  onClick={() => {
                    setPhotoIndex(i);
                    setIsOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {work.gallery && work.gallery.length > 0 && (
          <Lightbox
            open={isOpen}
            close={() => setIsOpen(false)}
            index={photoIndex}
            slides={work.gallery.map((src) => ({
              src,
            }))}
            on={{
              view: ({ index }) => setPhotoIndex(index),
            }}
          />
        )}
      </div>
    </div>
  );
}