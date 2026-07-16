import { createFileRoute } from "@tanstack/react-router";
import { getEvents } from "@/lib/events.server";
import { getGallery } from "@/lib/gallery.server";
import { Event } from "@/data/eventsData";
import { GalleryItem } from "@/data/galleryData";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const [events, gallery] = await Promise.all([getEvents(), getGallery()]);
    return { events, gallery };
  },
  component: AdminPage,
});

function AdminPage() {
  const { events, gallery } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-20 w-full">
        {/* Notice banner */}
        <div className="mb-10 border border-yellow-600/40 bg-yellow-600/10 rounded-xl p-6">
          <h2 className="text-yellow-500 font-bold uppercase tracking-widest text-sm mb-2">
            Static Hosting — Read Only
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            This site is deployed on static hosting (Hostinger shared). Content editing is
            disabled. To update events or gallery items, edit{" "}
            <code className="text-yellow-400 bg-zinc-900 px-1 py-0.5 rounded text-xs">
              src/data/eventsData.json
            </code>{" "}
            or{" "}
            <code className="text-yellow-400 bg-zinc-900 px-1 py-0.5 rounded text-xs">
              src/data/galleryData.json
            </code>{" "}
            and redeploy.
          </p>
        </div>

        {/* Events preview */}
        <section className="mb-16">
          <h1 className="font-serif text-2xl text-red-600 tracking-wider uppercase mb-6 border-b border-zinc-800 pb-4">
            Events ({events.length})
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: Event) => (
              <div
                key={event.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col"
              >
                <div className="h-40 bg-black">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-contain opacity-80"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-serif text-base mb-1">{event.title}</h3>
                  <p className="text-zinc-500 text-xs mb-3 line-clamp-2">{event.description}</p>
                  <div className="mt-auto text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
                    {event.date} · {event.time}
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="col-span-full text-zinc-600 text-sm uppercase tracking-widest py-10 text-center">
                No events found.
              </p>
            )}
          </div>
        </section>

        {/* Gallery preview */}
        <section>
          <h1 className="font-serif text-2xl text-red-600 tracking-wider uppercase mb-6 border-b border-zinc-800 pb-4">
            Gallery ({gallery.length})
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item: GalleryItem) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col"
              >
                <div className="h-48 bg-black relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain opacity-80"
                  />
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base">{item.title}</h3>
                </div>
              </div>
            ))}
            {gallery.length === 0 && (
              <p className="col-span-full text-zinc-600 text-sm uppercase tracking-widest py-10 text-center">
                No gallery items found.
              </p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
