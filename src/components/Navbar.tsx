import { Instagram } from "lucide-react";
import campzzyLogo from "../assets/logo.png";
const RedditIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#5BC8F5]/60 to-transparent" />
      <div className="w-full px-4 py-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={campzzyLogo} alt="Campzzy logo" className="w-9 h-9 rounded-lg transition-transform duration-300 hover:rotate-6 hover:scale-105" />
          <span className="text-2xl md:text-[1.75rem] font-bold tracking-tight wordmark-gradient">Campzzy</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#overview" className="text-sm font-medium text-foreground underline decoration-[#5BC8F5]/70 underline-offset-4 transition-colors hover:text-[#5BC8F5]">
            Overview
          </a>
          <a href="https://www.instagram.com/campzzy.in?igsh=YWE1MjU2Mzl2M2Ny&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-foreground transition-all duration-200 hover:opacity-80 hover:scale-110">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="https://www.reddit.com/u/Campzzyin/s/thihKIC17f" target="_blank" rel="noopener noreferrer" className="text-foreground transition-all duration-200 hover:opacity-80 hover:scale-110">
            <RedditIcon />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;