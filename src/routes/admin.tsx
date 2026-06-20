import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { updateEvents, getEvents } from "@/lib/events.server";
import { getGallery, updateGallery, uploadImage } from "@/lib/gallery.server";
import { Event } from "@/data/eventsData";
import { GalleryItem } from "@/data/galleryData";
import { Eye, EyeOff } from "lucide-react";
import { sha256 } from "js-sha256";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const [events, gallery] = await Promise.all([getEvents(), getGallery()]);
    return { events, gallery };
  },
  component: AdminPage,
});

/**
 * UTILITY: Hash a string using SHA-256
 */
async function hashPassword(password: string) {
  // Use js-sha256 for consistent hashing across environments (even non-HTTPS)
  return sha256(password);
}

function AdminPage() {
  const initialData = Route.useLoaderData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState<"events" | "gallery">("events");
  
  // Events state
  const [events, setEvents] = useState<Event[]>(initialData.events);
  const [editingEvent, setEditEvent] = useState<Partial<Event> | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  
  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialData.gallery);
  const [editingGallery, setEditGallery] = useState<Partial<GalleryItem> | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<{name: string, data: string} | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  // VERIFIED SHA-256 hash of "karuta#@ABC123"
  const ADMIN_PASSWORD_HASH = "7fc889c4d4bdaa1ef90ad8aa56a5954452c190a0b65cdd0637bc097da9f9cd96";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    try {
      const enteredHash = await hashPassword(password.trim());
      if (enteredHash === ADMIN_PASSWORD_HASH) {
        setIsAuthenticated(true);
      } else {
        alert("Invalid credentials. Please try again.");
        setPassword("");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Authentication failed.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // ---- EVENTS HANDLERS ----
  const handleSaveEventsToDatabase = async (updatedEvents: Event[]) => {
    setIsSaving(true);
    try {
      const sorted = [...updatedEvents].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateA - dateB;
      });
      await updateEvents({ data: sorted });
      setEvents(sorted);
    } catch (error) {
      alert(`⚠️ DATA SYNC ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Are you sure you want to delete this event? This will update the public site immediately.")) {
      const filtered = events.filter(e => e.id !== id);
      handleSaveEventsToDatabase(filtered);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    let updatedEvents: Event[];
    const cleanedEvent = { ...editingEvent as Event };

    if (editingEvent.id) {
      updatedEvents = events.map(ev => ev.id === editingEvent.id ? cleanedEvent : ev);
    } else {
      const newEvent: Event = { ...cleanedEvent, id: Date.now().toString() };
      updatedEvents = [...events, newEvent];
    }
    await handleSaveEventsToDatabase(updatedEvents);
    setEditEvent(null);
  };

  // ---- GALLERY HANDLERS ----
  const handleSaveGalleryToDatabase = async (updatedGallery: GalleryItem[]) => {
    setIsSaving(true);
    try {
      await updateGallery({ data: updatedGallery });
      setGalleryItems(updatedGallery);
    } catch (error) {
      alert(`⚠️ DATA SYNC ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGallery = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      const filtered = galleryItems.filter(g => g.id !== id);
      handleSaveGalleryToDatabase(filtered);
    }
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;

    setIsSaving(true);
    let finalImageUrl = editingGallery.image || "";

    try {
      if (selectedImageFile) {
        const result = await uploadImage({ data: { fileName: selectedImageFile.name, base64Data: selectedImageFile.data } });
        finalImageUrl = result.url;
      }

      let updatedGallery: GalleryItem[];
      const cleanedItem = { ...editingGallery as GalleryItem, image: finalImageUrl };

      if (editingGallery.id) {
        updatedGallery = galleryItems.map(g => g.id === editingGallery.id ? cleanedItem : g);
      } else {
        const newItem: GalleryItem = { ...cleanedItem, id: Date.now().toString() };
        updatedGallery = [...galleryItems, newItem];
      }
      await handleSaveGalleryToDatabase(updatedGallery);
      setEditGallery(null);
      setSelectedImageFile(null);
    } catch (error) {
      alert("Error saving gallery item.");
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      setSelectedImageFile({ name: file.name, data });
      // Clear the text input when a file is chosen
      setEditGallery(prev => prev ? { ...prev, image: "" } : null);
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="font-serif text-3xl text-red-600 mb-8 tracking-widest uppercase text-center">Admin Access</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isAuthenticating}
              className="w-full bg-zinc-900 border border-zinc-800 p-4 pr-12 rounded text-center outline-none focus:border-red-600 transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button 
            type="submit" 
            disabled={isAuthenticating}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded transition-all disabled:opacity-50 tracking-widest"
          >
            {isAuthenticating ? "VERIFYING..." : "UNLOCK DASHBOARD"}
          </button>
        </form>
        <p className="mt-8 text-[10px] text-zinc-600 uppercase tracking-widest">Protected by SHA-256 Encryption</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <SiteHeader />
      
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-zinc-800 pb-8 gap-6">
          <div>
            <h1 className="font-serif text-4xl text-red-600 tracking-wider mb-2">ADMIN DASHBOARD</h1>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => setActiveTab("events")}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-all ${activeTab === "events" ? "bg-red-600 text-white" : "text-zinc-500 hover:bg-zinc-900"}`}
              >
                Events Manager
              </button>
              <button 
                onClick={() => setActiveTab("gallery")}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-all ${activeTab === "gallery" ? "bg-red-600 text-white" : "text-zinc-500 hover:bg-zinc-900"}`}
              >
                Gallery Manager
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            {isSaving && <span className="text-[10px] text-zinc-500 animate-pulse uppercase tracking-widest">Syncing with site...</span>}
            {activeTab === "events" ? (
              <button 
                onClick={() => {
                  setEditEvent({ title: "", date: "", time: "", location: "", description: "", image: "" });
                  setFormStep(1);
                }}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-xs font-bold transition-all w-full md:w-auto"
              >
                + ADD NEW EVENT
              </button>
            ) : (
              <button 
                onClick={() => setEditGallery({ title: "", category: "Food", image: "" })}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-xs font-bold transition-all w-full md:w-auto"
              >
                + ADD NEW IMAGE
              </button>
            )}
            <button 
              onClick={() => navigate({ to: activeTab === "events" ? "/events" : "/gallery" })}
              className="border border-zinc-800 hover:bg-zinc-900 px-6 py-2 rounded text-xs font-bold transition-all w-full md:w-auto"
            >
              VIEW PUBLIC SITE
            </button>
          </div>
        </div>

        {/* --- EVENTS DASHBOARD --- */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={event.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-600 transition-all flex flex-col">
                <div className="h-40 bg-black relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                  {index === 0 && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">AUTO-FEATURED</span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-serif text-lg mb-2">{event.title}</h3>
                  <p className="text-zinc-500 text-xs mb-4 line-clamp-2">{event.description}</p>
                  <div className="mt-auto pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                    <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                      {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} @ {event.time}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setViewingEvent(event)} 
                        className="text-red-600 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors mr-2"
                      >
                        View Details →
                      </button>
                      <button onClick={() => {
                        setEditEvent(event);
                        setFormStep(1);
                      }} className="text-zinc-400 hover:text-white p-2 text-sm" title="Edit">
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="text-zinc-400 hover:text-red-600 p-2 text-sm" title="Delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-xl">
                <p className="text-zinc-500 uppercase tracking-widest text-sm">No events listed. Click "Add New Event" to begin.</p>
              </div>
            )}
          </div>
        )}

        {/* --- GALLERY DASHBOARD --- */}
        {activeTab === "gallery" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-600 transition-all flex flex-col">
                <div className="h-48 bg-black relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider">{item.category}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <h3 className="font-serif text-lg">{item.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setEditGallery(item)} className="text-zinc-400 hover:text-white p-2 text-sm" title="Edit">
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteGallery(item.id)} className="text-zinc-400 hover:text-red-600 p-2 text-sm" title="Delete">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {galleryItems.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-xl">
                <p className="text-zinc-500 uppercase tracking-widest text-sm">No images in gallery. Click "Add New Image" to begin.</p>
              </div>
            )}
          </div>
        )}

        {/* View Modal (Events) */}
        {viewingEvent && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl rounded-2xl relative overflow-hidden my-auto shadow-2xl">
              <button 
                onClick={() => setViewingEvent(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white z-20 bg-black/20 backdrop-blur-md p-2 rounded-full transition-all"
              >
                ✕
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-full min-h-[300px] relative">
                  <img src={viewingEvent.image} alt={viewingEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent md:bg-gradient-to-r" />
                </div>
                
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                  <h2 className="font-serif text-3xl sm:text-4xl text-white mb-6 leading-tight uppercase tracking-wider">{viewingEvent.title}</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider">
                        {new Date(viewingEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400">
                      <span className="text-lg">🕒</span>
                      <span className="text-sm font-medium uppercase tracking-widest">{viewingEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400">
                      <span className="text-lg">📍</span>
                      <span className="text-sm font-medium uppercase tracking-widest">{viewingEvent.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-10 font-light">
                    {viewingEvent.description}
                  </p>
                  
                  <button 
                    onClick={() => {
                      setEditEvent(viewingEvent);
                      setViewingEvent(null);
                    }}
                    className="w-full bg-white text-black hover:bg-red-600 hover:text-white py-4 rounded-xl font-black text-[10px] tracking-[0.3em] uppercase transition-all shadow-lg"
                  >
                    Edit This Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Add Modal (Events) */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg p-6 sm:p-10 rounded-2xl relative my-auto shadow-2xl">
              <button 
                onClick={() => setEditEvent(null)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white z-10 p-2"
              >
                ✕
              </button>
              
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${formStep === 1 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>1</div>
                <div className="h-px w-8 bg-zinc-800" />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${formStep === 2 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>2</div>
                <h2 className="font-serif text-xl text-red-600 tracking-widest uppercase ml-4">
                  {editingEvent.id ? "Edit Event" : "New Event"}
                </h2>
              </div>
              
              <form onSubmit={(e) => {
                if (formStep === 1) {
                  e.preventDefault();
                  setFormStep(2);
                } else {
                  handleSaveEvent(e);
                }
              }} className="space-y-6">
                
                {formStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Event Title</label>
                      <input 
                        required
                        placeholder="e.g., ANNUAL GALA NIGHT"
                        value={editingEvent.title}
                        onChange={(e) => setEditEvent({...editingEvent, title: e.target.value})}
                        className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Pick Date</label>
                        <input 
                          required
                          type="date"
                          value={editingEvent.date}
                          onChange={(e) => setEditEvent({...editingEvent, date: e.target.value})}
                          className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors [color-scheme:dark]"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Pick Time</label>
                        <input 
                          required
                          type="time"
                          value={editingEvent.time}
                          onChange={(e) => setEditEvent({...editingEvent, time: e.target.value})}
                          className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors [color-scheme:dark]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Venue Location</label>
                      <input 
                        required
                        placeholder="Kigali, Rwanda"
                        value={editingEvent.location}
                        onChange={(e) => setEditEvent({...editingEvent, location: e.target.value})}
                        className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Image URL or Path</label>
                      <input 
                        required
                        placeholder="/events/image-name.jpg"
                        value={editingEvent.image}
                        onChange={(e) => setEditEvent({...editingEvent, image: e.target.value})}
                        className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Short Description</label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Describe the cinematic experience..."
                        value={editingEvent.description}
                        onChange={(e) => setEditEvent({...editingEvent, description: e.target.value})}
                        className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-800/50">
                  {formStep === 1 ? (
                    <>
                      <button 
                        type="submit" 
                        className="flex-1 bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold text-sm tracking-widest transition-all"
                      >
                        NEXT STEP →
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditEvent(null)}
                        className="flex-1 border border-zinc-800 hover:bg-zinc-800 py-4 rounded-xl text-sm font-bold tracking-widest transition-all"
                      >
                        DISCARD
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        type="submit" 
                        disabled={isSaving} 
                        className="flex-1 bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold text-sm tracking-widest transition-all disabled:opacity-50"
                      >
                        {isSaving ? "SAVING..." : "SAVE & PUBLISH"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="flex-1 border border-zinc-800 hover:bg-zinc-800 py-4 rounded-xl text-sm font-bold tracking-widest transition-all"
                      >
                        ← BACK
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit/Add Modal (Gallery) */}
        {editingGallery && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg p-6 sm:p-10 rounded-2xl relative my-auto shadow-2xl">
              <button 
                onClick={() => setEditGallery(null)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white z-10 p-2"
              >
                ✕
              </button>
              
              <h2 className="font-serif text-xl text-red-600 tracking-widest uppercase mb-8">
                {editingGallery.id ? "Edit Image" : "New Image"}
              </h2>
              
              <form onSubmit={handleSaveGallery} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Image Title</label>
                  <input 
                    required
                    placeholder="e.g., Jollof Rice"
                    value={editingGallery.title}
                    onChange={(e) => setEditGallery({...editingGallery, title: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Category</label>
                  <select
                    required
                    value={editingGallery.category}
                    onChange={(e) => setEditGallery({...editingGallery, category: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors"
                  >
                    <option value="Food">Food</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Image Upload</label>
                  <div className="flex flex-col gap-3">
                    <input 
                      required={!editingGallery.id && !selectedImageFile}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700"
                    />
                  </div>
                  {selectedImageFile && (
                    <p className="mt-2 text-[10px] text-green-500 uppercase tracking-widest">
                      File Selected: {selectedImageFile.name}
                    </p>
                  )}
                  {editingGallery.image && !selectedImageFile && (
                    <p className="mt-2 text-[10px] text-zinc-500 uppercase tracking-widest">
                      Current Image: {editingGallery.image}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-800/50">
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="flex-1 bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold text-sm tracking-widest transition-all disabled:opacity-50"
                  >
                    {isSaving ? "SAVING..." : "SAVE & PUBLISH"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setEditGallery(null); setSelectedImageFile(null); }}
                    className="flex-1 border border-zinc-800 hover:bg-zinc-800 py-4 rounded-xl text-sm font-bold tracking-widest transition-all"
                  >
                    DISCARD
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <SiteFooter />
    </div>
  );
}
