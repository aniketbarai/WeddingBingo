import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, UploadCloud } from "lucide-react";
import { api } from "../../api/client.js";

const CONFIG = {
  weddings: {
    title: "Weddings & Portfolio",
    eyebrow: "The stories you carry",
    fields: [
      { key: "title", label: "Project title", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "coupleNames", label: "Couple", required: true },
      { key: "location", label: "Location" },
      { key: "weddingDate", label: "Wedding date", type: "date" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "featured", label: "Featured", type: "checkbox" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
    columns: ["title", "coupleNames", "location", "published"],
  },
  inquiries: {
    title: "Inquiries",
    eyebrow: "Relationship pipeline",
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Phone" },
      { key: "message", label: "Message", type: "textarea" },
    ],
    columns: ["name", "email", "phone", "createdAt"],
  },
  bookings: {
    title: "Bookings",
    eyebrow: "Dates worth remembering",
    fields: [
      { key: "coupleNames", label: "Couple", required: true },
      { key: "email", label: "Email" },
      { key: "weddingDate", label: "Wedding date", type: "date" },
      { key: "venue", label: "Venue" },
      { key: "location", label: "Location" },
      { key: "status", label: "Status" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
    columns: ["coupleNames", "weddingDate", "venue", "status"],
  },
  testimonials: {
    title: "Testimonials",
    eyebrow: "Words from the people",
    fields: [
      { key: "coupleName", label: "Couple", required: true },
      { key: "location", label: "Location" },
      { key: "rating", label: "Rating", type: "number" },
      { key: "testimonial", label: "Testimonial", type: "textarea", required: true },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "featured", label: "Featured", type: "checkbox" },
    ],
    columns: ["coupleName", "location", "rating", "published"],
  },
  packages: {
    title: "Packages & Services",
    eyebrow: "Shape the offering",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "price", label: "Price" },
      { key: "category", label: "Category (photo / video / complete)", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "features", label: "Features (one per line)", type: "textarea" },
      { key: "popular", label: "Popular / Signature", type: "checkbox" },
      { key: "active", label: "Active", type: "checkbox" },
    ],
    columns: ["title", "price", "category", "active"],
  },
  services: {
    title: "Services",
    eyebrow: "The studio offering",
    fields: [
      { key: "number", label: "Display number", required: true },
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "image", label: "Service image", type: "image-upload", required: true },
      { key: "order", label: "Display order", type: "number" },
      { key: "active", label: "Active", type: "checkbox" },
    ],
    columns: ["number", "title", "active"],
  },
};

const blank = (config) =>
  Object.fromEntries(
    config.fields.map((field) => [
      field.key,
      field.type === "checkbox" ? false : "",
    ])
  );

