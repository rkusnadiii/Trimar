"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/628118181812?text=Hello%2C%20How%20Can%20I%20Help%20You%3F"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 flex items-center gap-2 bg-transparent text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition z-50"
    >
      <FaWhatsapp className="text-4xl" />
      <span>How Can I Help You?</span>
    </a>
  );
}
