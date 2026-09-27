import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, X, UploadCloud, GripVertical, Film } from "lucide-react";
import { api } from "../../api/client.js";

const emptyForm = {
  title: "",
  slug: "",
  coupleNames: "",
  location: "",
  weddingDate: "",
  description: "",
  featured: false,
  published: false,
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function TextForm({ form, setForm, onSubmit, saving, isNew, onCancel }) {
  const onTitleChange = (value) => {
    setForm((f) => ({
      ...f,
      title: value,
      // Only auto-fill the slug while creating and the admin hasn't touched it.
      slug: isNew && (f.slug === "" || f.slug === slugify(f.title)) ? slugify(value) : f.slug,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">Project title *</label>
        <input required value={form.title} onChange={(e) => onTitleChange(e.target.value)} className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">Slug *</label>
        <input required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">Couple *</label>
        <input required value={form.coupleNames} onChange={(e) => setForm((f) => ({ ...f, coupleNames: e.target.value }))} placeholder="Aarav & Isha" className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">Location</label>
        <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Udaipur, Rajasthan" className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">Wedding date</label>
        <input type="date" value={form.weddingDate} onChange={(e) => setForm((f) => ({ ...f, weddingDate: e.target.value }))} className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none" />
      </div>
      <div className="flex items-end gap-6 pb-1">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
          Published
        </label>
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">Description / excerpt</label>
        <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full resize-none rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none" />
      </div>
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" disabled={saving} className="rounded-lg bg-[#C6A75E] px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-black hover:bg-white disabled:opacity-40">
          {saving ? "Saving..." : isNew ? "Create & Continue to Media" : "Save Details"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border border-white/15 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-300 hover:bg-white/10">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function MediaDropZone({ accept, hint, onFile, uploading, children }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (!uploading) onFile(e.dataTransfer.files?.[0]); }}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
        dragging ? "border-[#C6A75E] bg-[#C6A75E]/5" : "border-white/15 hover:border-white/30"
      } ${uploading ? "pointer-events-none opacity-50" : ""}`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      {children || (
        <>
          <UploadCloud size={22} className="text-[#C6A75E]" />
          <p className="text-xs text-gray-400">{uploading ? "Uploading..." : hint}</p>
        </>
      )}
    </div>
  );
}

function MediaEditor({ wedding, onChange }) {
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const dragIndexRef = useRef(null);
  const [gallery, setGallery] = useState(wedding.gallery || []);

  useEffect(() => setGallery(wedding.gallery || []), [wedding._id, wedding.gallery]);

  const uploadCover = async (file) => {
    if (!file || !file.type.startsWith("image/")) return toast.error("Please choose an image file");
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post(`/api/admin/weddings/${wedding._id}/cover`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(data.wedding);
      toast.success("Cover photo updated");
    } catch {
      // api client toasts
    } finally {
      setUploadingCover(false);
    }
  };

  const uploadVideo = async (file) => {
    if (!file || !file.type.startsWith("video/")) return toast.error("Please choose a video file");
    if (file.size > 100 * 1024 * 1024) return toast.error("Video must be under 100MB");
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("video", file);
      const { data } = await api.post(`/api/admin/weddings/${wedding._id}/video`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(data.wedding);
      toast.success("Highlight video added");
    } catch {
      // api client toasts
    } finally {
      setUploadingVideo(false);
    }
  };

  const removeVideo = async () => {
    try {
      const { data } = await api.delete(`/api/admin/weddings/${wedding._id}/video`);
      onChange(data.wedding);
    } catch {
      // api client toasts
    }
  };

  const uploadPhoto = async (file) => {
    if (!file || !file.type.startsWith("image/")) return toast.error("Please choose an image file");
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post(`/api/admin/weddings/${wedding._id}/gallery`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(data.wedding);
      setGallery(data.wedding.gallery || []);
    } catch {
      // api client toasts
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = async (imageId) => {
    const previous = gallery;
    setGallery((g) => g.filter((img) => img._id !== imageId));
    try {
      const { data } = await api.delete(`/api/admin/weddings/${wedding._id}/gallery/${imageId}`);
      onChange(data.wedding);
    } catch {
      setGallery(previous);
    }
  };

  const handleDragStart = (index) => () => { dragIndexRef.current = index; };
  const handleDragOverItem = (index) => (e) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) return;
    setGallery((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      dragIndexRef.current = index;
      return next;
    });
  };
  const handleDragEnd = async () => {
    dragIndexRef.current = null;
    try {
      const { data } = await api.patch(`/api/admin/weddings/${wedding._id}/gallery/reorder`, { order: gallery.map((img) => img._id) });
      onChange(data.wedding);
    } catch {
      setGallery(wedding.gallery || []);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Cover */}
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-500">Cover photo</p>
          <MediaDropZone accept="image/*" hint="Drag & drop or click to select" onFile={uploadCover} uploading={uploadingCover}>
            {wedding.coverImage ? (
              <div className="relative w-full">
                <img src={wedding.coverImage} alt="Cover" className="mx-auto max-h-40 rounded-lg object-cover" />
                <span className="mt-2 block text-[10px] text-gray-500">Click or drop to replace</span>
              </div>
            ) : undefined}
          </MediaDropZone>
        </div>

        {/* Video */}
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-500">Highlight video (optional)</p>
          <MediaDropZone accept="video/mp4,video/webm,video/quicktime" hint="Drag & drop or click to select" onFile={uploadVideo} uploading={uploadingVideo}>
            {wedding.video ? (
              <div className="relative w-full">
                <video src={wedding.video} className="mx-auto max-h-40 rounded-lg" controls muted />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeVideo(); }}
                  className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/90 hover:bg-rose-500"
                  aria-label="Remove video"
                >
                  <X size={14} />
                </button>
              </div>
            ) : undefined}
          </MediaDropZone>
        </div>
      </div>

      {/* Gallery */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-gray-500">Photo gallery ({gallery.length})</p>
        </div>
        <MediaDropZone accept="image/*" hint="Drag & drop photos here, or click to add one at a time" onFile={uploadPhoto} uploading={uploadingPhoto} />

        {gallery.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {gallery.map((img, index) => (
              <div
                key={img._id}
                draggable
                onDragStart={handleDragStart(index)}
                onDragOver={handleDragOverItem(index)}
                onDragEnd={handleDragEnd}
                className="group relative aspect-square cursor-grab overflow-hidden rounded-lg bg-white/5 active:cursor-grabbing"
              >
                <img src={img.src} alt={img.title || "Gallery photo"} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white/70">
                  <GripVertical size={11} />
                </span>
                <button
                  type="button"
                  onClick={() => removePhoto(img._id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/50 group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminWeddings() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // "_new" | id | null
  const [form, setForm] = useState(emptyForm);
  const [activeWedding, setActiveWedding] = useState(null); // full record with populated gallery, once created
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/weddings", { params: { search: debouncedSearch, limit: 50 } });
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { load(); }, [load]);

  const startNew = () => {
    setEditingId("_new");
    setForm(emptyForm);
    setActiveWedding(null);
  };

  const startEdit = async (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      coupleNames: item.coupleNames || "",
      location: item.location || "",
      weddingDate: item.weddingDate ? String(item.weddingDate).slice(0, 10) : "",
      description: item.description || "",
      featured: !!item.featured,
      published: !!item.published,
    });
    setActiveWedding(null);
    try {
      const { data } = await api.get(`/api/admin/weddings/${item._id}/full`);
      setActiveWedding(data.wedding);
    } catch {
      setActiveWedding(item);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setActiveWedding(null);
  };

  const submitText = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (editingId === "_new") {
        const { data } = await api.post("/api/admin/weddings", payload);
        toast.success("Story created — now add photos below");
        setEditingId(data.item._id);
        setActiveWedding({ ...data.item, gallery: [] });
      } else {
        const { data } = await api.patch(`/api/admin/weddings/${editingId}`, payload);
        toast.success("Details saved");
        setActiveWedding((prev) => (prev ? { ...prev, ...data.item } : data.item));
      }
      await load();
    } catch {
      // api client toasts
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this story and all its photos/video? This can't be undone.")) return;
    try {
      await api.delete(`/api/admin/weddings/${id}`);
      toast.success("Story deleted");
      if (editingId === id) cancelEdit();
      await load();
    } catch {
      // api client toasts
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Weddings &amp; Stories</h1>
          <p className="mt-1 text-sm text-gray-400">
            These power the "Stories" section of the public Gallery page — each one is a couple's cover photo, optional highlight video, and photo gallery.
          </p>
        </div>
        {!editingId && (
          <button onClick={startNew} className="flex items-center gap-2 rounded-lg bg-[#C6A75E] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-black hover:bg-white">
            <Plus size={15} /> New Story
          </button>
        )}
      </div>

      {editingId ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#C6A75E]">
            {editingId === "_new" ? "New Story — Details" : "Edit Story"}
          </h2>
          <TextForm form={form} setForm={setForm} onSubmit={submitText} saving={saving} isNew={editingId === "_new" && !activeWedding} onCancel={cancelEdit} />

          {activeWedding && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#C6A75E]">Media</h2>
              <MediaEditor wedding={activeWedding} onChange={setActiveWedding} />
              <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-gray-400">
                <p className="font-semibold text-gray-300">Recommended size &amp; format</p>
                <p>
                  Cover &amp; gallery photos: at least <span className="text-[#C6A75E]">1000px</span> on the shorter side, JPG/PNG/WebP/GIF, up to 10MB each.
                  Highlight video: <span className="text-[#C6A75E]">1080p</span>, MP4/WebM/MOV, ideally under 2 minutes, up to 100MB.
                </p>
              </div>
              <button onClick={cancelEdit} className="mt-6 rounded-lg border border-white/15 px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-300 hover:bg-white/10">
                Done
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="relative mb-4 max-w-sm">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search stories..." className="w-full rounded-lg border border-white/15 bg-black py-2.5 pl-9 pr-3 text-sm focus:border-[#C6A75E] focus:outline-none" />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-white/5" />)}
            </div>
          ) : items.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-500">No stories yet — click "New Story" to add your first one.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item) => (
                <div key={item._id} className="group relative overflow-hidden rounded-xl bg-white/5">
                  <div className="aspect-[4/5] w-full bg-black/40">
                    {item.coverImage ? (
                      <img src={item.coverImage} alt={item.coupleNames} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-600">No cover yet</div>
                    )}
                  </div>
                  {item.video && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] uppercase tracking-wide">
                      <Film size={11} /> Video
                    </span>
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="truncate text-sm font-medium">{item.coupleNames}</p>
                    <p className="truncate text-xs text-gray-400">{item.location || "—"}</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => startEdit(item)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 hover:bg-white/25" aria-label="Edit">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => remove(item._id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/90 hover:bg-rose-500" aria-label="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <span className={`absolute top-2 right-2 h-2.5 w-2.5 rounded-full ${item.published ? "bg-emerald-400" : "bg-gray-500"}`} title={item.published ? "Published" : "Draft"} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
