"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface FormData {
  slug: string;
  name: string;
  description: string;
}

export default function AddWork() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    slug: "",
    name: "",
    description: "",
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 6) {
      alert("Maximum 6 images allowed");
      return;
    }

    setGalleryFiles(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(previews);
  };

  const removeImage = (index: number) => {
    const newFiles = galleryFiles.filter((_, i) => i !== index);
    const newPreviews = galleryPreviews.filter((_, i) => i !== index);
    
    setGalleryFiles(newFiles);
    setGalleryPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.slug || !form.name || !form.description) {
      alert("Please fill in all required fields");
      return;
    }

    if (!bannerFile) {
      alert("Please upload a banner image");
      return;
    }

    if (galleryFiles.length === 0) {
      alert("Please upload at least one gallery image");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      formData.append("slug", form.slug);
      formData.append("name", form.name);
      formData.append("description", form.description);
      
      // Add banner image
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }
      
      // Add gallery images
      galleryFiles.forEach((file, index) => {
        formData.append(`gallery_${index}`, file);
      });

      const res = await fetch("/api/works", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const error = await res.json();
        alert(`Failed to create work: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error creating work:", error);
      alert("Error creating work");
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-yellow-400">Add New Work</h1>
            <button
              onClick={() => router.push("/admin")}
              className="bg-gray-600 text-white px-4 py-2 rounded font-semibold hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="e.g., lexus-gias"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-yellow-400 focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">URL-friendly identifier</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Work Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., GIIAS 2021-2025"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the work, event details, achievements, etc."
                rows={4}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Banner Upload */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Banner Image</h2>
            <p className="text-gray-400 mb-4">Upload a banner image for the work landing page</p>
            
            {/* Banner File Input */}
            <div className="mb-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-yellow-400 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Banner image will be displayed on the work landing page
              </p>
            </div>

            {/* Banner Preview */}
            {bannerPreview && (
              <div className="mb-4">
                <div className="relative group">
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={bannerPreview}
                      alt="Banner preview"
                      width={800}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Banner Preview
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gallery Upload */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Gallery Images</h2>
            <p className="text-gray-400 mb-4">Upload up to 6 images for the gallery</p>
            
            {/* File Input */}
            <div className="mb-6">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-yellow-400 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Selected: {galleryFiles.length}/6 images
              </p>
            </div>

            {/* Image Previews */}
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {galleryFiles[index]?.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="px-6 py-3 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Work"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
