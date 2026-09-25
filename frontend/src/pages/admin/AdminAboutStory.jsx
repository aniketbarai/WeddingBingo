import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud, Save } from "lucide-react";
import { api } from "../../api/client.js";

const emptySlide = { eyebrow: "", heading: "", text: "", image: "", alt: "" };

function SlideEditor({ slideKey, title, showEyebrowAndHeading, slide, onTextChange, onFilePick, preview }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const pick = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    onFilePick(slideKey, f);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#C6A75E]">{title}</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Image */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); pick(e.dataTransfer.files?.[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
            isDragging ? "border-[#C6A75E] bg-[#C6A75E]/5" : "border-white/15 hover:border-white/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          {(preview || slide.image) ? (
            <img src={preview || slide.image} alt={slide.alt || title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
              <UploadCloud size={26} className="text-[#C6A75E]" />
              <p className="text-xs">Drag &amp; drop or click to select</p>
            </div>
          )}
          {(preview || slide.image) && (
            <div className="absolute inset-0 flex items-end justify-center bg-black/0 opacity-0 transition-opacity hover:opacity-100 hover:bg-black/50">
              <span className="mb-3 rounded-full bg-black/70 px-3 py-1 text-[10px] uppercase tracking-wide">Click to replace</span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          {showEyebrowAndHeading && (
            <>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">Eyebrow label</label>
                <input
                  type="text"
                  value={slide.eyebrow}
                  onChange={(e) => onTextChange(slideKey, "eyebrow", e.target.value)}
                  placeholder="The Visionary"
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">Heading (name) — shown as "Meet [Name]"</label>
                <input
                  type="text"
                  value={slide.heading}
                  onChange={(e) => onTextChange(slideKey, "heading", e.target.value)}
                  placeholder="Pradeep Jartarghar"
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none"
                />
              </div>
            </>
          )}
          <div className="flex-1">
            <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">
              {showEyebrowAndHeading ? "Paragraph" : "Text / Quote"}
            </label>
            <textarea
              value={slide.text}
              onChange={(e) => onTextChange(slideKey, "text", e.target.value)}
              rows={showEyebrowAndHeading ? 5 : 4}
              placeholder="Slide text..."
              className="h-full w-full resize-none rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAboutStory() {
  const [story, setStory] = useState({ slide1: emptySlide, slide2: emptySlide, slide3: emptySlide });
  const [files, setFiles] = useState({}); // { slide1: File, slide2: File, slide3: File }
  const [previews, setPreviews] = useState({}); // { slide1: objectUrl, ... }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/about-story");
      if (data?.story) {
        setStory({
          slide1: { ...emptySlide, ...data.story.slide1 },
          slide2: { ...emptySlide, ...data.story.slide2 },
          slide3: { ...emptySlide, ...data.story.slide3 },
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

  const onTextChange = (slideKey, field, value) => {
    setStory((current) => ({ ...current, [slideKey]: { ...current[slideKey], [field]: value } }));
  };

  const onFilePick = (slideKey, file) => {
    setFiles((current) => ({ ...current, [slideKey]: file }));
    setPreviews((current) => ({ ...current, [slideKey]: URL.createObjectURL(file) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("slide1Eyebrow", story.slide1.eyebrow || "");
      formData.append("slide1Heading", story.slide1.heading || "");
      formData.append("slide1Text", story.slide1.text || "");
      formData.append("slide2Text", story.slide2.text || "");
      formData.append("slide3Text", story.slide3.text || "");
      if (files.slide1) formData.append("slide1Image", files.slide1);
      if (files.slide2) formData.append("slide2Image", files.slide2);
      if (files.slide3) formData.append("slide3Image", files.slide3);

      const { data } = await api.put("/api/admin/about-story", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data?.story) {
        setStory({
          slide1: { ...emptySlide, ...data.story.slide1 },
          slide2: { ...emptySlide, ...data.story.slide2 },
          slide3: { ...emptySlide, ...data.story.slide3 },
        });
      }
      setFiles({});
      setPreviews({});
      toast.success("About section updated");
    } catch {
      // api client already toasts the error
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl">
        <div className="h-8 w-48 animate-pulse rounded bg-white/5" />
        <div className="mt-8 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="p-8 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">About Story</h1>
          <p className="mt-1 text-sm text-gray-400">
            Edit the text and photo for each of the 3 scrolling slides in the homepage "About" section.
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
        <SlideEditor
          slideKey="slide1"
          title="Slide 1 — The Visionary"
          showEyebrowAndHeading
          slide={story.slide1}
          onTextChange={onTextChange}
          onFilePick={onFilePick}
          preview={previews.slide1}
        />
        <SlideEditor
          slideKey="slide2"
          title="Slide 2"
          showEyebrowAndHeading={false}
          slide={story.slide2}
          onTextChange={onTextChange}
          onFilePick={onFilePick}
          preview={previews.slide2}
        />
        <SlideEditor
          slideKey="slide3"
          title="Slide 3"
          showEyebrowAndHeading={false}
          slide={story.slide3}
          onTextChange={onTextChange}
          onFilePick={onFilePick}
          preview={previews.slide3}
        />
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-gray-400">
        Recommended image size: at least <span className="text-[#C6A75E]">1600×1200px</span> (landscape), JPG/PNG/WebP, up to 10MB.
      </div>
    </form>
  );
}
