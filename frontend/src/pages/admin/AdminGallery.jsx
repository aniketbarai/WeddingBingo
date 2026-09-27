import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud, X, Trash2, ImageOff } from "lucide-react";
import { api } from "../../api/client.js";
import BASE_URL from "../../config.js";

const resolveImageSrc = (src) => (/^https?:\/\//i.test(src) ? src : `${BASE_URL}${src}`);

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [stories, setStories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [shareToStory, setShareToStory] = useState(false);
  const [storyId, setStoryId] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const loadImages = useCallback(async () => {
    setLoadingList(true);
    try {
      const { data } = await api.get("/api/admin/images");
      setImages(Array.isArray(data?.images) ? data.images : []);
    } catch {
      // api client already toasts the error
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    // This effect synchronizes the component with the protected gallery API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    api.get("/api/admin/weddings", { params: { limit: 100 } })
      .then(({ data }) => setStories(Array.isArray(data?.items) ? data.items : []))
      .catch(() => setStories([]));
  }, []);

  const applyFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setTitle("");
    setShareToStory(false);
    setStoryId("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    applyFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Select or drop a photo first");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title.trim());
      if (shareToStory && storyId) formData.append("storyId", storyId);

      await api.post("/api/admin/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(shareToStory && storyId ? "Photo added to the gallery and story" : "Photo added to the gallery");
      clearSelection();
      loadImages();
    } catch {
      // api client already toasts the error
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const previous = images;
    setImages((current) => current.filter((img) => img._id !== id));
    try {
      await api.delete(`/api/admin/images/${id}`);
      toast.success("Photo removed");
    } catch {
      setImages(previous); // roll back optimistic removal on failure
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold">Gallery</h1>
      <p className="text-gray-400 mt-1 mb-8 text-sm">
        Upload a photo and it appears in the public gallery immediately.
      </p>

      {/* UPLOAD FORM */}
      <form onSubmit={handleUpload} className="mb-12">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !preview && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-colors cursor-pointer ${
            isDragging ? "border-[#C6A75E] bg-[#C6A75E]/5" : "border-white/15 hover:border-white/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => applyFile(e.target.files?.[0])}
          />

          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="Selected preview" className="max-h-64 rounded-xl mx-auto" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center hover:bg-white/10"
                aria-label="Remove selected photo"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <UploadCloud size={32} className="text-[#C6A75E]" />
              <p className="text-sm">
                Drag &amp; drop a photo here, or <span className="text-[#C6A75E] underline">click to select</span>
              </p>
              <p className="text-xs text-gray-600">JPG, PNG, WEBP or GIF, up to 10MB</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="flex-1 bg-black border border-white/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C6A75E] transition-colors"
          />
          <button
            type="submit"
            disabled={uploading || !file}
            className="px-8 py-3 rounded-lg bg-[#C6A75E] text-black text-sm font-bold uppercase tracking-wide hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Add to Gallery"}
          </button>
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[.03] p-4">
          <label className="flex items-center gap-3 text-sm text-white/75">
            <input
              type="checkbox"
              checked={shareToStory}
              onChange={(e) => {
                setShareToStory(e.target.checked);
                if (!e.target.checked) setStoryId("");
              }}
              className="accent-[#c6a75e]"
            />
            Also show this photo in one couple story
          </label>
          {shareToStory && (
            <select
              value={storyId}
              onChange={(e) => setStoryId(e.target.value)}
              required
              className="mt-3 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white focus:border-[#c6a75e] focus:outline-none"
            >
              <option value="">Choose one story…</option>
              {stories.map((story) => (
                <option key={story._id} value={story._id}>{story.coupleNames} — {story.title}</option>
              ))}
            </select>
          )}
          <p className="mt-2 text-xs text-white/35">The photo remains in the general gallery and is linked to only the selected story.</p>
        </div>
      </form>

      {/* EXISTING PHOTOS */}
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
        Published Photos {!loadingList && `(${images.length})`}
      </h2>

      {loadingList ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-gray-500 py-16 border border-white/10 rounded-2xl">
          <ImageOff size={28} />
          <p className="text-sm">No photos published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img._id} className="group relative aspect-square rounded-xl overflow-hidden bg-white/5">
              <img
                src={resolveImageSrc(img.src)}
                alt={img.title || "Gallery photo"}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                <span className="text-xs truncate pr-2">{img.title || "Untitled"}{img.storyId ? " · Shared with story" : ""}</span>
                <button
                  onClick={() => handleDelete(img._id)}
                  className="shrink-0 w-8 h-8 rounded-full bg-rose-500/90 hover:bg-rose-500 flex items-center justify-center"
                  aria-label="Delete photo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