export default function AdminResourcePage({ resource }) {
  const config = CONFIG[resource];
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Debounce search state to prevent rapid API calls
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/api/admin/${resource}`, {
        params: { search: debouncedSearch, limit: 50 },
      });
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [resource, debouncedSearch, config]);

  useEffect(() => {
    load();
  }, [load]);

  if (!config) {
    return (
      <div className="min-h-screen bg-[#090909] p-10 text-white">
        Invalid resource type specified: <code>{resource}</code>
      </div>
    );
  }

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...editing };
      if (typeof payload.features === "string") {
        payload.features = payload.features
          .split("\n")
          .map((v) => v.trim())
          .filter(Boolean);
      }
      if (editing._id) {
        await api.patch(`/api/admin/${resource}/${editing._id}`, payload);
      } else {
        await api.post(`/api/admin/${resource}`, payload);
      }
      setEditing(null);
      await load();
    } catch {
      /* Soft toast error handling via api client */
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      await api.delete(`/api/admin/${resource}/${id}`);
      await load();
    } catch {
      /* Soft toast error handling via api client */
    }
  };

  const uploadServiceImage = async (file) => {
    if (!file || resource !== "services") return;
    if (!file.type.startsWith("image/")) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/api/admin/services/upload-image", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setEditing((current) => ({ ...current, image: data.image.url, imageFileId: data.image.fileId }));
    } finally {
      setUploadingImage(false);
    }
  };

  const display = (item, key) => {
    const value = item[key];
    if (key === "createdAt" || key === "weddingDate") {
      return value ? new Date(value).toLocaleDateString() : "—";
    }
    if (key === "published" || key === "active" || key === "featured") {
      return value ? "Yes" : "No";
    }
    return Array.isArray(value) ? value.join(", ") : value || "—";
  };

  return (
    <section className="min-h-screen bg-[#090909] p-5 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[.3em] text-[#c6a75e]">
              {config.eyebrow}
            </p>
            <h1 className="mt-2 font-serif text-4xl">{config.title}</h1>
            <p className="mt-2 text-sm text-white/40">
              A real workspace connected to the WeddingBingo database.
            </p>
          </div>
          <button
            onClick={() => setEditing(blank(config))}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c6a75e] px-4 py-3 text-sm font-semibold text-black hover:bg-[#b5964d]"
          >
            <Plus size={16} /> Add record
          </button>
        </div>

        <div className="my-6 flex max-w-md items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-4 py-3">
          <Search size={16} className="text-white/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
          />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 p-12 text-center text-sm text-white/40">
            Loading workspace…
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-16 text-center">
            <p className="font-serif text-2xl">Nothing here yet.</p>
            <p className="mt-2 text-sm text-white/40">
              Create the first record to begin shaping this part of the studio.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-white/[.04] text-xs uppercase tracking-widest text-white/35">
                <tr>
                  {config.columns.map((key) => (
                    <th key={key} className="px-5 py-4">{key}</th>
                  ))}
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-t border-white/10 hover:bg-white/[.025]">
                    {config.columns.map((key) => (
                      <td key={key} className="max-w-[260px] truncate px-5 py-4 text-white/70">
                        {display(item, key)}
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setEditing({
                              ...item,
                              features: Array.isArray(item.features)
                                ? item.features.join("\n")
                                : item.features || "",
                            })
                          }
                          className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-[#c6a75e]"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => remove(item._id)}
                          className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <form
            onSubmit={submit}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#161616] p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl">
                {editing._id ? "Edit record" : "New record"}
              </h2>
              <button type="button" onClick={() => setEditing(null)}>
                <X />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {config.fields.map((field) => (
                <label
                  key={field.key}
                  className={`${
                    field.type === "textarea" ? "md:col-span-2" : ""
                  } text-xs uppercase tracking-widest text-white/45`}
                >
                  {field.label}
                  {field.type === "image-upload" ? (
                    <div className="mt-2 rounded-xl border-2 border-dashed border-white/15 p-4 text-center transition hover:border-[#c6a75e]" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); uploadServiceImage(e.dataTransfer.files?.[0]); }}>
                      <input type="file" accept="image/*" className="hidden" id="service-image-upload" onChange={(e) => uploadServiceImage(e.target.files?.[0])} />
                      {editing[field.key] ? <img src={editing[field.key]} alt="Service preview" className="mx-auto mb-3 h-32 w-full rounded-lg object-cover" /> : <UploadCloud className="mx-auto mb-2 text-[#c6a75e]" />}
                      <label htmlFor="service-image-upload" className="cursor-pointer text-xs normal-case tracking-normal text-white/60">{uploadingImage ? "Uploading to ImageKit…" : "Drag & drop an image here, or click to choose"}</label>
                    </div>
                  ) : field.type === "textarea" ? (
                    <textarea
                      required={field.required}
                      value={editing[field.key] || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, [field.key]: e.target.value })
                      }
                      className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#c6a75e]"
                    />
                  ) : field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(editing[field.key])}
                      onChange={(e) =>
                        setEditing({ ...editing, [field.key]: e.target.checked })
                      }
                      className="ml-3 accent-[#c6a75e]"
                    />
                  ) : (
                    <input
                      required={field.required}
                      type={field.type || "text"}
                      value={editing[field.key] || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, [field.key]: e.target.value })
                      }
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#c6a75e]"
                    />
                  )}
                </label>
              ))}
            </div>
            <button
              disabled={saving}
              className="mt-6 w-full rounded-xl bg-[#c6a75e] py-3 text-sm font-semibold text-black hover:bg-[#b5964d] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save record"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
