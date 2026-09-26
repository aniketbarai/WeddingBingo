import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud, Save, Plus, Trash2 } from "lucide-react";
import { api } from "../../api/client.js";

const emptyHero = { subtitle: "", ctaLabel: "", backgroundImage: "", rotatingPhrases: [] };
const emptyHighlight = { tag: "", title: "", text: "" };
const emptyCategoryItem = { image: "", alt: "", caption: "" };

const CATEGORY_TABS = [
  { key: "wedding", label: "Wedding" },
  { key: "preWedding", label: "Pre-Wedding" },
  { key: "film", label: "Film" },
];

function ImageDropzone({ src, onFilePick, aspect = "aspect-[4/3]", label = "Drag & drop or click to select" }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const pick = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    onFilePick(f);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); pick(e.dataTransfer.files?.[0]); }}
      onClick={() => fileInputRef.current?.click()}
      className={`relative ${aspect} cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
        isDragging ? "border-[#C6A75E] bg-[#C6A75E]/5" : "border-white/15 hover:border-white/30"
      }`}
    >
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
          <UploadCloud size={22} className="text-[#C6A75E]" />
          <p className="text-xs">{label}</p>
        </div>
      )}
      {src && (
        <div className="absolute inset-0 flex items-end justify-center bg-black/0 opacity-0 transition-opacity hover:opacity-100 hover:bg-black/50">
          <span className="mb-3 rounded-full bg-black/70 px-3 py-1 text-[10px] uppercase tracking-wide">Click to replace</span>
        </div>
      )}
    </div>
  );
}

