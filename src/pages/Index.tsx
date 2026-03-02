import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("introShown");
  });

  const [introFading, setIntroFading] = useState(false);

  // Intro logic (runs only once per session)
  useEffect(() => {
    if (!showIntro) return;

    const fadeTimer = setTimeout(() => setIntroFading(true), 1500);
    const hideTimer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("introShown", "true");
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [showIntro]);

  // Scroll to blogs when coming back from article
  useEffect(() => {
    if (location.state?.scrollTo === "blogs") {
      const el = document.getElementById("blogs");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // --- Intro Screen ---
  if (showIntro) {
    return (
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-1000 ${
          introFading ? "opacity-0" : "opacity-100"
        }`}
      >
        <video
          autoPlay
          muted
          playsInline
          className="h-[130vh] w-auto object-contain"
        >
          <source src="/hero-logo.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  // Intro Screen
  if (showIntro) {
    return (
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-1000 ${
          introFading ? "opacity-0" : "opacity-100"
        }`}
      >
        <video
          autoPlay
          muted
          playsInline
          className="h-[130vh] w-auto object-contain"
        >
          <source src="/hero-logo.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

// Main Website Return
return (
  <div className="min-h-screen bg-background animate-fade-in">

    {/* Navigation */}
    <nav className="sticky top-0 z-50 relative backdrop-blur-xl bg-white/60 border-b border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <img
          src="/threathunt-logo.png"
          alt="Threat Hunt"
          className="h-[56px] w-auto"
        />

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <a
            href="#home"
            className="text-sm px-3 py-1.5 rounded-full transition-all duration-200 text-gray-800 hover:bg-[#2AA6C6]/15 hover:text-[#2AA6C6]"
          >
            Home
          </a>

          <a
            href="#blogs"
            className="text-sm px-3 py-1.5 rounded-full transition-all duration-200 text-gray-800 hover:bg-[#2AA6C6]/15 hover:text-[#2AA6C6]"
          >
            Blogs
          </a>

          <a
            href="#contact"
            className="text-sm px-3 py-1.5 rounded-full transition-all duration-200 text-gray-800 hover:bg-[#2AA6C6]/15 hover:text-[#2AA6C6]"
          >
            Contact Us
          </a>
        </div>

      </div>

      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#2AA6C6]/40 to-transparent"></div>

    </nav>
      {/* Home Section */}
      <section id="home" className="mx-auto max-w-4xl px-9 py-20">
        <h1 className="text-7xl font-semibold text-foreground mb-7" style={{ fontFamily: 'var(--font-serif)' }}>
          Threat Hunting
        </h1>

        <div className="space-y-6 text-base leading-relaxed text-foreground/85" style={{ fontFamily: 'var(--font-serif)' }}>
          <p>
            Threat Hunting is one of those Cyber domains which unfortunately is still misunderstood even by very mature professionals.
          </p>
          <p>
            Please don't get surprised if you find cyber folks within your organization mixing threat hunting with threat intelligence or assuming that it's a reactive approach towards incident investigation.
          </p>
          <p>
            This is normal because Hunting itself is still a relatively new job role (as of Feb 2026), and most organizations out there do not yet have dedicated teams for it.
            Mostly professionals who work in SOC, or as Incident handlers simultaneously do threat hunting.
          </p>
          <p>
            In here, we'll look at concepts that any professional/team can use.
          </p>
        </div>
      </section>

{/* Blogs Section */}
<section id="blogs" className="mx-auto max-w-3xl px-6 py-20 border-t border-border">

  {/* Section Header */}
  <div className="mb-10">
    <h2
      className="text-3xl font-semibold text-foreground relative inline-block"
      style={{ fontFamily: 'var(--font-serif)' }}
    >
      Blogs
      <span className="absolute left-0 -bottom-2 h-[3px] w-16 bg-[#2AA6C6] rounded-full"></span>
    </h2>
  </div>

  {/* Blog Card */}
  <Link
    to="/blog/adya-hypothesis"
    className="group block rounded-xl border border-border bg-white/60 backdrop-blur-sm p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#2AA6C6]/40"
  >
    <h3 className="text-xl font-semibold text-foreground group-hover:text-[#2AA6C6] transition-colors duration-200">
      Adya_hypothesis
    </h3>

    <p className="mt-3 text-muted-foreground leading-relaxed">
      A hypothesis-driven noise reduction technique for modern threat hunting.
    </p>

    <div className="mt-6 text-sm text-[#2AA6C6] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Read article →
    </div>
  </Link>

</section>

      {/* Contact Section */}
      <section id="contact" className="mx-auto max-w-2xl px-6 py-16 border-t border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
          Contact
        </h2>

        <div className="flex items-center gap-6">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
            LinkedIn
          </a>
          <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
            Medium
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
            GitHub
          </a>
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
};

export default Index;