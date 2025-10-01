"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type Work = {
  slug: string;
  name: string;
  logo: string;
  year: string;
  img: string;
  description: string;
  gallery: string[];
};

export default function WorkPageClient({ slug }: { slug: string }) {
  const [work, setWork] = useState<Work | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/works/${slug}`)
      .then((res) => res.json())
      .then((data) => setWork(data))
      .catch((err) => console.error("Failed to fetch work:", err));
  }, [slug]);

  if (!work) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="p-6 pt-20 max-w-5xl mx-auto text-white">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{work.name}</h1>
      <p className="text-gray-400 mb-6">{work.year}</p>

      {/* Banner */}
      <div className="relative w-full h-[400px] mb-6">
        <Image
          src={work.img}
          alt={work.name}
          fill
          className="rounded-lg object-cover"
        />
      </div>

      {/* Description */}
      <p className="mb-10 text-lg text-gray-300 leading-relaxed">
        {work.description}
      </p>

      {/* Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {work.gallery.map((src, i) => (
          <div key={i} className="cursor-pointer">
            <Image
              src={src}
              alt={`Gallery ${i}`}
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-auto"
              onClick={() => {
                setPhotoIndex(i);
                setIsOpen(true);
              }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={work.gallery.map((src) => ({ src }))}
          index={photoIndex}
          on={{ view: ({ index }) => setPhotoIndex(index) }}
        />
      )}
    </div>
  );
}
