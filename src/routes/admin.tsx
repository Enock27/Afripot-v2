import { createFileRoute } from "@tanstack/react-router";
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
  const [isSaving, setIsSaving] = useState(false);

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
      await updateEvents({ data: updatedEvents });
      setEvents(updatedEvents);
    } catch (error) {
      alert("Failed to save to database");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event? This will update the live site immediately.")) {
      const filtered = events.filter(e => e.id !== id);
      handleSaveToDatabase(filtered);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    let updatedEvents: Event[];
    if (editingEvent.id) {
      updatedEvents = events.map(ev => 
        ev.id === editingEvent.id ? (editingEvent as Event) : ev
      );
    } else {
      const newEvent: Event = {
        ...editingEvent as Event,
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
        <div className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-8">
          <div>
            <h1 className="font-serif text-4xl text-red-600 tracking-wider mb-2">EVENT MANAGER</h1>
            <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Live content updates for all viewers</p>
          </div>
          <div className="flex gap-4 items-center">
            {isSaving && <span className="text-xs text-zinc-500 animate-pulse uppercase tracking-widest">Saving changes...</span>}
            <button 
              onClick={() => setEditEvent({ title: "", date: "", time: "", location: "", description: "", image: "" })}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-sm font-bold transition-all"
            >
              + ADD NEW EVENT
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-600 transition-all">
              <div className="h-40 bg-zinc-800 relative">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                {event.isFeatured && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">FEATURED</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg mb-2">{event.title}</h3>
                <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <div className="text-zinc-400 text-xs font-medium">
                    {event.date}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditEvent(event)} className="text-zinc-400 hover:text-white p-2">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="text-zinc-400 hover:text-red-600 p-2">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit/Add Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl p-6 sm:p-8 rounded-xl relative my-auto max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
              <button 
                onClick={() => setEditEvent(null)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white z-10"
              >
                ✕
              </button>
              <h2 className="font-serif text-xl sm:text-2xl text-red-600 mb-6 sm:mb-8">
                {editingEvent.id ? "EDIT EVENT" : "NEW EVENT"}
              </h2>
              
              <form onSubmit={handleSaveEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2">EVENT TITLE</label>
                  <input 
                    required
                    value={editingEvent.title}
                    onChange={(e) => setEditEvent({...editingEvent, title: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-2.5 sm:p-3 rounded text-sm outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2">DATE</label>
                  <input 
                    required
                    placeholder="Saturday, August 16, 2025"
                    value={editingEvent.date}
                    onChange={(e) => setEditEvent({...editingEvent, date: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-2.5 sm:p-3 rounded text-sm outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2">TIME</label>
                  <input 
                    required
                    placeholder="7:00 PM"
                    value={editingEvent.time}
                    onChange={(e) => setEditEvent({...editingEvent, time: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-2.5 sm:p-3 rounded text-sm outline-none focus:border-red-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2">LOCATION</label>
                  <input 
                    required
                    value={editingEvent.location}
                    onChange={(e) => setEditEvent({...editingEvent, location: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-2.5 sm:p-3 rounded text-sm outline-none focus:border-red-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2">IMAGE PATH / URL</label>
                  <input 
                    required
                    placeholder="/src/assets/..."
                    value={editingEvent.image}
                    onChange={(e) => setEditEvent({...editingEvent, image: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-2.5 sm:p-3 rounded text-sm outline-none focus:border-red-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-zinc-500 text-[10px] font-bold tracking-widest mb-2">DESCRIPTION</label>
                  <textarea 
                    required
                    rows={3}
                    value={editingEvent.description}
                    onChange={(e) => setEditEvent({...editingEvent, description: e.target.value})}
                    className="w-full bg-black border border-zinc-800 p-2.5 sm:p-3 rounded text-sm outline-none focus:border-red-600 resize-none"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-3">
                  <input 
                    type="checkbox"
                    checked={editingEvent.isFeatured}
                    onChange={(e) => setEditEvent({...editingEvent, isFeatured: e.target.checked})}
                    className="accent-red-600 w-4 h-4"
                  />
                  <label className="text-xs sm:text-sm font-medium">Mark as Featured (Cinematic Banner)</label>
                </div>
                <div className="md:col-span-2 mt-2 sm:mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button type="submit" disabled={isSaving} className="flex-1 bg-red-600 hover:bg-red-700 py-3 sm:py-4 rounded font-bold text-sm transition-all disabled:opacity-50">
                    {isSaving ? "SAVING..." : "SAVE EVENT"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditEvent(null)}
                    className="flex-1 border border-zinc-800 hover:bg-zinc-800 py-3 sm:py-4 rounded text-sm transition-all"
                  >
                    CANCEL
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
