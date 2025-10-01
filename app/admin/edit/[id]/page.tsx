"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface WorkForm {
  slug: string;
  name: string;
  description: string;
  banner_url?: string;
  gallery?: string[];
}

export default function EditWork({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<WorkForm>({
    slug: "",
    name: "",
    description: "",
  });
  const [existingBanner, setExistingBanner] = useState<string | null>(null);
  const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
  const [newBannerPreview, setNewBannerPreview] = useState<string | null>(null);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);

    // Fetch work data
    fetch(`/api/works/${params.id}`)
      .then((res) => res.json())
      .then((data: WorkForm) => {
        setForm({
          slug: data.slug,
          name: data.name,
          description: data.description,
          banner_url: data.banner_url,
        });
        setExistingBanner(data.banner_url || null);
        setExistingGallery(data.gallery || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching work:", error);
        alert("Error loading work data");
        setLoading(false);
      });
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNewBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBannerFile(file);
      setNewBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeNewBanner = () => {
    setNewBannerFile(null);
    setNewBannerPreview(null);
  };

  const removeExistingBanner = () => {
    setExistingBanner(null);
  };

  const handleNewGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingGallery.length + files.length;
    
    if (totalImages > 6) {
      alert("Maximum 6 images allowed total");
      return;
    }

    setNewGalleryFiles(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setNewGalleryPreviews(previews);
  };

  const removeExistingImage = (index: number) => {
    const newGallery = existingGallery.filter((_, i) => i !== index);
    setExistingGallery(newGallery);
  };

  const removeNewImage = (index: number) => {
    const newFiles = newGalleryFiles.filter((_, i) => i !== index);
    const newPreviews = newGalleryPreviews.filter((_, i) => i !== index);
    
    setNewGalleryFiles(newFiles);
    setNewGalleryPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.slug || !form.name || !form.description) {
      alert("Please fill in all required fields");
      return;
    }

    const totalImages = existingGallery.length + newGalleryFiles.length;
    if (totalImages === 0) {
      alert("Please keep at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      formData.append("slug", form.slug);
      formData.append("name", form.name);
      formData.append("description", form.description);
      
      // Add existing gallery (as JSON)
      formData.append("existing_gallery", JSON.stringify(existingGallery));
      
      // Add new banner if uploaded
      if (newBannerFile) {
        formData.append("new_banner", newBannerFile);
      }
      
      // Add existing banner info
      formData.append("existing_banner", existingBanner || "");
      
      // Add new gallery images
      newGalleryFiles.forEach((file, index) => {
        formData.append(`new_gallery_${index}`, file);
      });

      const res = await fetch(`/api/works/${params.id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const error = await res.json();
        alert(`Failed to update work: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating work:", error);
      alert("Error updating work");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4">Loading work data...</p>
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
            <h1 className="text-2xl font-bold text-yellow-400">Edit Work</h1>
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

          {/* Banner Management */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Banner Image</h2>
            <p className="text-gray-400 mb-4">Banner image displayed on the work landing page</p>
            
            {/* Existing Banner */}
            {existingBanner && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Current Banner</h3>
                <div className="relative group">
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={existingBanner}
                      alt="Current banner"
                      width={800}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeExistingBanner}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Current Banner
                  </div>
                </div>
              </div>
            )}

            {/* New Banner Upload */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">
                {existingBanner ? "Replace Banner" : "Upload Banner"}
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleNewBannerChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-yellow-400 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {existingBanner ? "Upload a new image to replace the current banner" : "Upload a banner image for the work landing page"}
              </p>
            </div>

            {/* New Banner Preview */}
            {newBannerPreview && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">New Banner Preview</h3>
                <div className="relative group">
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={newBannerPreview}
                      alt="New banner preview"
                      width={800}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeNewBanner}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    New Banner Preview
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Existing Gallery */}
          {existingGallery.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Current Gallery Images</h2>
              <p className="text-gray-400 mb-4">Click × to remove images</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {existingGallery.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={`Current image ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Current Image
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Images</h2>
            <p className="text-gray-400 mb-4">
              Add up to {6 - existingGallery.length} more images (max 6 total)
            </p>
            
            {/* File Input */}
            <div className="mb-6">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewGalleryChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:border-yellow-400 focus:outline-none"
                disabled={existingGallery.length >= 6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Total: {existingGallery.length + newGalleryFiles.length}/6 images
              </p>
            </div>

            {/* New Image Previews */}
            {newGalleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {newGalleryPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={preview}
                        alt={`New preview ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {newGalleryFiles[index]?.name}
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
              {isSubmitting ? "Updating..." : "Update Work"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
