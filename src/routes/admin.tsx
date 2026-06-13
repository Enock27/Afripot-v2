import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { updateEvents, getEvents } from "@/lib/events.server";
import { Event } from "@/data/eventsData";

export const Route = createFileRoute("/admin")({
  loader: () => getEvents(),
  component: AdminPage,
});

function AdminPage() {
  const initialEvents = Route.useLoaderData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [editingEvent, setEditEvent] = useState<Partial<Event> | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Simple hardcoded password
  const ADMIN_PASSWORD = "admin"; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const handleSaveToDatabase = async (updatedEvents: Event[]) => {
    setIsSaving(true);
    try {
      // Sort events chronologically: nearest event first
      const sorted = [...updatedEvents].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      await updateEvents({ data: sorted });
      setEvents(sorted);
    } catch (error) {
      alert("⚠️ DATA SYNC ERROR: Changes were not saved to the server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event? This will update the public site immediately.")) {
      const filtered = events.filter(e => e.id !== id);
      handleSaveToDatabase(filtered);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    let updatedEvents: Event[];
    
    // We no longer need manual 'isFeatured' logic because the system
    // will auto-feature the nearest event based on the sorted list.
    const cleanedEvent = { ...editingEvent as Event };

    if (editingEvent.id) {
      updatedEvents = events.map(ev => 
        ev.id === editingEvent.id ? cleanedEvent : ev
      );
    } else {
      const newEvent: Event = {
        ...cleanedEvent,
        id: Date.now().toString(),
      };
      updatedEvents = [...events, newEvent];
    }
    
    await handleSaveToDatabase(updatedEvents);
    setEditEvent(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="font-serif text-3xl text-red-600 mb-8 tracking-widest uppercase">Admin Access</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
          <input 
            type="password" 
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 p-4 rounded text-center outline-none focus:border-red-600 transition-colors"
          />
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded transition-all">
            UNLOCK DASHBOARD
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <SiteHeader />
      
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-zinc-800 pb-8 gap-6">
          <div>
            <h1 className="font-serif text-4xl text-red-600 tracking-wider mb-2">EVENT MANAGER</h1>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
              Automatic Chronological Ordering (Nearest First)
            </p>
          </div>
          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            {isSaving && <span className="text-[10px] text-zinc-500 animate-pulse uppercase tracking-widest">Syncing with site...</span>}
            <button 
              onClick={() => setEditEvent({ title: "", date: "", time: "", location: "", description: "", image: "" })}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-xs font-bold transition-all w-full md:w-auto"
            >
              + ADD NEW EVENT
            </button>
            <button 
              onClick={() => navigate({ to: "/events" })}
              className="border border-zinc-800 hover:bg-zinc-900 px-6 py-2 rounded text-xs font-bold transition-all w-full md:w-auto"
            >
              VIEW PUBLIC SITE
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div key={event.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-600 transition-all flex flex-col">
              <div className="h-40 bg-zinc-800 relative">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
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
                    <button onClick={() => setEditEvent(event)} className="text-zinc-400 hover:text-white p-2 text-sm" title="Edit">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="text-zinc-400 hover:text-red-600 p-2 text-sm" title="Delete">
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

        {/* View Modal */}
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

        {/* Edit/Add Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl p-6 sm:p-10 rounded-2xl relative my-auto max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
              <button 
                onClick={() => setEditEvent(null)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white z-10 p-2"
              >
                ✕
              </button>
              <h2 className="font-serif text-2xl text-red-600 mb-8 tracking-widest uppercase">
                {editingEvent.id ? "Edit Event Details" : "Create New Event"}
              </h2>
              
              <form onSubmit={handleSaveEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div className="md:col-span-2">
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Event Title</label>
                  <input 
                    required
                    placeholder="e.g., ANNUAL GALA NIGHT"
                    value={editingEvent.title}
                    onChange={(e) => setEditEvent({...editingEvent, title: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors"
                  />
                </div>
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
                <div className="md:col-span-2">
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Venue Location</label>
                  <input 
                    required
                    placeholder="Kigali, Rwanda"
                    value={editingEvent.location}
                    onChange={(e) => setEditEvent({...editingEvent, location: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Image URL or Path</label>
                  <input 
                    required
                    placeholder="/events/image-name.jpg"
                    value={editingEvent.image}
                    onChange={(e) => setEditEvent({...editingEvent, image: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2 uppercase">Short Description</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Describe the cinematic experience..."
                    value={editingEvent.description}
                    onChange={(e) => setEditEvent({...editingEvent, description: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm outline-none focus:border-red-600 transition-colors resize-none"
                  />
                </div>
                <div className="md:col-span-2 mt-4 flex flex-col sm:flex-row gap-4">
                  <button type="submit" disabled={isSaving} className="flex-1 bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold text-sm tracking-widest transition-all disabled:opacity-50">
                    {isSaving ? "SAVING CHANGES..." : "SAVE & PUBLISH"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditEvent(null)}
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
