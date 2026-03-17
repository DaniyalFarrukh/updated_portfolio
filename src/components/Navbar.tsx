import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

const navLinks = [
  { label: "About",    href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Skills",   href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled,   setScrolled]   = useState<boolean>(false);
  const [active,     setActive]     = useState<string>("#home");

  const navRef = useRef<HTMLElement>(null);

  // GSAP entrance on mount
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      navLinks.forEach((link) => {
        const section = document.querySelector(link.href);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActive(link.href);
          }
        }
      });

      // GSAP 3D depth on scroll — subtle scale + shadow lift
      if (navRef.current) {
        const progress = Math.min(window.scrollY / 200, 1);
        gsap.to(navRef.current, {
          boxShadow: `0 ${4 + progress * 12}px ${8 + progress * 24}px rgba(0,0,0,${0.1 + progress * 0.15})`,
          duration: 0.3,
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        style={{ opacity: 0 }} // GSAP will animate this
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-md"
            : "bg-background/70 backdrop-blur-md"
          }
          border-b border-border/40`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#home" className="text-2xl font-extrabold tracking-tight">
            Daniyal<span className="text-primary">.</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
                whileHover={{ y: -2, scale: 1.05 }}
                className={`relative text-sm font-medium transition-colors duration-200 group
                  ${active === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-primary rounded-full transition-all duration-300
                    ${active === link.href ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </motion.a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold"
            >
              <a href="#contact">Let's Connect</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40 lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium py-2 border-b border-border/30 transition-colors
                    ${active === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {link.label}
                </a>
              ))}
              <Button asChild className="mt-2 w-full">
                <a href="#contact" onClick={() => setMobileOpen(false)}>
                  Let's Connect
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
