import { useEffect, useState, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer"
import { 
  Grid, List, Heart, Eye, 
  Image as ImageIcon, Clock, Star, ArrowUpRight, ChevronLeft, ChevronRight, X,
  Instagram, MessageCircle
} from "lucide-react";
import BASE_URL from "../config";

const resolveImageSrc = (src) => (/^https?:\/\//i.test(src) ? src : `${BASE_URL}${src}`);

// Replace these with your actual logo path and WhatsApp link/number
const BRAND_LOGO_SRC = "src/assets/logo_wb.jpg";
const WHATSAPP_LINK = "https://wa.me/9594624646";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [selected, setSelected] = useState(null);
  const [myLikes, setMyLikes] = useState(() => JSON.parse(localStorage.getItem("user_likes") || "[]"));
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/images?page=${page}&limit=12&sort=${sortBy}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data?.images)) {
        setImages(data.images);
        setTotalPages(data.pages || 1);
      } else {
        console.error("Unexpected images response:", data);
        setImages([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setImages([]);
      setTotalPages(1);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [page, sortBy]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleLike = async (id, e) => {
    if (e) e.stopPropagation();
    if (myLikes.includes(id)) return;
    try {
      const res = await fetch(`${BASE_URL}/api/like/${id}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        const updatedLikes = [...myLikes, id];
        setMyLikes(updatedLikes);
        localStorage.setItem("user_likes", JSON.stringify(updatedLikes));
        setImages(prev => prev.map(img => img._id === id ? { ...img, likes: data.newLikes } : img));
        if (selected?._id === id) setSelected(prev => ({ ...prev, likes: data.newLikes }));
      }
    } catch (err) { console.error(err); }
  };

  const handleOpen = async (img) => {
    setSelected(img);
    try {
      const res = await fetch(`${BASE_URL}/api/click/${img._id}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setImages(prev => prev.map(item => item._id === img._id ? { ...item, clicks: data.clicks } : item));
        setSelected(prev => ({ ...prev, clicks: data.clicks }));
      }
    } catch (err) { console.error(err); }
  };

  return (
    <>
    <div data-navbar-theme="light" className="pt-16 sm:pt-20 lg:pt-20 bg-[#F8FAFC] font-sans text-slate-700 min-h-screen">
      <div className="flex h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] overflow-hidden">
        
        {/* GOOGLE DRIVE SIDEBAR */}
        <aside className="w-60 border-r border-slate-200/80 bg-white p-4 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="space-y-5">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                <ImageIcon size={18} />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900 text-xs leading-none">Gallery</h1>
                <span className="text-[10px] text-slate-400 font-medium">Wedding Bingo</span>
              </div>
            </div>

            <nav className="space-y-1">
              <button 
                onClick={() => { setSortBy("newest"); setPage(1); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  sortBy === "newest" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Clock size={16} /> Recent Photos
              </button>
              <button 
                onClick={() => { setSortBy("popular"); setPage(1); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  sortBy === "popular" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Star size={16} /> Popular Media
              </button>
            </nav>

            {/* SOCIAL CARDS SECTION */}
            <div className="space-y-2 pt-1">
              {/* INSTAGRAM PROFILE CARD */}
              <a
                href="https://instagram.com/wedding_bingo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative w-full flex items-center gap-3 p-2 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white hover:from-pink-50/40 hover:to-purple-50/40 hover:border-pink-200/60 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-sm group-hover:rotate-6 transition-transform duration-300">
                    <img 
                      src={BRAND_LOGO_SRC} 
                      alt="Wedding Bingo Instagram"
                      className="w-full h-full object-cover rounded-full bg-white"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-gradient-to-tr from-amber-500 to-purple-600 text-white p-0.5 rounded-full ring-2 ring-white">
                    <Instagram size={9} />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="text-[11px] font-bold text-slate-800 truncate group-hover:text-pink-600 transition-colors">
                    @wedding_bingo
                  </h4>
                  <p className="text-[9px] font-medium text-slate-400 truncate">
                    Follow on Instagram
                  </p>
                </div>

                <ArrowUpRight 
                  size={13} 
                  className="absolute top-2 right-2 text-slate-300 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-pink-600 transition-all duration-300" 
                />
              </a>

              {/* WHATSAPP PROFILE CARD */}
              <a
                href={WHATSAPP_LINK}
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative w-full flex items-center gap-3 p-2 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white hover:from-emerald-50/40 hover:to-teal-50/40 hover:border-emerald-200/60 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-emerald-400 to-green-600 shadow-sm group-hover:-rotate-6 transition-transform duration-300">
                    <img 
                      src={BRAND_LOGO_SRC} 
                      alt="Wedding Bingo WhatsApp"
                      className="w-full h-full object-cover rounded-full bg-white"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white">
                    <MessageCircle size={9} />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="text-[11px] font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                    Wedding Bingo
                  </h4>
                  <p className="text-[9px] font-medium text-slate-400 truncate">
                    Chat on WhatsApp
                  </p>
                </div>

                <ArrowUpRight 
                  size={13} 
                  className="absolute top-2 right-2 text-slate-300 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-emerald-600 transition-all duration-300" 
                />
              </a>
            </div>
          </div>

          {/* STORAGE COUNTER */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
              <span>Storage</span>
              <span className="text-slate-900 font-semibold">{images.length} items</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-2/3" />
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* HEADER (No Searchbar) */}
          <header className="h-14 border-b border-slate-200/80 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">My Drive</span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-medium text-slate-500 capitalize">{sortBy}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button 
                onClick={() => setViewMode("grid")} 
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Grid size={16} />
              </button>
              <button 
                onClick={() => setViewMode("list")} 
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
              >
                <List size={16} />
              </button>
            </div>
          </header>

          {/* GALLERY SCROLL SECTION */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Files</h2>
              <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img) => (
                  <motion.div
                    key={img._id}
                    layout
                    onClick={() => handleOpen(img)}
                    className="group bg-white border border-slate-200/80 rounded-xl p-2.5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative"
                  >
                    <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 mb-2.5 relative">
                      <img 
                        src={resolveImageSrc(img.src)} 
                        loading="lazy" 
                        alt="Drive item"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <ImageIcon size={14} className="text-blue-500 shrink-0" />
                        <span className="text-xs font-medium text-slate-700 truncate">IMG_{img._id.slice(-4)}.jpg</span>
                      </div>
                      <button 
                        onClick={(e) => handleLike(img._id, e)}
                        className={`p-1 rounded-full transition-colors ${myLikes.includes(img._id) ? "text-rose-500" : "text-slate-300 hover:text-rose-500"}`}
                      >
                        <Heart size={14} fill={myLikes.includes(img._id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="bg-white rounded-xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
                {images.map((img) => (
                  <div 
                    key={img._id} 
                    onClick={() => handleOpen(img)}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={resolveImageSrc(img.src)} className="w-9 h-9 rounded-md object-cover" alt="thumbnail" />
                      <div className="flex items-center gap-2">
                        <ImageIcon size={14} className="text-blue-500" />
                        <span className="text-xs font-semibold text-slate-800">IMG_{img._id.slice(-6)}.jpg</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Heart size={13} className="text-rose-500" /> {img.likes}</span>
                      <span className="flex items-center gap-1"><Eye size={13} /> {img.clicks}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION FOOTER */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-4 pb-8">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-30 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button 
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-30 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </main>
        </div>

        {/* DETAILS MODAL */}
        <AnimatePresence>
          {selected && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex justify-end"
              onClick={() => setSelected(null)}
            >
              <motion.div 
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }}
                className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={16} className="text-blue-600" />
                      <span className="text-xs font-semibold text-slate-800">File Details</span>
                    </div>
                    <button onClick={() => setSelected(null)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="p-5 space-y-5">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                      <img src={resolveImageSrc(selected.src)} className="w-full h-full object-cover" alt="Selected file" />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900 text-xs">IMG_{selected._id}.jpg</h3>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-lg">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Likes</span>
                          <span className="text-slate-800 font-bold">{selected.likes}</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Views</span>
                          <span className="text-slate-800 font-bold">{selected.clicks}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex gap-2">
                  <button 
                    onClick={() => handleLike(selected._id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      myLikes.includes(selected._id) 
                        ? "bg-rose-50 text-rose-600" 
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
                    }`}
                  >
                    <Heart size={14} fill={myLikes.includes(selected._id) ? "currentColor" : "none"} />
                    {myLikes.includes(selected._id) ? "Liked" : "Like Item"}
                  </button>
                  <a 
                    href={resolveImageSrc(selected.src)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl flex items-center justify-center"
                  >
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    <Footer />
  </>
  );
}