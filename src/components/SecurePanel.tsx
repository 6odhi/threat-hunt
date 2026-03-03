import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   THREAT MAP
   — fills the left portion of SecurePanel
   — map canvas scales to container via CSS, drawn at 2x resolution
═══════════════════════════════════════════════════════════════════ */
const ThreatMap = ({ step, sent }) => {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const rafRef       = useRef(null);
  const tRef         = useRef(0);
  const sizeRef      = useRef({ w: 480, h: 300 });

  const proj = (lon, lat, w, h) => ({
    x: ((lon + 180) / 360) * w,
    y: ((90 - lat) / 180) * h,
  });

  const CONTINENTS = [
    [[-168,72],[-140,70],[-95,75],[-80,50],[-65,45],[-60,47],[-80,25],[-90,15],[-85,10],[-77,8],[-105,20],[-118,32],[-122,37],[-124,48],[-130,55],[-140,58],[-155,60],[-165,64],[-168,72]],
    [[-80,12],[-65,10],[-50,5],[-35,-5],[-38,-15],[-40,-22],[-50,-30],[-55,-35],[-70,-55],[-75,-50],[-80,-40],[-80,-30],[-75,-15],[-80,12]],
    [[28,72],[30,60],[25,55],[15,55],[8,55],[0,50],[-5,48],[0,44],[10,44],[15,42],[20,40],[25,42],[30,46],[28,52],[20,55],[15,60],[20,65],[28,72]],
    [[15,37],[25,37],[35,32],[42,12],[44,2],[40,-5],[35,-18],[28,-35],[18,-35],[12,-18],[10,-5],[8,5],[15,10],[8,20],[0,28],[-5,35],[5,37],[15,37]],
    [[28,72],[60,75],[100,72],[140,70],[168,65],[170,55],[145,45],[135,35],[130,28],[120,22],[110,5],[100,2],[95,10],[90,22],[80,28],[70,22],[60,22],[50,28],[42,12],[35,32],[28,52],[28,72]],
    [[114,-22],[120,-18],[130,-12],[140,-15],[150,-22],[152,-28],[148,-38],[140,-38],[130,-32],[118,-28],[114,-22]],
    [[-44,83],[-20,82],[-15,78],[-25,72],[-45,70],[-55,72],[-60,78],[-44,83]],
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(w * 0.58); // maintain aspect ratio
      sizeRef.current = { w, h };
      canvas.width  = w * 2; // hi-dpi
      canvas.height = h * 2;
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const ctx = canvas.getContext("2d");

    const draw = () => {
      tRef.current += 0.013;
      const t = tRef.current;
      const { w, h } = sizeRef.current;
      const W = w * 2, H = h * 2; // actual canvas px (2x)

      ctx.clearRect(0, 0, W, H);

      const p = (lon, lat) => proj(lon, lat, W, H);
      const ORG = p(-77, 39);

      const ATTACKS = [
        { origin: p(37,  55), label: "MOSCOW",  color: "255,40,40",  active: step >= 1 },
        { origin: p(116, 40), label: "BEIJING", color: "255,110,20", active: step >= 2 },
        { origin: p(51,  36), label: "TEHRAN",  color: "255,190,20", active: step >= 2 },
        { origin: p(127, 37), label: "DPRK",    color: "180,50,255", active: step >= 3 },
      ];

      // ── bg ──
      ctx.fillStyle = "#030810"; ctx.fillRect(0, 0, W, H);

      // ── stars ──
      for (let i = 0; i < 120; i++) {
        const sx = (Math.sin(i * 127.1) * 0.5 + 0.5) * W;
        const sy = (Math.sin(i * 311.7) * 0.5 + 0.5) * H;
        ctx.globalAlpha = 0.12 + Math.sin(t * 0.6 + i) * 0.07;
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(sx, sy, 0.8 + Math.sin(i*53.3)*0.4, 0, Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ── grid ──
      ctx.strokeStyle = "rgba(42,100,140,0.07)"; ctx.lineWidth = 1;
      for (let lon=-180;lon<=180;lon+=30){ const a=p(lon,90),b=p(lon,-90); ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke(); }
      for (let lat=-90;lat<=90;lat+=30){  const a=p(-180,lat),b=p(180,lat); ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke(); }

      // ── continents ──
      CONTINENTS.forEach(pts => {
        const mp = pts.map(([lon,lat])=>p(lon,lat));
        ctx.beginPath(); ctx.moveTo(mp[0].x,mp[0].y);
        mp.slice(1).forEach(q=>ctx.lineTo(q.x,q.y));
        ctx.closePath();
        ctx.fillStyle   = "rgba(28,52,72,0.72)";
        ctx.strokeStyle = "rgba(42,110,150,0.28)";
        ctx.lineWidth   = 1.4;
        ctx.fill(); ctx.stroke();
      });

      // ── threat origin glow ──
      ATTACKS.forEach((atk,i) => {
        if (!atk.active || sent) return;
        const pulse = 0.2 + Math.sin(t*2.8+i)*0.12;
        const gr = ctx.createRadialGradient(atk.origin.x,atk.origin.y,0,atk.origin.x,atk.origin.y,52);
        gr.addColorStop(0,`rgba(${atk.color},${pulse})`);
        gr.addColorStop(1,`rgba(${atk.color},0)`);
        ctx.beginPath(); ctx.arc(atk.origin.x,atk.origin.y,52,0,Math.PI*2);
        ctx.fillStyle=gr; ctx.fill();
      });

      // ── attack arcs ──
      ATTACKS.forEach((atk,i) => {
        if (!atk.active) return;
        const sx=atk.origin.x, sy=atk.origin.y, ex=ORG.x, ey=ORG.y;
        const mx=(sx+ex)/2, my=(sy+ey)/2 - 120 - Math.abs(sx-ex)*0.12;

        if (sent) {
          ctx.beginPath();
          for(let s=0;s<=50;s++){ const f=s/50; const bx=(1-f)*(1-f)*sx+2*(1-f)*f*mx+f*f*ex; const by=(1-f)*(1-f)*sy+2*(1-f)*f*my+f*f*ey; s===0?ctx.moveTo(bx,by):ctx.lineTo(bx,by); }
          ctx.strokeStyle=`rgba(${atk.color},0.08)`; ctx.lineWidth=1.5; ctx.stroke();
          ctx.beginPath(); ctx.arc(sx,sy,5,0,Math.PI*2);
          ctx.fillStyle="rgba(74,222,128,0.5)"; ctx.fill();
          return;
        }

        const speed=0.25+i*0.06, prog=(t*speed+i*0.38)%1.35, capped=Math.min(prog,1), TAIL=0.2;

        // ghost arc
        ctx.beginPath();
        for(let s=0;s<=50;s++){ const f=s/50; const bx=(1-f)*(1-f)*sx+2*(1-f)*f*mx+f*f*ex; const by=(1-f)*(1-f)*sy+2*(1-f)*f*my+f*f*ey; s===0?ctx.moveTo(bx,by):ctx.lineTo(bx,by); }
        ctx.strokeStyle=`rgba(${atk.color},0.1)`; ctx.lineWidth=1.5; ctx.stroke();

        // animated head
        const segStart=Math.max(0,capped-TAIL);
        const pts=[];
        for(let s=0;s<=36;s++){ const f=segStart+(s/36)*(capped-segStart); pts.push({x:(1-f)*(1-f)*sx+2*(1-f)*f*mx+f*f*ex, y:(1-f)*(1-f)*sy+2*(1-f)*f*my+f*f*ey}); }
        if(pts.length>=2){
          ctx.beginPath(); pts.forEach((q,idx)=>idx===0?ctx.moveTo(q.x,q.y):ctx.lineTo(q.x,q.y));
          const hd=pts[pts.length-1], tl=pts[0];
          const lg=ctx.createLinearGradient(tl.x,tl.y,hd.x,hd.y);
          lg.addColorStop(0,`rgba(${atk.color},0)`); lg.addColorStop(1,`rgba(${atk.color},1)`);
          ctx.strokeStyle=lg; ctx.lineWidth=3; ctx.stroke();
          // head dot
          ctx.beginPath(); ctx.arc(hd.x,hd.y,4,0,Math.PI*2);
          ctx.fillStyle=`rgb(${atk.color})`; ctx.fill();
          // head glow
          const hgr=ctx.createRadialGradient(hd.x,hd.y,0,hd.x,hd.y,14);
          hgr.addColorStop(0,`rgba(${atk.color},0.55)`); hgr.addColorStop(1,`rgba(${atk.color},0)`);
          ctx.beginPath(); ctx.arc(hd.x,hd.y,14,0,Math.PI*2); ctx.fillStyle=hgr; ctx.fill();
        }

        // impact shockwave
        if(capped>=0.97 && prog<1.28){
          const age=(prog-0.97)/0.31;
          [1,2].forEach(ring=>{ const ra=Math.max(0,age-(ring-1)*0.3); if(ra<=0)return; ctx.beginPath(); ctx.arc(ORG.x,ORG.y,ra*36,0,Math.PI*2); ctx.strokeStyle=`rgba(${atk.color},${(1-ra)*0.65})`; ctx.lineWidth=3; ctx.stroke(); });
        }

        // origin dot
        const op=0.55+Math.sin(t*4+i)*0.35;
        ctx.beginPath(); ctx.arc(sx,sy,6,0,Math.PI*2); ctx.fillStyle=`rgba(${atk.color},${op})`; ctx.fill();
        ctx.fillStyle=`rgba(${atk.color},0.8)`; ctx.font=`bold ${Math.max(11,W*0.023)}px monospace`;
        ctx.fillText(atk.label,sx+9,sy-6);
      });

      // ── ORG reticle ──
      const rp = sent ? 0 : 0.45+Math.sin(t*6)*0.3;
      if(!sent){
        [18,30,42].forEach((r,i)=>{ ctx.beginPath(); ctx.arc(ORG.x,ORG.y,r,0,Math.PI*2); ctx.strokeStyle=`rgba(42,166,198,${rp*(0.55-i*0.14)})`; ctx.lineWidth=1.5; ctx.stroke(); });
        ctx.strokeStyle=`rgba(42,166,198,${rp*0.55})`; ctx.lineWidth=1.2;
        [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dy])=>{ ctx.beginPath(); ctx.moveTo(ORG.x+dx*16,ORG.y+dy*16); ctx.lineTo(ORG.x+dx*34,ORG.y+dy*34); ctx.stroke(); });
      }
      ctx.beginPath(); ctx.arc(ORG.x,ORG.y,6,0,Math.PI*2);
      ctx.fillStyle=sent?"#4ade80":"#2AA6C6"; ctx.fill();
      ctx.fillStyle=sent?"rgba(74,222,128,0.8)":"rgba(42,166,198,0.8)";
      ctx.font=`bold ${Math.max(11,W*0.023)}px monospace`;
      ctx.fillText("◎ ORG",ORG.x+9,ORG.y+5);

      // ── HUD ──
      const hf = Math.max(10, W*0.02);
      ctx.font=`${hf}px monospace`; ctx.fillStyle="rgba(42,166,198,0.22)";
      ctx.fillText(`VECTORS: ${String(ATTACKS.filter(a=>a.active&&!sent).length).padStart(2,"0")}`,10,hf+4);
      ctx.fillText(`MODE: ${sent?"SECURED":"HUNTING"}`,10,H-8);
      ctx.fillText("39°N 77°W",W-90,hf+4);

      // corner accents
      const cs=18; ctx.strokeStyle="rgba(42,166,198,0.45)"; ctx.lineWidth=2;
      [[0,0,1,0],[0,0,0,1],[W,0,-1,0],[W,0,0,1],[0,H,1,0],[0,H,0,-1],[W,H,-1,0],[W,H,0,-1]]
        .forEach(([x,y,dx,dy])=>{ ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx*cs,y+dy*cs);ctx.stroke(); });

      // border
      ctx.strokeStyle="rgba(42,100,140,0.3)"; ctx.lineWidth=1.5; ctx.strokeRect(1,1,W-2,H-2);

      // sent overlay
      if(sent){
        ctx.fillStyle="rgba(3,8,16,0.45)"; ctx.fillRect(0,0,W,H);
        ctx.save(); ctx.translate(W/2,H/2); ctx.rotate(-0.04);
        const tf=Math.max(16,W*0.036);
        ctx.font=`bold ${tf}px monospace`;
        ctx.strokeStyle="rgba(74,222,128,0.65)"; ctx.lineWidth=2;
        const txt="THREAT NEUTRALIZED";
        const tw=ctx.measureText(txt).width;
        ctx.strokeText(txt,-tw/2,6);
        ctx.fillStyle="rgba(74,222,128,0.12)"; ctx.fillText(txt,-tw/2,6);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [step, sent]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div ref={containerRef} style={{ width:"100%", lineHeight:0 }}>
        <canvas ref={canvasRef} style={{ display:"block", borderRadius:6, width:"100%" }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${step}-${sent}`}
          initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
          style={{
            fontFamily:"monospace", fontSize:10, letterSpacing:3, textAlign:"center",
            color: sent ? "rgba(74,222,128,0.6)" : step===0 ? "rgba(42,166,198,0.45)" : "rgba(255,100,80,0.7)",
          }}
        >
          {sent ? "◉ ALL VECTORS NEUTRALIZED"
            : step===0 ? "◎ MONITORING GLOBAL TRAFFIC"
            : step===1 ? "▲ INBOUND VECTOR — MOSCOW"
            : step===2 ? "▲▲ MULTI-VECTOR ENGAGEMENT"
            : "⚠ FULL ENGAGEMENT — INITIATING HUNT"}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ════════════════════════════════════════════════════
   MAIN SECURE PANEL
   layout: [ThreatMap 55%] [Form 45%]
════════════════════════════════════════════════════ */
const SecurePanel = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const step =
    name.trim()
      ? email.trim()
        ? message.trim()
          ? 3
          : 2
        : 1
      : 0;

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSubmit = async () => {
  setError("");
  setSent(false);

  if (!name.trim() || !email.trim() || !message.trim()) {
    setError("Please fill all fields.");
    return;
  }

  if (!isValidEmail(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("/.netlify/functions/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send message.");
    }

    setSent(true);

    // Clear fields immediately
    setName("");
    setEmail("");
    setMessage("");

    // 🔥 Reset UI after 3 seconds
    setTimeout(() => {
      setSent(false);
    }, 3000);

  } catch (err: any) {
    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 24, width: "100%" }}>

      {/* ── Threat Map — 55% width ── */}
      <div style={{ flex: "0 0 55%", minWidth: 0 }}>
        <ThreatMap step={step} sent={sent} />
      </div>

      {/* ── Form — remaining 45% ── */}
      <div style={{ flex: "1 1 0", minWidth: 0 }} className="relative group">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#2AA6C6]/40 via-[#3b82f6]/30 to-[#2AA6C6]/40 blur-lg opacity-40"
        />

        <div className="relative h-full rounded-2xl bg-[#0e141b]/90 backdrop-blur-2xl border border-white/10 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col justify-between">

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white tracking-tight">
              Secure Transmission Channel
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Encrypted. Direct. Confidential.
            </p>
          </div>

          <div className="space-y-4 flex-1">

            {/* Name */}
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer w-full bg-transparent border border-white/10 rounded-lg px-4 pt-5 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:border-[#2AA6C6] transition"
                placeholder="Name"
              />
              <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#2AA6C6]">
                Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full bg-transparent border border-white/10 rounded-lg px-4 pt-5 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:border-[#2AA6C6] transition"
                placeholder="Email"
              />
              <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#2AA6C6]">
                Email
              </label>
            </div>

            {/* Message */}
            <div className="relative flex-1">
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="peer w-full bg-transparent border border-white/10 rounded-lg px-4 pt-5 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:border-[#2AA6C6] transition resize-none"
                placeholder="Message"
              />
              <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#2AA6C6]">
                Message
              </label>
            </div>

            {/* Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-[#2AA6C6] to-[#3b82f6] text-white shadow-lg shadow-[#2AA6C6]/30 hover:shadow-[#2AA6C6]/50 transition-all duration-300"
            >
              {loading
                ? "Sending..."
                : sent
                ? "✓ Transmission Secured"
                : "Initiate Collaboration"}
            </motion.button>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 mt-2 text-center">
                {error}
              </p>
            )}

            {/* Success */}
            {sent && !error && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[#2AA6C6] text-sm mt-2 text-center"
              >
                Message sent successfully.
              </motion.p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePanel;

/* ─── tailwind keyframe ─── */
// add to your global CSS if not already present:
// @keyframes shine { 0% { transform: translateX(-100%) rotate(12deg); } 100% { transform: translateX(200%) rotate(12deg); } }