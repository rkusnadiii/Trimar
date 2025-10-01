"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import PageLoaderWrapper from "@/components/PageLoaderWrapper";
import { team, TeamMember } from "./data"; // 🔥 import data

export default function OurTeam() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6; // tampil 8 di mobile
  const totalPages = Math.ceil(team.length / itemsPerPage);

  const paginatedTeam = team.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <PageLoaderWrapper>
      <div className="min-h-screen bg-black text-white flex flex-col relative">
        {/* Background blur */}
<div
  className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1470&q=80')] 
  bg-cover blur-sm opacity-30"
/>

        <section className="flex-1 flex flex-col items-center justify-center py-20 px-6 sm:px-6 md:px-12 relative z-10">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-5xl md:text-6xl font-extrabold text-center mb-16"
          >
            <span className="text-white">Our </span>
            <span className="text-yellow-400">Team</span>
          </motion.h1>

          {/* Grid Team - Mobile pakai pagination */}
          <div className="block md:hidden w-full max-w-[600px]">
            <div className="grid grid-cols-2 gap-6">
              {paginatedTeam.map((member, i) => (
                <TeamCard
                  key={member.id}
                  member={member}
                  isActive={activeIndex === i}
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-yellow-400 text-black rounded-lg disabled:opacity-40"
              >
                Prev
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-yellow-400 text-black rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          {/* Grid Team - Desktop tetap semua */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-[1400px] mx-auto">
            {team.map((member, i) => (
              <TeamCard
                key={member.id}
                member={member}
                isActive={activeIndex === i}
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              />
            ))}
          </div>
        </section>
      </div>
    </PageLoaderWrapper>
  );
}

function TeamCard({
  member,
  isActive,
  onClick,
}: {
  member: TeamMember;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3 }}
      className="relative group overflow-hidden rounded-xl shadow-lg cursor-pointer md:cursor-default"
      onClick={() => {
        if (window.innerWidth < 768) onClick();
      }}
    >
      {/* Foto */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-lg">
        <Image
          src={member.img}
          alt={member.name}
          width={400}
          height={500}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          loading="lazy"
          className={`object-cover w-full h-auto transform transition duration-500 ${
            isActive ? "scale-110" : "group-hover:scale-110"
          }`}
        />
      </div>

      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4 transition-opacity duration-500 ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <h3 className="text-lg font-bold">{member.name}</h3>
        <p className="text-sm text-gray-300">{member.role}</p>
      </div>
    </motion.div>
  );
}
