"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function PageLoaderWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;
  return <>{children}</>;
}
