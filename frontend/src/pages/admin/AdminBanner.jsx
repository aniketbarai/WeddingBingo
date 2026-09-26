import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud, X, Trash2, ImageOff, GripVertical } from "lucide-react";
import { api } from "../../api/client.js";

const MIN_SLIDES = 3;
const MAX_SLIDES = 10;

export default function AdminBanner() {
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [alt, setAlt] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const dragIndexRef = useRef(null);
  const [reordering, setReordering] = useState(false);

  const loadItems = useCallback(async () => {
    setLoadingList(true);
    try {
      const { data } = await api.get("/api/admin/banner");
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch {
      // api client already toasts the error
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadItems();
  }, [loadItems]);

  const atMax = items.length >= MAX_SLIDES;
  const atMin = items.length <= MIN_SLIDES;

  const applyFile = (selectedFile) => {
    if (!selectedFile) return;
    if (atMax) {
      toast.error(`You can have at most ${MAX_SLIDES} banner slides`);
      return;
    }
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Images must be under 10MB");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setAlt("");
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
      formData.append("alt", alt.trim());

      await api.post("/api/admin/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Slide added to the banner");
      clearSelection();
      loadItems();
    } catch {
      // api client already toasts the error
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (atMin) {
      toast.error(`You must keep at least ${MIN_SLIDES} banner slides`);
      return;
    }
    const previous = items;
    setItems((current) => current.filter((item) => item._id !== id));
    try {
      await api.delete(`/api/admin/banner/${id}`);
      toast.success("Slide removed");
    } catch {
      setItems(previous);
    }
  };

  // --- Drag-to-reorder ---
  const handleDragStart = (index) => () => {
    dragIndexRef.current = index;
  };

  const handleDragOverItem = (index) => (e) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) return;
    setItems((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      dragIndexRef.current = index;
      return next;
    });
  };

  const handleDragEnd = async () => {
    dragIndexRef.current = null;
    setReordering(true);
    try {
      await api.patch("/api/admin/banner/reorder", { order: items.map((i) => i._id) });
    } catch {
      loadItems();
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold">Homepage Banner</h1>
      <p className="text-gray-400 mt-1 mb-2 text-sm">
        The auto-sliding hero banner shown on the homepage. Drag a card to reorder.
      </p>
      <p className="text-xs text-gray-500 mb-8">
        Requires a minimum of <span className="text-[#C6A75E]">{MIN_SLIDES}</span> and a maximum of{" "}
        <span className="text-[#C6A75E]">{MAX_SLIDES}</span> slides — currently{" "}
        <span className="text-[#C6A75E]">{items.length}</span>.
      </p>

      {/* UPLOAD FORM */}
      <form onSubmit={handleUpload} className="mb-12">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !preview && !atMax && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
            atMax
              ? "cursor-not-allowed border-white/10 opacity-50"
              : `cursor-pointer ${isDragging ? "border-[#C6A75E] bg-[#C6A75E]/5" : "border-white/15 hover:border-white/30"}`
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={atMax}
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
                {atMax ? (
                  `Maximum of ${MAX_SLIDES} slides reached — remove one to add another`
                ) : (
                  <>Drag &amp; drop a photo here, or <span className="text-[#C6A75E] underline">click to select</span></>
                )}
              </p>
              <p className="text-xs text-gray-600">JPG, PNG, WEBP or GIF, up to 10MB</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Alt text (optional, for accessibility/SEO)"
            className="flex-1 bg-black border border-white/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C6A75E] transition-colors"
          />
          <button
            type="submit"
            disabled={uploading || !file || atMax}
            className="px-8 py-3 rounded-lg bg-[#C6A75E] text-black text-sm font-bold uppercase tracking-wide hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {uploading ? "Uploading..." : "Add Slide"}
          </button>
        </div>

        <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-gray-400">
          Recommended size: at least <span className="text-[#C6A75E]">1920×1080px</span> (wide/landscape), JPG/PNG/WebP, up to 10MB.
        </div>
      </form>

      {/* EXISTING SLIDES */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
          Banner Slides {!loadingList && `(${items.length})`}
        </h2>
        {reordering && <span className="text-xs text-gray-500">Saving order...</span>}
      </div>

      {loadingList ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-video bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-gray-500 py-16 border border-white/10 rounded-2xl">
          <ImageOff size={28} />
          <p className="text-sm">No banner slides yet — add at least {MIN_SLIDES} to publish the homepage banner.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div
              key={item._id}
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOverItem(index)}
              onDragEnd={handleDragEnd}
              className="group relative aspect-video rounded-xl overflow-hidden bg-white/5 cursor-grab active:cursor-grabbing"
            >
              <img
                src={item.src}
                alt={item.alt || "Banner slide"}
                loading="lazy"
                className="w-full h-full object-cover"
              />

              <span className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white/70">
                <GripVertical size={14} />
              </span>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                <span className="text-xs truncate pr-2">{item.alt || `Slide ${index + 1}`}</span>
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={atMin}
                  className="shrink-0 w-8 h-8 rounded-full bg-rose-500/90 hover:bg-rose-500 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Delete slide"
                  title={atMin ? `At least ${MIN_SLIDES} slides required` : "Delete"}
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