export default function AdminHomeContent() {
  const [hero, setHero] = useState(emptyHero);
  const [highlights, setHighlights] = useState([emptyHighlight, emptyHighlight, emptyHighlight]);
  const [categories, setCategories] = useState({
    wedding: { items: [emptyCategoryItem, emptyCategoryItem] },
    preWedding: { items: [emptyCategoryItem, emptyCategoryItem] },
    film: { items: [emptyCategoryItem, emptyCategoryItem] },
  });
  const [activeTab, setActiveTab] = useState("wedding");
  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState("");
  const [categoryFiles, setCategoryFiles] = useState({}); // { "wedding_0": File, ... }
  const [categoryPreviews, setCategoryPreviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/home-content");
      const content = data?.content;
      if (content) {
        setHero({ ...emptyHero, ...content.hero });
        setHighlights(content.highlights?.length ? content.highlights : [emptyHighlight, emptyHighlight, emptyHighlight]);
        setCategories({
          wedding: { items: content.categories?.wedding?.items?.length ? content.categories.wedding.items : [emptyCategoryItem, emptyCategoryItem] },
          preWedding: { items: content.categories?.preWedding?.items?.length ? content.categories.preWedding.items : [emptyCategoryItem, emptyCategoryItem] },
          film: { items: content.categories?.film?.items?.length ? content.categories.film.items : [emptyCategoryItem, emptyCategoryItem] },
        });
      }
    } catch {
      // api client already toasts the error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const onHeroField = (field, value) => setHero((current) => ({ ...current, [field]: value }));

  const onPhraseChange = (index, field, value) => {
    setHero((current) => {
      const rotatingPhrases = [...current.rotatingPhrases];
      rotatingPhrases[index] = { ...rotatingPhrases[index], [field]: value };
      return { ...current, rotatingPhrases };
    });
  };

  const addPhrase = () => {
    setHero((current) => ({ ...current, rotatingPhrases: [...current.rotatingPhrases, { text: "", color: "gold" }] }));
  };

  const removePhrase = (index) => {
    setHero((current) => ({ ...current, rotatingPhrases: current.rotatingPhrases.filter((_, i) => i !== index) }));
  };

  const onHeroFilePick = (file) => {
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const onHighlightChange = (index, field, value) => {
    setHighlights((current) => {
      const next = [...current];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const onCategoryItemChange = (categoryKey, index, field, value) => {
    setCategories((current) => {
      const items = [...current[categoryKey].items];
      items[index] = { ...items[index], [field]: value };
      return { ...current, [categoryKey]: { items } };
    });
  };

  const onCategoryFilePick = (categoryKey, index, file) => {
    const slotKey = `${categoryKey}_${index}`;
    setCategoryFiles((current) => ({ ...current, [slotKey]: file }));
    setCategoryPreviews((current) => ({ ...current, [slotKey]: URL.createObjectURL(file) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("subtitle", hero.subtitle || "");
      formData.append("ctaLabel", hero.ctaLabel || "");
      formData.append("rotatingPhrases", JSON.stringify(hero.rotatingPhrases || []));
      formData.append("highlights", JSON.stringify(highlights));
      formData.append(
        "categoryText",
        JSON.stringify({
          wedding: categories.wedding.items.map(({ alt, caption }) => ({ alt, caption })),
          preWedding: categories.preWedding.items.map(({ alt, caption }) => ({ alt, caption })),
          film: categories.film.items.map(({ alt, caption }) => ({ alt, caption })),
        }),
      );
      if (heroFile) formData.append("heroImage", heroFile);
      Object.entries(categoryFiles).forEach(([slotKey, file]) => formData.append(slotKey, file));

      const { data } = await api.put("/api/admin/home-content", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data?.content) {
        setHero({ ...emptyHero, ...data.content.hero });
        setHighlights(data.content.highlights || highlights);
        setCategories({
          wedding: { items: data.content.categories?.wedding?.items || categories.wedding.items },
          preWedding: { items: data.content.categories?.preWedding?.items || categories.preWedding.items },
          film: { items: data.content.categories?.film?.items || categories.film.items },
        });
      }
      setHeroFile(null);
      setHeroPreview("");
      setCategoryFiles({});
      setCategoryPreviews({});
      toast.success("Homepage content updated");
    } catch {
      // api client already toasts the error
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl">
        <div className="h-8 w-64 animate-pulse rounded bg-white/5" />
        <div className="mt-8 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="p-8 max-w-5xl pb-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Homepage — Hero &amp; Highlights</h1>
          <p className="mt-1 text-sm text-gray-400">
            Edit everything above the sliding Banner section: the hero text/photo, the 3 story highlight cards, and the Wedding / Pre-Wedding / Film preview grids.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#C6A75E] px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* HERO */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#C6A75E]">Hero Section</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <ImageDropzone
              src={heroPreview || hero.backgroundImage}
              onFilePick={onHeroFilePick}
              aspect="aspect-[16/10]"
              label="Hero background — drag & drop or click"
            />
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">Subtitle (under the headline)</label>
                <textarea
                  value={hero.subtitle}
                  onChange={(e) => onHeroField("subtitle", e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">Button label</label>
                <input
                  type="text"
                  value={hero.ctaLabel}
                  onChange={(e) => onHeroField("ctaLabel", e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-gray-500">Rotating headline phrases</label>
              <button type="button" onClick={addPhrase} className="flex items-center gap-1 text-xs text-[#C6A75E] hover:text-white">
                <Plus size={14} /> Add phrase
              </button>
            </div>
            <div className="space-y-2">
              {hero.rotatingPhrases.map((phrase, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phrase.text}
                    onChange={(e) => onPhraseChange(index, "text", e.target.value)}
                    placeholder="One Moment at a Time"
                    className="flex-1 rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#C6A75E] focus:outline-none"
                  />
                  <select
                    value={phrase.color}
                    onChange={(e) => onPhraseChange(index, "color", e.target.value)}
                    className="rounded-lg border border-white/15 bg-black px-2 py-2 text-sm focus:border-[#C6A75E] focus:outline-none"
                  >
                    <option value="gold">Gold</option>
                    <option value="white">White</option>
                  </select>
                  <button type="button" onClick={() => removePhrase(index)} className="text-gray-500 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HIGHLIGHTS */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#C6A75E]">Story Highlights (3 cards)</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item, index) => (
              <div key={index} className="space-y-2 rounded-xl border border-white/10 p-4">
                <input
                  type="text"
                  value={item.tag}
                  onChange={(e) => onHighlightChange(index, "tag", e.target.value)}
                  placeholder="THE ORIGIN"
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-xs uppercase tracking-widest focus:border-[#C6A75E] focus:outline-none"
                />
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => onHighlightChange(index, "title", e.target.value)}
                  placeholder="Our Beginning"
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#C6A75E] focus:outline-none"
                />
                <textarea
                  value={item.text}
                  onChange={(e) => onHighlightChange(index, "text", e.target.value)}
                  rows={5}
                  placeholder="Card paragraph..."
                  className="w-full resize-none rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#C6A75E] focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORY PREVIEWS */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#C6A75E]">Category Preview Grids</h2>
          <div className="mb-4 flex gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                  activeTab === tab.key ? "bg-[#C6A75E] text-black" : "border border-white/15 text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {categories[activeTab].items.map((item, index) => {
              const slotKey = `${activeTab}_${index}`;
              return (
                <div key={index} className="space-y-3">
                  <ImageDropzone
                    src={categoryPreviews[slotKey] || item.image}
                    onFilePick={(file) => onCategoryFilePick(activeTab, index, file)}
                  />
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(e) => onCategoryItemChange(activeTab, index, "alt", e.target.value)}
                    placeholder="Alt text (for accessibility/SEO)"
                    className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#C6A75E] focus:outline-none"
                  />
                  <textarea
                    value={item.caption}
                    onChange={(e) => onCategoryItemChange(activeTab, index, "caption", e.target.value)}
                    rows={2}
                    placeholder="Caption shown in the lightbox"
                    className="w-full resize-none rounded-lg border border-white/15 bg-black px-3 py-2 text-sm focus:border-[#C6A75E] focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
}
