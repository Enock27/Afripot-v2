import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          <div>
            <div className="font-swanky text-2xl sm:text-3xl md:text-4xl text-gold mb-3 sm:mb-4">AfriPot</div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Where tradition meets taste. A culinary experience celebrating African heritage.
            </p>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm md:text-base tracking-[0.25em] uppercase text-gold mb-3 sm:mb-4">Visit</h4>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              Nyarugenge 19 KN 51 St<br />
              Kigali, Rwanda
            </p>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm md:text-base tracking-[0.25em] uppercase text-gold mb-3 sm:mb-4">Hours</h4>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              Mon – Sun<br />
              7:00 AM – 12:00 AM
            </p>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm md:text-base tracking-[0.25em] uppercase text-gold mb-3 sm:mb-4">Navigate</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base">
              <li><Link to="/menu" className="text-muted-foreground hover:text-gold transition-colors">Menu</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-gold transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 text-xs sm:text-sm md:text-base text-muted-foreground tracking-wider">
          <p>© {new Date().getFullYear()} <span className="font-swanky">AfriPot</span> Restaurant. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="text-gold">✦✦</span> Two Michelin Stars
          </p>
        </div>
      </div>
    </footer>
  );
}
