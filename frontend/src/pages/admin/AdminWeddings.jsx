import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, UploadCloud, Film, Search } from "lucide-react";
import { api } from "../../api/client.js";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const blankForm = () => ({
  title: "",
  slug: "",
  coupleNames: "",
  location: "",
  venue: "",
  weddingDate: "",
  description: "",
  featured: false,
  published: false,
});

export default function AdminWeddings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState(null); // details form, null = list view
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState(null); // full wedding doc being managed (media/video)

  const coverInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/weddings", { params: { search, limit: 50 } });
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const startCreate = () => setForm(blankForm());

  const startEdit = (item) => {
    setForm({
      ...blankForm(),
      ...item,
      weddingDate: item.weddingDate ? item.weddingDate.slice(0, 10) : "",
    });
  };

  const closeForm = () => setForm(null);

  const submitDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.slug && payload.title) payload.slug = slugify(payload.title);
      if (form._id) {
        await api.patch(`/api/admin/weddings/${form._id}`, payload);
        toast.success("Story updated");
      } else {
        await api.post("/api/admin/weddings", payload);
        toast.success("Story created");
      }
      setForm(null);
      await load();
    } catch {
      /* api client already toasts the error */
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this couple's story permanently? This also removes their video and photos.")) return;
    try {
      await api.delete(`/api/admin/weddings/${id}`);
      toast.success("Story deleted");
      if (active?._id === id) setActive(null);
      await load();
    } catch {
      /* api client already toasts the error */
    }
  };

  const openManage = (item) => setActive(item);

  const uploadCover = async (file) => {
    if (!file || !active) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await api.post(`/api/admin/weddings/${active._id}/cover`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setActive(data.item);
      toast.success("Cover image updated");
      load();
    } catch {
      /* toasted */
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const uploadVideo = async (file) => {
    if (!file || !active) return;
    setUploadingVideo(true);
    try {
      const fd = new FormData();
      fd.append("video", file);
      const { data } = await api.post(`/api/admin/weddings/${active._id}/video`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setActive(data.item);
      toast.success("Hero video uploaded");
    } catch {
      /* toasted */
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const removeVideo = async () => {
    if (!active) return;
    try {
      const { data } = await api.delete(`/api/admin/weddings/${active._id}/video`);
      setActive(data.item);
      toast.success("Video removed");
    } catch {
      /* toasted */
    }
  };

  const uploadMedia = async (fileList) => {
    if (!fileList?.length || !active) return;
    setUploadingMedia(true);
    try {
      for (const file of fileList) {
        const fd = new FormData();
        fd.append("image", file);
        // eslint-disable-next-line no-await-in-loop
        const { data } = await api.post(`/api/admin/weddings/${active._id}/media`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setActive(data.item);
      }
      toast.success("Photos added to this couple's story");
    } catch {
      /* toasted */
    } finally {
      setUploadingMedia(false);
      if (mediaInputRef.current) mediaInputRef.current.value = "";
    }
  };

  const removeMedia = async (mediaId) => {
    if (!active) return;
    const previous = active;
    setActive({ ...active, media: active.media.filter((m) => m._id !== mediaId) });
    try {
      const { data } = await api.delete(`/api/admin/weddings/${active._id}/media/${mediaId}`);
      setActive(data.item);
    } catch {
      setActive(previous);
    }
  };

  return (
    <section className="min-h-screen bg-[#090909] p-5 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[.3em] text-[#c6a75e]">Every couple, their own page</p>
            <h1 className="mt-2 font-serif text-4xl">Couple Stories</h1>
            <p className="mt-2 text-sm text-white/40">
              Each story gets its own hero video, description, and photo gallery — separate from the general Gallery pool.
            </p>
          </div>
          <button
            onClick={startCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c6a75e] px-4 py-3 text-sm font-semibold text-black hover:bg-[#b5964d]"
          >
            <Plus size={16} /> New story
          </button>
        </div>

        <div className="my-6 flex max-w-md items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-4 py-3">
          <Search size={16} className="text-white/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
          />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 p-12 text-center text-sm text-white/40">Loading workspace…</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-16 text-center">
            <p className="font-serif text-2xl">No couple stories yet.</p>
            <p className="mt-2 text-sm text-white/40">Create the first one to give it a dedicated page in the Gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item._id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.02]">
                <div className="relative aspect-[4/3] bg-white/5">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.coupleNames} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20">No cover</div>
                  )}
                  {item.videoUrl && (
                    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] uppercase tracking-widest text-[#c6a75e]">
                      <Film size={11} /> Video
                    </span>
                  )}
                  <span className={`absolute right-3 top-3 rounded-full px-2 py-1 text-[10px] uppercase tracking-widest ${item.published ? "bg-emerald-500/80 text-black" : "bg-white/20 text-white/70"}`}>
                    {item.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-[.2em] text-[#c6a75e]">{item.location || "—"}</p>
                  <h3 className="mt-1 font-serif text-xl">{item.coupleNames}</h3>
                  <p className="mt-1 text-xs text-white/40">
                    {item.media?.length || 0} photo{item.media?.length === 1 ? "" : "s"} in their gallery
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => openManage(item)}
                      className="flex-1 rounded-lg bg-[#c6a75e] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-black hover:bg-white"
                    >
                      Manage media
                    </button>
                    <button onClick={() => startEdit(item)} className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-[#c6a75e]" aria-label="Edit details">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(item._id)} className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-red-400" aria-label="Delete story">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details form modal */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={closeForm}>
          <form
            onSubmit={submitDetails}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d0d] p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl">{form._id ? "Edit story" : "New story"}</h2>
              <button type="button" onClick={closeForm} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-white/40">Couple names</label>
                <input
                  required
                  value={form.coupleNames}
                  onChange={(e) => setForm({ ...form, coupleNames: e.target.value })}
                  placeholder="Aarav & Isha"
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#c6a75e] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-white/40">Story title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })}
                  placeholder="A lakeside wedding in Udaipur"
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#c6a75e] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-white/40">Slug (URL)</label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  placeholder="aarav-isha"
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#c6a75e] focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-white/30">Page will be at /gallery/story/{form.slug || "…"}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-widest text-white/40">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#c6a75e] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-widest text-white/40">Wedding date</label>
                  <input
                    type="date"
                    value={form.weddingDate}
                    onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#c6a75e] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-white/40">Venue</label>
                <input
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#c6a75e] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-widest text-white/40">Minimal description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="A short line shown under the hero video on the story page."
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#c6a75e] focus:outline-none"
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                  Published (visible on the site)
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-xl bg-[#c6a75e] px-4 py-3 text-sm font-semibold text-black hover:bg-[#b5964d] disabled:opacity-40"
            >
              {saving ? "Saving…" : form._id ? "Save changes" : "Create story"}
            </button>
          </form>
        </div>
      )}

      {/* Media manager modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setActive(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d0d] p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[.2em] text-[#c6a75e]">{active.location}</p>
                <h2 className="font-serif text-2xl">{active.coupleNames}</h2>
              </div>
              <button onClick={() => setActive(null)} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Cover image */}
            <div className="mb-6">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">Cover image</h3>
              <div className="flex items-center gap-4">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-white/5">
                  {active.coverImage ? (
                    <img src={active.coverImage} alt="Cover" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20 text-xs">None</div>
                  )}
                </div>
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => uploadCover(e.target.files?.[0])} />
                <button
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide hover:border-[#c6a75e] hover:text-[#c6a75e] disabled:opacity-40"
                >
                  {uploadingCover ? "Uploading…" : "Change cover"}
                </button>
              </div>
            </div>

            {/* Hero video */}
            <div className="mb-6">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">Hero video</h3>
              {active.videoUrl ? (
                <div className="mb-3 overflow-hidden rounded-lg">
                  <video src={active.videoUrl} controls className="max-h-52 w-full bg-black" />
                </div>
              ) : (
                <p className="mb-3 text-sm text-white/30">No video uploaded yet — the story page will fall back to the cover image.</p>
              )}
              <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => uploadVideo(e.target.files?.[0])} />
              <div className="flex gap-2">
                <button
                  onClick={() => videoInputRef.current?.click()}
                  disabled={uploadingVideo}
                  className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide hover:border-[#c6a75e] hover:text-[#c6a75e] disabled:opacity-40"
                >
                  {uploadingVideo ? "Uploading…" : active.videoUrl ? "Replace video" : "Upload video"}
                </button>
                {active.videoUrl && (
                  <button onClick={removeVideo} className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/60 hover:border-red-400 hover:text-red-400">
                    Remove
                  </button>
                )}
              </div>
              <p className="mt-2 text-[11px] text-white/30">MP4, WebM or MOV, up to 150MB.</p>
            </div>

            {/* Story gallery — this couple's own photos, separate from the general gallery */}
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                This couple&apos;s story gallery ({active.media?.length || 0})
              </h3>
              <input ref={mediaInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadMedia(e.target.files)} />
              <button
                onClick={() => mediaInputRef.current?.click()}
                disabled={uploadingMedia}
                className="mb-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60 hover:border-[#c6a75e] hover:text-[#c6a75e] disabled:opacity-40"
              >
                <UploadCloud size={14} /> {uploadingMedia ? "Uploading…" : "Add photos"}
              </button>

              {active.media?.length ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {active.media.map((m) => (
                    <div key={m._id} className="group relative aspect-square overflow-hidden rounded-lg bg-white/5">
                      <img src={m.url} alt="Story" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeMedia(m._id)}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                        aria-label="Remove photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/30">No photos added to this story yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
