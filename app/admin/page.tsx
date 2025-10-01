"use client";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminPage() {
  const { data: works, mutate, isLoading } = useSWR("/api/works", fetcher);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, []);

  const deleteWork = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this work?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/works/${slug}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      if (res.ok) {
        mutate();
      } else {
        alert("Failed to delete work");
      }
    } catch (error) {
      console.error("Error deleting work:", error);
      alert("Error deleting work");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-yellow-400">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/new"
                className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition"
              >
                Add New Work
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading works...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Works Management</h2>
              <p className="text-gray-400">Total works: {works?.length || 0}</p>
            </div>

            {works && works.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {works.map((work: any) => (
                  <div key={work.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                    {/* Work Image */}
                    <div className="aspect-video bg-gray-800 relative">
                      {work.gallery && work.gallery.length > 0 ? (
                        <Image
                          src={work.gallery[0]}
                          alt={work.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Work Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 truncate">{work.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">Slug: {work.slug}</p>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {work.description}
                      </p>
                      
                      {/* Gallery Count */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-gray-500">
                          Gallery: {work.gallery?.length || 0} images
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/edit/${work.slug}`}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition text-center"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteWork(work.slug)}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No works found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first work.</p>
                <Link
                  href="/admin/new"
                  className="bg-yellow-400 text-black px-6 py-3 rounded font-semibold hover:bg-yellow-300 transition"
                >
                  Add New Work
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
