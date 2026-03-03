import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllBlogs } from "@/lib/blogLoader";
import SecurePanel from "@/components/SecurePanel";
import {
  Linkedin,
  Github,
  Globe,
  Network,
  FileText,
  Shield
} from "lucide-react";

const Index = () => {
  const location = useLocation();

  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("introShown");
  });

  const [introFading, setIntroFading] = useState(false);

  useEffect(() => {
    if (!showIntro) return;
    const fadeTimer = setTimeout(() => setIntroFading(true), 1500);
    const hideTimer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("introShown", "true");
    }, 2200);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, [showIntro]);

  useEffect(() => {
    if (location.state?.scrollTo === "blogs") {
      const el = document.getElementById("blogs");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  if (showIntro) {
    return (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-1000 ${introFading ? "opacity-0" : "opacity-100"}`}>
        <video autoPlay muted playsInline className="h-[130vh] w-auto object-contain">
          <source src="/hero-logo.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  const blogs = getAllBlogs();

  return (
    <div className="min-h-screen bg-background animate-fade-in">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <img src="/logoone.png" alt="Threat Hunt" className="h-[56px] w-auto" />
          <div className="flex items-center gap-6">
            <a href="#home" className="text-sm px-3 py-1.5 rounded-full transition text-gray-800 hover:bg-[#2AA6C6]/15 hover:text-[#2AA6C6]">Home</a>
            <a href="#blogs" className="text-sm px-3 py-1.5 rounded-full transition text-gray-800 hover:bg-[#2AA6C6]/15 hover:text-[#2AA6C6]">Blogs</a>
            <a href="#contact" className="text-sm px-3 py-1.5 rounded-full transition text-gray-800 hover:bg-[#2AA6C6]/15 hover:text-[#2AA6C6]">Contact</a>
          </div>
        </div>
      </nav>

      {/* Home Section */}
<section
  id="home"
  className="relative mx-auto max-w-4xl px-9 py-20 overflow-hidden"
>

  {/* Watermark */}
  <img
    src="/logo.png"
    alt="Threat Hunt Watermark"
    className="absolute inset-0 m-auto w-[500px] opacity-[0.05] blur-[1px] pointer-events-none select-none"
  />

  {/* Content Wrapper */}
  <div className="relative z-10">

    <h1
      className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground mb-8 md:mb-10"
      style={{ fontFamily: "var(--font-serif)" }}
    >
      Threat Hunting
    </h1>

    <div
      className="space-y-8 text-lg leading-8 text-foreground/85"
      style={{ fontFamily: "var(--font-serif)" }}
    >
      <p>
        Threat hunting is a proactive approach for finding sophisticated threats in an organization's environment which evaded automated cyber defense solutions (such as EDR, SIEM, Firewalls, and IDS).
        
        Hunting not only helps to identify APTs, malware infections, malicious activity etc. within the network, but it also goes much further, uncovering known and unknown security gaps that other teams may have overlooked.
      </p>

      <p>
        Unfortunately, as of today (March 2026), most organizations still take a reactive approach to the extraordinarily fast-paced cyber threat landscape.
      </p>

      <p>
        In this blog, I will be sharing tools, techniques, and concepts that I have learned and implemented during my hunting journey. Stay tuned!
      </p>
    </div>

  </div>

</section>

      {/* Blogs Section */}
<section
  id="blogs"
  className="mx-auto max-w-4xl px-6 py-20 border-t border-border"
>
  <div className="mb-12">
    <h2
      className="text-3xl font-semibold text-foreground relative inline-block"
      style={{ fontFamily: "var(--font-serif)" }}
    >
      Blogs
      <span className="absolute left-0 -bottom-2 h-[3px] w-16 bg-[#2AA6C6] rounded-full"></span>
    </h2>
  </div>

  <div className="space-y-6">
    {blogs.map((blog) => (
      <Link
        key={blog.slug}
        to={`/blog/${blog.slug}`}
        className="group flex items-center justify-between gap-8 rounded-xl border border-border bg-white/60 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[#2AA6C6]/40"
      >

        {/* LEFT CONTENT */}
        <div className="flex-1 min-w-0">

          <h3 className="text-xl font-semibold text-foreground group-hover:text-[#2AA6C6] transition-colors">
            {blog.title}
          </h3>

          <p className="mt-2 text-muted-foreground leading-relaxed text-sm">
            {blog.description}
          </p>

          {blog.date && (
            <div className="mt-4 text-xs text-muted-foreground">
              Posted on: {new Date(blog.date).toLocaleDateString()}
            </div>
          )}

        </div>

        {/* RIGHT IMAGE */}
        {blog.cover && (
          <div className="w-full md:w-36 h-48 md:h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={blog.cover}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

      </Link>
    ))}
  </div>
</section>

      {/* CONNECT SECTION */}
      <section
        id="contact"
        className="relative mt-32 py-28 bg-gradient-to-br from-[#0b1118] via-[#0f1720] to-[#0b1118] text-white overflow-hidden
          before:absolute before:inset-0
          before:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)]
          before:bg-[size:24px_24px]
          before:pointer-events-none"
      >
        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-serif)" }}>Connect</h2>
          <div className="w-16 h-[2px] bg-[#2AA6C6] mb-16 rounded-full" />

          {/*
            Layout:
            [Social links — fixed narrow col] [SecurePanel — takes all remaining space]
            SecurePanel internally renders [ThreatMap | Form] side by side
          */}
          <div className="flex items-start gap-12">

            {/* Col 1 — Social links, vertically centered with the map */}
            <div className="flex flex-col space-y-6 text-gray-400 pt-4 flex-shrink-0">
              {[
                { name: "LinkedIn",       url: "https://www.linkedin.com/in/harish-tiwari-160a7bbb/", icon: Linkedin },
                { name: "GitHub",         url: "https://github.com/6odhi",                              icon: Github   },
                { name: "Tumblr",         url: "https://rekcah.tumblr.com/",                            icon: Globe    },
                { name: "Null Community", url: "https://null.community/profile/4938-harish-tiwari",     icon: Network  },
                { name: "Arsenal Blog",   url: "https://myarsenalsite.wordpress.com/",                  icon: FileText },
                { name: "Payatu Author",  url: "https://payatu.com/author/harish-tiwari/",              icon: Shield   },
              ].map((platform) => {
                const Icon = platform.icon;
                return (
                  <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer"
                    className="group/link flex items-center gap-4 text-base transition-all duration-300 hover:text-white">
                    <Icon size={22} className="text-gray-500 group-hover/link:text-[#2AA6C6] transition-colors duration-300" />
                    <span className="tracking-wide">{platform.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Col 2 — SecurePanel fills all remaining width */}
            <div className="flex-1 min-w-0">
              <SecurePanel />
            </div>

          </div>
        </div>
      </section>

      <div className="h-20 bg-gradient-to-br from-[#0b1118] via-[#0f1720] to-[#0b1118]" />
    </div>
  );
};

export default Index;
