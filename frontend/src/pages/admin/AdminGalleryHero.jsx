import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Save, UploadCloud, X } from "lucide-react";
import { api } from "../../api/client.js";

function DropZone({ label, accept, preview, onFile, onClear, kind }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-widest text-gray-500">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); onFile(e.dataTransfer.files?.[0]); }}
        onClick={() => inputRef.current?.click()}
        className={`relative aspect-video cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          dragging ? "border-[#C6A75E] bg-[#C6A75E]/5" : "border-white/15 hover:border-white/30"
        }`}
      >
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        {preview ? (
          kind === "video" ? (
            <video src={preview} className="h-full w-full object-cover" muted controls />
          ) : (
            <img src={preview} alt={label} className="h-full w-full object-cover" />
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
            <UploadCloud size={24} className="text-[#C6A75E]" />
            <p className="text-xs">Drag &amp; drop or click to select</p>
          </div>
        )}
        {preview && onClear && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 hover:bg-black"
            aria-label={`Remove ${label}`}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminGalleryHero() {
  const [coupleName, setCoupleName] = useState("");
  const [poster, setPoster] = useState("");
  const [video, setVideo] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/gallery-hero");
      if (data?.hero) {
        setCoupleName(data.hero.coupleName || "");
        setPoster(data.hero.poster || "");
        setVideo(data.hero.video || "");
      }
    } catch {
      // api client already toasts
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const pickPoster = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };
  const pickVideo = (file) => {
    if (!file || !file.type.startsWith("video/")) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setRemoveVideo(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("coupleName", coupleName);
      if (posterFile) formData.append("poster", posterFile);
      if (videoFile) formData.append("video", videoFile);
      if (removeVideo) formData.append("removeVideo", "true");

      const { data } = await api.put("/api/admin/gallery-hero", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data?.hero) {
        setPoster(data.hero.poster || "");
        setVideo(data.hero.video || "");
      }
      setPosterFile(null);
      setPosterPreview(null);
      setVideoFile(null);
      setVideoPreview(null);
      setRemoveVideo(false);
      toast.success("Gallery hero updated");
    } catch {
      // api client already toasts
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="h-8 w-56 animate-pulse rounded bg-white/5" />
        <div className="mt-8 h-72 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="p-8 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gallery Hero</h1>
          <p className="mt-1 text-sm text-gray-400">The single fixed banner shown at the top of the Gallery page.</p>
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

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="mb-6">
          <label className="mb-1 block text-[10px] uppercase tracking-widest text-gray-500">Couple name / headline</label>
          <input
            type="text"
            value={coupleName}
            onChange={(e) => setCoupleName(e.target.value)}
            placeholder="Aarav weds Isha"
            className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm focus:border-[#C6A75E] focus:outline-none"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <DropZone
            label="Poster image (shown behind the text, and while the video loads)"
            accept="image/*"
            kind="image"
            preview={posterPreview || poster}
            onFile={pickPoster}
          />
          <DropZone
            label="Background video (optional)"
            accept="video/mp4,video/webm,video/quicktime"
            kind="video"
            preview={videoPreview || (removeVideo ? null : video)}
            onFile={pickVideo}
            onClear={() => {
              setVideoFile(null);
              setVideoPreview(null);
              setRemoveVideo(true);
            }}
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-5 text-gray-400">
        <p className="font-semibold text-gray-300">Recommended size &amp; format</p>
        <p>
          Poster: at least <span className="text-[#C6A75E]">1920×1080px</span> (landscape), JPG/PNG/WebP, up to 10MB.
          Video: <span className="text-[#C6A75E]">1080p (1920×1080)</span>, MP4/WebM/MOV, under 60 seconds, up to 100MB —
          it plays muted and looped, so keep it visually simple.
        </p>
      </div>
    </form>
  );
}
