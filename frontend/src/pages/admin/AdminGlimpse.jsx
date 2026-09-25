import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud, X, Trash2, ImageOff, GripVertical, Film } from "lucide-react";
import { api } from "../../api/client.js";

export default function AdminGlimpse() {
  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewIsVideo, setPreviewIsVideo] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Drag-to-reorder state
  const dragIndexRef = useRef(null);
  const [reordering, setReordering] = useState(false);

  const loadItems = useCallback(async () => {
    setLoadingList(true);
    try {
      const { data } = await api.get("/api/admin/glimpse");
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

  const applyFile = (selectedFile) => {
    if (!selectedFile) return;
    const isVideo = selectedFile.type.startsWith("video/");
    const isImage = selectedFile.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast.error("Please choose an image or video file");
      return;
    }
    if (isVideo && selectedFile.size > 100 * 1024 * 1024) {
      toast.error("Videos must be under 100MB");
      return;
    }
    if (isImage && selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Images must be under 10MB");
      return;
    }
    setFile(selectedFile);
    setPreviewIsVideo(isVideo);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setPreviewIsVideo(false);
    setTitle("");
    setCaption("");
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
      toast.error("Select or drop a photo/video first");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("media", file);
      formData.append("title", title.trim());
      formData.append("caption", caption.trim());

      await api.post("/api/admin/glimpse", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Added to the Glimpse section");
      clearSelection();
      loadItems();
    } catch {
      // api client already toasts the error
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const previous = items;
    setItems((current) => current.filter((item) => item._id !== id));
    try {
      await api.delete(`/api/admin/glimpse/${id}`);
      toast.success("Removed");
    } catch {
      setItems(previous); // roll back optimistic removal on failure
    }
  };

  const toggleActive = async (item) => {
    const previous = items;
    setItems((current) => current.map((i) => (i._id === item._id ? { ...i, active: !i.active } : i)));
    try {
      await api.patch(`/api/admin/glimpse/${item._id}`, { active: !item.active });
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
      await api.patch("/api/admin/glimpse/reorder", { order: items.map((i) => i._id) });
    } catch {
      loadItems(); // fall back to server order if the save failed
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold">Glimpse</h1>
      <p className="text-gray-400 mt-1 mb-8 text-sm">
        Photos and videos shown in the "Glimpse" section on the homepage. Drag a card to reorder.
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
            accept="image/*,video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => applyFile(e.target.files?.[0])}
          />

          {preview ? (
            <div className="relative inline-block">
              {previewIsVideo ? (
                <video src={preview} className="max-h-64 rounded-xl mx-auto" controls muted />
              ) : (
                <img src={preview} alt="Selected preview" className="max-h-64 rounded-xl mx-auto" />
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center hover:bg-white/10"
                aria-label="Remove selected file"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <UploadCloud size={32} className="text-[#C6A75E]" />
              <p className="text-sm">
                Drag &amp; drop a photo or video here, or <span className="text-[#C6A75E] underline">click to select</span>
              </p>
              <p className="text-xs text-gray-600">Images: JPG, PNG, WEBP, GIF up to 10MB · Videos: MP4, WEBM, MOV up to 100MB</p>
            </div>
          )}
        </div>

        <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-gray-400">
          <p className="font-semibold text-gray-300">Recommended size for the homepage Glimpse grid</p>
          <p>
            The layout keeps each photo&apos;s natural shape (no cropping), so any size works — but for the
            sharpest, most consistent look aim for at least <span className="text-[#C6A75E]">1000px</span> on the
            shorter side. Portrait shots (roughly 4:5) and square shots (1:1) both sit nicely in the grid; very
            wide panoramas will look large in one column. For videos, a <span className="text-[#C6A75E]">1080p (1920×1080)</span>
            {" "}or portrait <span className="text-[#C6A75E]">9:16</span> clip under 60 seconds works best.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="flex-1 bg-black border border-white/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C6A75E] transition-colors"
          />
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="flex-1 bg-black border border-white/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C6A75E] transition-colors"
          />
          <button
            type="submit"
            disabled={uploading || !file}
            className="px-8 py-3 rounded-lg bg-[#C6A75E] text-black text-sm font-bold uppercase tracking-wide hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {uploading ? "Uploading..." : "Add to Glimpse"}
          </button>
        </div>
      </form>

      {/* EXISTING ITEMS */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
          Glimpse Items {!loadingList && `(${items.length})`}
        </h2>
        {reordering && <span className="text-xs text-gray-500">Saving order...</span>}
      </div>

      {loadingList ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-gray-500 py-16 border border-white/10 rounded-2xl">
          <ImageOff size={28} />
          <p className="text-sm">Nothing in the Glimpse section yet.</p>
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
              className={`group relative aspect-square rounded-xl overflow-hidden bg-white/5 cursor-grab active:cursor-grabbing ${
                item.active === false ? "opacity-40" : ""
              }`}
            >
              <img
                src={item.type === "video" ? item.thumbnail || item.src : item.src}
                alt={item.alt || item.title || "Glimpse media"}
                loading="lazy"
                className="w-full h-full object-cover"
              />

              {item.type === "video" && (
                <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] uppercase tracking-wide">
                  <Film size={11} /> Video
                </span>
              )}

              <span className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white/70">
                <GripVertical size={14} />
              </span>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="shrink-0 w-8 h-8 rounded-full bg-rose-500/90 hover:bg-rose-500 flex items-center justify-center"
                    aria-label="Delete item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs truncate">{item.title || "Untitled"}</span>
                  <button
                    onClick={() => toggleActive(item)}
                    className="shrink-0 rounded-full border border-white/30 px-2 py-1 text-[10px] uppercase tracking-wide hover:bg-white/10"
                  >
                    {item.active === false ? "Show" : "Hide"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
