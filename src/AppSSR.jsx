import { useState, useEffect, useRef } from "react";
import {
  Shirt, Sparkles, UtensilsCrossed, Dumbbell, Smartphone, Gamepad2, Plane, Wallet,
  Star, Music, BookOpen, HeartPulse, Car, Home, ShoppingCart, Gem, Baby, Trophy,
  Heart, Leaf, Building2, Film, Video, Frown, MessageSquare, ArrowLeftRight,
  BarChart3, TrendingUp, Target, Search, ClipboardList, CreditCard, Rocket,
  Inbox, Palette, Banknote, Mail, FileText, Zap, Bot, Loader, AlertTriangle,
  PartyPopper, ArrowDown, Check, Copyright, MapPin, Circle, Pencil, Megaphone,
  Bitcoin, PawPrint, Camera, Eye, X, CheckCircle, Users, IndianRupee, Clock,
  ShieldCheck, Globe, TrendingDown, Headphones, Star as StarIcon, ChevronRight,
  ChevronDown, Play, BarChart, Lock, BadgeCheck, Handshake, Laugh, Angry,
  AlertCircle, ThumbsDown, ArrowRight, PhoneOff, MessagesSquare, Banknote as BanknoteIcon, Gift, Lightbulb
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, limit } from "firebase/firestore";

// ─── SECURITY: All secrets loaded from environment variables (.env file) ──────
// Create a .env file in your project root with:
//   VITE_FIREBASE_API_KEY=your_key
//   VITE_FIREBASE_AUTH_DOMAIN=your_domain
//   VITE_FIREBASE_PROJECT_ID=your_project
//   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
//   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
//   VITE_FIREBASE_APP_ID=your_app_id
// Also set these same vars in your Vercel project → Settings → Environment Variables.
// Never hardcode API keys in source — they are visible in the compiled bundle.
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── SECURITY: Input sanitization (for writing to Firestore) ─────────────────
// Encodes HTML special chars so stored strings are safe if ever server-rendered.
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>'"&]/g, c => ({'<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;','&':'&amp;'}[c]))
    .trim()
    .slice(0, 200); // hard cap — no field should exceed 200 chars
}

// ─── Safe display helper for JSX ─────────────────────────────────────────────
// React already HTML-escapes output, so using sanitize() in JSX double-encodes
// chars (e.g. "&" becomes "&amp;amp;" visible to the user). Use stripHtml()
// when rendering user-supplied strings inside JSX.
function stripHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>'"&]/g, '').trim().slice(0, 200);
}

// ─── SECURITY: Validation helpers ────────────────────────────────────────────
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^[+]?[0-9\s\-().]{7,15}$/;

function validateForm(form) {
  const errors = {};
  if (!form.name || form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
  if (!form.email || !EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address.';
  if (form.phone && !PHONE_RE.test(form.phone.trim())) errors.phone = 'Please enter a valid phone number.';
  return errors;
}

// ─── SECURITY: Client-side rate limiter (last-resort, not a substitute for server rules) ───
const _submitLog = { count: 0, windowStart: 0 };
function clientRateCheck() {
  const now = Date.now();
  if (now - _submitLog.windowStart > 60_000) { _submitLog.count = 0; _submitLog.windowStart = now; }
  _submitLog.count++;
  return _submitLog.count <= 3; // max 3 submissions per 60 seconds per session
}

/* ═══════════════════════════════════════
   COLLANCER — Public Launch Edition 2026
   Rebuilt with richer storytelling + images
═══════════════════════════════════════ */

const FONTS = ``; // Fonts loaded via <link> in index.html — @import here causes HTML-escaping in SSR prerender

function EmojiToIcon({ emoji, size = 20, color, className = "" }) {
  const map = {
    "👗": Shirt, "💄": Sparkles, "🍔": UtensilsCrossed, "💪": Dumbbell,
    "📱": Smartphone, "🎮": Gamepad2, "✈️": Plane, "💰": Wallet,
    "🌟": Star, "🎵": Music, "📚": BookOpen, "🏥": HeartPulse,
    "🚗": Car, "🏠": Home, "🛒": ShoppingCart, "💍": Gem,
    "👶": Baby, "⚽": Trophy, "🌿": Leaf, "🏢": Building2,
    "🎬": Film, "🐾": PawPrint, "🔮": Eye, "₿": Bitcoin,
    "📸": Camera, "🎞️": Film, "🎥": Video, "📺": Play, "🎭": Frown,
    "🔍": Search, "📋": ClipboardList, "💳": CreditCard, "🚀": Rocket,
    "✨": Sparkles, "📩": Inbox, "🎨": Palette, "💸": Banknote,
    "🎯": Target, "🏆": Trophy, "📝": FileText, "📬": Mail,
    "🔄": ArrowLeftRight, "⚡": Zap, "🤖": Bot, "📊": BarChart3,
    "📈": TrendingUp, "😤": Frown, "📢": Megaphone, "💬": MessageSquare,
  };
  const Icon = map[emoji] || Sparkles;
  return <Icon size={size} color={color} className={`lucide-anim ${className}`} />;
}

/* ═══ CSS ═══ */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #05050e;
    --bg-elevated: #0a0a1a;
    --bg-card: #0f0f22;
    --bg-card-hover: #141430;
    --cyan: #00e5ff;
    --cyan-dim: #00b8cc;
    --purple: #b388ff;
    --purple-dim: #8b5cf6;
    --pink: #ff6eb4;
    --amber: #ffb347;
    --green: #4ade80;
    --blue: #60a5fa;
    --red: #f87171;
    --orange: #fb923c;
    --text: #eeeeff;
    --text-muted: #8888bb;
    --text-dim: #55557a;
    --border: rgba(255,255,255,0.06);
    --border-hover: rgba(255,255,255,0.13);
    --glow-cyan: 0 0 40px rgba(0,229,255,0.18), 0 0 80px rgba(0,229,255,0.06);
    --glow-purple: 0 0 40px rgba(179,136,255,0.15), 0 0 80px rgba(179,136,255,0.05);
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ff-display: 'Syne', sans-serif;
    --ff-body: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body {
    font-family: var(--ff-body);
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.25); border-radius: 10px; }

  body::before {
    content: ''; position: fixed; inset: 0; z-index: 9998; pointer-events: none; opacity: 0.02;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .lucide-anim { animation: lucideFloat 3s ease-in-out infinite; }
  @keyframes lucideFloat { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-3px) scale(1.08);} }
  .lucide-spin { animation: lucideSpin 2s linear infinite; }
  @keyframes lucideSpin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  .lucide-pulse { animation: lucidePulse 2s ease-in-out infinite; }
  @keyframes lucidePulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }


  .grid-bg {
    background-image:
      linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
  }

  section { position: relative; z-index: 1; }

  .glass-card {
    background: linear-gradient(180deg, rgba(15,15,34,0.96) 0%, rgba(10,10,26,0.98) 100%);
    border: 1px solid var(--border);
    border-radius: 24px;
    backdrop-filter: blur(40px);
    position: relative;
    overflow: hidden;
    transition: all 0.5s var(--ease-out-expo);
  }
  .glass-card::after {
    content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  }
  .glass-card:hover {
    transform: translateY(-4px);
    border-color: var(--border-hover);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5), var(--glow-cyan);
  }

  .btn-glow {
    display:inline-flex; align-items:center; justify-content:center; gap:10px;
    padding:16px 36px; border-radius:14px; border:none; cursor:pointer;
    font-family:var(--ff-body); font-size:15px; font-weight:600;
    background:linear-gradient(135deg, var(--cyan), #0099cc);
    color:#000;
    box-shadow:0 0 0 1px rgba(0,229,255,0.3) inset, 0 4px 0 #006699, 0 8px 32px rgba(0,229,255,0.25);
    transition:all 0.3s var(--ease-out-expo);
    position:relative; overflow:hidden;
  }
  .btn-glow::after {
    content:''; position:absolute; top:0; left:-100%; width:50%; height:100%;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transform:skewX(-25deg);
    animation:btnShine 4s ease-in-out infinite;
  }
  .btn-glow:hover { transform:translateY(-2px); box-shadow:0 0 0 1px rgba(0,229,255,0.5) inset, 0 6px 0 #006699, 0 16px 48px rgba(0,229,255,0.35); }
  .btn-glow:active { transform:translateY(1px); }

  .btn-outline {
    display:inline-flex; align-items:center; justify-content:center; gap:10px;
    padding:15px 34px; border-radius:14px; cursor:pointer;
    font-family:var(--ff-body); font-size:15px; font-weight:600;
    background:transparent; color:var(--purple);
    border:1.5px solid rgba(179,136,255,0.3);
    box-shadow:0 4px 0 rgba(139,92,246,0.2);
    transition:all 0.3s var(--ease-out-expo);
  }
  .btn-outline:hover {
    transform:translateY(-2px);
    background:rgba(179,136,255,0.08);
    border-color:rgba(179,136,255,0.5);
    box-shadow:0 6px 0 rgba(139,92,246,0.2), 0 8px 32px rgba(179,136,255,0.15);
  }

  @keyframes btnShine { 0%{left:-100%;} 50%{left:150%;} 100%{left:150%;} }
  @keyframes cleoMsgIn { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  @keyframes cleoResponseIn { from{opacity:0;} to{opacity:1;} }
  @keyframes cleoCursor { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes cleoThink { 0%,100%{opacity:0.25;transform:translateY(0);} 50%{opacity:1;transform:translateY(-5px);} }

  .badge {
    display:inline-flex; align-items:center; gap:8px;
    padding:6px 16px; border-radius:50px;
    font-size:12px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase;
    font-family:var(--ff-display);
  }
  .badge-cyan { background:rgba(0,229,255,0.08); color:var(--cyan); border:1px solid rgba(0,229,255,0.2); }
  .badge-purple { background:rgba(179,136,255,0.08); color:var(--purple); border:1px solid rgba(179,136,255,0.2); }
  .badge-green { background:rgba(74,222,128,0.08); color:var(--green); border:1px solid rgba(74,222,128,0.2); }
  .badge-red { background:rgba(248,113,113,0.08); color:var(--red); border:1px solid rgba(248,113,113,0.2); }
  .badge-amber { background:rgba(255,179,71,0.08); color:var(--amber); border:1px solid rgba(255,179,71,0.2); }

  .text-gradient { background:linear-gradient(135deg, var(--cyan) 0%, var(--purple) 50%, var(--pink) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .text-gradient-cyan { background:linear-gradient(135deg, var(--cyan), var(--cyan-dim)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .text-gradient-purple { background:linear-gradient(135deg, var(--purple), var(--pink)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .text-gradient-warm { background:linear-gradient(135deg, var(--amber), var(--orange)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  .glow-cyan { color:var(--cyan); text-shadow:0 0 40px rgba(0,229,255,0.3); }
  .glow-purple { color:var(--purple); text-shadow:0 0 40px rgba(179,136,255,0.25); }
  .glow-red { color:var(--red); text-shadow:0 0 30px rgba(248,113,113,0.3); }

  .section-title {
    font-family: var(--ff-display);
    font-size: clamp(22px, 3.5vw, 48px);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.03em;
  }

  .divider-line {
    height:1px;
    background:linear-gradient(90deg, transparent, rgba(0,229,255,0.15), rgba(179,136,255,0.15), transparent);
  }

  .reveal { opacity:0; transform:translateY(60px); transition:opacity 0.9s var(--ease-out-expo), transform 0.9s var(--ease-out-expo); }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-scale { opacity:0; transform:scale(0.92) translateY(30px); transition:opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo); }
  .reveal-scale.visible { opacity:1; transform:scale(1) translateY(0); }

  .marquee-container { height:76px; display:flex; align-items:center; overflow:hidden; mask-image:linear-gradient(90deg, transparent, black 10%, black 90%, transparent); -webkit-mask-image:linear-gradient(90deg, transparent, black 10%, black 90%, transparent); }
  .marquee-track { display:flex; gap:20px; width:max-content; height:100%; animation:marquee 42s linear infinite; touch-action:pan-y; align-items:center; }
  @keyframes marquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }

  @keyframes float1 { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-10px) rotate(1deg);} }
  @keyframes float2 { 0%,100%{transform:translateY(0) rotate(2deg);} 50%{transform:translateY(-14px) rotate(-1deg);} }
  @keyframes float3 { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-8px) scale(1.01);} }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(1.3);} }
  @keyframes scroll-indicate { 0%,100%{transform:translateY(0);opacity:1;} 50%{transform:translateY(8px);opacity:0.4;} }
  @keyframes shimmer { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }

  .spotlight-card { position:relative; overflow:hidden; }
  .spotlight-card::before {
    content:''; position:absolute; inset:0; border-radius:inherit;
    background:radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,229,255,0.06), transparent 40%);
    opacity:0; transition:opacity 0.3s; pointer-events:none; z-index:1;
  }
  .spotlight-card:hover::before { opacity:1; }

  .img-card {
    border-radius: 20px;
    overflow: hidden;
    position: relative;
  }
  .img-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.75) saturate(1.1);
    transition: transform 0.6s var(--ease-out-expo), filter 0.4s;
  }
  .img-card:hover img { transform: scale(1.05); filter: brightness(0.85) saturate(1.2); }
  .img-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(5,5,14,0.9) 0%, rgba(5,5,14,0.2) 50%, transparent 100%);
  }

  .problem-card {
    background:linear-gradient(180deg, rgba(248,113,113,0.04), rgba(10,10,26,0.98));
    border:1px solid rgba(248,113,113,0.12);
    border-radius:20px; padding:32px;
    position:relative; overflow:hidden;
    transition:all 0.5s var(--ease-out-expo);
  }
  .problem-card:hover { transform:translateY(-4px); border-color:rgba(248,113,113,0.25); box-shadow:0 20px 60px rgba(248,113,113,0.08); }
  .problem-card { min-width: 0; box-sizing: border-box; }
  .problem-stat { min-width: 0; box-sizing: border-box; }
  .problem-stat-label { min-width: 0; overflow-wrap: anywhere; }
  @media (max-width: 600px) {
    .problem-stat { width: 100%; display: flex !important; align-items: flex-start !important; flex-direction: column !important; gap: 4px !important; }
    .problem-stat-value { font-size: 21px !important; line-height: 1.15; }
    .problem-card { width: 100%; }
  }


  .solution-card {
    background:linear-gradient(180deg, rgba(0,229,255,0.04), rgba(10,10,26,0.98));
    border:1px solid rgba(0,229,255,0.12);
    border-radius:20px; padding:32px;
    position:relative; overflow:hidden;
    transition:all 0.5s var(--ease-out-expo);
  }
  .solution-card:hover { transform:translateY(-4px); border-color:rgba(0,229,255,0.25); box-shadow:0 20px 60px rgba(0,229,255,0.08); }

  .stat-big {
    font-family: var(--ff-display);
    font-size: clamp(28px, 4vw, 52px);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .timeline-line {
    position: absolute;
    left: 23px;
    top: 56px;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--cyan), var(--purple), transparent);
  }

  .toggle-pill {
    display:flex; background:rgba(255,255,255,0.03);
    border:1px solid var(--border); border-radius:14px; padding:4px; gap:4px;
  }
  .toggle-pill button {
    padding:10px 28px; border-radius:12px; border:none; cursor:pointer;
    font-family:var(--ff-body); font-size:14px; font-weight:600;
    transition:all 0.3s var(--ease-out-expo);
    background:transparent; color:var(--text-muted);
  }
  .toggle-pill button.active {
    background:linear-gradient(135deg, var(--cyan), #0099cc);
    color:#000;
    box-shadow:0 2px 0 #005577, 0 4px 16px rgba(0,229,255,0.25);
  }

  .creator-card {
    background:linear-gradient(180deg, rgba(17,17,34,0.9), rgba(12,12,26,0.95));
    border:1px solid var(--border); border-radius:20px; padding:24px;
    transition:all 0.5s var(--ease-out-expo); position:relative; overflow:hidden;
  }
  .creator-card:hover { transform:translateY(-6px) scale(1.02); border-color:var(--border-hover); box-shadow:0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,229,255,0.1); }

  .testimonial-card {
    background:linear-gradient(180deg, rgba(17,17,34,0.9), rgba(12,12,26,0.95));
    border:1px solid var(--border); border-radius:24px; padding:32px;
    position:relative; overflow:hidden; transition:all 0.5s var(--ease-out-expo);
  }
  .testimonial-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  }
  .testimonial-card:hover { transform:translateY(-4px); border-color:var(--border-hover); box-shadow:0 24px 64px rgba(0,0,0,0.4); }

  .nav-bar {
    position:fixed; top:0; left:0; right:0; z-index:1000; padding:16px 24px;
    transition:all 0.4s var(--ease-out-expo);
  }
  .nav-bar.scrolled {
    background:rgba(5,5,14,0.88);
    backdrop-filter:blur(24px) saturate(1.2);
    border-bottom:1px solid var(--border);
  }

  .comparison-table tr:nth-child(odd) td { background: rgba(255,255,255,0.015); }
  .comparison-table th { font-family: var(--ff-display); font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }

  .feat-icon { width:52px; height:52px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:24px; box-shadow:0 4px 16px rgba(0,0,0,0.2); line-height:1; flex-shrink:0; }

  .number-ring {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--ff-display); font-size: 18px; font-weight: 800;
    flex-shrink: 0;
  }

  /* ═══ MOBILE-FIRST RESPONSIVE ═══ */
  @media (max-width: 900px) {
    .hide-mobile { display:none !important; }
    .section-title { font-size: clamp(20px, 3.8vw, 32px) !important; }
    .glass-card { border-radius: 16px; }
    .glass-card:hover { transform: none; }
    .stat-big { font-size: clamp(22px, 5vw, 36px) !important; }
    .badge { font-size: 11px; padding: 5px 12px; }
    .toggle-pill button { padding: 9px 16px; font-size: 13px; }
    .problem-card { padding: 20px; }
    .solution-card { padding: 20px; }
  }

  @media (max-width: 600px) {
    .nav-bar { padding: 10px 16px; }
    .section-title { font-size: clamp(18px, 5vw, 24px) !important; }
    .btn-glow { width: 100%; justify-content: center; padding: 14px 20px !important; font-size: 14px !important; border-radius: 12px; }
    .btn-outline { width: 100%; justify-content: center; padding: 14px 20px !important; font-size: 14px !important; border-radius: 12px; }
    .glass-card { border-radius: 14px; }
    .toggle-pill { width: 100%; }
    .toggle-pill button { flex: 1; padding: 10px 8px; font-size: 12px; }
    .feat-icon { width: 44px; height: 44px; border-radius: 12px; }
    .marquee-track { gap: 16px; animation-duration: 30s; }
    .badge { font-size: 10px; padding: 4px 10px; }
    .stat-big { font-size: clamp(22px, 7vw, 30px) !important; }
    .number-ring { width: 36px; height: 36px; font-size: 14px; border-radius: 10px; }
    input { font-size: 16px !important; }
  }

  @media (min-width: 901px) {
    .mobile-overlay { display: none !important; }
    .hamburger { display: none !important; }
  }

  /* Safe area for notched phones */
  @supports (padding: env(safe-area-inset-bottom)) {
    .nav-bar { padding-left: max(16px, env(safe-area-inset-left)); padding-right: max(16px, env(safe-area-inset-right)); }
    footer { padding-bottom: max(40px, env(safe-area-inset-bottom)); }
  }

  /* Touch-friendly tap targets */
  @media (hover: none) {
    .glass-card:hover { transform: none; box-shadow: none; border-color: var(--border); }
    .btn-glow:hover { transform: none; }
    .btn-outline:hover { transform: none; }
    .creator-card:hover { transform: none; }
  }

  .problem-grid .problem-card { overflow:hidden; }
  .problem-card p { min-height: 74px; }
  .problem-statbox { min-height: 58px; box-sizing:border-box; }
  .problem-statbox .problem-stat-value { flex:0 0 auto; white-space:nowrap; }
  .problem-statbox .problem-stat-label { flex:1; min-width:0; }
  .creator-ai-card { position:relative; overflow:hidden; }
  .creator-ai-card::after { content:''; position:absolute; width:280px; height:280px; right:-130px; top:-150px; border-radius:50%; background:radial-gradient(circle, rgba(0,229,255,.09), transparent 68%); pointer-events:none; }
  .creator-ai-use { transition:transform .35s cubic-bezier(.16,1,.3,1), border-color .35s ease, background .35s ease; }
  .creator-ai-use:hover { transform:translateY(-3px); border-color:rgba(0,229,255,.28) !important; background:rgba(255,255,255,.035) !important; }
  @media (max-width: 680px) { .problem-card { min-height:0 !important; } .problem-card p { min-height:0; } .problem-statbox { flex-direction:column; gap:3px !important; } .problem-statbox .problem-stat-value { white-space:normal; font-size:20px !important; } }

  /* ═══ CLEO SHOWCASE — CINEMATIC AI DEMO ═══ */
.cleo-showcase { position:relative; overflow:hidden; }
  .cleo-showcase::before {
    content:''; position:absolute; width:620px; height:620px; border-radius:50%;
    background:radial-gradient(circle, rgba(0,229,255,.12) 0%, rgba(124,58,237,.07) 35%, transparent 70%);
    top:-180px; right:-180px; filter:blur(8px); pointer-events:none;
  }
  .cleo-showcase::after {
    content:''; position:absolute; width:500px; height:500px; border-radius:50%;
    background:radial-gradient(circle, rgba(179,136,255,.08), transparent 68%);
    bottom:-260px; left:-160px; pointer-events:none;
  }
  .cleo-demo-shell {
    position:relative; border:1px solid rgba(179,136,255,.22); border-radius:30px;
    background:linear-gradient(145deg, rgba(17,17,40,.94), rgba(7,8,22,.98));
    box-shadow:0 40px 120px rgba(0,0,0,.48), 0 0 80px rgba(124,58,237,.08), inset 0 1px 0 rgba(255,255,255,.08);
    overflow:hidden; transform:translateZ(0);
  }
  .cleo-demo-shell::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(115deg, transparent 15%, rgba(255,255,255,.035) 48%, transparent 62%);
    transform:translateX(-120%); animation:cleoGlassSweep 8s ease-in-out infinite;
  }
  @keyframes cleoGlassSweep { 0%,58%{transform:translateX(-120%)} 78%,100%{transform:translateX(120%)} }
  .cleo-windowbar { display:flex; align-items:center; gap:10px; padding:15px 18px; border-bottom:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.018); }
  .cleo-window-orb { width:32px; height:32px; border-radius:11px; display:grid; place-items:center; background:linear-gradient(145deg, rgba(0,229,255,.18), rgba(124,58,237,.2)); border:1px solid rgba(0,229,255,.22); box-shadow:0 0 25px rgba(0,229,255,.12); }
  .cleo-status { margin-left:auto; display:flex; align-items:center; gap:6px; font-size:10px; color:var(--text-muted); }
  .cleo-status-dot { width:7px; height:7px; border-radius:50%; background:var(--green); box-shadow:0 0 12px rgba(74,222,128,.7); animation:cleoStatus 1.8s ease-in-out infinite; }
  @keyframes cleoStatus { 0%,100%{opacity:.5;transform:scale(.85)} 50%{opacity:1;transform:scale(1.15)} }
  .cleo-chat { padding:18px; min-height:540px; position:relative; }
  .cleo-chat::before { content:''; position:absolute; inset:0; background-image:radial-gradient(circle at 20% 20%, rgba(0,229,255,.07) 0 1px, transparent 1.5px), radial-gradient(circle at 80% 70%, rgba(179,136,255,.07) 0 1px, transparent 1.5px); background-size:80px 80px,110px 110px; opacity:.6; pointer-events:none; }
  .cleo-msg { position:relative; z-index:2; animation:cleoBubble .85s cubic-bezier(.16,1,.3,1) both; }
  @keyframes cleoBubble { from{opacity:0;transform:translateY(18px) scale(.98);filter:blur(4px)} to{opacity:1;transform:none;filter:blur(0)} }
  .cleo-user-msg { max-width:78%; margin-left:auto; padding:13px 15px; border-radius:18px 18px 5px 18px; background:linear-gradient(135deg, rgba(0,229,255,.18), rgba(124,58,237,.13)); border:1px solid rgba(0,229,255,.24); box-shadow:0 12px 30px rgba(0,0,0,.22); font-size:13px; line-height:1.55; }
  .cleo-ai-msg { max-width:88%; padding:13px 15px; border-radius:5px 18px 18px 18px; background:linear-gradient(145deg, rgba(179,136,255,.11), rgba(16,17,40,.8)); border:1px solid rgba(179,136,255,.2); font-size:13px; line-height:1.55; }
  .cleo-typing { display:inline-flex; align-items:center; gap:4px; }
  .cleo-typing i { width:6px; height:6px; border-radius:50%; background:var(--purple); animation:cleoTyping 1s ease-in-out infinite; }
  .cleo-typing i:nth-child(2){animation-delay:.15s}.cleo-typing i:nth-child(3){animation-delay:.3s}
  @keyframes cleoTyping { 0%,70%,100%{opacity:.25;transform:translateY(0)} 35%{opacity:1;transform:translateY(-4px)} }
  .cleo-scan { margin:14px 0; padding:12px 14px; border:1px solid rgba(0,229,255,.14); border-radius:16px; background:rgba(0,229,255,.035); overflow:hidden; position:relative; }
  .cleo-scan::after { content:''; position:absolute; left:0; right:0; top:0; height:2px; background:linear-gradient(90deg, transparent, var(--cyan), transparent); animation:cleoScan 2s linear infinite; }
  @keyframes cleoScan { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
  .cleo-scan-row { display:flex; flex-wrap:wrap; gap:7px; margin-top:9px; }
  .cleo-chip { display:inline-flex; align-items:center; gap:5px; padding:6px 9px; border-radius:999px; font-size:10px; color:#cbd5ff; background:rgba(255,255,255,.035); border:1px solid rgba(255,255,255,.07); }
  .cleo-results { margin-top:14px; display:grid; gap:9px; }
  .cleo-result { display:flex; align-items:center; gap:10px; padding:10px; border-radius:15px; background:linear-gradient(135deg, rgba(255,255,255,.045), rgba(255,255,255,.018)); border:1px solid rgba(255,255,255,.07); animation:cleoResult 1s cubic-bezier(.16,1,.3,1) both; position:relative; overflow:hidden; }
  .cleo-result:nth-child(2){animation-delay:.12s}.cleo-result:nth-child(3){animation-delay:.24s}
  @keyframes cleoResult { from{opacity:0;transform:translateX(-22px) scale(.97);filter:blur(3px)} to{opacity:1;transform:none;filter:blur(0)} }
  .cleo-avatar { width:42px; height:42px; flex:0 0 42px; border-radius:14px; display:grid; place-items:center; font-family:var(--ff-display); font-weight:800; font-size:13px; color:#fff; background:linear-gradient(135deg, rgba(0,229,255,.24), rgba(124,58,237,.32)); border:1px solid rgba(255,255,255,.1); box-shadow:inset 0 1px 0 rgba(255,255,255,.08); }
  .cleo-fit { margin-left:auto; text-align:right; flex:0 0 auto; }
  .cleo-fit-score { font-family:var(--ff-display); font-size:16px; font-weight:800; color:var(--green); }
  .cleo-fit-label { font-size:9px; color:var(--text-dim); }
  .cleo-rank { position:absolute; top:7px; right:7px; font-size:8px; font-weight:800; color:var(--amber); background:rgba(255,179,71,.1); border:1px solid rgba(255,179,71,.2); border-radius:999px; padding:2px 6px; }
  .cleo-composer { margin-top:14px; padding:9px; display:flex; align-items:center; gap:8px; border-radius:15px; border:1px solid rgba(255,255,255,.08); background:rgba(0,0,0,.2); }
  .cleo-composer-input { flex:1; min-width:0; color:var(--text-dim); font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .cleo-send { width:32px; height:32px; border-radius:10px; display:grid; place-items:center; background:linear-gradient(135deg,var(--cyan),#7c3aed); color:#06101a; box-shadow:0 6px 18px rgba(0,229,255,.18); animation:cleoSend 2.8s ease-in-out infinite; }
  @keyframes cleoSend { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,229,255,.28)} }
  .cleo-orbit { position:absolute; width:170px; height:170px; border:1px solid rgba(0,229,255,.08); border-radius:50%; right:-50px; top:80px; animation:cleoOrbit 12s linear infinite; pointer-events:none; }
  .cleo-orbit::after { content:''; position:absolute; width:8px; height:8px; border-radius:50%; background:var(--cyan); box-shadow:0 0 18px var(--cyan); top:16px; left:28px; }
  @keyframes cleoOrbit { to{transform:rotate(360deg)} }
  .cleo-side-stack { display:grid; gap:12px; }
  .cleo-metric-card { padding:17px; border-radius:20px; background:linear-gradient(145deg, rgba(17,17,40,.9), rgba(10,10,26,.95)); border:1px solid rgba(255,255,255,.07); box-shadow:0 20px 50px rgba(0,0,0,.25); position:relative; overflow:hidden; }
  .cleo-metric-card::after { content:''; position:absolute; width:100px; height:100px; border-radius:50%; right:-40px; top:-45px; background:radial-gradient(circle, rgba(0,229,255,.12), transparent 70%); }
  .cleo-mini-bar { height:6px; border-radius:999px; background:rgba(255,255,255,.06); overflow:hidden; margin-top:9px; }
  .cleo-mini-bar span { display:block; height:100%; border-radius:inherit; background:linear-gradient(90deg,var(--cyan),var(--purple)); animation:cleoBar 2.8s ease-out both; transform-origin:left; }
  @keyframes cleoBar { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  .cleo-pulse-ring { position:absolute; width:260px; height:260px; border:1px solid rgba(0,229,255,.08); border-radius:50%; left:-100px; bottom:-110px; animation:cleoRing 5s ease-in-out infinite; pointer-events:none; }
  @keyframes cleoRing { 0%,100%{transform:scale(.95);opacity:.4} 50%{transform:scale(1.08);opacity:.9} }
  @media (max-width: 820px) {
    .cleo-chat { min-height:500px; padding:14px; }
    .cleo-demo-shell { border-radius:24px; }
    .cleo-user-msg { max-width:88%; }
    .cleo-ai-msg { max-width:96%; }
    .cleo-orbit { opacity:.45; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cleo-demo-shell::before,.cleo-status-dot,.cleo-send,.cleo-orbit,.cleo-scan::after,.cleo-mini-bar span,.cleo-pulse-ring { animation:none !important; }
  }

`;



/* ═══ DATA ═══ */
const CATEGORIES = [
  { icon: "👗", label: "Fashion" }, { icon: "💄", label: "Beauty" },
  { icon: "🍔", label: "Food & Drinks" }, { icon: "💪", label: "Fitness" },
  { icon: "📱", label: "Tech" }, { icon: "🎮", label: "Gaming" },
  { icon: "✈️", label: "Travel" }, { icon: "💰", label: "Finance" },
  { icon: "🌟", label: "Lifestyle" }, { icon: "🎵", label: "Music" },
  { icon: "📚", label: "Education" }, { icon: "🏥", label: "Health" },
  { icon: "🚗", label: "Auto & Bikes" }, { icon: "🏠", label: "Real Estate" },
  { icon: "🛒", label: "E-Commerce" }, { icon: "💍", label: "Jewellery" },
  { icon: "👶", label: "Kids & Family" }, { icon: "⚽", label: "Sports" },
  { icon: "💍", label: "Wedding" }, { icon: "🌿", label: "Eco & Organic" },
  { icon: "🚀", label: "Startups & D2C" }, { icon: "🎬", label: "Entertainment" },
  { icon: "🐾", label: "Pets" }, { icon: "🔮", label: "Astrology" },
  { icon: "₿", label: "Crypto & Web3" },
];

const CREATORS_DEMO = [
  { name: "Priya Sharma", handle: "@priyasharma", niche: "Fashion", followers: "86K", platform: "Instagram", rating: 4.9, emoji: "👗", color: "#ff6eb4", price: "Rs.2,400" },
  { name: "Rohan Mehra", handle: "@techwithrohan", niche: "Tech", followers: "100K", platform: "YouTube", rating: 4.8, emoji: "📱", color: "#60a5fa", price: "Rs.6,000" },
  { name: "Kavya Nair", handle: "@kavyafitness", niche: "Fitness", followers: "90K", platform: "Instagram", rating: 4.7, emoji: "💪", color: "#4ade80", price: "Rs.1,800" },
  { name: "Arjun Reddy", handle: "@arjunfinance", niche: "Finance", followers: "400K", platform: "YouTube", rating: 4.6, emoji: "💰", color: "#ffb347", price: "Rs.24,000" },
  { name: "Ananya Bose", handle: "@ananyabeauty", niche: "Beauty", followers: "54K", platform: "Instagram", rating: 4.8, emoji: "💄", color: "#b388ff", price: "Rs.1,200" },
  { name: "Vikram Joshi", handle: "@vikramgames", niche: "Gaming", followers: "4M", platform: "YouTube", rating: 4.9, emoji: "🎮", color: "#00e5ff", price: "Rs.2,40,000" },
];

const PROMO_TYPES = [
  { key: "story", label: "Story Promotion", icon: "📸", desc: "24-hour Instagram Story with swipe-up CTA link to your product.", tag: "Instagram", tagColor: "#4ade80", features: ["24-hr visibility", "Swipe-up CTA", "Quick turnaround"] },
  { key: "reel", label: "Reel Promotion", icon: "🎬", desc: "Permanent Instagram Reel — short vertical video on creator's profile.", tag: "Most Popular", tagColor: "#00e5ff", features: ["Permanent on profile", "High organic reach", "Caption + hashtags"] },
  { key: "video", label: "Video Promotion", icon: "📺", desc: "30–60 second brand promo placed mid-roll in a YouTube video.", tag: "YouTube", tagColor: "#ffb347", features: ["Mid-roll placement", "30–60 sec", "Description link"] },
  { key: "personalvideo", label: "Personal Video", icon: "🎥", desc: "Fully scripted personal video dedicated to your brand.", tag: "Premium", tagColor: "#b388ff", features: ["Dedicated content", "Scripted", "Exclusive for you"] },
  { key: "personalad", label: "Personal Ad", icon: "📢", desc: "Exclusive scripted brand content across Instagram & YouTube.", tag: "Premium", tagColor: "#b388ff", features: ["Cross-platform", "Full usage rights", "60-day campaign"] },
  { key: "ytshorts", label: "YouTube Shorts", icon: "⚡", desc: "60-second branded YouTube Short with high discovery potential.", tag: "YouTube", tagColor: "#f87171", features: ["Shorts feed", "60 sec max", "High discoverability"] },
];

const HOW_IT_WORKS_BIZ = [
  { num: "01", icon: "🔍", title: "Discover Creators", desc: "Browse growing verified Indian creators by niche, city, budget & platform. Or ask Collancer AI for instant recommendations.", color: "var(--cyan)" },
  { num: "02", icon: "📋", title: "Choose & Book", desc: "Select your promotion type, fill your campaign brief, and confirm your order in under 2 minutes.", color: "var(--purple)" },
  { num: "03", icon: "💳", title: "Pay Securely", desc: "Pay via UPI, card, or net banking through Razorpay. Your payment is held safely until delivery.", color: "var(--pink)" },
  { num: "04", icon: "🚀", title: "Campaign Goes Live", desc: "Creator delivers your promotion. Track in real time. Leave a review. Done.", color: "var(--amber)" },
];

const HOW_IT_WORKS_CREATOR = [
  { num: "01", icon: "✨", title: "Create Your Profile", desc: "List your niche, platform, city, prices, and categories. Get verified by our team in 24 hours.", color: "var(--cyan)" },
  { num: "02", icon: "📩", title: "Receive Bookings", desc: "Brands discover you and send booking requests directly. Review their brief instantly.", color: "var(--purple)" },
  { num: "03", icon: "🎨", title: "Deliver Content", desc: "Accept the brief, create the content, and deliver within the agreed timeline.", color: "var(--pink)" },
  { num: "04", icon: "💰", title: "Get Paid", desc: "Payment is released to your account automatically after delivery. No chasing, no waiting.", color: "var(--amber)" },
];

const FEATURES_BIZ = [
  { icon: "🔍", title: "Discover the Right Creators", desc: "Search verified Indian creators by niche, city, platform, budget, audience size and engagement — then shortlist with confidence.", color: "rgba(0,229,255,0.08)", border: "rgba(0,229,255,0.2)", accent: "var(--cyan)" },
  { icon: "🤖", title: "Collancer AI Matching", desc: "Describe your campaign in plain English. Collancer AI helps surface relevant creators, compare options and estimate potential reach for your budget.", color: "rgba(179,136,255,0.08)", border: "rgba(179,136,255,0.2)", accent: "var(--purple)" },
  { icon: "📋", title: "Structured Campaign Briefs", desc: "Define deliverables, budget, category and timeline in one clear brief. Creators know exactly what you need before they apply.", color: "rgba(255,110,180,0.08)", border: "rgba(255,110,180,0.2)", accent: "var(--pink)" },
  { icon: "💳", title: "Secure Escrow Payments", desc: "Pay securely through Razorpay. Funds are held until the agreed delivery, protecting both brands and creators throughout the booking.", color: "rgba(255,179,71,0.08)", border: "rgba(255,179,71,0.2)", accent: "var(--amber)" },
  { icon: "📊", title: "Verified Creator Signals", desc: "Evaluate profiles using verified metrics, engagement signals, content quality, reviews and clear creator pricing — not follower count alone.", color: "rgba(0,229,255,0.08)", border: "rgba(0,229,255,0.2)", accent: "var(--cyan)" },
  { icon: "🔄", title: "Automatic Refund Protection", desc: "If a creator rejects the booking or misses the agreed delivery deadline, the booking is protected by Collancer's automatic refund flow.", color: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)", accent: "var(--green)" },
];

const STATS = [
  { value: "FREE", label: "Creator Profile Listing", icon: "✨", color: "var(--cyan)" },
  { value: "100%", label: "Payment Protection", icon: "🛡️", color: "var(--purple)" },
  { value: "25", label: "Creator Niches", icon: "🎯", color: "var(--pink)" },
  { value: "6", label: "Promotion Formats", icon: "📢", color: "var(--amber)" },
];

const TESTIMONIALS = [];

const LOGOS = [
  { name: "Nykaa", logo: "https://cdn.simpleicons.org/nykaa/FC2779?viewbox=auto", fallback: "nykaa", color: "#FC2779" },
  { name: "Minimalist", logo: "https://cdn.simpleicons.org/minimalist/111111?viewbox=auto", fallback: "minimalist", color: "#F2F2F2" },
  { name: "Mamaearth", logo: "https://cdn.simpleicons.org/mamaearth/00A651?viewbox=auto", fallback: "mamaearth", color: "#00A651" },
  { name: "Plum", logo: "https://cdn.simpleicons.org/plum/6B2D5C?viewbox=auto", fallback: "plum", color: "#E98BC3" },
  { name: "Dot & Key", logo: "https://cdn.simpleicons.org/dotandkey/111111?viewbox=auto", fallback: "dot&key", color: "#FFFFFF" },
  { name: "Foxtale", logo: "https://cdn.simpleicons.org/foxtale/FF5C7A?viewbox=auto", fallback: "foxtale", color: "#FF5C7A" },
  { name: "Pilgrim", logo: "https://cdn.simpleicons.org/pilgrim/111111?viewbox=auto", fallback: "pilgrim", color: "#FFFFFF" },
  { name: "mCaffeine", logo: "https://cdn.simpleicons.org/mcaffeine/7B3F00?viewbox=auto", fallback: "mCaffeine", color: "#C98A5B" },
  { name: "Myntra", logo: "https://cdn.simpleicons.org/myntra/FF3F6C?viewbox=auto", fallback: "myntra", color: "#FF3F6C" },
  { name: "Meesho", logo: "https://cdn.simpleicons.org/meesho/F43397?viewbox=auto", fallback: "meesho", color: "#F43397" },
  { name: "Bata", logo: "https://cdn.simpleicons.org/bata/DD282E?viewbox=auto", fallback: "Bata", color: "#DD282E" },
  { name: "Lenskart", logo: "https://cdn.simpleicons.org/lenskart/11B5E4?viewbox=auto", fallback: "Lenskart", color: "#11B5E4" },
  { name: "boAt", logo: "https://cdn.simpleicons.org/boat/E20722?viewbox=auto", fallback: "boAt", color: "#E20722" },
  { name: "Noise", logo: "https://cdn.simpleicons.org/noise/000000?viewbox=auto", fallback: "noise", color: "#FFFFFF" },
  { name: "CRED", logo: "https://cdn.simpleicons.org/cred/2E2E2E?viewbox=auto", fallback: "CRED", color: "#FFFFFF" },
  { name: "PhonePe", logo: "https://cdn.simpleicons.org/phonepe/5F259F?viewbox=auto", fallback: "PhonePe", color: "#8B5CF6" },
  { name: "Paytm", logo: "https://cdn.simpleicons.org/paytm/00BAF2?viewbox=auto", fallback: "paytm", color: "#00BAF2" },
  { name: "Zerodha", logo: "https://cdn.simpleicons.org/zerodha/387ED1?viewbox=auto", fallback: "zerodha", color: "#4CA6FF" },
  { name: "Tata", logo: "https://cdn.simpleicons.org/tata/0057A8?viewbox=auto", fallback: "TATA", color: "#45A6FF" },
  { name: "Jio", logo: "https://cdn.simpleicons.org/jio/0A66C2?viewbox=auto", fallback: "Jio", color: "#00A8FF" },
  { name: "Reliance", logo: "https://cdn.simpleicons.org/relianceindustrieslimited/D1AB66?viewbox=auto", fallback: "Reliance", color: "#D1AB66" },
];

/* ═══ HOOKS ═══ */
function useRevealAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
        } else { entry.target.classList.remove('visible'); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}


/* ═══ DEVICE DETECTION HOOK ═══ */
function useDevice() {
  const getDevice = () => {
    const ua = navigator.userAgent;
    const w = window.innerWidth;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    if (w <= 480 || (isMobileUA && w <= 600)) return 'mobile';
    if (w <= 900) return 'tablet';
    return 'desktop';
  };
  const [device, setDevice] = useState(() => {
    try { return getDevice(); } catch(e) { return 'desktop'; }
  });
  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return { device, isMobile: device === 'mobile', isTablet: device === 'tablet', isDesktop: device === 'desktop' };
}

/* ═══ LOGO ═══ */
function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="9" cy="14" r="7" stroke="#00e5ff" strokeWidth="2" fill="none" />
      <circle cx="19" cy="14" r="7" stroke="#b388ff" strokeWidth="2" fill="none" />
      <path d="M14 8.5C15.8 10.2 15.8 17.8 14 19.5" stroke="url(#lg1)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <defs><linearGradient id="lg1" x1="14" y1="8" x2="14" y2="20" gradientUnits="userSpaceOnUse"><stop stopColor="#00e5ff"/><stop offset="1" stopColor="#b388ff"/></linearGradient></defs>
    </svg>
  );
}

/* ═══ NAV ═══ */
function Nav() {
  const { isMobile } = useDevice();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'The Problem', id: 'problem' },
    { label: 'For Brands', id: 'for-brands' },
    { label: 'For Creators', id: 'for-creators' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Meet Founder', id: 'founder' },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => scrollTo('hero')}>
            <div style={{ width: 40, height: 40, borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="data:image/webp;base64,UklGRqaxAABXRUJQVlA4IJqxAACw4AOdASoaBhoGPjEYiEQiIYichBABglpbvxWT6Ap6S/Y/PV4nODMswv2428en+T6jNGA2P9n+1/qP908b+L/tP3z8lv8H/1f9z9WWN/wf39/cn/U/bhoIZa8+7xf9Y/zn+O/a7+8f///j/bb02/xf93/cB/hH8X/z/+T/0H+s/vv///4/h//Lf2BfrV/tf8H+8vzdf5T/ff4r3i/6n9x/8T8An9O/vn+1/NrvHv3e9gH+if3v/heuf/4f9R+//0g/1D/X/+n/Uf7j///Qj/M/7T/wfz7+QD/r+oB/2///7AH7/+1v4f/9f9J7FfQb71+xP+U/wXwH+O+1x63/27/i/dRoL9I/n/Mj+Qfbb8l/lP2q/L38rfyn+48C/xzxBfw3+T/5f8kf8j+zn4WvPtSvQF7s/5n/F/ur/ofpV+9/4/oX9tv+N7gH7Bf6383P3/6D71/2Af57/gv9p/lP3h/vn1K/zv/K/y/91/dT20foH+M/5n+E/KH7Cv5p/Wf+D/ff3f/zP////v2//9H+O/wr////n68/tl9///3+zH9QP+B/R/5b////WDN/gvbBsxvhK9pScFr93j0lGQvy59qLgYwVgeD+iJZ5ET9sGzuqOn+lV1R0/0quqOn+lV1R0/0ezvCAGCch+citwcFX/A03/dL0TFNnI8GlEquqOn+lV1R0/qI+WpV7f+GfffxJH29wcQt2eRE/bBs7qjp/pVdUdP9Krqjp/pVdUdP9KvblXEJL5PcLnOHZtPL1XVHT/Sq6o6Om3hITH8JAgh0/0quqOn+lV1R0/0quqOn+lV1R0/0quqOn+lV1R0/0jTVpiUTS/Jq3xp/pVdUdP80osN0xFJ6OWFaL/gvbBs7qjp/pVdUdP9Krqjp/pVdUdP9Krqjp/pVdUdP81EQ6sX1/FOKaRE/bBs6xrWkYLcLSDZ3VHT/Sq6o6f6VXVHT/Sq6o6f6VXVHT/Sq6o6f6VXVHT/NQGORMB0ih0cBXVHT/NNMz1vT2eqqOn+lV1R0/0quqOn+lV1R0/0quqOn+lV1R0/0quqOn+lV1R088OXwZjdWs2wbOsa1p7HvV4L2wbO6o6f6VXVHT/Sq6o6f6VXVHT/Sq6o6f6VXVHT/Sq6o6f5qzPVpU9I/6VVjOMNcvlWxfIiftg2d1R0/0quqOn+lV1R0/0quqOn+lV1R0/0quqOn+lV1R0/lCSutVD2rtCN92E1jTx/Sq6o6f6VXVHT/Sq6o6f6VXVHT/Sq6o6f6VXVHT/Sq6o6f6VXVG6zelbTjJ+hiBLRknLyEapcuqOn+lV1R0/0quqOn+lV1R0/nUR6u0Krqjp/pVdUdP9Krqjp/pVdgKXCUBVdaRjGzzxxqHXA4ZNKUs8iJ+2DZ3VHT/Sq6o6f6SAgLND0stS17JoR7LpknWQ7PIiftg2d1R0/0quqOjzJRa/E5hIQvi2HZ5ET9sGzuqOn+lV1RvSpBMLnGrV60fdf5Q3jyg8XrQnvJ+2DZ3VHT/Sq6o6f6VVlmwYbvuKfFbYzR2ESo6f6VXVHT/Sq6o6f5tzajoeuS3K5WSx4pDb7a50pL+WXZi9s/DFYesSxtCyHZ5ET9sGzuqOn+lQ0tES4HSr9m4h0Gcsh2eRE/bBs7qjp/pIAjc+4PQ1EmD/vyIitLZSHtQE2m77gA7rGWS/1NOlrbmNn3+w7PIiftg2d1R0/0qFW7kCkPo/zfiUdP9Krqjp/pVdUdII/DyMThoiEULfl+DwNxbFbjcST0kZi6t/kUqXZodFYBP8qk9dmdDoeckTTxlqXzlSpLh2eRE/bBs7qjp/pUMtnEjEgwErQ5UY6f6VXVHT/Sq6o6RAIPvMTA6QOT+gD/uqk5h9QkniZ+rd7EbCS12hpJwIUXX81Wb+SRjvm9NuVlYnQ5BKYnWQ7PIiftg2d1R086widfJtqhCxB12hVdUdP9KrqjpA9lS8kBxcvQHz1zp105vaTEPkVOEpt1ZoFV2IEFBykeFqtzYuSDWzBE5S4q5mHQ/G6Cy6o6f6VXVHT/Sqs6P0LI7jKkYn8F7YNndUdP9KiyWHgyU7eQow0CU9SVRS6sQo5eF7uBBXaFV4BVJtSBF/HM0LjY0Adc9FeeyzTVjCv6BLmA6yHZ5ET9sGzuqFkWAMexLS+E7PIiftg2d1RvSo/tpjevWUHgfCPHqJcRbgYlldAOiJMAn6cSWhgpZjbalh7LG1ya2AYfuD2Py3s5EquqOn+lV1R0/k+MVJLrv/gsiftg2d1R0/0j/Kl5F9vW/HIv4COpIU9AnESaeKJvBsu1R0/0qGtlUr3oJyGXbCMvAHdtRz9JR/3B6j/Az7jp/pVdUdP9Krqjp/pVdUdP9Kq3ZxCZTp92E5sq1hzoN7BZpw/bu2y5ZDs56aTKXWiADHK67bpXmxL73CvZ5Dvpgp7Ds8iJ+2DZ3VHT/Sq6o6f6VXMQOyxCGzKmInzoYJa77FeEKBmEs6bMsN1y2NBY0azP8kr9k3EI0oQnhiF54dD8O1AGE3iEquqOn+lV1R0/0quqOn+lV1FtzDjlNpErfe9LFJsPzHUjPFPo/F4VKSzuOn+amo9E90g15+0KOhhRxoh7Gzn+WGzflR/gvbBs7qjp/pVdUdP9KrqhjDcskf3GBeIn9Y2J05Fij+dZyHB0FKCEYFi+lV1Ruq7FRBdE6IvhzvnPPT54El0sB/iqNBeqWwFMOys7ncE+VH+C9sGzuqOn+lV1R0/0quot+NvOqfn/+boHYWs12Wj4Z91bVJzxwO7Ky+QIBto1tKrpNk4A73l1R0/kHwbC+AtyNG54M5P+fM3RI0f5XKKT//IxxIbQvm4uSPZurnWUYFZy5AlKS36Z3VHT/Sq6o6f6VXVHT/SP8qQPqOQpS6NzWtbCrQ+2jCPCZqHQuPk60DJQAfwkEZyjAg9gF3UKhyDo+d2qlbFke5QojExzwzI6A6IHSr0bnZ64Vtvs9M54/n4POX6qLP9h2eRE/bBs7qjp/pVdUNNvOeV/zw0NJQ2eJvkTi0xx3rqzV7mEzjE8ATzUHMThueBrOd9pYCr3Ff3gS2t69ZxrXuG9XeqDOp9xHJER2eQeGE6ntjmh8b1JcOzyIn7YNndUdP9KrqjelYZdnKNo7abSf0qrGZE8F4ycJptPumlVFHLO4oDsNBUFDsAmRnanr3yuzkFeBn23wsoyFt54FyBSTGbrmHZGdrY5yTLJhz9o3NYdniee/JlgINpcOYquqOn+lV1R0/0quqOkD2VKaxaBYofW7rIdjnob4WkbSkfEYJ/VL6cbk+0HPzB3+8+StWN8qI66Qn1Q/ys5Ds8Tm0/W/q5WiBDK2hVdUdP9Krqjp/pVXOxbQSZyYDhDaz+C9r2kJ/M30jN2z2WC9ByhqnVeOp7vM3UcsfOZOq7I1onZ8tonETR5gqx3Rs7qjo8b8kj+8u1BS+Vj/Be2DZ3VHT/Sq6o6QPZUf25gklvmt/+oU/0quWe8TLCyak/xz9j8kx8FiKHJ47Oj3gbULXWU0LhSl0bnPov+C9pIvvZdyKZPtDHcMuDv2HZ5ET9sGzuqOn+b8MWRnaWCQmECkltWq+46f6RoWBlOZTGdZYEknjrwXyQmeuFh1WqBtdDRhUy37Is8iJ+ko0Q0ZeMM3zC7fkmBLcOzyIn7YNndUdP9I/zsOPRuIdhgriFwOf/8tCq6iOgKrgvjqML8AfGfVfpj93CTZyndIIDcMYD/V2hVcta5o9c7ZXyJ/fuzmMXjnk/bBs7qjp/pVdUNNv7zgQ7O6oCV4ueM4GSF+C9sFab0VFx1dPGS/d2TtgsI8rx4iD12uMS3P6VXVCqwnmtYoiQ2kHIdgg/8sX7nkRP2wbO6o6f6VEuz4LdptlSuime5r5EPpXR0/0jQr86K61VNcZmZFV2hHiksR3RCEYNGFRSkm/4L2vaaXUY9O5Z3lKSpt/f7+qzmFmB3jp/pVdUdP9KrmIHkqEgWCTSUtxKLKlJLaH6tUdP5JCcZ3SGdWnBy6o3j4fykjfCYVi5x+lV1RuubpOAxNw0gMani0EMZ/oD+m5u1BKj8uqOn+lV1R0/0kTw8tBnC/kcBaoFFlSkltD9WqOn8khOM7pDNINachfVHRyaBBmuWQoWT8e0uovtXVHTzc1Gai/k0HcBJ5Y7RhJXbVdwBA92MRUGzuqOn+lV1RvUY7oOQLmG5QGcOVHjxQ1pcX4Dp/pUKz2oUWRtIR3B2dA+XUgcBls2Rqu0KrlrWUEh4m3iMDWCpsh3PoP9T2H2JJjLTPoWQ7PIiftg2dbtJ7lqDLiMVoJ3ZXxuGoDprDl1XVHR0yyMnO4+sbFLPIOVcYwFUKyoi72HZ5EGe984HO2XD4j/BZ1wK5aHOw3QCG2Vv4dnkRP2wbO6o30qHk/42qWN/h6PTzjCX855YhBIRnnOl9LPIii6wbO6ytCq6oVWMSuHaeVHKGZ7s5Awg+XWrRBH1CfMfBAFVndUdP9Krqjp/MWoBS7TLr+/fYUOsH119EenPRZCsFGrXB0md1R0/0quqOn+lVZDQbHdyJFWv4efhijC/11gj66TJh11POiJhaFV1R0/0quo0GvRiR37+/K+hgY9rOLXLXGsrvVrEyDbBLOGA1Hq5h3sBXaFV1R0/0quqN1zQmBE/xhr9hmhZ2egY6/jGNDvyc4N1JgdEcb3tsLQquqOn+lV1UxHg7+/e0FV4CWkn/rl8BwGLKVRibt+Ok64TvcYL6SJUr8At8IuUMfqJDhifw0yLkwAFhk64L2wbO6o6f6VCv++Vab7Kd1Zo+6HFKJcPd//34bES12qsq1Xd0302PC5wHi7x89pxIJ8eeBnXLIxd+JsYH9sGzuqOn+lV7hJ/ZKfAkfvOqZrAojYxczXQTIC2GzKznXShcgOxrWwVgo1a3g81T/Sq6o6f6VVkND0+hPfbgPuQ8jdY133uzlarHc9/kZoAFGTNWNzz8lnd2ZKsAq0GilvbFPGSL/gvbBs7qjp6Q6hb1FyMNW7QxUO4vEdM4toS8x+R8lf5Qp03Txnuw91gVkf7/zO/8zwiSZtCzxRIXqkV/VaQ7PIiftg2YsA2dzuRNBG9Z+VdZ1viRf86jaN7n6zvAJ12TX7ZFxoU3QuFj67QqESKyCFi767LKvUOKeFP+C9sGzuqOoEHQHIUIUvQUFtAT6pVdUboCTAzLVSYHRFVd34wbd5vjRoVXVHT/Sq6o6f6VXNwOazf2YALpO1Bgwk7R0rmCiHQdWbxWn7Hw/4M7pMCBEQ0dP9Krqjp/p+ZKaF9bCKEhD1mB72rfwbcLCJW5W4ig7qv9TkyCftg2d1R0/0quqOn+lV8nn3v6CWo1NsleQhwAe6PDKeYux66E+kXKheT19ASRI7qfSq6o6f6VXM/g7nAnUC3S9F+l+4L2wbMYX06G8JVv5dUdP9Krqjp/pVdUdP9Ml1f33OJJ5hRltqdWv2wbO5cEbffMRqWIqi4MPWi3win5dUdP9KrqjsxRk3ROEPseySO0th2eRCFCuXZCONgMjrIdnkRP2wbO6o6f6VXV9+c6OD6HbOZuzMiAhfJVcy48RgW6xmdSXOKg2d1R0/0qvcbXnKb9hr9wPPQrVHXHVzp4k2l1xylxEemzuqOn+lV1R0/0quqOoMwFMWanmKGygjyApjDrIepxelJ38a9uhrJICKTp5D/pVdUdP9Kr1P4WSj09oAXAIpQ3d0JVdULHowuTBIb0w3Zw12WA3obFCyHZ5ET9sGzuqOn+lZAyDxZ4XeQ8UXOcVjaFVYysOHeDeF+FFKrqjp/pVdUMXvHX7hE7j3yk886dV2hVcwxD3PjWzRWRBrXDJVdUdP9Krqjp/pVdUdQIUS70DtGudXhwbq1BJSHZC9P5BtyeLcIiPejjJZMmZP5md9JnmP2F/wXtg2d1R1ItxtHWB7p4svyaFkOxwym49F79vHp3fgAk7bwDC9OuptIjGMYw4dKcGXVHT/Sq6o3V0vdSilpRGsxvhtH8shdP08X9P0jJ/esnpjRibNpidWz7YKgvaxkoiYxjMF6/V9V1R0/0quqOkCCgMsjfkMssaRhoew7HDK+rZCGR/s9dqNmo37cE2VuQsqpmN0XQevEn7YNndUdP80yFeeEJMrBL6P5hRF+7dEUHwIIoAsdc4KFSnv5v7ZIICxtcg6jNaLemheOhSST5c98tc6VXVHT/Sq6obx0HsLPamQPFoEuJtnkgZ5kOnrgdtX8LZmvqYW68CZCgqEvDn7Qucsh2eRE/bBs6xaWbF+GGV8oTU1zozgsDyEeGkVTF3JPmCYjRDy9BFoWy8rOZoGEk0nW4UU1s1LKSvnoh36wLwyOFTZ3VHT/Sq6pAleSIoFkjAtxdjkp/cWWkjcqsI/t/8HEraxYgEMPF6IQ/uWshmlNt4bDCqGjom6FV1R0/0quqOnm1xicWhx2FbvOoOrsU8bohZf1Nq2r9Ga8EA6KrnZA33DnmSCyrpgPFADeFHTemHYuG/oNaeCDbPMHTvHT/Sq6o6f6SXVjaz5ZaHVwmp1/VIatlbQLZFOKG+lbS5JzwkbbQSbauCoS8OftDyq6o6f6VXVHT/SoVntQosjcr+YQBKkMcwcHjpeTe0zGiyd/cCTcnHJ29U5jwigWPBJmtFYEtY2tq/hnGrUiJ+2DZ3VHT/S84Gi2zgsVKUSBZRp3CGaUXG5uRTV9D//UWb/7yqBEWObFDCBP2wbO6o6f6VXVCqJEdPAUzGgDHGGRQHqxqBHH/TbHGfLuODLbzdwtCq6o6f6VXVHT+YblPNh9VHzS/7mRaPwa/hrdLgCDahsO8IayDIndLqjp/JBgep5ESxMkFsfpVdRHQFQmiscANAijTc1ue+uXDtGTu6khlryXljT+q6o6f6VXVHT+Yldql8bdZ+WPCZzEnyxLYwT52RcKUujc33YdnkQZ8crD/Ozo5uvZbfaEbeC4aOw8ift+A6f6VCs9+SfLO5Q6xxSL7JnA3J1zX98Iin+Hjp/pVdUdP9KrmJfwD1qZNtS1Y25hoyFqE+qHA9KrqjddBSSdpVlTXx5ET3q5ce1xDFQMbjp/pGcPp2J+rI13XHtyOIhobecQQh2HtXaFV1R0/0quozE8wP1OaZhPm8el+kjzBw2uPDs8iJZWrCtKM+Q62MOshzyL5BHpeNA2U9nm/Ds8g8zf3PiMZrTQe44+NmxLUA3rGI+RE/bBs7qjp/pJJSoQS60xs6rvKJcVR0gvtXVHTzdBSSdpvg+cG7qHZ3L+QaaIE83FQV2vZRmeRE9zoCq4Lp/KQ8Q8b1h1+gOw0dP9Krqjp/pVcxORXtBJnLlBKPvrc/u5lvVdoVXLWuhrh2m95IZ8a/TnhyInvWTTk5PjIgRekLwyaFkOx0LAynKcB3bedWRnZUlw7PIiftg2d1R0/0j/KlNYw0x0OGWTDn7R0rIdnkHWuhrh2N2HZtt4rfSq5ZVwIz2h8qAadpc75ex0/0qFZ75NvMo4Ubf17i4/McJmeRE/bBs7qjp/pUS7QeuzmJurnXSFCn6ewm2DZ3LWuhrh2N2FQB/Kz3quqF7qwKXxpjmMfn/sBXaFVY+RKn00tnvOQHlA7B8085+w7PIiftg2d1R0/0j/Kj/IWYNkurASAWQ7PIOtZQU9S3Rj5GVPHMxmujlO4hVu/BdGE5EpIHTSWIydcF7YK2LKriU2dpC6W9Sh+WAV1R0/0quqOn+lV1Qx2p/5xtJF9TkyOV+2w7PIgz3uWR9jeP6ovj6++7kKHXcQRu3xht+RQXFyCZcE21bQ8LyWP1ao6fyZJXvUJv6MOVHycJiKNoVXVHT/Sq6o6f6VVuziF9A5k8jlBCq6oVWL09c7Zbq0lBU7npwGCV/2sqzkMb1Iu4rvW/aCxbbQ1DbAmyHj5QMado1WP3TbBs6zrN2Rc9H9uew6f6VXVHT/Sq6o6f6SAk/FjdRhg3BR8NCyHOaWdvW7EF+2/Dc7g+FkP34uL2uZ/VLCYpdzLaq4E/efjHMkA3H8vW+NOl9LPIg0CyHql4b+2Sq6o6f6VXVHT/Sq6o3qLSyWlTDjOHe0s8iDPe5ZH2N841mmIKGmNXjccDd45ou9Z9yPh5PTGvofaZsWbwvUTnt8eG9utQcBJEepvHMMhlk/rroXMGP1ao6PHxi2X8bcw5dx0/0quqOn+lV1R0/0qJR/ldFk1eh7SMBBP0lG8GByW6ioQi7aMdON31QFTsIGIjfN6ctONOHQvtAkgpR6CgnX372JDc3ONadaZKJZEWmvU19K6OjsW90oLR71CR8Q8XgvbBs7qjp/pVdUdP9Kq52JWLUNu78MAsetqshWfiv5LQX1vNJPcnZn4sDbOTDaT3L24WGQ2/5Hmqp/pGlf5Y6vjehtV6BfPt2asZtcSJxfUrX/C3/i4KmTVRwLxhedlKaxMlV1R0/0quqOn+lV1R0/0kXEyeosoi/nFwV1g3VshXp0W9rLJDMP4SLNbaYU8GieLpmcTRQsiAYp3F4t02TasuzJBiiK4XHHLDcrKSIAHRQAsuP6V8Kx0PJxCkNznJVdUdP9Krqjp/pVdUdP9JAS4NR2oHkYmj2V3I3t3i0AdC5XaEitgQrXNIwrSvdhJTQdtfDCI/KEGUf35LLqjp/pVdUdP9Krqjp/pVdUMdyxVSwFPCZhiU/CMLNiOb77Nbzx7raOKIn7XxpTDbxviHpIxKbkOqCfoAkAkCeZ5ET9sGzuqOn+lV1R0/0quqGO5YqnKp98vzGlCpNFbXi8GkaVuuWQ7Oevvl0R5EQMb3EJkauGbD+/G4PY/Vl1R0/0quqOn+lV1R0/0quqOn8xbgsDZUeys5HDlvau+xrZlv/A2enAPm6yqfofUJy5lekK+C6ELTi3MODjpqjp/pVdUdP9KYfobqjp/pVdUdP9JFw8CuV/gR+Ybl5fp3q525CtzuKMYOrcJcbNaVyM13wu85FTsIayWzjYcJ1kOzyIn7YNndRIp2ObQquqOn+lV1R0gfET8PEXtCBKxO0tuSpRwphJFCyHY7pf7EbUcsoYzjMzieUHluo9nV2hVdUdP9KrqjdihssxsJUECftg2d1R0/0qrdlhD/clCWdhQGvBIxQusP3xtGnVM6w6HSITPXM8X8BvAdB7+5iQTZW98G9sweUHbr6eysf4L2wbO6o6f6VXLgirl2gJSSO25oNndUdP9Krqjp/m/DK5y3fBhyAN5Wed8rr8wusuBZsfwcLTnKm4z0ogtYqa0M1+EENI0rPlyux71zRUe1TyIn7YNndUdP9KrlvBMu5TZQ5IT9sGzuqOn+lV1RvTlkPFBHM/pd6i8HPYkLor8o8HgV2xzQEevPIbtQMP2rHPRQv1c/YRfJ1eryBlICbLen+lV1R0/0quqOn8pqNti2xQKT2mb00LIdnkRP2wbO6o6ek/plSDqPkTSsxE+pk13EWBLe6mr8v5u9R38FsF+/kTk3tJ2M8Dl8EjiwOsRQHBrfmzRnFyiHiN29P9Krqjp/pVdUdP81SUnNh5cIjEiiKt739uyHZ5ET9sGzuqOn+lRJrRNTYup5L+PzFIxHcCjrOMxRB1vRDjRzliYpta8baPrzrEg78pbN9LzPXbW/2HZ5ET9sGzuqOn+lVZ1PlSHC3eT+UNbP2HZ5ET9sGzuqOn+lV2aJ2TdBSYxEQqhvYLChxunCGPceuQQ5TxwaXgsRiT+q2e4gZDh+C9sGzuqOn+lV1R0/0je0D1c67jUNn9L27PIiftg2d1R0/0quqOn8zdTE8Bl1VYbdWfH6vy4I2RrHC3CVrCB7Ds8iJ+2DZ3VHT/Sq6oWMk6dyMANotNO68uC9sGzuqOn+lV1R0/0quqR/GUOB/s/c70fQ9wxaFuzyIn7YNndUdP9Krqjp/pH7bKdAq5UMBs23Y/gmkkRP2wbO6o6f6VXVHT/Sq6o6f6q71+FkOzyIn7YNndUdP9Krqjp/pVWbGBo2JvbYdjqVsSU02bXtsGzuqOn+lV1R0/0quqOn+lV1R0/0quqOn+lV1R0/0quqOn+lV1QqLDHqOtnZ5NEGLjOUQ+b/Sq6o6f6VXVHT/Sq6o6f6VXVHT/Sq6o6f6VXVHT/Sq6o6f6VXUQ27Bc8+ERf8FuU5TsUV3OhZDs8iJ+2DZ3VHT/Sq6o6f6VXVHT/Sq6o6f6VXVHT/Sq6o6f5ouFKarHiE6CWQ7PE3rquI6f37QquqOn+lV1R0/0quqOn+lV1R0/0quqOn+lV1R0/0quqOn+kZtXSXhz9nFdPIifte0dmXrdPY6nWfmjp/pVdUdP9Krqjp/pVdUdP9Krqjp/pVdUdP9Krqjp/pVdRGO+TwgOwmOw7PIiftJ2EFeQvgXdqLQquqOn+lV1R0/0quqOn+lV1R0/0quqOn+lV1R0/0quqN6GBdtB04ONn+lV1R0/0jVdleDox9jQX3yIn7YNndUdP9Krqjp/pVdUdP9Krqjp/pVdUdP9Krqjdbfq2J55mIwQ6f6VXVHT/SoWe6lCWVmcFvnEdsys8iJ+2DZ3VHT/Sq6o6f6VXVHT/Sq6o6f6VXVHT/NK87h40P30am2H+6NjO6o6f6VXVHT/SoZd7cqNqWwmajct6C0KFguOhET9sGzuqOn+lV1R0/0quqOn+lV1R0/0quqFU/WUyBnD3LiSMtB+fpaTXPh0dP9KrqIAA/v7YUAFZrQu2YX4sgpCWsX/PtVsdC/jikkIh2JbDKB50itLmcGrcLiEpAFmMmCbSX8zZjXogzcL4JQZ4uFkQqB30HVQ6PSmc0w5mr4ticAhkgxnxtWDvmx66JSxG/d1yR6jp1nXIRhqc4EkVk11TmRuCfskfjkOXRRDpJlEdDgY9EaCCZjnaw5lmEISwj+R5IUCl8ndhq9dg5iBkqhbA4aVf1LuJRN4vHr3srlz9BIvLzanEWZ0SxUqOP26/myipphDHFy7PGgX6GofhPMN61Iq66ppyQ5cnplCuYAAAAAAvKxrB+jDvOU1btr2752AmuB6rmA9fZw8YPHrHBkFXAKSxUxtae3RnRQFEGRiqEAVM+x1S2R9a6DBf+/+gyJyZORIDFd2VZP3HwuFcRbL9R6ayMLvl/ph313BLAdCeTLcKoIa94WbocETW3mZdFRaPiG0Xf//KcPwk+th39ThJb+B3UthOrbongGQb8N2gouPROjBdCZGVcMSUhxyn/+dyxqWT8O4U+HZkZRG0RKB3uqEDyRmlZzKPjKXnhNu+xRwJg+zzJzQm1ocjrYmrGdQxZAAAIv9z49V5RI6nsTf20C9iKhdgvJEV5E5zRtxL6wh3FDfJu2ohSznRSYzd05EMmqkMSyAHw9ReCw9LPcCJUUgjC/81zY9+e6NdCWYoNnzTLAi38SL8OH+5uCD43QZcWvU3/7V9EnJFFky6ik9OJjRE9Abt7wzUS2qXqANjmmihsT0i7Ke8hac/aD3B1d7x0AAAAAAAAATR1eM2wp6l/XPs5eCg8mbrnXNbJ3uXTlOwpz4xcU130bPs/gJnH6cMGV7SbfVkVjBnrMErgwFPyuqkmtIhvnFU7J21yPsFd8/13EssrN3HvHDgWIKjakwyLZVOUPGyDi2yNx1vZY6q6AA1UVbf6yacQMXdA0MENRMld/b70pGbLx4z8lp2qSS7nqbG0nHOi5VGCKlZcUZWEvuuJgpI5mA1Yi02PLu/p99Z5D2bpit/n53OH9/FqCZTLr3Y8Pg8L3ehO5ODG0MKs4WA7zykGkoRmKgzkgR6RSHhDIv2GLwAAAAAAAAAGS+QDizxF3Jl/t6qg6KHfmDwnQqsmxZo0dtaQrQ6NXIhs6DacNVOv79ZpThAcpSdsUfHkt22wJpOcGgJzAJGLjybhCSxymwHZLV7bjX/lCM2aac1Z4pIAAisAP0+Nq6Lj4VKoY7Kmy8CgTjk2QwCgIEC/ruwntdWZdSwukDBsZSyB8uTD/9tiI43kBz/ZlDf/NUOdakBouEj8YXsfEOr0CvRElI6n8RoL2cIHbzICpYBdx0NG8yrh/Cvo3I9qZpHJoleAAAAAAAAABi5o3wBABeR6mBdkni0MLbYB0eQw17BY+A6rusr1k2OlEFKcIZZb3wi8kogeRKB5AoeN3o71HIw8FVMdqnuQLYAy6RpY39A83vkI+Fg1PJZt/nmabKKTAA6B+bfB58A+zFAcPj3HSpSV7mYLbOh5HEIVRTXZqOupnHeMW6aeLr3yHCPsqBgIp4Tgt+iN+vRbHskWXgzY/VEfUVNuOW3yqqF0oAVTuw3/aCJJootslkKZhVPGDhcAAAAAAAAAAf7Iji5rcS4Tckp5gIu+QVe8JeIT0JJHF1vtAtc2x5l18hdqoEYV0MFwQ0HevD6fQKhj7SE910uGDe7wzj4clTS24+8MBroYBMQatxQvHeJ9WMVKFkQt95eMCwfkxcPv7E9AVzNZ4qpB5krdma2rUKCk4AGW2M/FZmGOCF0BKa121d8yXC+z1Bv3VzFaGVd00MyAAAAAAAAABUUZ3cercmqSSi13IcwljAEApSbKYFsniFKej24CWOY8JIsdsqBPyW1h+92WZzWBOCbm8uU+lSGKKZgkscusTNylrBJNAjP/i/zd4TRUdaUQen7Q/luvBOSz16gxjY2eecPRSixZ2QDCGJ3ybnGmIe28e3EgRNGmZYUMq7po1oAAAAAAAAABLXAi95lnTK39GliSQ1wVCmyOhlOw2WseiRrApEi5qgOumJsFVTto8xRPz6MZ4MqSs2GPx6BCb5DO4bCkoAkAW7qxwfomBrVr+QF1lF2AQyAQMnyxZ8qCgPzLak2ikXSMBhApMSMTQ5iVYyOZwvi7yeEo0doQuGQNbbSnbgEniu6Ne30HCAzXMdzilxAAAAAAAAAAAAduBlEGD6ld5ydvqNjP/MqwNhtgfTrHrpKYmx3roDNeRGt+Zn6QiqMrzGcwV893N3woUxCDkR1H3EOIxsW2sNxf/DRuK8bV379bMj34BG4LASrBdoqzMklEepQnh3WO5w1XITWHygWyVBjJFOInzjeVwAAAAAAAAAABKKOs4mByXg9XSHuNzu60tKt66tNIpW+aeEOuvM3lWwNt1ECTT33hewfWJxL3rU33VGmcYcotQntQ32OYlQR+sHSntA9qJSI/B/PrhpmaZso7KiB5WP/e4Dn8b5B2DnvWbK75SS39XYD4Vi3D1J0kE/KH/Zraw8b6kDEAAAABKG0I4cOGwgAAAExIoEyA6aG8F7Qxcr6PCVjP1cNf7poKGSrRnuWSDg165dXVXuEgVstO0B/tVPCPnaF7pOAxqCyybuRHkqWGl2y+bfjtzaiX5eMbV0Y0MdMnhWEpedoDGp29DIgN99Cy9hmIvKeDl2yh38pSjuWnbIKQAAAB+IaBfcgP2pMPmuy/zht6sCp6W1AiCOpk73Qlivw4azf997AAAAMRA3hXHSoPWNdWerdGkLMpes0hJOnGQ2fRMhK/hN0UGZZfgHg9gOg/zy7PSmQ/19taTclHcKZ/CAOAfSLJQ2cSDybmUExDeLAG/CZwfASQFcmWP1ex9Pm/+r3I0266ud3XCgieybMkIAAABYHGt+IgjbGseKf6gORD09rAaS5DcEE99xIyRS6KZADWRvcSGnilJt8Hbe996lw+zEKsQAN4DBn1D0ICpP4iagClerrFSMp+7AAAGIYVfTyEwSjKFXA4fWNMlFtqprhj47sYt3ugSPWE44SeswOToTVjo6Kzd6c/iIsqhD7FBXn600iDEpXVNo1JlhT0HuMUAqKQOAzf0/ztQVfSbma5df4soP9gXKBUrqQOdrQAAAJOjHC3sWcphMKftSe30ygQQAm4pbQcxfozUHoIB0Fs1E1qTCbBw0P1fV0WDHbYV5snYNKP1BZwQLknzfQkO+A3tIpUukBQZFHnYw4dt7Mdumg7hsJ2zRknsRojEhadmLS+pboQAAAdvQWL9MzOwABGhcuPDJeeLmA3jyU9pDAL427dHOfEYK0SXQX/oKvoyVN2U2pZqJS43zFIxxLUewih78o/wApft8ZaoCuT6d9cbt5NFOIv0dCbGs4oV8z1tfygoTDUWeegAABJilby2yy8us/rS3vjahvt4YxStjRPpdPD6kEV31IjbAJt2fW/mYiH3+HH4fmQAhIIf/mEuirw++47AZX35nvu+CvVdDdiDeyAyW0Urn7JlN/Ap3b//EHC3bgQVX5kPhIVMEUNW0hEDG6YvtZ/kTxX9S2DsR68aJsOQLH0/+efNxgAATGaftndp+53G2qFiqFrFddZW/I3DcDTSvrOgTs+I1Cl4nFjDLYyTbQqlIIPvHCtfGgL3UrMKehT33Mu5PRLD3FjejPpd1cyfAgY530MHQUVNodzFFaQ+tjgnpL0AAAB7YwGJltm5RQJzWfqTZFyHF4Ya+kDyqFKgAa77Odi7z5ddgxkfpSSyfGJ3Go5hrECDO4q3iHlM0tgDZAcVD4rcSr5sB6F5tHMXC2hvhWkfA+HlwQCSvRcAVQvAFX2zIIZp99xvBSLjr2FqGjJ8kuGXYE+taXqgg26RXTmPJQvA+M23G5eE3R1Hgl7vTAwDixsBmmFBtSaDVqunrYfkeVN1IWahhTT27Z+3h7pyvgXT896hTLNZK08WXEqBuchphyTReGudFw6heHV9kX0RSk5pYpsJKV/Tj6a9wT97JCQ2ZrYN8FuOHwZy6hwLcFk7/Gc/kB/nfTSUg47kQrgFq/49XoA2Y+IE5/xZZo+eNl3Ku0TDG2lcT7x7snSW3BbC+fJRjXGT1dV6B1WF8IwuXTV/z8qIrbHf/wZG83iCmA2iEo8mLj4eBa03DEwB8+5c4ZkxRB0Ct/hTSIKwv/blBpJECISThjQpoy9m2eO/DolN7UjYFeyTRpYrSzxtvDAsPSYk1l4++vFtrtKXjWwpPhVrq3az2g0cAAAAQ9txRp2X/xWf04H+b6GSE/eX7yZiq44d4OFI8LdZl+sCSnQd8zEj/zMiLZHCswkmbrLnn1Qv+fOTphPZoVBJl2Eh78kij1K/cbwee75bwQoXjuoFL4tv4AAIFaQunKRjNAwUQU206EcFKf62vQ3cTFufNST3JDhEzLEFLc3l7q2RNjwdkOmyrw0Uvi7Opi7rPkV1aBMVy0BdlomB4pZd6U3pQkhV5fU8UJnba23vKUP82drav/MbXC9/hDJzqFsI1NUCPJZg5e+41lxIGHsOYsxFs+qznt4hu9x97t2Fznh5pMFUNeKvssHZN5w2Gt0FTqjw35mfPC6oNmg9fpr7Qys9//cin5WxDgH3UU88T4N2od1HLCrWiCLnjnVuLczYBHJ5fm1X2ZjR6cOraIDNLSTUWh9aAfKoAO+8gtFXOxQCSFOgIwjxCanKyIW90yJMtLYfjMyxER33sMlwpoDkmnUG5pgFKWv8CV2fqYrU9+JKAX16/nqnJ/KapLHd0EKIzs+q8Fhluk9MetOmh+byA/5jqpz7M6ziDlmVd/GrKkH2vJny34RNxBC/1W+9DR+h6hiC/9kb7iKCeexQlvTWcnXmbuj075BmOg0rHH4jh7MoIBbOm4UFHkZGnVO4zVh8LCm83Y0SY68LoDKlL9oXvt4QwABffTsw8OTQ88RL22I7MEZWRX6mEiasMvcIS79FN4xSN/to0GHGTw7+23iJ7h34QDOWDn7OrXsqa++dI3RUZOIwa5sRJVcHuq8vqV2gAATvkp/MdBjdNv8FaPdVeFnweEc8grsLYn/po69JG9a1xpj8TEDpAmd3XbsUPQ0HKqGLsWV385rESEKADNB2iBbo7sjz7i565tbU3FkI/KEXYnqrNZaA9yPtdN3uPKftK6N/ldets3KXKNtTYa6o/RmxuA8DmkYZqwKbJFoVhbUlpe5hLfxTM/arIAaRZ08igh3zysOZXLSeZCVPwJE/i2QkAABcEl6RueJkTZnrz0tHja3kJq594er+tIdcvTtEXojgJYckA502IcKOuutwVUqjBjv43a9OsB2uggYdDUjIn1U3APO/yQ2e9e2HP0+zF5W7FZzfNjh3mZAPhlynxIcaLYoJThskKKPWMdJZd7HiCcnivb2rHjx6hTtSmWpHxxeUWVu552nOgGyZkBqL8ygJV3acQjNF167I6AANHosOZNN8XrtDm/bbUJGRjY3gU6akpVlEblR9MsidITRvLR+jVDLCWuQ8t0z86g+NkmmkpfVRSo/v+vVGy7N1dbegzbS+sBAMuwx5QUJmAABM2jz06ymxvc4d/UN2mrSn/9obuUdkLm3Oah3ZH176dMoD/jvPimIiB3gIdKRdcABYtWBDnsxJo7O4FkIjiAuY40WRsiMgLpB9/chnq7OgVrFH43ZXnt5JTnsNLrkX5IUPzSR+IP99Gsv3j6Y8cy7cWxTd3dgOH94KiUBv/62A26CqJ1Zfay7XTqrASoTz//guWHpbwkU54LSuNoDmQ2I6m06G2V5efNba473O4gi0m/73hcSODOWiX1vk0PsCdsneYHuTMPsNONsAcpnH1NJZ//rnMIMFf74fJns6PJguMkOk//0c43sxryccY7pmxkKGaedRqpdb6ZDDelCGM1nT7YNvZBX043uxaYefZXHQ5LtADJtpVB+4afieiHEVudWtQHsUSDedGndHE2xZ9PEJZRpCyAJAADhhBCEA/LUMJlyy9AA602fp5Zzg3YLazn0fNOAbYUvMOppPL4x4y0ufbOh6GSVCtsKDmQo/WOEAAABmZqkOTX3tiMYPHjpf19t7s6+cjpqAnGxYoWiVDsGaVzT/rrvAZvy+dnFQzhY/WOw1IO99JqRnIxSS/h8DmxJnTv3ph3t3S4JLcpOZVQCQlsVJYS+B4DJ98zB629ku+8UU3Gwf11UKAg/MFDWHd8Z4ztvhI7U5COjlE7Onbo7RbSPyj5IqdH1BhMdmAk4G0ejYL41lXquyr8zh6IL78yHgXw2TMfnDJ98Wm/F/UMQfSE/mPAQPdqS7z5LXV2h7JXtTYrxo88nCiZsiCLDri6OBdTskauj54LfLnrO3NfmQ6fOJqMXIJfG2PL4T3MlrWGgABc7oLHkbF/chM9P/ggBTzFj0MevC0h4eO01u8yhmAACybXnHpO/NZzdBavmUsDZ+VAdmwa9zvAABHdXRdY5scJISdvtMpu2/eB/QCD3yt77QxNsUA7KZNhW2Z5YwH2D/+RzUj2ZMYkgScEiQoPSdPVeYe+J4JQDZszRfADJLsiwvLUoR+evlwfOm9fVGLmBT6TO6sysn8l773dstIkEpib19YG8L1tV75pHaGHq5su0wY8Z1fga05Yw/OEd3KB0HO2hQOZCjQtg87TLg0wBTFjs7K8HmajxoIrYKfGwtN8El2WLs/xrArjUGVz/ziXpDWTOQPJg5GOSK5RvyehyEKISaY0TOImev6xsredC4VtO9jTqNHGGu6ypGcjOxqHMbVHvOPO2drEP+03TuwAAAAFt8AM5lcEM9WrNyBMzUBLUi+GOiZN/qpM/spPeGFQIeE/DOzA9wTEFzIP3YxbolMMwx0aLWEQtOxzJSzlaEKZ6NDR7xkv9C3G50XLBLvGJcQJE7i5p7lhWJkEraNwrtpKzuk0uDOKKADX7dgT4x6BIsMDZ0Gg5UdmFxRbIGncUO7svaf4We/WBrvMUi/axHNMLPo61ejLE0anNRNc3kjB2CjhcBHgQhN939A3vT7mre9LR490Q+tMivdrX6qYvXLRFiI/naLlbzGEAAAAG1/7GB6y21wUaWVaMiunO84HyxIApTCaVdGl63bPiokbDeRoX60sKGte7M6DImyDvU1KnEbTeaCH56DME5jyFeqnMFY4RUY3Woy5BV+EqXmVMb83AIeYWiLM5oRrqMEBPei006AC87VWu7GT90I/LWeN7dawS9jS7HyTI45QH0c7ZLqEwpoI+q/Hti6JePW2yJ3cieAKZvMGlxqSZDDD+E2FQ7wxxECCICWtBVJhstdr2l6JbVgWGpIq9Ex0OVBZCGlOfL3RYCMdeKFDoAAAADkHdH4VltrQKUKIfTgc26VAcTu9ThKFIqTdP63+AFU5koJPmiyNo4cnLHHCKX+6qozO1gtY0eUn8ZhhfmipZkPfthIOeSwH8BC6QF2Tgr/LXe+dp58rturY+d6LOxQDgelTZCudz+2+fJVCRyc6McYRGwp1MSY7/DfYfw80GhaWS8B3+n06FS62aR1EvBR/6cA4ezy6vw3fZ1bMOElbFnh0a3fM99PrdzdSL8ZCXdeMzPwGPa82KykqGmJoR2OxmqihpQZLwrGIaXPUHKylmjnbkVYBtjd/fmm5DVvKQ3po4gwvQLXkqVNQ/1IiaGAAAAHcMX/Ctlv6MmhFc/8l5Dt1nSA3Tujuil+GlMoGvvdBKKiOPSPc0KuzfqMZKakmH4151yihzqy3eqIOvOgrPHOgipZTAA3eyVeRD9fHZ1/N0DigfHFp+ut7qnvoZDyQAxm2LL0kFQw//ORVnx+HirZFsEFI7q8Z9CJw7TO0TmGsSAeGcptBm5cgAExtcN0eAp+SDmOLXLge+FBl3L5855VEuvzUroSkyxM6vQ0UFefr2NgQpHCLJARiNuqlyZGOfT46xcbEp6hUTR+/xBEPKXhlJAmTFSjVPnYdykhOuwhyIxS8CICP5ACBw2H9+tD7qdrATq3FM4/KDOxxNpe2xVGALtMDS6BAAAAvCS0/OtvydgiwS4/+fvXEUn8/PBgjS2ScTHq4oBVZFDOIWnkyrICn6dpUsQHDeSKwMuqzJwPZjY6o6tCK97a69KNjJ/8d4wulw+emNAhlDgFLJlRpbZk/ymFweUobfVLmLzakHNY//pcRLDP9koZMflcWdnRbOleHsH45QBz5MN7O5fjdvS12Yh1awAXZly7AWbZSc1QJQcAC/c0a1M2IW0ttc1T2PYsVdyBr0sUC9UEqrb0En2m/bcKtmgywsLeGr1UWnF9gIkyMTo7+r/HV6agc+ZS/NPIcvFX7Uw/hVwyzWDHYrxZCdWLoAXwXfcTQDyDG+iJMOe9emBhjnRGiPH8/y8Jbn9nPEzIWNiyoWDd7uUUIq9ChSUEpKQ96G4eo9V76WWe0DBj7iWjO3E11hhq2vGYIm8LDtwgzQdP14ggjOyy5ftbHV3IS5IMQw/nmXW30iR8LNZPV2bgIgPEVSLtzytoqLaqqwXhPcF1s3Pt+0NixAGRj8idt25Cio3rxpomGCt7jxB69a9moSn1cueiZdxNAgobttPpBS4n2Npr0cfqBFtFtyvRM3hm8Z83RYS0G/GsrCtMNthTi2lMcBR0VS5IQh0l2Ca1ZO14JxRooDvCSFgw9lorbQ5WdYBGDrA07FPxTLhv720FZrivewi2EWUjxhSLVvUdrysD8K20g06PxpL8RgZ0enc+Ht/f2Y/BPPc99rLmTnUliYvXmtXzJuce/dfvknID96UNs/R3c6yhODvc9K+JHrfy61vgl8KTLTz/QW74UXRXQc7F+QuF5CmpGhHlJ2YjtTfEdiIKL2fFoWTafYDbYZe+r4ZJ5AsD9zDCXj6+taMn3mILhu76X4RnJaXSiYZi1TUtfRIptkUvLlK1bXNzW7BJ3OY/xIOlv29q50QnbvfRa8TNUTV3XuKhNdrN+g85uuhnBkMprhcI0XlYM2uqSyX5neQoCeD5rbTZGqG5pmzYOMkl3zQKUi9giIVawAebidxTP3wCMRHfQosSJ+akAAAC9kDyy2M59NVn2rnjwrKtQc/oZMRZQz6+pJgDSgkKdzYJwzT6aXj3/kEAkN3HECQKw9BJRS4XwtqoYzPoD7ydDmho5IEqkl29Y1xPL+NQKRR40lyxqULqdcDmuVBNTodoAsfALLBEfWUcry2DBMc7+FWV27JyUVmAKcDcvzAa2Y27iF2Yg3HuQUNQSHI598aIRUbjc+zuiUMzhNxE+or3vK7GMsgN2ejns6IS8tuKZJ1htK2OE4ifCmoYsZM2u4H0l7HecyXcDKcQI63JVMcA+Eq+YfPMd89/Hb033bynnS3ajRGpI/HZpJVq8MGmASm6g6KZpsAXsEk/mkqegcNsm8uTC6wrl4UGCCFDkqnb4uZiJUvz7ZsbttPg7DRVneUrlHoVvnEKXZxNBy9R5nlcSjGZZPeRa8rqVWJuqL9z6yaT/sQDfO3ZdBCEUABDgi48Eu2yd3cGgMx53r5L+LgS3gL8fDq8YzucquVI/XXBFm98JTnCZMZoye4TJfOvTUXwg8NtQuXca9JVSrwtHo7RqDNeLL9U5mcQr67OpgDRg4W9OL8w2UpG8BOZGxHVsPeKFEvAJiIgiLfIAgNaQZcSlbK1RNgkU9z7SzwoiD/3jaGRqmaOmPJm2zPvIVxw+RerfHiiToBvLwKh0A73m/f/lBhfXbKcjx6ZXOoup+OjLWLMovmosVmAwBA6liYwHqkWrCfEXkWXLWZpot/hUjROMcwwB2fNJGlCDE9Bbs/yUXzE+i0StTXlEm27/R9c+ABEr5PwU8g+SINGFjiGiEQ4k67mp2MZLXPRGqMPmc6uK9J0J/fE+OHBMg7a8r25BeImsOpe6TtIms4duG5+UZgvzcQwHbcIu0PygHru4vhgr5xJ4f5rQWDcBiOgAAAlVcwM/v4Z6tPLFLzsob+hM9NsOV2sDwxepHc5ppzCHT5JggHIbCanWN9sFIUTnd4x35K2zQ0lXt92ojKzNO3rVSnzlvyrjcyuER+wK/GpRmDgU59MkwcM0kTuzKzkhhuChC75BjD7aeZNu2R0fA3ShCxa64lem3H5NdDgmaz9Pz6wmEE2ODllJFJB4V4W0o6aVTgJKnZq6fotvqWKanRCYOcsgtU6NepJpfVFlYL1R+lPjUeza3PlKT9k0bAfo8lSAIXEFY/+5BQa2/utzH944yTU8JDNvGkbx92Qtz7vNwM6s8yUGj86eicWR8yS3p/i1BxFWa3989oEIf6KWO4iRl2yUsN4YvQGGA9ywQRiatyDNOIr+9Ow3ojwStoamRMVNTkOlN4ZT0lVg8LZr5s9PQNV6InEcmGyQQhEeDJsgAE9Mf8aPlzhItaxwDVlaE9C1L2dnowjwMXZqvu9L7sMCZZul4X9+fhyT2I0X71IM0Pv0rzVSzzdL+X2ighJZX7qxJUNShAvek1YX6KYNpakl0PSe0amTXsTN07j0v53P184iNJWyra/N2KNU08bM9COgpzI6JwIJmucDmxNAfZWdn9ikhu8+K6i8JvwacqQMSxs33qkmqfN+ICJwqMfqw1yPq+1jJkjBd/noJPHkpmkUS+R2+gY5iVA4cg86ZXvBRFl7WfHeemuyiB6ktJOwg+pjvqNBp1wcU1F6MaQn8Y1Bx3c5MUY9NvNBqCtJqMqRGaVHTew7wbOlfridpWPglFO5t2wEdjSZgSHOsvoRKyM7kIwf9jKgtMgkfw5UQ1jrB6kwyEHI9vVHULKNI1lBy3/wdW8XJfwmnEAsErMcFYmVagxIF6rKVFkad6TgF4qGUzl7rWVAgAAE7XLwqMTGE4AF7KTaBSjlturlciSoeehw+eO8odzDmHetZi94mYTXTlM13/iyfIfHCUML8dz//JXteT4MdKuC2TPfKcITPVfakbV90MDu0lw+O84Xe7fWHv5ajd3ctoamEz8OSOX8U9moKheaW+WtX1EggtORLuGUokLH0kS/HyNbe+/QHMhuLCZjV9oG1IqhYoE6vP3rYsTu9j4pRiJko5j2359MX1mii4QbA+tvyUVBOALY+jYRcPKRiWNNC5Uc2/oFjS09aLX78GJ8TYxVIGoeWyYT+xRB+QXC0WSF22ftyNZRfJLM8j9sUUfkapRK+aFQWsYay8HgmvUb0tYB23MJmVQ/e6I0Bbid84IV+ZfkN8xDmmpOb/6zcgsHXSw13O9ORE74b6WmCDPO+/Ww+YVO9iMq49x7MVTkxg3M+LBXLE6m7c69fkn8dWX3crIUeR/MuUmDz7EsJ57OZRy066vIN174iBCwe5cMWktc+1md6MVdXHpD+dM+WkjQaZyXPRt8AvsDr09Mma1VJn1XiYOtJeIhzt3F+By/ukJjFjvTOcIKoKWbPszDRjHlHmCA7WurtU4VfoyHlggTg2+od9TvhtwvFVK7oXeWf1i9tHd4Ok/bzb7fUHbU1XWwx93sU2ZDgcR2u+Jk/kSP+1JxYpmDZnRqzxMlFPH6t3Phksku3xHqbwovh8VkndSQfV6O9GaIlDczpkYhUm3le6gbM7X/1IA5Hok5F0CndQAYoegBXkfHTfC8rSaU8deMKTXPkxFQHUKNNxlY7t1ymHDTJS5As1bb/cJ3SNKYv4wvfne7pvaHyXltmdiE/1QCNqZuwfJzea44jO+i9q0XxFYqAhF3TWxZFJnZs4jnRRPVslE37q7aLTvLoA4cI6uG+TBPlawaXNueCwWK84/4nVarFG0svUQRmwpsOnQVnsjOdTQtgWpUUY5h8bPPWIAAAxAIQ9FIOWRO7c/pJd57PeqxcW6yerWdXqVj2dqRLME9FMkJegTGyNL8DXEgAXPoHMsiqeLwbL2RNwCizyDXS69ofYytHz6x/IJsGGY4vBrNZTHyOanxmQPT1TXtb2Lk411/56jg4M2tUs3nrUmsv6bqryIRMLQRCLQ3snZoPtCX7iO++HbgDBhBL4fP4V6jnHkoNYJ0pywYBRmD1W9WsaEWFGqrja3Mo9q6/lnuoebVNuAtsBdpK4oEzXqKWElYAbHghNcX6NrIfHiuOjLf4R/onsod1lUnDXTBXS0MVwD5gsPjgZNEDgxGWksTAbAY0k0DNbDwIZBM/4PTMpt/YZibIFV7S2vBLSUOGA/gZtEJ8e/PHkNS17yd9P2ehbh/P3HaMxpXMZBFsNM4EuiV+UqWXUVAZSET5guAAfUMuoJA2MI8VD6oJ5zNFmTwz7rs9gzeOqA6NcBm4Cj6Ukx7bBueSVBQ0HoRxzK7xk0h0YExgAABm8o+ntIG1yEf4Viw86EtItqMbxQmQLObECVMgU1R4agRFuy+sxcghzGWHFuvv3/GLUfIUj7PtTnbyt5fyruVz0jpTQ56PAoIuuJ0rClbeqaA5z7xVhERlY3F3XnCYYuayMtqYHgqB3nnFjYgu5sw1+V39E9b2A6Crd5CGaU2kNpEyF+UxHUqn22Dos74JGkiWw+cAA20Bmc/fEHSg0LIpKqpfYtBhH1M8+hQ4k4bUhnkFA/Eg+ppRuKQU38a9KltdM/Iaw4JVWNBAULU/yQxRV6nMw8hxG/yRkMinU9CV79NWAlywO9zGns3aVABgscBE9BHz5La3PQPnShhhwO+hgt98lcaWMEZVCaGU8eDH0CJiTRw3SRa0siGJ98D1hxGjax3brd/u8aT7LYn3EZyii1ojIgWYsV13PQ/7aloUrQ3y6Ts1ABd4HxTX/7oqTHm3jcJchHXiruHA+Ov7Rzo+ljYMuZPFCIwkfgkF0VFWLpLF40NqjAXfZXFlZDiK4hYLTmFcqMTkzSKCWPTVw3TIJPBTG2AgbI4gAAEGtXTSNjq7OIn5fQuORL07vLJTzv3xyOp69hi9xqOOBxq5+QS86vcc+KfxZG4MxZedt7uY4VQf/z6Y3+6WgRsITOeRQf6V9ggXg08IM4urn3+m60yQN7JJ4XStSaICfw901CIovYTcRACqfYzeb9rqHYeKyVqhiX1GkWo1zWLZHR5gF8ytlQWlEC+TXRCHr0ut0O1BrGvFdTzrnWdazoV4nH2wFZ0tjDqxH+7SrrnbdU1GPfGh0WUzOkJz9MFL3ybnI4KSYgVroe0PH0p40qZm32jGHK2AxlK4MFXYoWjAug/xLQWdbjQiYz7GdC2UpmWetF+VrX4av+ncwu3+ilAQyCZ8cHdrpXilG9mdpM6SOi8DApiHBhKsDLbqNBp5/IGmyu2Z2BuvYIA5UiM2gR6WODtDo6E5ePPJQzZ0SvNIr8iGTc9lnxDF8CXiD7s+52/4M+CWstD2o/KO4vgO0BB0R7PnQsTxtPku2B0aZG75iTAEUOqdBsx6eRj9dHrxIWn62HtjDOfxWgZNL8l/KK+ozxxAcMcO8uV72CuNHCKQULMyOrQqdFkCAqIiFce4HKPjlk8AGn0l8oWo4oDB9Jv1iKU7HBIAADbI8anc5VuSKbxmYtW685tXRAJiJ9A6ojagGr/8cW0WU+zS0IZLLpfsIVeAjeLFEUZziTRQcnpEVrmh345TM8f5rnnWDsqFPXNC8F48G5oVB4/zpQFNifuZy9RJq2uaeJmGaQEFukXTzlMdAHxS+7zeWnqTquWMKeRBxNPh3yVLvPAZLQP5glU4GHplb9Y38ev7EDDYSjqZvdtDUOg/+6FM/iDBzTALdoibyeLmhjpIyivvpjTsajGHMs5Jf1GqRX4US2xjmf2CcMWMqryaBAOae3Nv28nqRuSjDeJq2sb7E6NTAO9biMZnktC00TgYSQZ+iCqbiQ1mwOJeljb4w1DwYFTgPL6KOpdXs58Kh6IgR3lMd3EUNjru7BttVbn71xO0quu0Zktsc77lBzjXvKYtvjt//jK843xJLH3PSBDa12NRHoC46Web6hX7nJU9YAANL8QFhsG6S/kyKZ9aBEFvONXyPRXm6BkzqYwRQPYkEcE19kHQmq+kjl6y5I6Y2c+FbNeaHtKXjmmkBOXZm43u9cuRmlWzkVtY3ddO5NiR1YGlb95ierhGLDGnyPyC+fF93zRIN6iaAz/hAAAzZ8W616ZTIfwhwoOlMmVJ3f41nhiSHrFQxL9sEecghOBksVkGeDtRpS0mTKjgW2fM0QTUUXxKkQuRiijuRV354mVb7YO7QrkTSpywtlvZDBLCd39CrIKwUP0dJopw9lwJ3GBiGiCT8xGpUe3EQmBO9R2symNvYoQvmYVYjvHmQ/Vr4DTE3LmTmS9BGxf/aAj9JsD1rU7M5W1Re1CVzR8qj6dfAdbLNgnq/rIOXpmTmPSXHh2VdOlpo5sWCG4OMO6cisoSJ7LpXo3QyyL4wDCdsXeDfhMXqB6e0vhAoJlNZj+KYDy+EAQUFIGvXWNJYXyB1g4k6ltEt5jiBCgoySyrYwhmh8u9ldq3gJ/GNHx77q0tvDRyXQBAlGS1aicYaYrhv3GHM8ijRwc9ppGKHwFzmTUXPPq1erx3eysvZtHdIAA1PxAWGwbpL+TIrRvGLZyotqIaPgigY27yP53Kyl7UM8l2ASZbCZCII5ev1x+ViQIpCT7oxZ4ZewTTztfCK7SP67H6jkfQhblzq6pYrvx+51LU0J1wGVZKp9txb+qnSfG6HoyNH8AVVGNes8J/gqXwRQ6N67AAAriaJDKwOC4epuOGSZRs5CW5zsShTgWo0WCg7IK9bfISfRmG18IFToY3YbPr2CK19kC40DyeVTuMv0ctQL/ZZyzAdpJ02uGqoE2xmAxKDyM91N1FMhA151wEgrqK/X8LunrdJTaRxmG73M8iAEGum60zqFZ5wftul5dcvdcwlfd5uUqX3S6QvhgMRME5NN2qeLwbTzTdw2n/T1h9qB7dBh7XwGmQ6ltF5kV4wZmJuqLtdetBfP5ss1+x+M8Bme9EtLuxUl1ekCYLczKVVyASHwAZHuz43cuxRajTkjoGnQ91RC/X6cHBHklxw/3SiCU5DVftFBMYLEGiZXmk63IU1ww41kcTQ7Y9l6r5GmBlwYn3wPW0mRhjWBkDknQUM+IaCxLgbaLFabYbJdGSxwTxjRWglXDfkPayoor5ysfMAAsyaEjbu6wPVBrw83k9ExIFw0LvW+mu28Nb/GJ/etneWyZuDEhTw49e/gpJ4jXniT+fV4a+fDMDF62SrPkwUug9rm20oaCiyjrZw+AVVQUr81thREXK3kFV5MK7JvQKbbYTGE6+7xXK62Ibe6M2yfmVC/4OwmubSAAANdqb/0HVRlGQZcDa+IxNiBtL+5yNdoMCypfXZ6qOuxlDZ+wwsqAEBKZ2loQBUBK/YkYFt7CTmoAxZbS9s1rhY5OR4HMnzW8vGM3P/TI47o6TSaFQO2lC35HamXs2XpeVJt0zBmPZ3+YuRAgcmMznSLCIysdHiHmGKH5ueWJlqN09yFJkVwaYbere5Zc3TmDm1AG/DSdbY0FtKoXl+MX41HDaKWq/qISk2Qo16Itiw15dR77V2Rg/GeAx4ZG3Btz5ZcxAyqliO1QRxPsm+805lsFlt3BNlBeAgQJHj1eUeTQtedfwSi3nk12XBZ5gKU3Pdm1iEMA/xk/opJBnxGmwQl4gfas9ROdmo9Nz8+OBlWd9yibV6cj7sSqT7e0quwQYpmxsCJztpLMsyRoSOvkv+PhwEcNzqqBcvibNAtyaEjbu0VyefMVgjn2DTxZzk7Gh+7CnWTcCajMZtUG1QAQQljNe4gjyCnrj8rEgRRP4IZAgUjgb0akasyR9P7gEuhCDP7jy1i5DPcswBg27UFz/Sn3RqdzsExk4Cpv6mGeXoiEKeoM+s8bAghr36mxg+ngAAqKt7YOau1u7lCT1HxlSlAluK09+AWwFTwhvfVZMIry9ZVZVqaOnYsLi8iRuh8Fv6EnQPVQbKJjEFrB2JhZcmgDpkEp984TMsNUWTLoCQbC/xYI7Z4fjBAvyaNjEZ7sZawmEZOl0ldghRQPPZeU1/wuepfAOvAUHJpyEXruGbzRs4W9QX0uSJ3gsPF6i9NQU536x/FMPWJraHuu9UgK0qwgmSKu57hOTLh4rJC/bxmaXfy7Nrex7DTCO/FnzzHI3z+mG+7+nzu3vJZNeZVzGCC7LskIekUZwELAcOiHNgcQhKZtA33qAguoCknEFGGqgCdpmV5pOtyFNbpvBpOG91Mym34yf0UkgvB4zXsFDcAcvjrqBD7Se/N8ivmZVqVAHA5RKabPAR4x9eQF3I5XJ+pD8cc8OBAzV23oD+0C9iV7Hyv+A+rKVtBAk2Ecg5j5y+Lmv1HSopIZAWJkUaBpvBNasA38FJPEa88VUheum0pZatGmp4BSTYo6KLuuWUb32/1Et5BT1wRHwxuER7uBiFDLKcJD9q1xsZtzS/dQJpysC1ebgXw/k7dqfeI8Hhovi++N+59gAAM9bYj0Ke72/2AVKORV4nyk2CTBDgD2VL9RVrB87XHvYKL8NndIIWfYxaV0kn2UgqEg2Id3xg7A0O5JOdUNI0h5xH52WWggzz9WPvXqadfsSMC454iaEnnEwlV9KjeEaC5GLduz9NEa9OwPm1reTKwQliJNWxVTAGZsWE6jtkyIsBO9R3qC+mzw0sthp/lAwVY2eJtKTUCLqYxjvjK4Y1KMHvHMfm+RalfHm8J5h3Qr9mwDRxQ0Q+KskR6FgfyftXHwIcN939PndvxakW9KppbZJCDSwBaBFgChqU+4/7emGSW5lZQD43UXbNuyk+JEQB8vrIwxkxWmEgLObxciQ3V0X6ZxrGouBtp1ojPECumwWhNoxQuzNtEsu0ilZZBu3J8tYC52JWFCMuohXS77fjKmt9vxlTX6XAACGUlqPRmDI5/8qerdiGaSAEjz1lDJRdZ5cE2FIlATfDPb2N9pM5uCZFm9Q0j8x3ZK/d1CIynIQqz5MFLoPcwzn85tl9jPkrRnVTq/uGimWGI87NFJV8gdfE+UFnF/NnSgx15jpy7BvhaCKumABxISBo4v9/NuBAAv4/0FZN/AXHg4ApQpzpz8ZyExePuGtRWLkHAuJe3j/0q3och6XiVjG+9uQAlHWfGxs48TLKL14okNYoGf2906qVEN+pm6EQYJT7xYBO3sqaIusSB3vJrWxe4wEoDrjjAE3M92O/kz7PogXfk/Cv5R7CE71/sX3OG5WcC0L9k1bF5L+QNcfbTl9/X8SuLkN0xlS8XhFX79WWQC7x5joMYyzv+8xmb6DKjsYAjRuDOO3sY7x5kP0JHkJitJzKJ2rb4LF3WHPx3Y3S4FDGSUBu0PtvzcJhrWCgA/pkSxOAcW0SvVWNHz7BZ8krk9F80o4bBSTiCjLRAFEZT47RG3cfpIMT8YfTgjXXstphyPl2cqoc6nDWab7gd/g7/0LLD5HIUWieIHUK0XzSaKWlbR+M5ZQONICdzSbZoe1r8MU9PFlOgABtfiAsNHcVNW/YbtSR67iavkeivzGmM19Es0SyrtdlAyAf9b0OixXf9nkdRPVL+TA2wsCnz4ZgZ41npi17if3C9ubt4VpvrKXlmD8EFEgkBos89MD905HJyNbiZ6iMzqVm/3NPjovb3D0YkPwigqYHgF3m8JfUeM/orfwRW4sXkAALbXb59iFqS2Uu4zd3tL/bXcfIMUWGbqHwjcGKJ2d2oGucaF99EMEOGfscGjG4sm2XvqLzDNlpElEU6ETsidBq0EyNuvzN5TT3h4hYeFuxZbS9yRf0fylRafc4mCLCmoW2cmPsmtFwvvKOpPdU+L8LsvWyqOQocF1KoWwYfQDRn+J6mxYxXz5xW5Dfhwue4O3ulyWiggICIsuwonWeXHr535qMw5R3V8tHPEAcTLGzw+9cuinVTw7JADm7PSFYbYOkj2oGa3I5VeJs3MSqwHANrTpMiz0voEl6FHwucNVkb7i6Ua/fR5t5m0MFIvs1+z1r/QQ2CL86qXXDfPN324E0e8DMaGCmdVZpvuB4H2XYQtdpb0nWY/0AS974ITX7C3hoyWrUTjDPr0lXJUxHnSsYN+GPEpz3dMVFAbmCgOoh15am0QElCx4vhbBUnhNh+/PAC4JoSNuSL2nHpMAdBtVcCGCR9K2HivQ9iyvK2yFlo77/ZUDtn/Cv2vZ2qsj71WhfyTwGRPpWsrG/Ia6cs4XyziHbwiuXTLC/ad7sqYDaht28ySu4MsAyX1OI877M6yRVSqdrdYU1xta8TgKw0rD0hL9U0i8A62muiFH+39xc/LKEr9YJnBpt38O+fAxvNTuhYpvvmzjeogABPoeGRFm1GUQ6nn5MxwiWVirv16Thp45NsAauSg8tEkEwGbJkEI78FiLb6dEM07pbsMeEb6anGrUo9g0iFYyGW+f/SxUzOnC7h6ZipWLe43csd41dz1QGNyZI6sHc27YIjGZp4m/3iwlPArFYs3udyI8rDVbPgd1YsLq0tkpRicPrgMTMB3g6yiE74bOZeWmUxw04l041J6uC7IAAAATB5Ag+BB0yYh8N7klA6NwcNFnv3mmg80AVittH/gke0WAghMwYFjg/H8sbtDlRykL/dBt62+mgN/j5rpa4gzdJWAv1655Msxg/4/ljdobqYyViad+6Gn0kg6AAnAg43L+Yo5XRwKmnDeNUwziZh0WyV0Ev7ysJySeyNMq6Zk2nM7nsY7vTSto/wErsEoUUWnGDXegQAN7bRG8RfPT7ATu2h2x6tHryu79gml+PhUXJWELsbtaTfHkVwhZwV3v3FXJFsc4S4C6ykRuAr6GkXfGQr//+3qVGvOCYvkofBq8hWG98jmDyCDaFMC4Wp5jKy/XOSxTpA0fpXntRxzQ4TjlDtveqC/MsYqrGk8QubYkCyuJ1KMA2a/vUv37mYM7EX9I2CUB0yCVBO5rV3BrhiMF2jZ8R6z4GGjWcv+MK2moNjafhdcQ7M9R5ETwKNbDAAAP7QL18M81Ly57ibwzR7QLAowdHHvpDB2iS+NR7SWM3qTcYrOnLU4U+revhfL+65Jfyy9X3JGQSH2wkEPTFrDNzLAEuXmBrtGgp8fyxu0I5jz/2xezXgcA2qM0jnKia3s6T9RxkFhZf+Bhr7Vtp8v/e2nERmt6GGMfVVH6fP3qmr33LjpYFXXoZ3gLYMq3sJNouhhlwoubMS53WRsj1WfdM7/Fl0rxBPmhxNEa9nBuekAALqWLdWDQvKDalDbGYbLkKtVrhJHpzZV4hczzaokWt5SiNSSU7X8nomMVhvxLDMmHive/0e6gwJwSP8KDgzaAYHOrqIhg3bGwmCWY7LvYlXzkEkrOZfkQLGJMbv0bu7zLDdx0Rpxy8e9WgVc8RNt02QrMVEPL+MS5POdGpTJOoa1/LpWd82wsfP4UzU3+9u576U1BFhaIq6VmfzeOAzmCtqfBowyLOIKqA1IZ7ntejlLka2OUXB24huwjy9I1Igpwwyati92X3oAAJg8gQfAg6ZMQ8LXSkzUpASX6PfDMWGlV+o6VFF12hFeNsmyGoAQ5Lf8jaqyPvcYibMaI+1OtneSDx/0SysJmdzkVWY7L+YzlgUvVVbmLs1xMQki1fa/BwmI+KKN3Riha036KRHfjps1bBEhez8Sz7mOME/6or6XecKsfKUZkJg8JpycNsRCb/83krZ7djPgL1z6Hb/FMJikPzCo7LyYvEhuTUqTDr7tRen/GCWXZk2ZwjQoHORlp0FxGCN/U6lR8BgYBfU/BxRAATpbN6I4+L0TvK2Sc6VgZ+gno4W4htqkGJUjk7cy99/hCQZs+zh/FcAXuls7uRQhQYnA2IBQ4GnbxIfklb/Bocqz5xnrTUsG2mEkM8kkY3xwv/5OJmlMl0tClyE0KcYCUysw3ihPaTzTnTONyTVpU+lWNuLQn/ljerpHCo4x6hKD86lUXe1v2np4KevJO094Cr9W0iYlKlubFzL4ffNC42k9XnzqehhCtACKZds6LFSfZcXnO0N9AjhluQH9gVZg1FqRJFwS2Pfb4CKcaFKYq985PpkFFf9uuUO7tfGA9R8/Sojok2LZdpwxNiYSqqXi8D59Y25EeXSNGGNEX8hcVC866gJyHGtfW5X6TkPWXS5c275EURUnDnTjBP7yONk+K3Iet6lDbOb223BwGS9uwrl1OC/LbzRSVHB7C+TyWARZOqZXA/UZIhhW8ST8i7x44KSoqrdJeaCmrf2RWEjB1rf4qrHNWykK+HWkWr7s29Amj9ktMxeL72OHZAAeikYl86goj0/3/OeundV0/GfeQK/g+rRv3nRwo2NmsDZ3BLuh5aGnbhcJjxwkb1LNFzSvXnoqp3VoaxmcuqMXkKKTVjgM5jHDcwxf0gDpyOL7k0MrOahZo77bZcPhA0yOrexd/xCgMk4PRSKhrCeDYSvtu40d1Vhu2cBLI6oF+9GwaJ0Hx/tLQ0YBtMxu/BIYZfuUAAaX4gKr/3pdckv5aOfVbLYF8QXD4ekYT8ASn+QVmF2YOynIWr6uidGv37hRqLhN5gXNi7XtRqao7yQeV9ojtfKQSgg6axHtiSyWPyYBnuMn6G9WVRn8JGTpug4CeBpQ1hvmNOQ9mKU7VINWSCXJWysS8aH6aGGzIDqmpCSAthjGgDF5rlo2A4PY3Ua2ciItnE1zSeBUWrj+Df4HsGb6pHjjwOVIWI9nHznKtFCIvoWraGZuemZLHsoKSD4WpHgvvv2Zk+vlnKf+fzcbL/vuuFHEbaibd1o2T5NPqHLkSqmGxAtPjxjJ4zs/aXpksUDkWtmKTVeTsar4K5R/0mwnctppwvTW7h5N+GmkCYdywViGzmv4NhrcvKJBVZc7uv/9z0Fqzlws8BIOsGb82dH3Ntnenyhn6l4vAAymdEKqgVwAKio5VxUNh2rx/jAI3pfp17wLvntD4Lw5eTfQ6xPWs+AZsjBn/2ep1AFsY080eePfaCTEXkZ+goam2vFp6u3advswYcX61Zoqm1Ll6ovd1w5vhvN2U207mJIN9rKjOIczSm7IyZrcgLbg/Ffvo9NG0Ob9XHWbLLCjoAcBNQFrOgRfZUh6amsdO9Z7BVopCJoZuV45bpy1UNsQ1bAMnj0Fkcj76r6v24jjJkRoiJ49CNDWmHNutNNJUL9TnTG0rsl+YesF4nF49HtTLE107Iei/+IAA/jjmSQTquuyMJpXrcd/CLt65/g11APWFqDGtFdT8J0+0cto9sF7Ua5HacaUvBUp9u/4CvUSrsExvp7u4S1q9NgLCVBsSZg4jB9xa9Sc3PN5yjKMtL1OAAyQmsnoJ0msfRu1yS3iOJ+tSaDkkY6LtW/RKUgQQ32EAwiNKstelrtGzSoIL571OwoQ3O8GG7jmNFBviZmAT//67Z7GKS0hr6mdrK1fBDV53/flV+DG/dpXJwPpsfXGEYgAN4Fhzh0ES/76EiiOdbgUKon9QTxECY1gfgsUjTKaSnta7/Zn9vyIGHSoOOtI6RZ4WiMG/f5niUKi/eClHlaL+/RoxYSXLeCpd23EOswNCBGw/401DLlfP3OUlPLpOKnxqm9ffRwu03JTnDnpMZleBVu7Y8VAn4VpwcEu5q4AvxIngQwTfdyCTAN6Syt6f6aroj8ws/Ems8dzgkgAgysdaCtFdsykh6fCa1QsstFutlJik4G/YdKHMkJPY0+Lb4YheapVFxo/5POQ9XkhOrB3NvZAuDSX138YST4MKfQLybJ9usjqgX70bBnyc1hPBUNF29OJdONSrA1aBIABqfiAqv/el1yS/lo6Sia+JZ+Ij+xSRIyeYJQ5elbPihjvWdTuYMCxwfv3D9WdZHOujI8o6/t8b+iDNyWthXz/8Rm6SsfWRpWByNiyR9f8/G+kLTme1RUH9jGQi2mwZkyYLPU4TFxDZV3SNE6iIevAv1m29z8FLov56hPZpMFGXvTiGpo0Vj5loXWJg6erjHEF8z83+LFGKlRd5Ysq9jaWuTKVBLOZn5cZcTTWGK31q5K0bkPStXaf3ivNnYjNAcjwin/9sLGTPoRPoZvf/GlqyGMkVEiS882J/tN5jGLv6qK/Yg6DSLa4IhHynR17Ebv5zThg+QSQ32xSBeYlhoKXN4lw0kRiv0BMl7hlpvxcQFue7kNmu0b+PTB7zyPr4lGhFE8wIuGC8TarWwce98QPuLzEPdO4d71hlJ5SCNSkqNj31VBh97K2yxdaydr5UqNmYDmZqkF8E0pPlEYTfKM2rcf+vxRcxQeEEsvUuo++2zD6Axc9YTbYtSgGfYf1CDOcry4xWe9fjtEkyiOMUiNSKqVFKijYqvI0h1SPJOl3iGXTAAAXi/YN+YqN2PXTTd/Kn5hLHt5bpUPWFeTRAkix7a07KDGuLX4HlhVU+dfhqieUbKY62VSaxOfT0aCgsq+0vt4F66fuVBY0FYBq84uhNtVxcwpAkpp0ryYi3eY/ujeH/42WOK51WrCXRUWlY4WG55npffqVDcnLxfFU+L0zP2QAcUsTPwrz6mPv42/hk9IpbLCZSbRQe7AMqAy2uXn1PKXVRWQ9aQKn98+brUmjexN25VFd/AZA5dZxhslGrQAd3MMvjuK6BRat09+pKj+M+6x5BNwgbp37ZT9lhw3nHrvNmwHtvAYbp1JxehTMqpdhsbVNmB468eP//dNNiyEJUxmHT135kVwBbGH/eD0wfhZ3sAhllPJXX0YjQI34CQ4WRHgJPN4JAoznY+ogZNP13YZ/PxBEmcxAOeD6K0fBA1x/PCOeebVsDzBpMkP1e8JR084wP7eaTyckF/4KGwoFPcru87mbSzBwaAgGLKTBr70DJN7vqUYACzJoSLYLETg2dMb9u8qk7/QbZ4vzMx+/IP99IQg/yNm9HNBLHtbsb/2oZvOLO5Bkh5SCUEHoXHzypGArmMaZe5ThpsFfqE9V9df/dGwbjb7v37TA2DwnTW4Diw1wLuwyi568SaGs3g5coz+ZbKVy2UOogozBNSDtx+paCarcE7sZOglPunwULxczxoamC8qbrdhXNDzLbmM67bv+mwQ+uAYYlUARgf+VmlxYMe7mAEXNM1nuieqFHAlLx5/kmyoKlR6srEVnXwrfnsbZZksTpYEBwg2AsrWnuIKSdZYbLKOeZrAkHQytBLCvYXfrHfYI4R631nlOIjF4FP9QUOiAYwoQqt2dQQ1qpBPUbf3JBiaqI4ZPe2JLtJqX+ZX3YDb/2PihODs1P/CtMJirFjdiVpYT5mkoGL20eLJM9fYlTI4obLz04GRkEcdkl/e0ivBaxfWwn+zhkYyNzmxELtXNHsah8nH81rEefr6RDgRmJA+DTXBtOEAA5Ht4YVGHRUYU6fMmaBdVJmHhawoZw2+M6Y2vpFLboEmbieK+cs4kjFjXrrYy2gECUtPWOPwPG31J7nsd0IL/GsBTW6C7WqpzdL4NtZepvuZQ/wp5qSPcUsf7jmqZoBqMyhIXnHG617NyAAI2s0Ff25jJYA1k5DZ2yQ9jIlDQSChZSpk4Dr11fjycjWh4KlL4ZdDP5LkgKLbN+1Ol5IJO1zTW1Q422BQU5u2O+cdHmBXx147BZUHOlKmwDSEmicu9hCom2/dWAAAAAAAALX1uwm9eBuliGXPU0l24owE+Tv929tarsUTlb4AhyawZ7P/Nj+rmJy+nnse4+2Wr6rKFcTZvN351NKrTJ6aUMB7AINfQ8yvHiNX602xLC/YCRaFHv7LGaA1K0kbQDOpliWiiJPqNBJaaMBXaLPXqn+OudErCaOrfTOAACXjuNBHGp68iQCA5PBf6PpA7N1k23rl53jTUFGKlDg//apQea13AjLD3EKDmNS+grVvcWt1mMlQVD8gXqOORd4oDHVWSdk61ezIrAq1NODHxg20yTVSwm3vj/f+dGhNctXd4X9t0K7c4AFZdnZGH4q3PmSn9ai7ADE8GhI/RquVg3Z7CA1MeBWBpB8TauibKg5vjzVsX1pEu6NWAl1XXPgrvXsaZr7kENSI6u2gmeI+CMdoFjyryCchXi96OKFaqcXiDPdugkxpdArySqbCCV9558iUwACqe5wuVGr1AZ0EeChl+1uZM8j9Lnb6O/XvKLL/F+P0juGFEnNzkqaHzU83sf/MABRPzaaAX3evCF91pO4V0A7yZgdtQA2Txk1oE5GcAAAG11v3ggr2tGx7Mzv2BJm97xacjJGQM3cbt7VaNxEm5R/1AGyGOtgb92nwZVJiWs996dJUWXzMv5zjUdlLniWbbieMptDpbpTbNTnHgypi74wP2Dx/ku3ZSjozAAIoW+lvpw/xIXSeRDYUcDA3diP8Z3mpyjdjEh9Gbu71uSQsL/IbMnQQN9z9ImIGvee1COxFhLhjvwqotD6JGq/eLcY1p3lPeF1ZFWgzDpnO3077iQikSGmgCxwAG/rWl+o2bW2pW23mn76ighCdgozgVqg8fPwXQdosINn2FekAn9zKXsWZxJb8VVMwlS2U82ktudZdDPsHbOQWXK5Xsf74EcwZH9s4BRNh9Qh96hn4vLeHq+0olHLxJFr9qvxegmhQmo/ivJd6RUSyGlKOEZKZfaYTXttKbC8edWgnPJNUnaLAIiEHcIb0mGrB5VpFwAAAN/ErCKQkqUKzPXE6B0k/hkyv3pX2unj8aCKSxJVIZfAi+olz3Xe5Dfk9XNdXSqps5TSSwhJD7XJ2usayBRkEOSh4NKX9wq+gsV39oyoCZS/VD+nNIxxCt/yswl+GZ41cIK6a8aGYeT9IMlslLJCnrX0XZmaGHgRet6nB1WwTgFR0alPFf2mx+vnsYNV2M9561Xx4Z1AB8aGde9sAAzn8r/0ZNPBk2mZinYpTSvHefNK1L7iWavOMPFtKCCVmZE0HbrwUW62ZuXfSDxsN0OFMP3OHkq8sBkEBxAfoA/+wO6HX7hV2wM519ICDQYcNvB35gntqBv7rl2DZhCvc/6g7HK2g5gd7SiXEsPAiJrAAAGcJZpw6q3q4lKViGhhipW/0re6bZCsUppciSYFMYqfvgvBuRyJjJb6nvnspJwCbB7ynzaCuAW74K3SxHIpBVhSG+rBGy5TQAH2e+YgzjTmzwny+UnJBuD/D7AAIdD0p2kylPcEZ3c3lOuqmrWDW5AAE4bRfnp8qEhCumt3MzJh6+BoAkKrYDfZBSCcS+GcULFmN7sKOezg5qcV5VEM+asZJT0hNzbQPrabInNi4w0vzLBDdqKzUpyMUnCOM2sU0FQico9AW57tTeUK5Dq39TS1mYsR6+Edun8ZrwAAAaCQcYIZSdR6cq6qZvLdfbE0W3WR9gCKpccsx9iKBX1YUsnPHtHAFkGFe59i9W1IzUm+4FTt2VeaReK+rZPWcKJyvpPndg1mfVtgmbD0tKuMtla4Pmu+XaR4pW5QEpBFIdb3iITrllTwBmqvuggX+oTQEj/ceYntzNkzh5+chuTnfvJH/L6wMRQQNmSajPxVbnySrMIZKLKAHLoB/21Fbv7VstOPC8522HV+ha4HgDtpPgcacu3wJyi9zGz7j8YXHTwd5bzoLhelXTJsDDppR9jhZUa2twAvYy4CzV5YYbZpqGWraeOjyP76iyGVTQE9bYKzPGxpidKBjZHNsedvVWMAAADrK2hjgAYWO9r+VcmwuXn8rhF/4jB6RIXUrMlkmvwIKyU3Af+2de6NCFz43ZA6oQ0px9FBQrRTCwFyUiz1gMP3m6dM+sIFGavXfGfgVuUghaVfga84CbLEarrEkNijH4xTmd8+wG3X11i+k92npfohkRScJI9puNLaUeM3iD1ulq554ARFMBGvWxKzrIsXS6r2b8UygVLyIgb87fT3ZxErwCDAAAOGHEKQU8wGbjjoofPFhawVk9sykGSJx0k9KCuDxGjb1xo1/7Igg3FC5hBuTZHfaPFCfCCTwJPNpFA9w0pVGBgeHOiy04eyI5nl+ryWsGNMVAAnmKfn9UZ6LrfQg5wxN4eFKBu0VyNWTUZu3peQUlIsJ9c8kVlN3F8LgndljcDGn0oeNHZ7l+Iu8RkHCPXCh4NJPpxS2BFogsQkYdDPR1tqQ70MPdvaB26t1PoC/kRmZGcssx0oAAAIG89D1eBg2t6Erxrt6x29XH72LacutiKGiyYpocUsaQ0j6Q/goxHe0YF7LGg8d3jLyN8vKt63oJsEjAX+1OYl2onCetVpZfO2SgBehjsckUkGERFfeW/EOVsu1W8CmMhxBidCwQI8IT2ForhRGbsgDKqz8fJ0SeV8F22/kEOVRCZEUeGjh8OcJrHd5CdDE/+dlMT6sO3Ql5mpWE15R9PxJWRrCpK493vMpKIxQcFB9dAAMi2LjKhUchYAEziLD8YEWBfwwOHK+ZUNSQqkGDN/3r0OWDNs/ibRuhwEkHOgVu5j0N9R0IBW3K6a3P+7jJMKT1cNvhWuGW8BOfQZw7Lqjt0zfr3fUcqGoy+fehcAkQWxSLERgILTbMZO1Bn558gCsMGr7Gw0LYJJWCtkMJICzs7hwClmTvMel5m5oFFwRPpbjbw0IcOn9+/iBmFbXz28B/x77MEdbikwObtK7g06sWYrGv4h0GXPmzk3MgjTMJb86qyjWm8Bhi0r02AqAOkfgDFC4Mnuounpu6c0Ek1Jbir/e3KNKw7JA79A870+Vf4zR789IOquIlZuvtgfxAglIsYUKHEuwgg+lY0wDbGfMxSbNSASAABQ4pQvNbhEUgCy9RA8h6Uwc7ZXUEUPUmdLDZ92cIrAanSoX7wkrOWE16y01uO0wHFhm/L1WdtY6NZlxRvtWQqryow2eVnIADKKgASCeuDqnGOlI0nAbbq24AcuzxBPCk3HJwWRAta69+7EmIZ5r3Z2Gu7AaRyNhdOgsdVTY2YWAh4oZMOUBsU6UCq91z5KYECCzEfRtDZyQrVPkv3fy/wxz5MwLkDwB7oU4vsupEH5KFygk9Iyqmae/+G3OkJK27gxJm/tdPxdu91P8er9AIBUwr52PWKFUDIh9wwgasEwwfmbep6BAAP/5yEK+CwKO4CbA/cN6sKhaVIBSNkSQBjkJQsBXlzZXHA0XapFUcjFgZy/pJ7oe9f5E5p8UvS8ADRp/Qpab13Jntek5XaHxDqAxdXmoCI3NG7CN5VA8YeE/DtAVc3z2Rtn8HtfS/3mlQeUl4Cw70L6RGQErH42S/rkEqIISCANZrgOm/aeot57qjiwQFLN7fevayW7GWtWcqGD8kgwgbvVWRdbOBTPMrT5T+dSOPXPxz09aTYnvUj5NEwnXTxg0g4CchK7IZe50bxKgEl4yh1hMMgw5zO42X3oJy1vDBxKizSIfv1faKkSgJBeVy5xIxr7RGQDdZHiw1VZPST0xrUHPc2LZegiQH3tTgyMKsVPh2vsOM2LTNke6s1IIr3AKFUVjlQ62J5GjG9wWB6ZZiWWotcl/55k/vvycQIjTyZHBm2ViMCWumdeIoH2rXYZjOXbKdt1LUxs4Gtg7dxi0aemfGcmCzCtl907zNoHOs0+aH0M06xvUHfkoGFNGS1aicYZ9fCKGfER18h9V8jTAy4MT74HraTIwxkxWell49SM+1x+XidpVdYdKm50rvw4RzhmfBwnEs1cJGLVsbe7QqXxxQAANsNgTsPj1rZg8enr9a8oGpq4WmnQaZnMRr2ni1p3zdbmGwJ2Hx62Vy7CVVIqGTSNp+dJ5e/dFNGpYTFtrLc5ngGkd4ZUOAgVOxuyaXzr4NOTrHQUC+hxtV6hEzQbZdJita5nUoUPV++srxYdHOPPlh1Txia/6Y16XVIdMQngf1rNojuiocx9bcctdcG4vBnda7GP5bpnaEjz8zY4xlUJZOA1yt4FKEdzKt0cxF++ZRvVArzuuMfzm1fweB2YkQyuIk/TRQsXwRJdGnrPu23FqhBcLlNGyPZBc89cbGy08y4MYGJQonTFz3tvtS7ID4Ar/mV0/QMNphBPMXw7TqrZSH+j9252AIYDHWlsNtOGtSnkIRMnkSLeWyxeMN+CDvN0b+GObp2wzcjXHhcM8kzBE2Aotnrjv527YV3cBGbYe7RBzr+hXwVaxDeh/9JrtE90S24peFCfqZwI5XhuefRInD5POLkeJJiG1PIpa/q4qoh6U4xP3Ztn3eS7F8Mg2aR+pHpC9/cAA07wfmHbxhhCOI+O/fIGYFCWsxtjgyFacd8Ha2lJSB4DtfrbxKYh206Nrhkte3iNTFkj7XZsAL/ijbT0mqjm14otVApIqQDZzI4X6TdZqNQrEGDt4C+GFKFeA5LjNqoqOuZBPvFg9ZFlmH+Kez3P9SBqmzuETBunZkE7MRg48KFj6Qw/mJuJaQsb8AeXPsvuXlmjOK8e3GxCAsUrzcBFwlRoXgcVmNHDpAMoiuweQ01AfkwJ39T8zK4O7MZe3rUUf6NRmwAnUrxhSYjv5pLLit6IKs1gz13sBAvsyK233+r63ByTURrNGN1BBqP9YUEApgZwwJUUqhbdLpDRYdqw+eE3VxSjit2v/469KjsQv5sgtFjG+L+MC8z3fs4hFq/elh9u/0KZEkeCsNJT0t1LpJNLoKhPE6IVIJgLrtYJccV/vr+Lu1Jg/yCRocyB5QAGWgL2C0AUBBLTBjVaBmfK7P7Npdxh3IGtEkZcrQLNSjDQYQAnj1eUeSW5lZQD43HS7JpRjNpcAEWEe51ZRv27G7i8cZgpbVW49mMeHSlDUdL2ixeeNpmU4tkfdwJobpi2w8LgiRjbGt/yYG+plSkBFA+0es+AC2mv903h1Yz8MU9HUqcgAACScxGpUe3EQmBIpqTDfcJPZuRFXx3JM0mRU+HJHL/SDB9tPMm3bJWewSGjniAOJljZmeOuPwCNrrGAzWDq0mmMuouHMTEHlcAsocm7KGaGC8zcflz6bQ6e0fUnXybWapeCvXJMvvu8JUHK9Cldze01dOF7xvbwRYHnCA9HQrrPxGYUhn1RN4yvOlZAe8i5Z0aNlYGAV3x8NaF5Obx+l+wG/c1RnqZQSRWUpfzGeTuG8TvFLFuBVTXg/+gnq+gROBfJzeKKNNJ+Uedwfk3vkJO72RwKHaNpkPT+GgY9ulX+pEyWfAmG2ZuT4GS/GHslTsS6PejVsvTW1pBS7UbUcGO4x+hhfZXwx+Lfd/mct13HkTLXS6dQxj9ATCsaCP4d+WB4mp0bijOg/BOrmf3NCEHzOKoJKK5156PL6OJ0RBpsYFvDV5x6nh0WZCMpYzFsKCU6Qh20tjivs9EkivkfvKJvPTLWL4GUOjtk89Z3QL6CfaYhrKT777sXXf/f9C6b1HSNG9wIGOKZpMdDihXTbu5O/c3K3uNJiukjyOxsZfg9Gzv55MwPuVry7fIzJjFrUWZAl8Wtki9V4AEd0sSLVOZy4jSQ/AbJrOQ54L/HuGQ8mqodnK48IWDpezDjdKGxiDTSAU/Gm8p1RT+lHDu8xF0NA2HoU3yBZcOY2dkSRscyhW6pS+bW8wlC4CFqg0l5B0SvRniRx3sVJ6L/yizZJHGBgxE+RKwKuBdJ1ujZRfgD0G2x26bcFAtY5fDzu2ETc1ZFkd4VOG/EG5dtMcc/1HQ9YPg2wGBZUIKpBgPgwOrjnfD4Ty09fxNufkoEhUkANukKFldtakwV92MmLuTqiZfGuAlaJiZquZ+UdVC7ZMdX63NbHHq9A7HalyX46M5QsaQefhlVotXJJX4xprdRpLBTqEiWdeyoN5anyPQXDzLe4l/zogcer6djrKsRvGHSkn2uM2jjiMFH6b+xb1pWF1SOSH5hNdm1WEo28JJOv1nJWY7dSgE6U9VqcFqzR0xgP8kcJzmoOp94uC9pfWOGB/Muu0UdhphSm4OLaJXqrGksL5ACoqMkPSpO4u4flQmhgqx/PMafmW5FGWiNmIbEVhOXh+9IpdRcDbRYPzGtJHAij879r0d4MXbWOPfmq3dm5PlrAXOxKwoRlyZZi2RkpQrVLdjFqZ4TaZWYACXPbh6ERTNwHxS/B6L5vWeY41CoSo51Zxkw3OxNQIuz24ehEYawufw3bJjQW0qheX40nDUJY9UthRidfAfLANJCN90vBr6y0Rw4EOKGaJFhn9Wx+WXRn+D83JiJhk0B6x3T98/jhVaAJIWEJA/VnVtPbjgrzY7LgI9W0NqDpuyd/oClLzihOJgxGJvvwe1v0juIne1k/SlGEpkQ8QL9d6LhqU3Go9iNkBJywEQg6so00wgx/Riua9clIq2Jqn6/lxZI1WSFfpiiqHtAkp/2GxXoo4ZWKmZTbNTSWtxlHIdauiY6YOKuKW5xhehQnstZurm2B5qL176obE1jVJm2PbNj0kVRkb49OzfMdFfXAanU5PajsBqydolFYOMcI8xDDQal/Iec9hNpbuoN6V7oqDdVWrUM6zeqnH0yaAPpoLUA0gUBhrhHDrFg9tuQR0lFhcHWlfufsKYr4oFG1g4vfGev/EJAz+SunehwqG1dNuTd7UhF+7aYfsQEa+NZ6dTt8gZSGey5V1JFd/10V5fKNE2CCqn2HhEJfORumSviRZ14yvRpt5sKcoiT34QABDJ8AcnQ0z6ti0Qm7SFscMLZWpooZPOEJAP9rh4BWqDS/JR00t6Hnu4D9n9r/Y7hOj30cA3CB4JXdneoV/lASooKeG5h73S6ZHmqUbADPx7h97F3fUapMsxrBbzd+vRv+/y5ehXPBqLYEvgREwaT7r+vy0Q8KAwPm8ycpKGm+dRBsa2DvofiJRrUN5+QXSw3rXBL9mQnW4T8UHeCq7N04K/FNgRZJuIjKfzxQwJQDEQGHTkfn1pAgRJpFfzSAJbIDznLRUlB75sC8BowvPi5vgMadWqAQAAAEulT50iwezRJdS2Dg6lLblEAj53NyW6HFpDm13gdb1BOLy0D+YJVSyxqkOVjZndpMip+NJwxw0wV2i5hvwRHmzyMUOZaw/ixSTGST/040B0wlkDcjgvDdG04s2VNWsLKIjl9qfqF0Hn+yU26AZblhMaKstHNt6fuvAazlbzeyvOQszq7VK1gFgFjM7qMBoABmHNcI3fJql1yDuUZymDPtIFPXCQkCneESRjwLCTrvYWil9/2LYLZLUbXy5NbdMrFv0UDigM5aslDoAF7Z/KmG2CufIumEMUBP0ZZ3Mx0wUmZavwggRNhbLRL0YI8InccSUvEOuLMoGRHbbjTTVX2tVS8czEAVE5ntLU36s2Fa3gXecZUMOPO01QxrQjgR8RwMmePkXCuMrM3JGzu/t1iUxo9KCS8DA1swDlYcvjsImhumLb8SjH6t9zMhNZzs1HoDuO8NmSPQnkR1bpi2zQ1HzMq4r//nNBg+/6wxaRqDCAQHM4hpRL/j4cCBdAAAABOHt1OX3+FP4Xy0aesRw2EwsJJNv3dstlTXtPLzBVeoEd3pU99BlR2NPR1SwvmVsqC0ogYbTMd7QslRhbF5NLy9JlUkUN3Y6LOawVFQOvKZVpsJOYLXXw37Jz7XRA9XME2u8HrwornOal2oSccQAhiGT0ziVMRMZma5ULcigcE1qmylvQ0VhH/r8M/slZ/svsHJ+tjUji8S8UgS6ysHadh6BUQ8BinWs2yP/3fHg3Hf1fJK1MfgAAqU8zNi3+bn5ELp/Zi7Hc7z+aZb8lakM+mMx1asE3TsFUanH2A52RDW34wapNrDhX0b3VW8hvDsF61xye1qtOyfbMzBqJUDhyDzoTjKnDcZdOcA0a7KIDI8YF3UDgwlV7tWvKfMcFDO5uk48AoAJ9ZO7/khq1HzMq40g9MynFsj7tDdNldot1DGjkugBvAoykVq2nMBdECtBKtb7LyS+9i1M06qC4IwsX290Cn3sFuvm1vEYfg1IuX5xToTHKUlrluWcWCm2WYzgZO0H9agzVoMC35/k3u5uMV4pDcmH5g5pmTNOHyR0tG0jqbGKZaFWh7rvVIB4UJix8c4NCeTTCpWe8Tm9/D/xJEQqwz1qq+mPXkWERoULFaTrbKnxViO27vh3VzuUJxdjaVp9krqohthCMVARwTG8qxPXmSxG1lm6BD6+VtY2uAEiebCFzoAClf2yGmtfU6bv2AEldLAQo4qsLJBOtkJuY0Um08mAO5ABUDpzyfJpfoTtX6sNn6aHf9Nb3G62R7phiY9eNjpLg/DZBBrYAAUuOXEpqnVWFoUylSy5DKpAgTRYq2a7ag+jCRkXrw0e1NzU2ODCe4T/b5/Vt67EgSS9QB/+3oI0QIKjDHnj5IR0mlZngHWDfBz6F8LImkUdS6vZzwYfVNYN8aq90oDI2X13VpHmQyARJpFhQGuKGA5n+/YXnV+ZupCoLTm2ixRKekK46H4BcxoqmS4yWUm764i0qfuYwAAVpNCRbBYjGB1EBoBu4QrPBFZql7DaBcDCHFPVF8/dbei+WUqGuidOxX03zCJcnBEW2i7nybRG2MpBmLONdlwiQuqQE9RFXw/DSEC3nQGnP5UjosM11JdA/wVbrX4R38k48Iez3w3uQWiglJnemBE2K4LR8MApMdzrkmU96PlTV3L9+43sotYbXgW1ZfEds8VwkynvR8r4pnK1D4DrRHj8px23//OpUVGfoBYzm8fooPkujQEmeJkHvKTgeoFftOSBrj7UESHE+3PLj1xGyumRhZLqYuxdpMiuEgK4CVKuYsbLfSBVuXQpD4x5jH+z1mMoh1PYOqO1rHYsizyaQvMliM37eImx9eTfJJprXqoDqUMya2jqwdqwVVQKcpVmbJUiUPSysoq47A09Czyu2e0muCXGKqjno0IEe0j1RTwT6dxNvxgPWT7RtouuZ2kVFAY7sW6x484ygAEV9ft8+u2I6Av7XaBCJCiTAZrfQbQQX5218awh7Md+Z+Z8YvASN6DDooloor0R8RwMmePkXQq5Nhgs6SOi+DApiHJ+1xpGFZdehPECJNlXV4B+B2QpeZHmGTKq3OaSnbNWkKWmspdzvKEHvOJzUfMyrjC/tdYf5HylUcRf5R3S33uo1I29phmYyAL0SDucTafBiJsyHPWQt+vvkNcU0OASo/ms6Q1JV5UhaVoGnTn8qZz5+Oh/LMG/MDqIDPxKLQ52anZK2J/etnxQx3rOinFdE6dPPN379wnoOfUeAscMmtlrLHGXULDbAsiJb4rrEga4/njjFUQ3sobwZVoyytyjt0HwyL2oVUPqVGiI36QNGlZDesYfLgpl2P5PNeDQNa0iVQ49AviiFWglU6WEvOGeZ1BH67dc9viT1cF2QKSD3XokOJkbmDMsBv7XdzjrB8Sh3Vsfage3QY6CHsEztD2xBvUWQoES7C+t4mA9sPzpPLyrEygzbUUp/X6IeurplWkVXxLlb+/bylopn9SnkeR7pdqLxhJ/jP+/0DnJRiYLPOvW8u1zkyb4mocAs9EMqYG1OW6iMuUdrZkRIATlj4f4YoQAFgf6EJxiVEtJvaaSPIjpQu+TSNsmYxu8RJUZAk9uZDSa2ZILwLjsSI4Hu498jVXhxCrX46AEfEKJY45ZZVsYQzSUZGYKW14JbDzH7LGjxl0F7xG71DLfXkKnTYLRrYENAS4w77S/rpNIr33r09RHy8/fjHwfAEkfFS1loyX3oAAmDyBB8CDrMC5qiYdzZEEjSl6p9hq2nZWTcCQYiEsdBtnvNkNQAhyW/0V0eha8qOaCWPbUrrd9M/fw7+Ix8Gx0eQZODy+sCtzf37tVh6b9nyS3X+pRkadpdhKAQd/MrdLr61CBPEgRk9gjP+XMpcFRpcG/yegufS8scmcxAOeD6K0fBA19qie0EBEDcbQCntzBYYv6RsEoRzoqFR7I1h4JPqmSzDj/R+pHfaVVAQk4Lup1wduIW1bSZR/xHfKBOuWAo1sMBUAe2EiN/1aKYMyvRDijUqVnvDiJjpBZMh+haYL1Os5zZQvXdpHPk1PYa6BT8qiO4viY1KHVKSUR5JxGoK8J9ey+Oa3XYB3XskdK9sTLiMP/drVdq8qBXoI8qs7kiwuvWGGJHVt3vEO4txek6m8gj2fGyWr0KxCa+RWM0U0qMAAC4Xs9V7goAA42a4JLvfISsi4kpYV5mDgE/jKTgsssB86wPL6KMCG0PbMnxPVXhxCrX448aD4AFkJlx5CTcNKs77k+854UXoxpCgAoF+R38DNohVsSaRX0A7GZTb8ZX6fb2pqYXvFiPvh8NuRYYbVBPMOWzRqLnbxfUd3IY+wAAE6eQIPgQdZgXNi7hr+4rkaUvVPsNWz1DjqYv1CuG+0UMd6zqdzA2Y4Px/LG7Q5Uc0Ese0juCxXQZtjQz/0gQFLVfD6R+sDkbFA7M/q3r4XycPY7NP2RMznUZlcnorPbXr7YCN2tCfvZ1C6RVkNlKamQXPph3kyti9xgJU+p/h7melAlzUFOSJtDGsAj6tQm6sL6UmboRBZ1OkGLAKM0KUMBzWroQYKXf7qygAWJkmB3y3xRhBt8vAnucJRwXY20oCpNhqB1hhmRFjuD0eZX7DohMTf8YOoS6rqxZGxgrvchTnoljeuRO8FmcO5Fux3z6YvSr2CjIa3BnrSK0xCOXFUO/dnR2SVqntjZuMXkIKujF/V6WjOEG+qo5/Y5bCe8XDG826YKVxL7ppTE/ccJ5VKND0+6cvvm1JnIwQwOUAAKJ1kXCXnE/CamvnpCvSmyCykoMpGios2daCPHEVZBYfHAyaIHBhnLOgSXJnRW5Xx1igj5CUONOeRSqdY/VAI2qxAlsPMlqn3VoVhgOKHng9hV7tWonGOhNDO5uk4ZaYEgIyklWMgoWg876VhAbQPxfXt/rL1Mf9gAQaktRqn98cNcy+a0d9NGQPrPzxUt/EZPVeREe2hs8ZvUm4E9cpw01L29akNqJIxL65lfvFpXLWGbYYL1Rui3IOGWSYqU9mfvqLUWOh5fQ3qyLsLp5dC1o+bfTBKPczV4CmGiaFbfs+8rr4Z0GSX96TSp1RIi0Ega7U9+0oXkXVg+JC4CV/b6rHGnl2OuwEmgW9S6q4vU/O9Ym2p5oxYgVQRlQAnglB/IY1Xbw519wu1A/N7NLcJOqEvPEBwdvdLktFBBbpqzzwJ4XwLsDz8MzYX1hf2Ptp5AeK6sX4uRAOHr+04NpmfbehEFkqIHBiej4X41ActMkPDn2XjEfXPgEk784xghLSW1mxBd/it/fGjg3MCQS34/q3ZqwlVAxLs9jkjLpNToybCToIxjbCo8tVnJ7J0stBDzkyuKUAAAMMsXLKiC3lB0tYkzs+aTN4UYtgAu5Kb3X2paNjJfvqVPVc6oFGohTNLhirk2GCzpI6MA2kgMJNKm82YBypEZtEKwcFpqY0miicYjpRQpWl/7oy9dpxWI2GBemEgMLNDs+aSN9vC9+ePHZ16eHgS5BM6V5ypA+v3oABcE0JFsFhXJ58wt85nTSpxNX1TKbjz8AUp6MBBP0+S+XsvBiVzyZYrv+zyOxHv5MimHl+pChj7EbboPkGSHlIMykBxlB4Gu74gi/q3r4XyfUxLxeqVUxygf8HDSbHkdnC/IB8sKgpkUoMIUWLeKGTy9ijYc8RsCKggKubW4KwHqtQUVpztnipdjtUwl7/8Xh0c1xUxLM1/mOLxjN4VTOlC4IZGqE6nyRhH4ClrF8BiZnErN2ulLTh80pHOA/GvZPqEo4LkUEBP4e2IN6ic8ZKCzsE7rvNyr/Z82Hfpi/54cxtez1meDs3F/ModZ3P7AuahPAvX/PDmf4ga853M7zGEqehmuVg98IZAmmXLWCqOm/eLmpfM3+m1GikIIRLGxuEfhpRhIZXNzgNAEMXa41b82Us1REngzwAAnIO0cXe0xtbSbq85ta+HRj243jCFDgYq9fri+UpgLYBDIcJ5ya8aElpJvaOztJnSR0hJMThE91QEafhXXBau3+fuMTKAS32RAsgpsPmJcfEbw0q/UnWg4MizOEtR3srtFBUTnZqe2Qu2BHWU7FawAHdYqHeEEIEwFuTQkbckSX8mRTPp/7OeVbhos9+800ITM/N/c/9ICw4HGUjU3oE/hMeIyxuunlzsMJMGAiQiGeUbcgk+4uXas4HrZ+Me+XTLC/bxeOh5fQ3oJAbaiwt9Qm1xISC3IumdRzkAfQ0L3R+YauBC6slFcizxoBFSOMDECLvsDkjdizQQWP3FOa18JHwMo2p9eol6m8snWti/DGf1+d+yrSceByRA9jzRarkzZmPoga2YRtslgiyrKb8F1gUEGzb1YZ0l/Qm5AijLdQ/YnM95+BjBGM8Ije0mYfwP9pwFZXB7Icn4Hvw0aCu55Lk3LLCQLQnAyW2KA5mSPuDaebr/xRmtL70x/4kie6nf4q52IJOLKXF7QQ4v+3wEb8yO2u9Rm0fYpP0dR7n/Z+YzHoTB2b5VE6CIAliFyG6X+tx+oS2X1uS3AAANjCiRMNQgfpss0LOominHwR0AzWmmsEUVdUL4jwuTstozKGT0F6hvCBqkwAGME+uu7U4Y4HgcN+4w8iqbmwcJqsaX0VIQo5LsJ3ZMY5I7ODF5G8xA4qJgyW0yFAlrtE1Zaynhyi9saWEvzoOJx39e9PJQF4TQkbd3WBteeKwRiJ3SQLhoXet9Ndt4a3+MT+9bO8tiuGzyFPDj18Ka6r1TrD2GKkqPL1QiMqEhXz90G1QAQIBF28K031lLyzB+CDaLx+miiEpzj374hxmtuvcI0WZc4VcRK2E0F12+VRZVvlFZ5hFgO+j6tB7HAyvkgX7owweYFmM7f/3uuaQPjzdbvTDTFeXslsNLByg2UTUdMBcX9YX2UhR5RIGD2CYhThZuOudPx7+RQatbF7qnxfob20XMbU6nfj9P+5Ba3gU15yeRVaW001uQ34cLnuDt7hiAHGGrqB1hhHJwkgKO/bEwilTnZmS506ouaT/XA4usbUmDN8hG2yl22I0h/t0fPNgAIUZfoAUlWSV1Kt1oin/Fas13ORTXeAqsVRCB5id8GJirQN8qfEwc+ZdrjYqX/qMA0IOknYlgAAfIYaA053pvZNU/V+hVd+E78WbMyR5pRAF9nTqY6dn+jLr62LpuAr+OSm0vf+zmmPnhefbJV3m+7B5QJb9vtGhU928puPMUT07XenQ2se4BPgAHloF7Er2Pm/EC6Nam+GqxW9t3g9JZn0yyn+R+mIvZ8XPVoYxWhDZjg850hbumwP1JR4Z3ORAtxEG3WhRlFO1AMVwvhqX5wRIQLsxObT0pkvkZOtO6meDy49i4CRgFO5yIQ6xVf4KXGHPDsARMQcZzIzxLaBO0zE/Y6EXYYbKv5Y7sjwXScLBU8/JmFhfFNror49Yo2vhQ5Uh+HxFVscI4zp0HhRRVrXagn3uciq5M2Zj6IGtmYyU/P7UceiZSIBeWD4sP6Julg+8mZnVTjz+dvhGDXEEVHOD7NlzprrnHsZ0fyu0TyV+xStSlcVEKZ7gV+yKocahAkV+3vG9PGwbrthh4zef3rl541zaOguF76YiNW8hyyMY8jrPPJ1/I7cd6u8sVq6+TAuc+EfnB9S/LsIelcFZvNvLKG5Yg2jRCjZkG831zsUIfYAAAjF8MfgtxVt0ncN5PIDuS+OIjMMKfWVrAxj4tT77VmDNzp99Je4UtRiwVmELN7Iq/lSULcueU1qjwnEYoLDuAYM+jJrJ7oqQNV/wga34gLDYJ0b8J+jjf1FXBzbCOQcx85fFzNZ0ju10ZCPqCcgJWf0SIjjznSFuDQwf9TmG8SFrgoMon029azRqQgcgz1aNCMAkC3W9o/I8JE2J3XRUXPLXcq+x6CeNJlwWttzQ845FaDZhhZ3LLPdbwoAVmrKmw7WJ4t1QuY4SdQiWRWAcS/P8hLYTW5+rZHVMZV1AGq0obwUUNJqCgO7Q7QsprVvDZLangaP/oVmaBHI/iB/oEMl/OV2qdVWiOMq4QIfOEDamo4tXsP7eqtsQaYXPPYNziEUhQ+W0aouyaArV0RBMAAtbXNqX19FADHS0+4pme1CgFy7TIbe/h/U4DTca/IEHkFmRZYLpSOMeByRA9hQ1gk2MB2DphdOgkQb+Yvkh4CR4cdTLApYzZbkN/NrOi/xPBlW/jTUXJ3dE8MaYQ5U5/1mphWFJgrpRSp+MjDAhLZY8kYpqjW2RDSC748bQ51wjjWwenu4gAAWSIejT8Mdu/Sd9SxUcK9eNm1eLTYFwIzr/utNFNM8FeLMOQVDJCVzm3geno4nRNKcmGoEqeQIT26L434T9HHEVrBzB1d58PSW9z0JV5EKkqPL0SgJvg76vNp4XDtH5HgU6w9hke5vYxQnPTzNR72vg67XIBrJVjj3Mb3TGH7lLquLYt2Dn180OVl+sRHOhduwmASolyqeURXRrg0EH75QAaq9Z6KYW2txOXZ0IfP9Ps8nBRVf7SPLSCVIyjqFalGjLS23Ut6znQihUZGfQdh7Ci+Le/hhhYRl2HRflf3S9zvkgYyeN/8ZgSISbXBiQWppeEtm9tgRZk3cp973t07bpdWtDCwOTGkjfUaitdkNESmRrMLwzAPv9gebOBfZxwlFdl3y0Kl2FHHkGkVBzzNfRDyANna+cKrFveWNHZoNEwsOSab4yWEha7F3jE51ju71jX5q03oKcj7ThHb1N7W3KdpRPEuaY+muXxKlUYjxcbx8+0mSNsNqeUKu6F+lsX6KDGs7GDNKq9HZhcefVRp3VyQ3ZLrR9yJqEaf7RMxcW803hHw0F9HJlGEsLXwKVgLazywmT0ga59SjZj5ZW8iKf9AAAGSMuk7LTaYoIsWzWgaBIDaAr+dMA44h401PuGC5B0ML89sZtE9KVgZngKRp0TT/RWMXBpxZS+/3o4Uc2tQWLcx41DbnEC0LMmhI27usD1Qa8k8efAdqPfe4nYblI2cEp/kFdjJDyoTX2QdDv+MskaMofmRUCKUaeBSrzunYMv9sg/faVIWAh4rv8V0sL9vF4gXVewCGBOI5l4rNpJ4N/UbmATLGQ/rG1RYjn4DMggtrRoDUA0gBo5MYx2+ipmLem0CRKSjdhtgQULF4RR6yhqBrfanWAlWCis5DZDa+x6X25+VScXpIzNW5MiXUicbHf6JUr/v7MLrWAGZOX+9fIdetOp1myoCN3QT6a8wersnZbOV1DYs0r2mVLtdw7Ni5g8QOYwNSGG78TZRX5aH4CStXeGjontTSYPadkQ0mNwpAThibb1W51EiPJrIeqZqSdMSFkkkZBqfRYty7aEG+4wkreLoks2biTNZHtHCxJhTpd5ZEdJruoNq6ZVYViQ8NUDFqb7fCe1skunDE6k2i5TeX4atqbu8Ax8BWAhCAUOIdyMahvJf2kHToUymVGf6sbeO5csp0FZB1TKheM1pl1MVDJcNkVZ3WOWW7WjsuyawdPBkjy1G7t2ADeKS6XPX20LjiEA3tSKK81oi1SjnSYKnlX1HPIp+kkoOfHWFCd4WzGrxSjzN9vuBfAzi3X94Qu+2myOY2S5jsmeoP44t+LXG3qUARMQhYZuLpxgI03fTFgM9D3StdpetgbjuOdgLVSL/bs/V8ffTxi4ddqAqfGUrFS06TJAnMAGzjwv7syTmFXwWL8rwdc60QQM88I51+HZt+Jz94q8Gfnqjtun6Ojmods8WhqubYamJfWuHPCoN2PfdYZxX7knwXE8j9zYP4EKi6Y5U16kp1k6NIxrfqjFRsNSO8Wxf6Ajpl0m5+2u+RZpuBLwIaNHT+AhruhUaiM8A2ArZGIAACo8KBstqj/jg8shqw49suc9JSJg4mgl98YJVJBJsDIz/eIjp3r+BClHw8OUVG5DT+RnFxI7MRp4KPIt2UMuDKFhr0g67htsMBB58ur/BclA0/BMS3zQGMf2gXsSvdRKKPSZOcabAdqPfe7weksz6ZZT/P3P/SAsTIz8J38C3GQrL1lxLqhvJkMb4kIhnlG3IJPuGmx3PbqFJhfWUMFfIzcQLqvRMCxzNBstwx/JLNRNtbKAxJdRJIbO5DKZnTCdoGTJZsvESFvAXqDVsgLL39c1uhVYhm9Dn4ZdFGt/dUYc4hS74t1Q44IIK8IBf37qjsPDrT8f6VhHEyj/W0FsaavNhV5yVR+G/8YrWS615/Zc6pikWqn+nnM/2WU6C3DFw0VK0siLfYlGc5NnMzaCSluFkGCRozYvn2wB+MNfuVBqptoAAG3AYA09kpXSwuWdoIPpCqE7P0E6UjxLrGSz3YaypL74L4As3/yvHeAwU97T9/5sXx0Rf/99CTMY/EnLKIlwB0OTfNfb3iOZCZpoGr2KDMz1Am+PGyuBu82S7aVamnbRW4HB+6hNhPbBy8lmeKYT7GP6ebzBmgt1PThDAg/qm3UOlKohWYK0joWSIJhfrTm4u3vJr0Jkpud1ELD6B2J/PvF1kfCBgDX14yn+tsrp4AT0c1oZob74pJ84HLnUO1GklMz2oOL5n6HAN+azR79UR+dd8VIk11NwmCBnAR129eGSoiCQkjkx9+pliBgeKJAHZ3IiGSmbL0gObMHdrV8LLH2Fe0OuBj9mTdeiN2ZzvZTKv9KFK/hCkl7GwJkTPrGq6ktreoTRqkITSmvZ489QWqxfq7YobeHA9bmW6uFRv/at7QQAAApvmZyirRJf5VRNV5ZaRwYZem3EikXjfEsT7bjpA/Z7uEZaG9flyn7KuNJyy0mxYJHFJ0UAecXRXHY5WSQFKVFBuflmS5AzTtKqNfz7WZuC/wtR0ZxDo2BW8ipYD7VXNj36VxDGtOfJfBNz35/qMvOp9zwDCqm/rvlxbh4DFb1qvhF3vUoGYhu/fIfT29dGiiLJGl3GwIDTCuZqQDuQziqQ+QIKFoHhr48js+7YZVdq00dk5fK/ohGr5pLNuVsCI/1HXQQvLppffMlOQ8srHJNoA/aMLi1Nf0w/o6IvL2V3PIZcCkHNYYpPYAFr5BUmtOdjCEhGjuVE4Z3FYYXQHMZvx8Neqia263TVPFB6LrC+m1gk1YnJO6rgz/h0strNeBaRCklWHbu6PHEg54rl5L5Dwdvj4NWRRIqAHKzJXqql9Wa1AAyAYJ46awNQjEaOSVgLfWmLxZdSZSrnaBx8EuKmliRPbEHIRc2dsnci5JeQ3hK3SJsTIFAkb2rtW4/e/z8XZh7G2jnYzjo6JZg1hSBqOe09K4cZX63rxjHrWKgnmeBH8wUkhLqHwibGTunQeksRI2R30YSPa4T/VnbZZZSeVGEzGdodVwEELVY4xXZawnTbK9dw2ngDS3zFY5F26PCaXXKHgsRF/ipZsXaoBTmiP9WRx5FjZ/NfoPdnZ4+KuhiOrMpWVXKbPGGnAXtt8SHMSrPrB/eUDZh9ZOrG465n6EPPeQ/GuScNhtGfOjWiTRm06xvXr4c+Nq2+3Lp75Xtlwsx4Md1RNeKMtRivFuHy2LcTEHDL2Yh/Gr2i8kWFY4L2RghH2vZ7889v2qZKaoQaxekxEpExPc4iByqcexSQAeDsll3aHrQYzoZ+7oFEWDMpDipAAAAFoiF2Sw+AYO/TzjmRZHrs9vINtMAsmqE0iBEynFErEuEpqEgzTgcyuhHvZwdIqQzIbub42EFM4lpevl9sqy5CJWq1sv1AGCf59iEVrFAwj9V8TxGAoGMGRTWxTyOEoqK1xrGfDSO2RyYiq4kQUoBxhA34cB1WFUxMewhEMfax+x7bhaA0WISVhQ/2r7lF6Vz35CtdNkVrtMVxFnUYKVtXFB6G3CFEx7Cdp+caQA4v3SE0rWWldJaeuLs5OtjKpT2wcxbN92wSg4+B+tU9cqvfUrqmxOdNn56oSXgtZZFDelbrmZvMsASesS9NG/orHQi/W4NKPe3d1CWzdLdPKswLOzI92kYktIjQ4UDovvZGbyy9BUqYbwDxNAXJwXBFT2GeF5tsbsV2Xh0PIWPPOXiKIK2ZpUcpqPrScAoAL5u8Drova5jiZsJs7FlYRTlU02PlAFTk0Awssbh4vh8Y8/PVDcFxiPmMYQA638qowJeb7NcBq+whUyiXlZAsm31T4V+7I/Jnidm0IRQ3QPiG2RDBWmDh9xobVqiebu5nuvaFepwCL2z9sXgEcEcnKJ+5rJP1VeRXp9wjmcfDDATCFfJKgCoEZ5s5UHwJROgfai1HTKaOGtOXAElxGEcgH0rwMxPmc6/dlJvVDnFIeqRjVAPt2Rn1zAMJkaZx0TRKawzw08K3FYlwe2bopo7j6Ypnq5Lb188L+d7LaFdbjB9xNJHnH8Yaas66k65jJ39zWbCn8NAUea5FePeH/Y4a3uQm2n5pYAiLy1vqQY6PNxqegY8tSdzytMjEkWpkDVc+1i0R/foDVKJCSA9b77jDT82bmAAAACoA/U/HtXZaZj/ysNh8BLgDkwKnI5vnlPtrCOWdPN+TP1C/Sj7SLryeT2upz6pV4iYuCHVjovmYWYbkrTvtBdkTvM18L3HFt4GBTY0U3+jebUnrWzx4djGvqHK9hRjtLZBJhdxp2WqB6R+3DculveIT8uu9UBbpn30/WZgDhQLTqvmNkxJiC3c5/HNaYS6XeoEQPn8pWS/xqmWBI7K4eoiytd4btiBKQscc8oxcMQIoSLMGff2GJDIwj/UvT7xgCgtVmBkn/PZpoCtkeP9KU0HDoJWupeJunUTCfgDr8o2tW0ZgYf+YgBDh+Up3WKPHCNEyQeHVrrMqmWkahu6m8YVf+9hM7hOoYhfk19GEtUYUgHHRF8waeqhKt1XgLngAAAAySl4dw1fU17+u/Bh3Xy0/Z8Jw90ClYv4nN9/vt4PsrouLGDYUnOo2WxpRamjWr51D1D8O8zxLX/gQli8+umE16xaKgZPX2LWQdtlHQ5UxRie1IxwP59E06NDTdLVaKIgMfzbuH74v5UcTwfCRv6HcNnQphTlb61WveYCUS3ETnIku7EJlbj8n1r5ue7gycCMCYVcnAgj35cdJBF2H9yqmJ+IBtk9rz25iFEAMgYcVLaj2g0bGGUo/eoisYDd0v8H42afPPssJKcnFTYas4dx23s/rUqEzr3krYKNWPq/czVf3Oap0yQb1u3ndjuoKgbaZhqZjwAAABgNLw7jzgvbJKMQHrQS2VEOLmvYxCVjNgjF8N1DETg8xhYgp7f0Je7e/q9z796G8nnfCbHkKyqNguJgYKCoHP53zV0RUHoh/q5FqZ4VJMB4VWNs+QOM+xCeG4yOAAdndSFCGFNRqYwktJK1J/q5FqwyumK26qIWMukHydQ0P/TJHo2cX4uw9R1PHgla75iV2RKoEhV+TyXugI+Z4FRRHolzBbNG6+yfD2ndmhJqNLWSgVIM7ap+67KCp4ufyvTE3XK5J2qvhnjkjXSHqF60Jcq0W5QAAAADK3miI8/+jNpCW0ox8YDTTj0TI6SIuUc4tGtQOE6Frmz1iJa1gLie8f7kHbhl+L/5hUM6JjCR7ECnIRQ+2svk/U0GbNdXsHfIJDPMndo4vzHh/QWW/TPJXnZ8lSnJmPydgt8Sxd8gkjVw7xCTSJnrepldOhInsNdZvTAzcEfQIBrfgkwq5DyBXpUePTZRkraW2YwO7l3E1xrLOy0sexEI8QxQ5+sKVRzm7WVJHWSs9e5qCe3OY6qV5dls6e9ZkdEAfWov6aLdE3P2qoorQhorzis/sbqVqt4cD1u4/iCDdL31pXn5iUFKEcAALHbeDjm/FeoIhP7n9gXSv0QABH5rMqKv8ApFQTvDX1ny4IvE1RmUbS0DSvxUDhS+JV9iEc7yxjeJG0NH2GUPJPoJ5PlQgaWMtWcrjRfWTU/LBgz8TkGgH81VWlSUR8nFvTxfOLg6oYQFREzz8l8cQLWfDoQVnOJ36+xXequfTe5QOCsZJNw8RpgA36Nx29viM9VhJhLPklv1K4muvcwjGElpezkAZHdDQ2IhpGotPUxD+4QbPNi8YxOlKIiierblyLVxJDlrSKcP9SqHCpnD0hLE3AWKxZkRKG+Z0EyWRoD2FasNYddVGbmzTcX0uTF9wd9VnaY2k0LdcWI1zlcTEa6tWXTDHje/Q6WmL5pO9XBEqrr+TqAAAJImNt4R6baJbQMl7aMQHb0a+S4+2UfVfpfZSAAHKvOvW8wdu5e6mBW5Skgumtx1EYrAVDfOsEKb35pfOf8fxy6FvjA+rCHNjpKvxY5UULePYsvzO8Ygiynxr3H/yrBYnRQMP43sPXVF1IUQh2WAeFobR4WvOgvedqjs6uqO0EAJe+xn0Le9ivychw92XpZADDQP7cAIPmWUuokgj5JdyzsMSHQCHQR4CmBo5ApkYD9QwL2XyYf1j4G7TB+iB7JjNL7oVNr9L7UCIUu4j3Y92v0o5sOXQL/WB/+DQ3m3sz3L/TkMdijqWddFmt3GXvi+QByT+iXPOUMnmIBCuwF10nUk454hxiF/Ev3G9w4cLxrsJ+FUN8jZ8+kx+QGVeUauC0GjBod9M2Yhi0bDniLmsTVq7Wjjo8nbJz4ofdW4GIA7vqhQPBElIeAAE+6YnwASLHTouyVMVvoile2t5Y5Om0ucXhEQdBLqQ38BSvAZN2jlVtvMw6dMyFidWE2jl1vJs0bpqlGkxr3KQACpA5Y14+gB7MLgD4G1ROJilQPVmzpk4/UeTeVuus/m7prO5XgN/4OclJFm1bQ24780q4lHT1UE5kJk0peaVsGg7fcOsC/D+JodWikMLYBQuZ7PO+iqK8HX+3kRxFAo0+TV0w2BsllLFPW8FI6UEiVg9J9LFiVcYWZZlbLRLJZ88xQlY+m60yhwwKS/SmgKAwkwfLLQAZ+pxzOh28EcDDa9QAWwtqWskrN8c14DhDegjkADv9o17cu+0V/RFXK41jjzdkmCtWHkTodQkjd0Lcw9rZMV1aEQQkP+50RLJdkwdW6v3MJZdOP/5toajHJLLI+Y0IEc6yYmO2ATgdg2Ujw2d+8bwUsWgD4TYoGRmzoCvw/coDroBl6QHV2+cKRVUNINd7EP6aIDXDIGKPjsgMqBpTey7aDOQaYkRASPMJYBsAAAEzEp34v72hQUw1fhEPrlz9lmnaUXt+tS6loKIb/gom7esatoRqAeBj1tTxKHYoygpujetXn2vMoQ01gSHR2alkUlVTIoAAiDBO9ogKwJrXuZ/R+ESe55DEGEHPyT1S1SeMzSK98gFr9reE2vveZZgH5oYIqx0UFjUCOb54AxIDyqkrCb5DKJY+NhLRx2Oj0aetJVDy6RaaCdbObAcFXY8gjJ34yFUwDC5t8IL1M+AxtO8EJ5Yj0nfDAckFsbtLM3rX+QpcX9MgVt7vNuLQrTxMHN4SdaBqhkgaaf0MPJnsHUcgwOSxrIvQZkBM6s42bmx73vbEeQEDOoDJSkM1dHbyP4Oj0N/pzuMRk66gC4fKxlcU1oGcbb4lF+iIyftgwZIv91tURQdYnaKlRjUtaJTrn64tga+YPrx+CqdXMrPLS3RE75sCFhayj+sZdsev9Hu9K+whu5fjKHhLOqyFECwBZ6Ycj9B0MNT3EiewLfWk+BH2Sm/pHcVXIz8f7RhuL3f6Zq16VboASThsrL+Nb7rhNdc65bUv0IYju3Ua4sNm7aIRmn7V5fvIP4dKEz3os7IUftAAATo9Pf+XJEMYwZafpKT9+/Uen+5l/X8fErkOxnkx9Mg5yMYxn4dXffwLOCbt/kgUy1+CN47cANa1j916lJBVWOtXooQoJfN/CtZjHwL7dvQfYgAB6uDy3nRnwLpD04WNLwhdqkobaKF4OPCpvOk7uspptnvyqJ93AA7DBd4lohBHbLXTC40s+dDDb7M5R4X7DODXADYzmYA00MVXVyfMf0j29AxEwFvX4WlhoCCEfgm+87HJBsTpk5wppIiFJMpSEN3zRe0U8CrMntGAZ6VdwmIOM5LEShzMo83Maw3g5eZ2ZTOYQDMC7+5/EPusq8+5ensV4xUSoXha16gKRtGxJrdw2R8ibaaw6Aag6AN55PC74hVwkqB4esKg/7G2P3u2uK0g99hfGArde2nCKZFKAgAG4/aFiSRRL8c5g+VIm58ENsSebcQXX6HXAVLLI2wDAdfCODbFlN4GjklI5JrSWclgAT1nWfa2tvQh48u0uUoZSh/RhQkxEYrT/oPl3kl/SXBxQV84ZvxdaKQtQ/nKFnmwoe2I1ZLrGWxLlV5Tia0qJQB9QK7wvMekbPCGMz7LDvIGIuH6JZR+9Pr17pG5zzykyFpKXkDBa//WxrCj6mHAZ8JzZmLlAx09kuKX4qKfCU/Peu0AkF5dJE8qgvxQgt9XqRB4WzcV3e4AvIzNl7+unDVxSXV976TqjKc/AOrbCrUmGvmmnDrkLS7Gifqi3d2cMUgOk/Ddi3uQ7EX0cAABEs1MspNv19lyO32j/lBHLJ/3YYoS7dmHxUULgY3AA4SyoBXBNSeVi3IFIz3zPyTAdaMj/hitj5ISOm8LOBKfWS+XJuJoHS6Q3jod6iDmbKJ8Cu9ATSdqIAAFMTqKiVeXrivdPc3vyaD3Qrunh3sWemU/2dUPbmKUpQxjocI9/QiwxwcMVHqatYe3VLvFIfdHUMmXjL2n9SWGZy4/vsuLKUF3wydXqingskPCZsm5o5b7YRPWSp82LrytWelCgcr5Vt/qNILVBNqF4Mq4M0X6x8Vadh5sHV2F7PYnzK0pixMHGl6AYYIv+s8DxX3w/uoM5Bu5eLDbqmn4W0pAOQcPqYk5dTr8RFQwn9r+t2GwFRGUxYwRx7NRzhb3Q1rae6NdS7cE57+gk5UG6EW5EjsD0OF7LJ5OZV9ig9vg7/Ors0XO+L9Q/O3LBElUr4KcUR+0myEgrBXkIGDAvp9enzqsDDMmvdI3hrdF7dvQUBIGRMT1QIsFU4HRC44kcfFDzc3T3lJ+zDna9ZWbbSyDJOcAAAG8DsNgZ/KBDvE5mIFccSnsfVJgC1dgFYX/3E7LXAvbXQLz6wRu4VCXQE8auvHGcyR4c9ZVPXfnXCFpQGYJnTbnS8zl9EkMlbOYmRa+05YKDhLzuxWYCwWdEPMAACGwk/Xt72wRdOGhRVchGLxX6htbEzMyOipIkXm7yBwQdQUDYgnyn2R4hUvpxZ/N4kAhROnWronXZrAUf77F5pwF4jQvnXXrV+lSdvBPrehFfqKuHhr12Hw8tAWMzq1zh1uNKbljD7O2f/cRd5L6czuTPcue/ebLDilxbLdFfXKOL8KJZWDZccAAAEJ8SIR4njeFLgQ2oLUbUPxqpv9TSqi6TGWfRYzV2e8/Wa0zPsm6sQZ2W+tOKFAuAAXQ+EptN+883mNTSotHI+YyUzGJ2a1DE1BfOCllhc1Kct8jC51suw1Qd1tJMcAAAHtb1HYu/srsidaomvJ/FcNaQsY7qr7lSesI41ln7tBAHuUVtZdZSGIS68NOg7DV+G0jYyICLurqzY9NUymOgXnVLAWpcq8y6fRDVcGqVk616CBjfwVzTh0uhiAunmFzH0e7zEAAABfAbxSHu4f/4grk1rCbwwCVxqRgc6HQXZzGq/XQQivk9OiDI44D245bwZ0LOuNUf+KBblNRVFGhwSq/M/nOAmD79J7+8QXRBps7IBlRnee/vWoeKgvlXzxvXmxCAAAENlftZymgFhdvo9f2hUFcTmCj76E8d34yLRlUI3y9P90p5LCFfYmwS49AattklbSEGbhk29F0dDcOgd7Pa16nLl5y0rPziOAAAABehVPY8ld7MKtOgzq0wAZ1ckri0I2WMcfS6wAD7RmWFHmQh9lCecGn9G7K0pJkfjZAPZzpz5n8+ZhrX/pWvuiC2lwP5LsALJrIqc9FZ6Zsg8BI1AXsEdIt+Axj97xCTgAAAUh0gwKAdXcG4ocwNux0CUqKnDqCc0jWletPw7YXUHh6b8AAAAAzzoQ0wPL7PuGFS38NcKde83lQXEw4tfNoRiHA+apfFwxtf0vGdtvnBS00qnoptFsLF8UOkkUxczUZ14f51Ob5CJCLmmlNHqO3ENMxOsOpIdCQ8IZ/YNmeeb9CPsFypPuF7yTXmQw12Kec0taigAAAAAAAAAAAACDKFbyhEcGeeqBHjtaSz+6/LFmO2MrTT4SICLC/qHKKCNigXASdhRg4ATSA5F10CkRlA1nAfYICzNY2iIL6nm/UcowwVH3/kYLf6BPOK9uL2e0VQMOg2iKZKReHTiIt7nq3JJgrEPwRAb1UIDLBnYFSUKiJewgAAAAAAAAAABZgH3+UB3yKv4MOXzXI+OMTP90t+uePb2Kxv+Pdl9/BzthWbm/g6XbTpg27JHCZjWCI8/XhNkvW7Drvy3mIE+6JwcpRyxUqz13qQiCuPTiu9INbPdwCZvsgSlc8R9FP9cJg9wLnMJV0EkC6B/+xNH8LFzB1ex8ndM/NDa00FnQr2JVAnsJFpL08AAAAAAAAAAHMCoDgpn/E4Oujv8mX52LKD+XyX5ACXZkbOZ6JlgBheJnVrYmvXydoc/3USkDA7fgevBjnssEPkoSjbiuL+T+ZXTtrtDfKb+QRgoQmPCGBA07DlICy2mujABsO/d0bQNccHzdohP9n5nPiED9nDAKe5472KMDfLNSHndtI0Okbgb7qe+3pAAAAAAAAAAGeJ9JtjF4GDV20xMrKJtWnRpU9VCHHpvse7VvKUM3fFj7QLDY49OuxhIu7PD8eE2Sa4YqJKWJpSdIKIUe5dD/JFYwA5T/Mf9TLO2fgAZA0DPDHmstuDtHAeE8T3HwMlO7HYBkX5MgKoF1YSs4jc3urZvF0TSk/y34QIbI/zjjqxLmN8vNEwBH9NAMRdDrQVAAAAAAAAAAGQBgvJ+wfib9zDA1OcxlX5evr9hANpvGXs4Q8b9hO7uKQJEGzgtJEkjcC5NEr/XyCgD+fK/bhh7ji1dEV0mzNKIAPk7E+epSf7oCXAAFdnUMOaLYCB2H44UQW8IoZy/mlCRdZyDjTrr3hn/tjDZ0ggX9vTdIC8kuXKGJt1baVvtAMYmu/ZmLE5dIX5lEhboZAUEEtJhtazaCkqYgoAAAAAAAAAZ5T7lH0P7fed3Ru4IYvcpK6nuSl9ZmOy5j4SHmPD6C+16f7PjYCHNrmh9Me+Fc5KWfBAZh9lprDf+22k2FrxJtVgdafXbF9gbxN4an1N/QX5szgneM/Pm48r4kX2/shL7AhnC+TwGNbpfKdYBDIkLP2rfDEB06z5Tu/IinxvI0f7SzUp68r2nw8dv5CN6+cBAMPDBp/zevhwV7Gm2AEvD6gOqh1N1OeE/ZxIQyY/s4+thS6R2EKiOggAAAAAAAAHwikBrsVV45soDMVNtCmWY50L9+2P+8BhGRQGgYLHfAQSCkj18i9JHAKVKIiW7cY+EV7K2Q5/8W86onQIPODuQXOZxB+nEoDWSspZisSqtxrwaufhOgRGU+UDMeIFq+7k6rtQgLz49fWwwGRpYIWTlgADYFpu0e2TnjOm0Lbonrvf9OBLjKA8R5i1NdpNLl1dmKubAD+723BuMl0K1uvNQwI8ep0SoEAeFE1MdAaU5SRbxtLcvUAqpRVLyrRMRtFH9ePVyyylr9hqWiN4Xpxo81gAAAAAAAAawEyg7LROkHsZNmbGIieWsWaStoZ6/6/wzLE+amHDXT8mRa7e0mvubhnqZ/8bxB2rm8HdaCa7fu0hVy0F5zuvpn6lOJdeIA62FonfNfj33Uiu9uCsJal/xl9uKxJAtoXshRW6SvnEHZjA5XN9QK8v6z0pAARWumko+gR5tkSMb3NjvjSOk3+mWUq/nEC3kdJ3qDBZ9JVk5KE//JbHxJ0v9uFShGmSGx7SEkkfLQ3dqOKQdClyyApDdfcN40svT96F3UwJIh1Jf4MTyNsLWSzWR3JTGwcl3PrAHVkqdKpzRdB4gBWhJMltH+y6BqaVOz3f6AAAAAAABKrgYiLDRm8qPAqOT3IC10s9rwr1xJyCjYYIT6KtRuy1Xzp5VOVoGATZvoWKcySLdoooDunfxTM3GFYC9dd7AfM85Crc8+jvd+0yEupl2+Jf/EpCGdJSCb2gyWVGMWB1YGncIsWJ3RXd4S3M51ACxfGBv/xpjwRnDQ//1ajm4K1LuoXWfB4ZU/IutA44gd0OfXah5VgAAABDdwJyHKf82X3ezJJ1AVqNUDBYTEP/t7Ih6uijsRUxub3WkeqFIa9VpTu4eyWPmSzpp8OSc85EfrqGyPetgq7m0pn/PZUE+0on67q9868Huxn9SSWyFhPNurD0CF4cR4lLITPEkwgzlU+/681RvFBYGZdKG2WWJzAJXj9lhFRwwemvKfTjSgAAAAAAZPmW6adMFe+syzcieN6MZChmTmvavWbJIYpRXnpeQ8ld7I2zP9ICsWiC39OPRiIeaHwAK/yoqgWDTj1VDAN0i/WJwaL4UgTs0A9f8mDHu2rmc+Yh4wcNWFSFXd6yMsFuWZRjCN2HN19j9iLPbYFJZKPuMZBjPRBHXsrdabiHFXskHWo/jJ5YILbA1QyXavPKFJSdoQAAAAA" alt="Collancer Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <span style={{ fontFamily: "var(--ff-display)", fontSize: 20, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.1 }}>
                Coll<span className="text-gradient-cyan">ancer</span>
              </span>
              <span style={{ fontSize: 9, fontWeight: 500, color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>where influence meets industry</span>
            </div>
          </div>

          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {links.map(link => (
              <button key={link.id} onClick={() => scrollTo(link.id)} style={{
                color: 'var(--text-muted)', fontSize: 14, fontWeight: 500,
                background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.3s',
                fontFamily: 'var(--ff-body)',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{link.label}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn-glow hide-mobile" style={{ padding: '10px 22px', fontSize: 13 }} onClick={() => scrollTo('join')}>
              Join Early <Sparkles size={14} className="lucide-anim" />
            </button>
            <button className="hamburger" onClick={() => setMenuOpen(v => !v)} style={{
              display: 'flex', background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.2)',
              borderRadius: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexDirection: 'column', gap: 5, padding: 10
            }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 18, height: 2, borderRadius: 2,
                  background: menuOpen ? (i===1 ? 'transparent' : 'var(--cyan)') : 'var(--cyan)',
                  transform: menuOpen ? (i===0 ? 'rotate(45deg) translate(4px, 4px)' : i===2 ? 'rotate(-45deg) translate(4px, -4px)' : 'none') : 'none',
                  transition: 'all 0.3s'
                }} />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-overlay" style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(5,5,14,0.98)', backdropFilter: 'blur(24px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 0, padding: '80px 24px 40px', animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <Logo size={32} />
            <div style={{ fontFamily: "var(--ff-display)", fontSize: 24, fontWeight: 800 }}>Coll<span className="text-gradient-cyan">ancer</span></div>
          </div>
          {links.map((link, i) => (
            <button key={link.id} onClick={() => scrollTo(link.id)} style={{
              display: 'block', width: '100%', textAlign: 'center', padding: '18px 0',
              fontSize: 20, fontWeight: 600, color: 'var(--text)',
              background: 'none', border: 'none', borderBottom: i < links.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              cursor: 'pointer', fontFamily: 'var(--ff-body)'
            }}>{link.label}</button>
          ))}
          <button className="btn-glow" style={{ marginTop: 40, fontSize: 16, padding: '16px 48px', width: '100%' }} onClick={() => scrollTo('join')}>
            Join Now <Sparkles size={14} className="lucide-anim" />
          </button>
        </div>
      )}
    </>
  );
}

/* ═══ HERO ═══ */
function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const { isMobile, isTablet } = useDevice();
  return (
    <section id="hero" aria-label="Collancer — India's #1 Influencer Booking Marketplace" itemScope itemType="https://schema.org/WPHeader" style={{
      minHeight: '100svh', display: 'flex', alignItems: 'center',
      padding: isMobile ? '82px 16px 0' : isTablet ? '104px 24px 0' : 'clamp(105px, 12vw, 140px) clamp(16px, 4vw, 24px) 0',
      position: 'relative', overflow: 'hidden'
    }}>
      <video className="hero-background-video" autoPlay muted loop playsInline preload="metadata" poster="/hero-poster.jpg" aria-hidden="true">
        <source src="/hero-background.webm" type="video/webm" />
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>
      <div className="hero-video-overlay" aria-hidden="true" />
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)',
        left: mousePos.x - 300, top: mousePos.y - 300,
        pointerEvents: 'none', transition: 'left 0.3s ease-out, top 0.3s ease-out', zIndex: 1
      }} />
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      <div style={{ maxWidth: 920, margin: '0 auto', width: '100%', textAlign: 'center', position: 'relative', zIndex: 2 }}>
      <div className="reveal" style={{ marginBottom: 18, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 3 }}>
        <div className="badge badge-cyan" style={{ fontSize: isMobile ? 'clamp(8.5px, 2.25vw, 10px)' : 12, letterSpacing: isMobile ? 0.45 : 0.8, lineHeight: 1.2, padding: isMobile ? '6px 9px' : '7px 14px', whiteSpace: isMobile ? 'normal' : 'nowrap', maxWidth: '100%', textAlign: 'center', justifyContent: 'center' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          India's First Structured Influencer Booking Platform
        </div>
      </div>
        <h1 className="reveal" style={{
          fontFamily: "var(--ff-display)",
          fontSize: isMobile ? 'clamp(22px, 6vw, 30px)' : isTablet ? 'clamp(26px, 4.5vw, 40px)' : 'clamp(32px, 3.5vw, 56px)',
          fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 12
        }}>
          Where Indian Brands<br />
          <span className="text-gradient">Meet Verified Creators</span>
        </h1>

        <p className="reveal" style={{
          fontSize: 'clamp(14px, 2vw, 20px)', color: 'var(--text-muted)',
          lineHeight: 1.7, maxWidth: 600, margin: '0 auto 14px', transitionDelay: '0.1s'
        }}>
          Find creators, launch campaigns, collaborate securely, and grow your brand with India's next-generation creator marketplace.
        </p>

        <div className="reveal" style={{
          display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, justifyContent: 'center',
          transitionDelay: '0.15s', maxWidth: isMobile ? '100%' : 480, margin: '0 auto',
          width: '100%', padding: isMobile ? '0' : '0'
        }}>
          <button className="btn-glow" style={{ fontSize: 15, padding: isMobile ? '15px 24px' : 'clamp(14px,2vw,18px) clamp(28px,4vw,40px)' }}
            onClick={() => document.getElementById('for-brands')?.scrollIntoView({ behavior: 'smooth' })}>
            I am a Brand <Building2 size={18} className="lucide-anim" />
          </button>
          <button className="btn-outline" style={{ fontSize: 15, padding: isMobile ? '15px 24px' : undefined }}
            onClick={() => document.getElementById('for-creators')?.scrollIntoView({ behavior: 'smooth' })}>
            I am a Creator <Sparkles size={18} className="lucide-anim" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ═══ LOGO MARQUEE ═══ */
function LogoMarquee() {
  const doubled = [...LOGOS, ...LOGOS];
  return (
    <section className="logo-marquee-section" aria-label="Example brands creators recognize" style={{ padding: '8px 0 18px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
      <div className="marquee-container">
        <div className="marquee-track">
          {doubled.map((brand, i) => (
            <div key={`${brand.name}-${i}`} className="brand-logo-tile" title={brand.name} aria-label={brand.name} style={brand.name === 'Mamaearth' ? { marginLeft: 10 } : undefined}>
              <img src={brand.logo} alt={brand.name} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ PROBLEM SECTION — UPGRADED ═══ */
function ProblemSection() {
  const { isMobile } = useDevice();
  const problems = [
    {
      icon: <MessagesSquare size={32} />,
      title: "Random DMs & WhatsApp Chaos",
      short: "No system, no structure, just endless scrolling.",
      details: [
        "Brand managers spend 3–4 hours daily searching Instagram to find the right creator — with no filter, no verification, and no way to confirm their audience is real.",
        "Once found, everything happens over WhatsApp: briefs in voice notes, prices negotiated over 20+ messages, no written contract, and zero accountability if either side backs out.",
        "There is no campaign tracking. No record of what was agreed. No proof the content was delivered. Entire campaigns are managed through screenshots and threads."
      ],
      color: "#f87171",
      stat: "3–4 hrs",
      statLabel: "lost per campaign just finding a creator",
      image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&q=80"
    },
    {
      icon: <IndianRupee size={32} />,
      title: "Payments Are a Gamble",
      short: "Money moved over UPI with zero protection.",
      details: [
        "Most influencer payments in India happen through direct UPI transfers to a personal number — with no escrow, no contract, no invoice, and no legal protection if anything goes wrong.",
        "Brands have lost thousands to creators who ghosted after receiving advance payment. Creators have delivered content to brands who disappeared without paying.",
        "There is no standardized pricing either. A creator with 50K followers might quote Rs.500 to one brand and Rs.15,000 to another — both parties are flying blind."
      ],
      color: "#fb923c",
      stat: "40%",
      statLabel: "of campaigns face payment disputes or ghosting",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80"
    },
    {
      icon: <TrendingDown size={32} />,
      title: "Fake Metrics Everywhere",
      short: "Inflated followers, bought likes, zero ROI.",
      details: [
        "India has one of the world's highest rates of fake follower inflation. Accounts with 200K 'followers' can have real engagement from just 800 people — and there is no easy way for brands to verify.",
        "There are no standardised tools available to small and mid-sized brands to check engagement quality, audience geography, or demographic fit before paying.",
        "After paying, brands have no way to track whether the post went live on time, how it performed, or whether the creator followed the brief at all."
      ],
      color: "#a78bfa",
      stat: "60%",
      statLabel: "of creators have purchased fake followers at some point",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
    },
  ];

  return (
    <section id="problem" aria-label="The Problem with Influencer Marketing in India" style={{ padding: isMobile ? '56px 16px' : 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 24px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div className="badge badge-red reveal" style={{ marginBottom: 24 }}>The Problem</div>
          <h2 className="section-title reveal">
            Influencer Marketing in India<br />
            <span className="glow-red">is Completely Broken</span>
          </h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 'clamp(14px,2vw,18px)', maxWidth: 620, margin: '28px auto 0', lineHeight: 1.7, transitionDelay: '0.1s' }}>
            India's influencer economy is worth <strong style={{ color: 'var(--text)' }}>₹3,500 crore</strong> and growing — yet the entire industry runs on WhatsApp DMs, personal UPI transfers, and gut feeling. There is no infrastructure. No standards. No protection.
          </p>
        </div>

        {/* Big visual problem cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {problems.map((p, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : (i % 2 === 0 ? 'minmax(0,1fr) minmax(0,420px)' : 'minmax(0,420px) minmax(0,1fr)'),
                gap: isMobile ? '24px' : 'clamp(24px,4vw,48px)', alignItems: 'center'
              }}>
                {/* Text block */}
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 20,
                    color: p.color
                  }}>
                    {p.icon}
                    <span style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(18px,3vw,28px)', fontWeight: 800, color: p.color }}>{p.title}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 600, marginBottom: 20, lineHeight: 1.6 }}>{p.short}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                    {p.details.map((d, di) => (
                      <div key={di} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, marginTop: 8, flexShrink: 0 }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75 }}>{d}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 14,
                    background: `${p.color}0f`, border: `1px solid ${p.color}25`,
                    borderRadius: 16, padding: '14px 20px'
                  }}>
                    <div style={{ fontFamily: 'var(--ff-display)', fontSize: 32, fontWeight: 800, color: p.color }}>{p.stat}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 180, lineHeight: 1.5 }}>{p.statLabel}</div>
                  </div>
                </div>

                {/* Image */}
                <div className="hide-mobile" style={{ order: i % 2 === 0 ? 1 : 0 }}>
                  <div className="img-card" style={{ height: 300, borderRadius: 24, border: `1px solid ${p.color}18` }}>
                    <img src={p.image} alt={p.title} loading="lazy" />
                    <div className="img-card-overlay" />
                    <div style={{
                      position: 'absolute', bottom: 20, left: 20, right: 20, zIndex: 2,
                      background: 'rgba(5,5,14,0.8)', backdropFilter: 'blur(12px)',
                      border: `1px solid ${p.color}25`, borderRadius: 14, padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: 10
                    }}>
                      <div style={{ color: p.color }}>{p.icon && <X size={18} />}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>This is how influencer marketing works <strong style={{ color: p.color }}>without Collancer</strong></div>
                    </div>
                  </div>
                </div>
              </div>
              {i < problems.length - 1 && <div className="divider-line" style={{ marginTop: 48 }} />}
            </div>
          ))}
        </div>

        {/* The number */}
        <div className="glass-card reveal" style={{
          marginTop: 64, padding: 'clamp(32px,6vw,56px)', textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(248,113,113,0.04), rgba(10,10,26,0.98))',
          borderColor: 'rgba(248,113,113,0.15)'
        }}>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'var(--text-muted)', marginBottom: 16 }}>The scale of the opportunity being wasted</p>
          <div className="stat-big text-gradient" style={{ marginBottom: 12 }}>₹3,500 Crore</div>
          <p style={{ fontSize: 'clamp(14px,1.8vw,17px)', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Spent every year on influencer marketing in India — almost entirely managed over WhatsApp, with no contracts, no payment protection, and no way to verify results.
          </p>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--cyan)', fontSize: 14, fontWeight: 700 }}>
            <span>Collancer is the fix. Here's how.</span>
            <div className="lucide-anim"><ArrowDown size={24} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ FOR BUSINESSES ═══ */
function ForBrands() {
  const { isMobile } = useDevice();
  return (
    <section id="for-brands" aria-label="Collancer for Brands — Book Verified Indian Influencers" style={{ padding: isMobile ? '56px 16px' : 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 24px)', background: 'rgba(0,229,255,0.012)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-cyan reveal" style={{ marginBottom: 24 }}>For Brands</div>
          <h2 className="section-title reveal">Find the Right Creator<br /><span className="text-gradient">Without the DM Chaos</span></h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 'clamp(14px,2vw,18px)', maxWidth: 600, margin: '24px auto 0', lineHeight: 1.7, transitionDelay: '0.1s' }}>
            Browse growing verified Indian creators. Filter by niche, city, budget, followers, and engagement rate — or describe what you need to Collancer AI and get matched instantly.
          </p>
        </div>

        {/* Before/After comparison */}
        <div className="reveal glass-card" style={{ marginBottom: 56, padding: 'clamp(20px,4vw,40px)', overflow: 'visible' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ fontFamily: 'var(--ff-display)', fontSize: 20, fontWeight: 700 }}>Before Collancer vs. After Collancer</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 24 }}>
            {/* Before */}
            <div style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, color: 'var(--red)', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 15 }}>
                <X size={16} /> Without Collancer
              </div>
              {[
                "Spend 3–4 hours daily scrolling Instagram just to find one creator",
                "Send 40 DMs, get 5 replies — half are bots or ghost accounts",
                "Negotiate price over 20+ WhatsApp messages with no written agreement",
                "Transfer money via personal UPI with zero legal protection",
                "Creator vanishes after receiving advance — no content, no refund",
                "Campaign ends with zero data on whether the post ever went live",
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                  <X size={14} style={{ color: 'var(--red)', marginTop: 3, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            {/* After */}
            <div style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, color: 'var(--cyan)', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 15 }}>
                <Check size={16} /> With Collancer
              </div>
              {[
                "Tell Collancer AI your niche & budget — get matched in under 2 minutes",
                "Every creator is verified with real follower data and genuine reviews",
                "Transparent fixed pricing — you see the cost before you book, not after",
                "Pay securely via Razorpay — funds locked in escrow until delivery",
                "If a creator rejects or misses the deadline, you get a full automatic refund",
                "Live campaign dashboard shows delivery status, content link & performance",
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                  <Check size={14} style={{ color: 'var(--green)', marginTop: 3, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refund Guarantee Banner */}
        <div className="glass-card reveal" style={{
          marginBottom: 32, padding: '20px 28px',
          background: 'linear-gradient(135deg, rgba(74,222,128,0.07), rgba(0,229,255,0.04))',
          borderColor: 'rgba(74,222,128,0.25)',
          display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap'
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={24} style={{ color: 'var(--green)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 800, fontSize: 16, color: 'var(--green)', marginBottom: 4 }}>100% Refund Guarantee</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
              If a creator <strong style={{ color: 'var(--text)' }}>rejects your booking</strong> or <strong style={{ color: 'var(--text)' }}>fails to deliver within the agreed deadline</strong>, your full payment is automatically refunded — no disputes, no forms, no waiting. Your money is never at risk on Collancer.
            </div>
          </div>
        </div>

        <section className="creator-ai-live glass-card" aria-label="Collancer AI for creators" style={{marginBottom:48,padding:'clamp(22px,4vw,34px)',background:'linear-gradient(135deg,rgba(0,229,255,.055),rgba(179,136,255,.07))',borderColor:'rgba(0,229,255,.17)'}}><div style={{position:'relative',zIndex:2,textAlign:'center',marginBottom:28}}><div className="badge badge-cyan" style={{marginBottom:16}}><span>✦</span> Meet Collancer AI for Creators</div><h3 style={{fontFamily:'var(--ff-display)',fontSize:'clamp(22px,3.2vw,34px)',fontWeight:850,margin:'0 0 12px'}}>Stop hunting for collabs.<br/><span className="text-gradient">Let Collancer AI find them.</span></h3><p style={{color:'var(--text-muted)',fontSize:14,lineHeight:1.7,maxWidth:680,margin:'0 auto'}}>Discover live paid opportunities and turn confirmed bookings into stronger content ideas.</p></div><div className="creator-ai-window"><div className="creator-ai-windowbar"><div className="creator-ai-orb">✦</div><div><div style={{fontFamily:'var(--ff-display)',fontWeight:800,fontSize:14}}>Collancer AI</div><div style={{fontSize:10,color:'var(--text-muted)'}}>Creator Opportunity & Content Assistant</div></div><div className="creator-ai-status"><i/> Live demo</div></div><div className="creator-ai-chat"><div className="creator-ai-bubble" style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}><div className="creator-ai-user">Find live paid skincare collabs for me in Mumbai under ₹10K.</div></div><div className="creator-ai-bubble" style={{display:'flex',justifyContent:'flex-start',marginBottom:12}}><div className="creator-ai-bot">Matching your profile to live campaigns using niche, location, format, audience and budget.</div></div><div className="creator-ai-scan"><div style={{display:'flex',alignItems:'center',gap:8,color:'var(--cyan)',fontSize:11,fontWeight:700}}>⌕ Finding relevant live opportunities</div><div className="creator-ai-chips"><span className="creator-ai-chip">Paid</span><span className="creator-ai-chip">Mumbai</span><span className="creator-ai-chip">Skincare</span><span className="creator-ai-chip">Reels</span></div></div><div className="creator-ai-bot" style={{maxWidth:'100%'}}><div style={{color:'var(--cyan)',fontWeight:800,fontSize:11,textTransform:'uppercase',letterSpacing:.7,marginBottom:8}}>3 live collabs match your profile</div><div className="creator-ai-opportunity"><div className="creator-ai-logo">PL</div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:800}}>PLUM · Skincare Reel</div><div style={{fontSize:10,color:'var(--text-muted)'}}>Paid · ₹7,500 · Apply through Collancer</div></div><div className="creator-ai-fit"><div className="creator-ai-score">96%</div><div className="creator-ai-label">FIT</div></div></div><div className="creator-ai-opportunity"><div className="creator-ai-logo">MA</div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:800}}>MARS · Beauty UGC Reel</div><div style={{fontSize:10,color:'var(--text-muted)'}}>Paid · ₹6,000 · Apply through Collancer</div></div><div className="creator-ai-fit"><div className="creator-ai-score">93%</div><div className="creator-ai-label">FIT</div></div></div><div style={{marginTop:12,paddingTop:11,borderTop:'1px solid rgba(255,255,255,.06)'}}><div style={{color:'var(--purple)',fontWeight:800,fontSize:11,marginBottom:8}}>✦ Booking received — content ideas ready</div><div className="creator-ai-ideas"><div className="creator-ai-idea"><strong>Hook-first</strong><br/>Problem → product → result.</div><div className="creator-ai-idea"><strong>Routine</strong><br/>Build the product into a morning routine.</div><div className="creator-ai-idea"><strong>Story</strong><br/>Keep the brand brief natural and creator-led.</div></div></div></div></div></div></section>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: 'clamp(14px, 2vw, 20px)', marginBottom: 'clamp(48px, 7vw, 72px)'
        }}>
          {FEATURES_BIZ.map((f, i) => (
            <div key={i} className="glass-card reveal spotlight-card" style={{ padding: 28, transitionDelay: `${i * 0.08}s`, textAlign: 'center' }}>
              <div className="feat-icon" style={{ background: f.color, border: `1px solid ${f.border}`, margin: '0 auto 18px', color: f.accent }}>
                <span style={{ lineHeight: 1 }}><EmojiToIcon emoji={f.icon} size={24} /></span>
              </div>
              <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card reveal" style={{ padding: 'clamp(28px,5vw,48px) clamp(20px,4vw,40px)', textAlign: 'center', background: 'linear-gradient(180deg, rgba(0,229,255,0.06), rgba(179,136,255,0.04))' }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Building2 size={48} className="lucide-anim" /></div>
          <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 'clamp(18px,3vw,28px)', fontWeight: 800, marginBottom: 12 }}>Ready to find your next creator?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Discover creators with transparent pricing, structured briefs, secure payments, and AI-powered matching — all in one place.
          </p>
          <button className="btn-glow" style={{ fontSize: 17, padding: '18px 48px' }} onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}>
            Find Creators <Sparkles size={16} className="lucide-anim" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ═══ COLLANCER AI SECTION ═══ */
function CleoSection() {
  const { isMobile, isTablet } = useDevice();
  const sectionRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState('');
  const [visible, setVisible] = useState(false);

  const prompt = 'Find 3 skincare creators in Mumbai for a ₹25,000 launch. Prioritise strong engagement, women 18–34 audience, Reels, and creators who fit our premium positioning.';
  const creators = [
    { initials:'AK', name:'Aarohi Kapoor', handle:'@aarohikapoor', niche:'Beauty · Mumbai', reach:'118K', fit:'98%', price:'₹8,500', note:'Premium aesthetic' },
    { initials:'RS', name:'Riya Shah', handle:'@riyashah', niche:'Skincare · Mumbai', reach:'84K', fit:'96%', price:'₹6,500', note:'Strong engagement' },
    { initials:'MN', name:'Mehak Nair', handle:'@mehaknair', niche:'Beauty · Mumbai', reach:'62K', fit:'94%', price:'₹5,500', note:'Audience match' },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.28 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    // Play the Collancer AI demo once when it first enters view.
    // After the full sequence is shown, leave it in the completed state
    // instead of restarting the animation every few seconds.
    let typingTimer;
    const phaseTimers = [];

    setPhase(1);
    setTyped('');
    let i = 0;
    typingTimer = setInterval(() => {
      i += 2;
      setTyped(prompt.slice(0, i));
      if (i >= prompt.length) {
        clearInterval(typingTimer);
        phaseTimers.push(setTimeout(() => setPhase(2), 800));
        phaseTimers.push(setTimeout(() => setPhase(3), 1900));
        phaseTimers.push(setTimeout(() => setPhase(4), 4700));
        phaseTimers.push(setTimeout(() => setPhase(5), 5900));
      }
    }, 34);

    return () => {
      clearInterval(typingTimer);
      phaseTimers.forEach(clearTimeout);
    };
  }, [visible]);

  return (
    <section id="cleo" ref={sectionRef} className="cleo-showcase" aria-label="Collancer AI — AI creator discovery for brands" style={{ padding: (isMobile || isTablet) ? '64px 16px' : 'clamp(90px, 10vw, 130px) clamp(16px, 4vw, 24px)' }}>
      <div style={{ maxWidth: 1180, margin:'0 auto', position:'relative', zIndex:2 }}>
        <div style={{ textAlign:'center', marginBottom: 52 }}>
          <div className="badge badge-purple reveal" style={{ marginBottom:18 }}><Bot size={13} /> Meet Collancer AI</div>
          <h2 className="section-title reveal" style={{ marginBottom:18 }}>
            Tell Collancer AI What You Need.<br /><span className="text-gradient-purple">Let AI Find the Right Creators.</span>
          </h2>
          <p className="reveal" style={{ color:'var(--text-muted)', fontSize:'clamp(14px,1.8vw,18px)', lineHeight:1.75, maxWidth:700, margin:'0 auto' }}>
            Brands describe the campaign in plain language. Collancer AI turns the brief into a ranked creator shortlist — matching niche, audience, content style, location, budget and campaign fit.
          </p>
        </div>

        <div className="cleo-demo-shell reveal">
          <div className="cleo-windowbar">
            <div className="cleo-window-orb"><Bot size={16} color="var(--cyan)" /></div>
            <div>
              <div style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:14 }}>Collancer AI</div>
              <div style={{ fontSize:10, color:'var(--text-muted)' }}>Creator Discovery Engine</div>
            </div>
            <div className="cleo-status"><span className="cleo-status-dot" /> Live demo</div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:(isMobile || isTablet) ? '1fr' : 'minmax(0,1.45fr) minmax(280px,.65fr)', minHeight:560 }}>
            <div className="cleo-chat">
              <div className="cleo-orbit" />
              <div style={{ position:'relative', zIndex:2, display:'flex', justifyContent:'center', marginBottom:16 }}>
                <span style={{ fontSize:9, color:'var(--text-dim)', letterSpacing:1.2, textTransform:'uppercase' }}>Campaign brief → AI matching → ranked creators</span>
              </div>

              <div className="cleo-msg" style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}>
                <div className="cleo-user-msg">
                  {typed || (phase === 0 ? 'I need creators for my next campaign…' : '')}
                  {phase === 1 && <span style={{ display:'inline-block', width:2, height:14, background:'var(--cyan)', marginLeft:2, verticalAlign:'middle', animation:'cleoCursor 1s infinite' }} />}
                </div>
              </div>

              {phase >= 2 && (
                <div className="cleo-msg" style={{ display:'flex', justifyContent:'flex-start', marginBottom:12 }}>
                  <div className="cleo-ai-msg">
                    Got it. I’m translating your brief into creator signals — <strong>niche, audience, engagement, location, content style and budget.</strong>
                  </div>
                </div>
              )}

              {phase >= 3 && phase < 4 && (
                <div className="cleo-scan cleo-msg">
                  <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--cyan)', fontSize:11, fontWeight:700 }}><Search size={13} /> Searching the creator network</div>
                  <div className="cleo-scan-row">
                    <span className="cleo-chip"><Target size={10} /> Skincare</span>
                    <span className="cleo-chip"><MapPin size={10} /> Mumbai</span>
                    <span className="cleo-chip"><Users size={10} /> Women 18–34</span>
                    <span className="cleo-chip"><BarChart3 size={10} /> Engagement</span>
                    <span className="cleo-chip"><IndianRupee size={10} /> ₹25K</span>
                  </div>
                </div>
              )}

              {phase >= 4 && (
                <div className="cleo-msg">
                  <div className="cleo-ai-msg" style={{ maxWidth:'100%' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, color:'var(--cyan)', fontWeight:800, fontSize:11, textTransform:'uppercase', letterSpacing:.8, marginBottom:10 }}>
                      <BadgeCheck size={14} /> 3 high-fit creators found
                    </div>
                    <div style={{ color:'var(--text-muted)', fontSize:11, marginBottom:10 }}>Ranked by campaign fit — not follower count alone.</div>
                    <div className="cleo-results">
                      {creators.map((c, i) => (
                        <div className="cleo-result" key={c.name}>
                          {i === 0 && <span className="cleo-rank">TOP MATCH</span>}
                          <div className="cleo-avatar">{c.initials}</div>
                          <div style={{ minWidth:0, flex:1 }}>
                            <div style={{ fontSize:12, fontWeight:800, paddingRight:i===0?70:0 }}>{c.name}</div>
                            <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:2 }}>{c.handle} · {c.niche}</div>
                            <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginTop:6 }}>
                              <span style={{ fontSize:9, color:'var(--text-muted)' }}>{c.reach} reach</span>
                              <span style={{ fontSize:9, color:'var(--cyan)' }}>{c.note}</span>
                              <span style={{ fontSize:9, color:'var(--green)' }}>{c.price}</span>
                            </div>
                          </div>
                          <div className="cleo-fit"><div className="cleo-fit-score">{c.fit}</div><div className="cleo-fit-label">FIT</div></div>
                        </div>
                      ))}
                    </div>
                    {phase >= 5 && (
                      <div style={{ marginTop:11, paddingTop:10, borderTop:'1px solid rgba(255,255,255,.06)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, animation:'cleoBubble .55s both' }}>
                        <span style={{ fontSize:10, color:'var(--text-muted)' }}>Want me to draft the campaign brief?</span>
                        <span style={{ fontSize:10, fontWeight:800, color:'var(--cyan)', display:'inline-flex', alignItems:'center', gap:4 }}>Continue <ArrowRight size={11}/></span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="cleo-composer">
                <div className="cleo-composer-input">Describe your campaign to Collancer AI…</div>
                <div className="cleo-send"><ArrowRight size={15} /></div>
              </div>
            </div>

            <div style={{ padding: isMobile ? '0 14px 16px' : '22px', display:'flex', alignItems:'center', position:'relative' }}>
              <div className="cleo-pulse-ring" />
              <div className="cleo-side-stack" style={{ width:'100%', position:'relative', zIndex:2 }}>
                <div className="cleo-metric-card">
                  <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--cyan)', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:.8 }}><Target size={14}/> What Collancer AI matches</div>
                  <div style={{ display:'grid', gap:10, marginTop:15 }}>
                    {[['Audience fit','98%'],['Content style','94%'],['Campaign fit','97%'],['Budget fit','92%']].map(([label,val]) => <div key={label}><div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'var(--text-muted)'}}><span>{label}</span><strong style={{color:'var(--text)'}}>{val}</strong></div><div className="cleo-mini-bar"><span style={{width:val}} /></div></div>)}
                  </div>
                </div>
                <div className="cleo-metric-card">
                  <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--purple)', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:.8 }}><Sparkles size={14}/> Why brands care</div>
                  <div style={{ marginTop:12, display:'grid', gap:9 }}>
                    {['Skip the endless DM search','Compare relevant creators faster','Start with a structured campaign brief','Keep discovery focused on fit'].map((x,i)=><div key={x} style={{display:'flex',alignItems:'center',gap:8,fontSize:11,color:'var(--text-muted)'}}><CheckCircle size={13} color={i<2?'var(--cyan)':'var(--purple)'}/>{x}</div>)}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, color:'var(--text-dim)', fontSize:10, paddingTop:2 }}><Lock size={11}/> Demo interface · no real creator data used</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap', marginTop:18 }}>
          {['Natural language search','Creator fit scoring','Budget-aware matching','Ranked shortlists'].map((x,i)=><span key={x} className="cleo-chip" style={{ padding:'7px 11px', color:i===0?'var(--cyan)':'var(--text-muted)' }}><CheckCircle size={11}/>{x}</span>)}
        </div>
      </div>
    </section>
  );
}


/* ═══ REQUIREMENTS MARKETPLACE ═══ */
function RequirementsMarketplace() {
  const { isMobile } = useDevice();
  const steps = [
    { icon: "📝", title: "Post Your Brief", desc: "Set your campaign title, budget, category, and promotion type. A structured brief means creators know exactly what you need — no back-and-forth.", color: "var(--cyan)" },
    { icon: "📬", title: "Receive Proposals", desc: "Verified creators browse your brief and send tailored proposals with their price, timeline, and a message explaining why they're the right fit.", color: "var(--purple)" },
    { icon: "🔄", title: "Compare Offers", desc: "Review all offers side by side — creator profile, verified metrics, price, proposal message, and estimated timeline. No scrolling through DMs.", color: "var(--pink)" },
    { icon: "⚡", title: "Accept & Book", desc: "One tap converts the best proposal into an active booking. Payment is collected securely and held until delivery.", color: "var(--amber)" },
  ];

  return (
    <section id="marketplace" style={{ padding: 'clamp(56px, 8vw, 120px) clamp(16px, 4vw, 24px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-cyan reveal" style={{ marginBottom: 20 }}>Pro Feature</div>
          <h2 className="section-title reveal">Requirements <span className="text-gradient">Marketplace</span></h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 'clamp(15px,2vw,18px)', maxWidth: 620, margin: '24px auto 0', lineHeight: 1.7, transitionDelay: '0.1s' }}>
            Prefer inbound applications? Post a structured campaign brief and let relevant creators pitch you. You set the budget and deliverables; creators come to you.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'clamp(12px,2vw,20px)' }}>
          {steps.map((s, i) => (
            <div key={i} className="glass-card reveal spotlight-card" style={{ padding: 28, transitionDelay: `${i * 0.08}s`, borderLeft: `3px solid ${s.color}` }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: `color-mix(in srgb, ${s.color} 12%, #13132e)`, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <EmojiToIcon emoji={s.icon} size={22} />
              </div>
              <div style={{ fontFamily: 'var(--ff-display)', fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 8, letterSpacing: 0.5 }}>STEP {String(i+1).padStart(2,'0')}</div>
              <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 18, fontWeight: 700, marginBottom: 10, color: s.color }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="glass-card reveal" style={{ marginTop: 32, padding: '20px 28px', background: 'linear-gradient(180deg, rgba(179,136,255,0.08), rgba(0,229,255,0.04))', borderColor: 'rgba(179,136,255,0.2)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <ClipboardList size={28} className="lucide-anim" style={{ color: 'var(--purple)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, fontFamily: 'var(--ff-display)' }}>Built into the Collancer workflow</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Create structured briefs, receive creator proposals, compare offers, and book the right fit without leaving Collancer.</div>
          </div>
          <button className="btn-outline" style={{ fontSize: 14, padding: '11px 24px', whiteSpace: 'nowrap' }} onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}>
            Get Early Access <Sparkles size={14} className="lucide-anim" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ═══ FOR CREATORS — UPGRADED ═══ */
function ForCreators() {
  const { isMobile } = useDevice();
  return (
    <section id="for-creators" style={{ padding: isMobile ? '56px 16px' : 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 24px)', background: 'rgba(179,136,255,0.012)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="badge badge-purple reveal" style={{ marginBottom: 24 }}>For Creators</div>
          <h2 className="section-title reveal">Turn Your Audience Into<br /><span className="text-gradient-purple">Steady, Guaranteed Income</span></h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 'clamp(13px,1.8vw,17px)', maxWidth: 640, margin: '28px auto 0', lineHeight: 1.75, transitionDelay: '0.1s' }}>
            If you're a creator in India, you've probably dealt with brands who ghost, negotiate endlessly, or forget to pay. Collancer eliminates all of that. Your profile does the selling. Your work gets paid automatically.
          </p>
        </div>

        {/* Creator pain → solution */}
        <div className="reveal glass-card" style={{ marginBottom: 56, padding: 'clamp(24px,4vw,40px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 16, color: 'var(--red)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ThumbsDown size={16} /> Creator Life Before Collancer
              </div>
              {[
                "Brand slides into DMs with a 'can you promote this?' — no brief, no budget",
                "Spend 3 days going back and forth on WhatsApp just to agree on a price",
                "Brand sends 50% advance over personal UPI — then stops responding",
                "You deliver the content — they say 'we'll post later' — they never do",
                "No invoice, no contract, no proof it even happened — professionally invisible",
                "Next brand has no idea who you are — you start from zero every single time",
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <X size={14} style={{ color: 'var(--red)', marginTop: 3, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 16, color: 'var(--purple)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={16} /> Creator Life with Collancer
              </div>
              {[
                "Brands arrive with a full brief, fixed budget, and clear expectations",
                "Your prices are public — serious brands book you, time-wasters don't",
                "100% payment is locked in escrow before you create a single frame of content",
                "Deliver through the platform — your earnings release automatically, no chasing",
                "Every completed campaign adds a verified review — your profile sells for you",
                "Collancer AI recommends you to matching brands 24/7 — even while you sleep",
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <Check size={14} style={{ color: 'var(--green)', marginTop: 3, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: 'clamp(14px, 2vw, 20px)', marginBottom: 'clamp(48px, 7vw, 72px)'
        }}>
          {FEATURES_CREATOR.map((f, i) => (
            <div key={i} className="glass-card reveal spotlight-card" style={{ padding: 28, transitionDelay: `${i * 0.08}s`, textAlign: 'center' }}>
              <div className="feat-icon" style={{ background: f.color, border: `1px solid ${f.border}`, margin: '0 auto 18px', color: f.accent }}>
                <EmojiToIcon emoji={f.icon} size={24} />
              </div>
              <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Two core collaboration models */}
        <div style={{ marginBottom: 72 }}>
          <h3 className="reveal" style={{ fontFamily: "var(--ff-display)", fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 10 }}>
            Two Ways to <span className="glow-purple">Collaborate</span>
          </h3>
          <p className="reveal" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>
            Choose the collaboration model that works best for your content and your goals.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 'clamp(14px,2vw,20px)' }}>
            {[
              { icon: <BanknoteIcon size={28} strokeWidth={1.8} />, title: 'Paid Collaborations', desc: 'Create content for brands and get paid for your agreed deliverables. Set your rates, review the brief, and collaborate through a structured booking.', color: 'var(--cyan)', features: ['Set your own rates', 'Secure payment flow', 'Clear campaign brief'] },
              { icon: <Gift size={28} strokeWidth={1.8} />, title: 'Barter Collaborations', desc: 'Collaborate with brands in exchange for products or experiences. Discover relevant opportunities and understand the deliverables before you accept.', color: 'var(--purple)', features: ['Product / experience exchange', 'Clear deliverables', 'Discover relevant opportunities'] }
            ].map((item, i) => (
              <div key={i} className="glass-card reveal spotlight-card" style={{ padding: 'clamp(22px,3vw,32px)', textAlign: 'left', borderColor: `${item.color}22`, transitionDelay: `${i * 0.08}s` }}>
                <div style={{ width: 58, height: 58, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, background: `${item.color}12`, border: `1px solid ${item.color}30`, marginBottom: 18 }}>{item.icon}</div>
                <h4 style={{ fontFamily: 'var(--ff-display)', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{item.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>{item.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {item.features.map((f, fi) => <span key={fi} style={{ padding: '6px 10px', borderRadius: 999, background: `${item.color}0c`, border: `1px solid ${item.color}20`, color: 'var(--text-muted)', fontSize: 11 }}>{f}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card reveal" style={{ padding: 'clamp(28px,5vw,48px) clamp(20px,4vw,40px)', textAlign: 'center', background: 'linear-gradient(180deg, rgba(179,136,255,0.06), rgba(255,110,180,0.04))' }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Sparkles size={48} className="lucide-anim" style={{ color: 'var(--purple)' }} /></div>
          <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 'clamp(18px,3vw,28px)', fontWeight: 800, marginBottom: 12 }}>Ready to turn your content into brand opportunities?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Create your free creator profile today. brands across India are already searching for creators in your niche. Listing is completely free — always.
          </p>
          <button className="btn-outline" style={{ fontSize: 17, padding: '17px 48px' }} onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}>
            List Your Profile Free <Sparkles size={16} className="lucide-anim" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ═══ HOW IT WORKS ═══ */
function HowItWorks() {
  const { isMobile } = useDevice();
  const [active, setActive] = useState('brand');
  const steps = active === 'brand' ? HOW_IT_WORKS_BIZ : HOW_IT_WORKS_CREATOR;

  return (
    <section id="how-it-works" aria-label="How Collancer Works — Step by Step Guide" style={{ padding: isMobile ? '56px 16px' : 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 24px)' }}>
      <div style={{ width: '100%', maxWidth: 980, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="badge badge-green reveal" style={{ marginBottom: 20 }}>Simple Process</div>
          <h2 className="section-title reveal">How <span className="text-gradient">Collancer Works</span></h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 18, maxWidth: 500, margin: '20px auto 36px', lineHeight: 1.7, transitionDelay: '0.05s' }}>
            From discovery to delivery — everything in one place.
          </p>
          <div className="reveal" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="toggle-pill">
              <button className={active === 'brand' ? 'active' : ''} onClick={() => setActive('brand')}>For Brands</button>
              <button className={active === 'creator' ? 'active' : ''} onClick={() => setActive('creator')}>For Creators</button>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: 860, margin: '0 auto' }}>
          <div style={{ position: 'absolute', left: 23, top: 56, bottom: 60, width: 2, background: 'linear-gradient(to bottom, var(--cyan), var(--purple), transparent)', zIndex: 0 }} className="hide-mobile" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {steps.map((s, i) => (
              <div key={`${active}-${i}`} style={{ display: 'flex', gap: isMobile ? 12 : 24, alignItems: 'flex-start', position: 'relative', zIndex: 1, opacity: 1, transform: 'none' }}>
                {!isMobile && <div className="number-ring" style={{ background: `color-mix(in srgb, ${s.color} 12%, #0a0a1a)`, border: `2px solid ${s.color}50`, color: s.color, flexShrink: 0 }}>{s.num}</div>}
                <div className="glass-card spotlight-card" style={{ flex: 1, padding: isMobile ? 18 : 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, borderRadius: 12, background: `color-mix(in srgb, ${s.color} 10%, #0f0f22)`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <EmojiToIcon emoji={s.icon} size={isMobile ? 18 : 20} />
                    </div>
                    <div>
                      {isMobile && <div style={{ fontFamily: 'var(--ff-display)', fontSize: 10, fontWeight: 700, color: s.color, marginBottom: 2, letterSpacing: 0.5 }}>STEP {s.num}</div>}
                      <h3 style={{ fontFamily: "var(--ff-display)", fontSize: isMobile ? 15 : 18, fontWeight: 700, color: s.color }}>{s.title}</h3>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ CATEGORIES ═══ */
function Categories() {
  return (
    <section id="categories" aria-label="25 Influencer Marketing Niches on Collancer" style={{ padding: 'clamp(56px, 8vw, 120px) clamp(16px, 4vw, 24px)', background: 'rgba(255,255,255,0.008)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="badge badge-amber reveal" style={{ marginBottom: 20 }}>All Niches</div>
          <h2 className="section-title reveal">25 <span className="text-gradient-warm">Categories Covered</span></h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 17, maxWidth: 500, margin: '20px auto 0', lineHeight: 1.7, transitionDelay: '0.05s' }}>
            From fashion and beauty to food, finance, tech and travel — Collancer is built around 25 creator niches.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {CATEGORIES.map((c, i) => (
            <div key={i} className="reveal" style={{
              transitionDelay: `${i * 0.025}s`,
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 50,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              fontSize: 13, fontWeight: 500, color: 'var(--text-muted)',
              transition: 'all 0.3s var(--ease-out-expo)', cursor: 'default'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)'; e.currentTarget.style.color = 'var(--cyan)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <span style={{ fontSize: 16 }}><EmojiToIcon emoji={c.icon} size={16} /></span> {c.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ SOCIAL PROOF ═══ */
function SocialProof() {
  const { isMobile } = useDevice();
  return (
    <section id="testimonials" aria-label="Trust Signals and Reviews — Collancer" style={{ padding: isMobile ? '32px 16px' : 'clamp(40px, 6vw, 60px) clamp(16px, 4vw, 24px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Trust badges */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: isMobile ? '12px' : 'clamp(12px,2vw,24px)', marginTop: isMobile ? 0 : 32 }}>
          {[
            { icon: <ShieldCheck size={20} />, label: "Escrow-Protected Payments" },
            { icon: <BadgeCheck size={20} />, label: "Verified Creator Profiles" },
            { icon: <Lock size={20} />, label: "Razorpay Secure Checkout" },
            { icon: <Globe size={20} />, label: "Made in India, for India" },
            { icon: <ArrowLeftRight size={20} />, label: "Full Refund if Creator Rejects" },
          ].map((b, i) => (
            <div key={i} className="reveal" style={{
              display: 'flex', alignItems: 'center', gap: 8, transitionDelay: `${i * 0.08}s`,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: isMobile ? '12px 14px' : '12px 20px', color: 'var(--text-muted)', fontSize: isMobile ? 12 : 14,
              justifyContent: isMobile ? 'center' : 'flex-start', flexDirection: isMobile ? 'column' : 'row',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              <span style={{ color: 'var(--cyan)' }}>{b.icon}</span>
              <span style={{ fontWeight: 600 }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ JOIN ═══ */
function JoinSection() {
  const { isMobile } = useDevice();
  const [tab, setTab] = useState('brand');
  const [form, setForm] = useState({ name: '', email: '', type: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    // Honeypot check — if the hidden field is filled, it's a bot
    if (form._hp) return;

    // Validate
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0]);
      return;
    }

    // Client-side rate limit
    if (!clientRateCheck()) {
      setError('Too many submissions. Please wait a minute and try again.');
      return;
    }

    setLoading(true);
    try {
      // Sanitize all inputs before writing to database
      const cleanName  = sanitize(form.name);
      const cleanEmail = sanitize(form.email).toLowerCase();
      const cleanPhone = sanitize(form.phone);
      const cleanType  = sanitize(form.type);

      // Deduplication: prevent the same email submitting twice
      // Single-field query only — compound queries need a Firestore composite index
      // limit(1) avoids reading all matching docs — we only need to know if any exist
      const dupQ = query(
        collection(db, "registrations"),
        where("email", "==", cleanEmail),
        limit(1)
      );
      const dupSnap = await getDocs(dupQ);
      if (!dupSnap.empty) {
        setSubmitted(true); // silently succeed — do not reveal db contents
        return;
      }

      await addDoc(collection(db, "registrations"), {
        name:             cleanName,
        email:            cleanEmail,
        phone:            cleanPhone,
        niche:            cleanType,
        registrationType: tab,
        submittedAt:      serverTimestamp(),
        status:           'new',
      });
      setSubmitted(true);
    } catch (_err) {
      // Never expose raw error details to the browser console
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bizBenefits = [
    'Early access to brand-side Collancer features',
    'Priority onboarding during early access',
    'Hands-on campaign setup guidance',
    'Priority onboarding and early access to brand features',
  ];
  const creatorBenefits = [
    'Free creator profile listing',
    'Get discovered by brands across India',
    'Payment protection through secure booking flows',
    'Clear payout tracking',
  ];

  return (
    <section id="join" aria-label="Join Collancer — Early Access Registration" style={{ padding: isMobile ? '60px 16px 80px' : 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 24px)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge badge-cyan reveal" style={{ marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            Limited Early Access
          </div>
          <h2 className="section-title reveal">Be Among the <span className="text-gradient">Early Community</span></h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 'clamp(15px,2vw,18px)', marginTop: 16, lineHeight: 1.7, transitionDelay: '0.1s' }}>
            Join Collancer early and get priority access as we build the infrastructure for faster, safer brand–creator collaborations in India.
          </p>
        </div>

        <div className="glass-card reveal" style={{ padding: 'clamp(20px,5vw,44px)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div className="toggle-pill">
              <button className={tab === 'brand' ? 'active' : ''} onClick={() => setTab('brand')}>I'm a Brand</button>
              <button className={tab === 'creator' ? 'active' : ''} onClick={() => setTab('creator')}>I'm a Creator</button>
            </div>
          </div>

          {!submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Honeypot: hidden field — bots fill it, humans don't */}
              <input
                type="text"
                name="_hp_field"
                value={form._hp || ''}
                onChange={e => setForm(p => ({ ...p, _hp: e.target.value }))}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              {[
                { key: 'name',  placeholder: tab === 'brand' ? 'Brand Name *' : 'Your Full Name *', type: 'text',  maxLen: 100, autoComplete: 'name' },
                { key: 'email', placeholder: 'Email Address *',                                           type: 'email', maxLen: 100, autoComplete: 'email' },
                { key: 'phone', placeholder: 'WhatsApp Number (optional)',                                type: 'tel',   maxLen: 15,  autoComplete: 'tel' },
                { key: 'type',  placeholder: tab === 'brand' ? 'Your Industry (e.g. Fashion, Food, Tech)' : 'Your Content Niche (e.g. Fitness, Beauty)', type: 'text', maxLen: 80, autoComplete: 'off' },
              ].map(f => (
                <input key={f.key} type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  maxLength={f.maxLen}
                  autoComplete={f.autoComplete}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: isMobile ? '14px 16px' : '14px 18px', color: 'var(--text)', fontSize: isMobile ? 16 : 15, outline: 'none', fontFamily: "var(--ff-body)", width: '100%', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,229,255,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              ))}

              <div style={{ background: tab === 'brand' ? 'rgba(0,229,255,0.05)' : 'rgba(179,136,255,0.05)', border: `1px solid ${tab === 'brand' ? 'rgba(0,229,255,0.2)' : 'rgba(179,136,255,0.2)'}`, borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: tab === 'brand' ? 'var(--cyan)' : 'var(--purple)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {tab === 'brand' ? <Building2 size={14} className='lucide-anim' /> : <Sparkles size={14} className='lucide-anim' />}
                  {tab === 'brand' ? 'What you get as an early brand' : 'What you get as a founding creator'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(tab === 'brand' ? bizBenefits : creatorBenefits).map(b => (
                    <div key={b} style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <CheckCircle size={15} style={{ color: tab === 'brand' ? 'var(--green)' : 'var(--purple)', marginTop: 1, flexShrink: 0 }} /> {b}
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn-glow" style={{ fontSize: 16, padding: '16px', width: '100%', opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
                {loading ? <><Loader size={16} className='lucide-spin' /> Submitting...</> :
                  tab === 'brand' ? <>Join as a Brand <Building2 size={16} className='lucide-anim' /></> :
                    <>Register as a Creator <Sparkles size={16} className='lucide-anim' /></>}
              </button>

              {error && <p style={{ textAlign: 'center', fontSize: 13, color: '#ff6b6b', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <AlertTriangle size={14} /> {error}
              </p>}

              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                No spam. No commitment. We'll reach out personally within 24 hours.
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}><PartyPopper size={64} className="lucide-anim" /></div>
              <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 30, fontWeight: 800, marginBottom: 12 }}>You're on the list!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 28px' }}>
                Thank you, <strong style={{ color: 'var(--text)' }}>{stripHtml(form.name)}</strong>! We'll reach out to you personally within 24 hours with your early access details.
              </p>
              <span style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 50, padding: '10px 22px', fontSize: 14, color: 'var(--cyan)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Mail size={14} className='lucide-anim' /> Check your inbox soon
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


/* ═══ FOUNDER SECTION ═══ */
function FounderSection() {
  const { isMobile } = useDevice();
  const founderImg = "/founder.jpg";
  
  return (
    <section id="founder" aria-label="Meet Jainik Dand — Founder and CEO of Collancer" style={{
      padding: isMobile ? '56px 16px' : 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 24px)',
      position: 'relative', zIndex: 1
    }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>

        <div className="reveal" style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
          <div className="badge badge-purple">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--purple)', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            Meet the Founder
          </div>
        </div>

        <div className="reveal glass-card" style={{
          padding: isMobile ? '32px 24px' : '48px 56px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
          background: 'linear-gradient(160deg, rgba(179,136,255,0.05) 0%, rgba(10,10,26,0.98) 60%)',
          border: '1px solid rgba(179,136,255,0.15)',
          position: 'relative', overflow: 'hidden'
        }}>

          <div style={{
            position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
            width: 320, height: 320, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(179,136,255,0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{
            width: isMobile ? 110 : 130, height: isMobile ? 110 : 130,
            borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
            border: '3px solid rgba(179,136,255,0.4)',
            boxShadow: '0 0 0 6px rgba(179,136,255,0.08), 0 16px 48px rgba(0,0,0,0.5)',
            marginBottom: 24, position: 'relative', zIndex: 1
          }}>
            <img src={founderImg} alt="Jainik Dand"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }} />
          </div>

          <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
            <div style={{
              fontFamily: 'var(--ff-display)', fontSize: isMobile ? 22 : 26,
              fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6, color: 'var(--text)'
            }}>
              Jainik Dand
            </div>
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: 0.8,
              textTransform: 'uppercase', color: 'var(--purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
              <Rocket size={13} className="lucide-anim" style={{ color: 'var(--purple)' }} />
              Founder &amp; CEO, Collancer
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, margin: '0 auto', width: '100%' }}>
            <p style={{
              fontSize: isMobile ? 14 : 17, lineHeight: isMobile ? 1.65 : 1.75,
              color: 'var(--text-muted)', fontStyle: 'italic',
              textAlign: 'center', margin: '0 0 8px',
              position: 'relative',
              padding: isMobile ? '0 8px' : '0 4px',
              wordBreak: 'break-word',
            }}>
              Influencer marketing has been built around agencies, spreadsheets, DMs, and forms. We&apos;re rebuilding it around technology, transparency, and direct connections between brands and creators.
            </p>
          </div>

          <div className="divider-line" style={{ width: '60%', margin: '24px auto 20px' }} />

          <div style={{
            fontSize: isMobile ? 13 : 14, fontWeight: 700,
            letterSpacing: 0.5, color: 'var(--cyan)',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
           
            Building the future of India&apos;s creator economy &#127470;&#127475;
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20, position: 'relative', zIndex: 1 }}>
            <a href="https://www.instagram.com/jainikshah3118/" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 18px', borderRadius: 50,
                background: 'linear-gradient(135deg, rgba(255,110,180,0.12), rgba(179,136,255,0.08))',
                border: '1px solid rgba(255,110,180,0.25)',
                color: 'var(--pink)', fontSize: 13, fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.3s var(--ease-out-expo)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,110,180,0.22), rgba(179,136,255,0.12))'; e.currentTarget.style.borderColor = 'rgba(255,110,180,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,110,180,0.12), rgba(179,136,255,0.08))'; e.currentTarget.style.borderColor = 'rgba(255,110,180,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Instagram
            </a>
            <a href="https://www.linkedin.com/in/jainik-dand/" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 18px', borderRadius: 50,
                background: 'linear-gradient(135deg, rgba(96,165,250,0.12), rgba(0,229,255,0.08))',
                border: '1px solid rgba(96,165,250,0.25)',
                color: 'var(--blue)', fontSize: 13, fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.3s var(--ease-out-expo)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(96,165,250,0.22), rgba(0,229,255,0.12))'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(96,165,250,0.12), rgba(0,229,255,0.08))'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ═══ FOOTER ═══ */
function Footer() {
  const { isMobile } = useDevice();
  return (
    <footer style={{ padding: isMobile ? '40px 16px 32px' : '60px 24px 40px', borderTop: '1px solid var(--border)', background: '#05050e' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-start', flexWrap: 'wrap', gap: isMobile ? 28 : 32, marginBottom: isMobile ? 32 : 48 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src="data:image/webp;base64,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" alt="Collancer Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--ff-display)", fontSize: 20, fontWeight: 800, lineHeight: 1.1 }}>Coll<span className="glow-cyan">ancer</span></div>
                <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>where influence meets industry</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.75 }}>
              India's first structured influencer booking marketplace. Connecting brands with verified creators across 25 niches, powered by Collancer AI.
            </p>
          </div>

          <div style={{ display: 'flex', gap: isMobile ? 32 : 'clamp(32px, 5vw, 64px)', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Platform</div>
            {['For Brands', 'For Creators', 'How It Works', 'Categories', 'Collancer AI', 'Join Early'].map(l => {
                const ids = { 'For Brands': '#for-brands', 'For Creators': '#for-creators', 'How It Works': '#how-it-works', 'Categories': '#categories', 'Collancer AI': '#cleo', 'Join Early': '#join' };
                return (
                <div key={l} style={{ marginBottom: 10 }}>
                  <a href={ids[l] || '#'} style={{ color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{l}</a>
                </div>
              )})}
            </div>
            <div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Contact</div>
              {[
                { label: 'support@collancer.in', href: 'mailto:support@collancer.in' },
                { label: 'Instagram', href: 'https://www.instagram.com/collancer_in' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/company/collancer' },
                { label: 'Twitter / X', href: 'https://twitter.com/collancer_in' },
              ].map(l => (
                <div key={l.label} style={{ marginBottom: 10 }}>
                  <a href={l.href} style={{ color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                    rel="noopener noreferrer"
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                  >{l.label}</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider-line" style={{ marginBottom: 24 }} />

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'center' : 'center', textAlign: isMobile ? 'center' : 'left', gap: isMobile ? 10 : 12 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Copyright size={13} /> 2026 Collancer. All rights reserved. Made in India <MapPin size={13} />
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms-of-service' }
            ].map(l => (
              <a key={l.label} href={l.href} style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══ SEO: Visually hidden but fully crawlable content block ═══
   This renders real HTML text that search engines index.
   Styled to be off-screen for sighted users, but present in DOM for bots. */
function SEOContent() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border: 0,
        left: '-9999px'
      }}
    >
      {/* Full keyword-rich content for search engine crawlers */}
      <h1>Collancer — India's Number One Influencer Booking Marketplace | Book Verified Creators in Under 2 Minutes</h1>
      <p>
        Collancer is India's first structured influencer booking marketplace, powered by Collancer AI.
        Connect your brand with growing verified Indian creators across 25 content niches.
        Book Instagram influencers, YouTube creators, and social media content creators in under 2 minutes.
        Secure payments via Razorpay with 100% automatic refund guarantee. Made in India, for India.
      </p>

      <h2>What is Collancer?</h2>
      <p>
        Collancer is an AI-powered influencer marketing platform and booking marketplace for India.
        It solves the core problems of influencer marketing in India — fake followers, no payment protection,
        unstructured DM-based negotiations, and zero campaign tracking — with a fully digital, structured,
        escrow-backed booking system powered by Collancer AI.
      </p>

      <h2>India's Influencer Marketing Problem</h2>
      <p>
        India's influencer economy is worth ₹3,500 crore and growing. Yet the entire industry runs on
        WhatsApp DMs, personal UPI transfers, and gut feeling. There is no infrastructure, no standards,
        no payment protection for brands, and no guaranteed income for creators. Collancer is the fix.
      </p>
      <ul>
        <li>No way to verify if creators have real followers or fake bot accounts</li>
        <li>Brands pay via personal UPI with zero legal protection</li>
        <li>Creators vanish after receiving advance payments</li>
        <li>No campaign tracking, no delivery confirmation, no data</li>
        <li>Negotiations happen over 20+ WhatsApp messages with no written agreement</li>
      </ul>

      <h2>For Brands — Book Verified Influencers in India</h2>
      <p>
        Indian brands and brands can discover, book, and pay verified creators across 25 niches
        in under 2 minutes on Collancer. Features include:
      </p>
      <ul>
        <li>Smart Discovery: Filter growing verified creators by niche, city, budget, platform, followers and engagement rate</li>
        <li>Collancer AI Assistant: Ask in plain English — find perfect creators, compare head-to-head, get reach estimates</li>
        <li>Requirements Marketplace: Post your brief and let verified creators come to you with proposals</li>
        <li>Secure Payments: UPI, cards, net banking via Razorpay — money held safely until campaign delivery</li>
        <li>Real Analytics: Genuine follower counts, engagement rates, average views, past reviews and audience demographics</li>
        <li>Full Refund Guarantee: 100% automatic refund if creator rejects booking or misses delivery deadline</li>
      </ul>

      <h2>For Creators — Get Paid for Your Influence</h2>
      <p>
        Indian content creators can list their profiles for free, receive structured booking requests from
        brands across India, and get paid securely via escrow. No more chasing payments over DMs.
      </p>
      <ul>
        <li>Free Listing: Get discovered by brands completely free — no upfront cost, no monthly fees</li>
        <li>Guaranteed Payment: 100% of your fee collected upfront and held in escrow — released automatically on delivery</li>
        <li>6 Promotion Types: Stories, Reels, Videos, Shorts, Personal Videos, Personal Ads — set your own prices</li>
        <li>Requirements Marketplace: See live campaign briefs from brands looking for creators in your niche</li>
        <li>Build Reputation: Collect verified reviews from real brands to attract more bookings</li>
        <li>Earnings Dashboard: Track all bookings, earnings, payout history, and campaign status in one place</li>
      </ul>

      <h2>For Brands — Find and Book the Right Creators</h2>
      <p>
        Brands can discover verified Indian creators across 25 niches, compare creator fit and transparent pricing,
        publish structured campaign briefs, receive proposals, and manage secure bookings in one workflow.
        Razorpay-powered payment protection and Collancer's refund flow are designed to reduce risk for both sides.
      </p>
      <ul>
        <li>Creator Discovery: Search by niche, city, platform, audience size, budget and engagement.</li>
        <li>Collancer AI: Describe your campaign in plain English and get creator-matching help, comparisons and reach estimates.</li>
        <li>Structured Briefs: Define deliverables, budget and timeline before creators respond.</li>
        <li>Requirements Marketplace: Let relevant creators pitch your campaign instead of relying on cold outreach.</li>
        <li>Secure Payments: Pay through Razorpay with funds protected through the booking workflow.</li>
        <li>Refund Protection: Bookings are protected when a creator rejects the booking or misses the agreed deadline.</li>
      </ul>

      <h2>What is Collancer AI?</h2>
      <p>
        Collancer AI is Collancer's built-in AI assistant for influencer campaign strategy. Instead of spending hours
        browsing creator profiles and guessing at metrics, brands simply describe what they need in plain
        English. Collancer AI understands the brand, budget, and audience goals, then surfaces exact creators who fit.
        Collancer AI supports natural language creator search, head-to-head creator comparisons, reach and ROI estimates,
        and niche-perfect matching.
      </p>

      <h2>How Collancer Works for Brands</h2>
      <ol>
        <li>Discover Creators: Browse growing verified Indian creators by niche, city, budget and platform. Or ask Collancer AI for instant recommendations.</li>
        <li>Choose and Book: Select your promotion type, fill your campaign brief, and confirm your order in under 2 minutes.</li>
        <li>Pay Securely: Pay via UPI, card, or net banking through Razorpay. Your payment is held safely until delivery.</li>
        <li>Campaign Goes Live: Creator delivers your promotion. Track in real time. Leave a review. Done.</li>
      </ol>

      <h2>How Collancer Works for Creators</h2>
      <ol>
        <li>Create Your Profile: List your niche, platform, city, prices, and categories. Get verified by our team in 24 hours.</li>
        <li>Receive Bookings: Brands discover you and send booking requests directly. Review their brief instantly.</li>
        <li>Deliver Content: Accept the brief, create the content, and deliver within the agreed timeline.</li>
        <li>Get Paid: Payment is released to your account automatically after delivery. No chasing, no waiting.</li>
      </ol>

      <h2>25 Influencer Marketing Niches Covered</h2>
      <p>
        Collancer covers creators across 25 content niches including Fashion, Beauty and Makeup, Food and Beverages,
        Fitness and Health, Tech and Gadgets, Gaming, Travel, Finance and Investing, Wellness and Mental Health,
        Cars and Automotive, Home and Interior Design, Shopping and E-commerce, Jewelry and Accessories,
        Baby and Parenting, Sports, Music, Books and Education, Sustainability and Eco, Real Estate,
        Film and Entertainment, Pet Care, Photography, Comedy and Memes, Crypto and Web3, and B2B and Brand.
      </p>

      <h2>6 Types of Influencer Promotions Available</h2>
      <ul>
        <li>Instagram Story: 24-hour disappearing content, high reach, swipe-up links</li>
        <li>Instagram Reel: Short-form video with massive organic discovery potential</li>
        <li>YouTube Video: Long-form dedicated or integrated video promotion</li>
        <li>YouTube Shorts: 60-second branded Short with high discoverability</li>
        <li>Personal Video: Custom branded video content for your brand's own channels</li>
        <li>Personal Ad: Creator-made ad creative for use in your paid advertising campaigns</li>
      </ul>

      <h2>Secure Payments and Refund Policy</h2>
      <p>
        All payments on Collancer are processed via Razorpay and held in escrow. Brands pay via UPI, debit card,
        credit card, or net banking. Payments are released to creators only after confirmed delivery.
        If a creator rejects a booking or fails to deliver within the agreed deadline, the brand receives
        a 100% automatic refund with no disputes, no forms, and no waiting.
      </p>

      <h2>Frequently Asked Questions about Collancer</h2>

      <h3>What makes Collancer different from other influencer platforms in India?</h3>
      <p>
        Collancer is India's first fully structured influencer booking marketplace with AI-powered matching via Collancer AI,
        escrow payment protection via Razorpay, a 100% automatic refund guarantee, a requirements marketplace where
        creators bid on briefs, and verified metrics — not self-reported follower counts. Unlike traditional agencies
        or WhatsApp-based negotiations, Collancer is fully digital, instant, and secure.
      </p>

      <h3>Is Collancer free for creators?</h3>
      <p>
        Yes. Creators can list their profiles on Collancer completely free. There are no upfront costs or monthly fees.
        Collancer takes a small platform commission only when a successful booking is completed.
      </p>

      <h3>How many influencers are on Collancer?</h3>
      <p>
        Collancer has growing verified Indian creators across 25 niches. All creators are manually verified by
        the Collancer team within 24 hours of profile creation, checking real engagement data and content quality.
      </p>

      <h3>Which cities does Collancer cover?</h3>
      <p>
        Collancer covers creators from all major Indian cities including Mumbai, Delhi, Bengaluru, Hyderabad,
        Chennai, Pune, Kolkata, Ahmedabad, Jaipur, Surat, and tier-2 cities across India.
      </p>

      <h3>What is the minimum budget to run an influencer campaign on Collancer?</h3>
      <p>
        There is no minimum campaign budget on Collancer. Creator prices vary based on their follower count,
        engagement rate, niche, and promotion type. Micro-influencer campaigns can start from as low as ₹500,
        while macro-influencer campaigns may range from ₹10,000 to ₹5 lakh or more.
      </p>

      <h3>Who founded Collancer?</h3>
      <p>
        Collancer was founded by Jainik Dand, Founder and CEO. The company was founded in 2026 with the mission
        to build the infrastructure India's creator economy has always deserved — replacing chaotic WhatsApp DMs
        with a structured, secure, AI-powered marketplace.
      </p>

      <address>
        <strong>Collancer</strong><br />
        India's First Structured Influencer Booking Marketplace<br />
        Email: <a href="mailto:support@collancer.in">support@collancer.in</a><br />
        Website: <a href="https://collancer.in">https://collancer.in</a>
      </address>
    </div>
  );
}

/* ═══ FAQ SECTION — Visible on page, crawlable, Schema-targeted ═══ */
function FAQSection() {
  const { isMobile } = useDevice();
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "What is Collancer?",
      a: "Collancer is India's first structured influencer booking marketplace powered by Collancer AI. It lets brands discover, book, and pay verified Indian creators across 25 niches in under 2 minutes — with secure Razorpay payments and a 100% refund guarantee."
    },
    {
      q: "How is Collancer different from other influencer platforms in India?",
      a: "Collancer is the only platform in India combining AI-powered matching (Collancer AI), escrow payment protection, a 100% automatic refund guarantee, a requirements marketplace where creators bid on your brief, and verified real metrics — not self-reported follower counts. No WhatsApp DMs. No guessing. No risk."
    },
    {
      q: "How do I book an influencer on Collancer?",
      a: "In 3 steps: (1) Use Collancer AI or filters to find a verified creator matching your niche, city, and budget. (2) Select your promotion type (Story, Reel, Video, etc.) and fill your campaign brief. (3) Pay securely via Razorpay — your money is held in escrow until the creator delivers."
    },
    {
      q: "Is my payment safe on Collancer?",
      a: "Yes. All payments are processed through Razorpay and held in escrow. Funds are only released to the creator after confirmed delivery. If a creator rejects your booking or misses the deadline, you receive a 100% automatic refund — no disputes, no forms, no waiting."
    },
    {
      q: "Is Collancer free for creators?",
      a: "Yes. Creators list their profiles completely free — no upfront cost, no monthly subscription. Collancer takes a small platform commission only on successful completed bookings."
    },
    {
      q: "What is Collancer AI?",
      a: "Collancer AI is Collancer's built-in AI campaign strategist. Describe what you need in plain English — Collancer AI finds perfect creators, compares options head-to-head, estimates your reach for a given budget, and identifies the best-fit influencer for your niche and city in seconds."
    },
    {
      q: "How many influencers are on Collancer?",
      a: "growing verified Indian creators across 25 content niches. Every creator is manually verified by the Collancer team within 24 hours — we check real engagement, audience geography, and content quality before approval."
    },
    {
      q: "Which promotion types can I book?",
      a: "Six types: Instagram Story, Instagram Reel, YouTube Video, YouTube Shorts, Personal Video, and Personal Ad. Each creator sets their own price per type, giving you transparent, fixed pricing before you book."
    },
    {
      q: "Which cities does Collancer cover in India?",
      a: "Collancer covers creators from all major Indian cities — Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur, Surat, Lucknow, Indore, Bhopal, and 200+ tier-2 and tier-3 cities. You can filter creators by city directly on the platform."
    },
    {
      q: "What is the minimum budget to run a campaign on Collancer?",
      a: "There's no minimum budget. Creators set their own prices, so you can find nano-influencers starting from as low as ₹500 per Story or Reel. The platform fee is a small percentage on top of the creator's rate — no hidden charges."
    },
  ];

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions about Collancer"
      style={{
        padding: isMobile ? '56px 16px' : 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 24px)',
        position: 'relative', zIndex: 1
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="badge badge-cyan reveal" style={{ marginBottom: 20 }}>FAQs</div>
          <h2 className="section-title reveal">
            Everything You Need<br />
            <span className="text-gradient">To Know</span>
          </h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 'clamp(14px,1.8vw,17px)', maxWidth: 500, margin: '20px auto 0', lineHeight: 1.7, transitionDelay: '0.1s' }}>
            Quick answers to the most common questions about Collancer, Collancer AI, payments, and creator bookings.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="glass-card reveal"
              style={{
                transitionDelay: `${i * 0.05}s`,
                overflow: 'hidden',
                borderColor: openIdx === i ? 'rgba(0,229,255,0.25)' : 'var(--border)',
              }}
            >
              {/* Question */}
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: isMobile ? '18px 20px' : '20px 28px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  textAlign: 'left',
                }}
                aria-expanded={openIdx === i}
                aria-controls={`faq-answer-${i}`}
              >
                <h3 style={{
                  fontFamily: 'var(--ff-display)', fontSize: isMobile ? 15 : 17,
                  fontWeight: 700, color: openIdx === i ? 'var(--cyan)' : 'var(--text)',
                  lineHeight: 1.4, flex: 1, transition: 'color 0.2s',
                }}>
                  {faq.q}
                </h3>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: openIdx === i ? 'rgba(0,229,255,0.12)' : 'rgba(255,255,255,0.04)',
                  border: openIdx === i ? '1px solid rgba(0,229,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                  transform: openIdx === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  color: openIdx === i ? 'var(--cyan)' : 'var(--text-muted)',
                }}>
                  <ChevronDown size={16} />
                </div>
              </button>

              {/* Answer */}
              <div
                id={`faq-answer-${i}`}
                role="region"
                style={{
                  maxHeight: openIdx === i ? 500 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <p style={{
                  padding: isMobile ? '0 20px 20px' : '0 28px 24px',
                  color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8,
                }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA below FAQs */}
        <div className="reveal" style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 20 }}>
            Still have questions? We're happy to help.
          </p>
          <a
            href="mailto:support@collancer.in"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 12,
              background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.25)',
              color: 'var(--cyan)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)'; }}
          >
            <Mail size={14} /> support@collancer.in
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══ MAIN APP ═══ */
// ─── ANALYTICS HELPERS ───────────────────────────────────────────────────────
function pushGtag(eventName, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

function pushDataLayer(obj) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(obj);
  }
}

// Hook: fires GA4 + GTM events for scroll depth (25/50/75/100%) and section views
function useAnalytics() {
  useEffect(() => {
    // ── Scroll depth tracking ──────────────────────────────────────────────
    const depths = [25, 50, 75, 100];
    const fired = new Set();

    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = Math.round((scrolled / total) * 100);
      depths.forEach(d => {
        if (pct >= d && !fired.has(d)) {
          fired.add(d);
          pushGtag('scroll', { percent_scrolled: d });
          pushDataLayer({ event: 'scroll_depth', percent_scrolled: d });
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Section visibility tracking (for engagement metrics) ───────────────
    const SECTIONS = [
      'hero', 'problem', 'for-brands', 'cleo',
      'marketplace', 'for-creators', 'how-it-works',
      'categories', 'testimonials', 'join', 'founder'
    ];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            pushGtag('section_view', {
              section_id: sectionId,
              page_title: document.title,
            });
            pushDataLayer({
              event: 'section_view',
              section_id: sectionId,
            });
            sectionObserver.unobserve(entry.target); // fire once per section
          }
        });
      },
      { threshold: 0.3 }
    );
    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    // ── Virtual page_view for SPA (fires on mount as initial view) ─────────
    pushGtag('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
    pushDataLayer({
      event: 'page_view',
      page_title: document.title,
      page_path: window.location.pathname,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      sectionObserver.disconnect();
    };
  }, []);
}

export default function AppSSR() {
  useRevealAnimation();
  useAnalytics();

  // ── Hash scroll on load ──────────────────────────────────────────────────
  // When someone visits /#faq, /#for-brands, etc., React mounts and then
  // scrolls to the matching section. RAF retries ensure DOM is painted first.
  useEffect(() => {
    const hash = window.location.hash; // e.g. "#faq"
    if (!hash) return;
    const id = hash.slice(1); // strip leading "#"
    const attemptScroll = (attemptsLeft) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (attemptsLeft > 0) {
        requestAnimationFrame(() => attemptScroll(attemptsLeft - 1));
      }
    };
    // 120ms delay lets the initial render settle; 10 retries cover slow devices
    setTimeout(() => attemptScroll(10), 120);
  }, []);

  useEffect(() => {
    // Ensure proper mobile viewport
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover';
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <style>{`
/* ═══ V33 AMBIENT BACKGROUND — lightweight CSS animation for all non-hero sections ═══ */
.site-ambient-bg{
  position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden;
  background:
    radial-gradient(900px 520px at 14% 12%, rgba(0,190,255,.13), transparent 68%),
    radial-gradient(780px 500px at 86% 78%, rgba(104,72,255,.12), transparent 70%),
    radial-gradient(620px 420px at 52% 42%, rgba(0,229,255,.045), transparent 72%),
    #030811;
}
.site-ambient-bg::before{
  content:""; position:absolute; inset:-28%;
  background:
    radial-gradient(ellipse 520px 180px at 22% 62%, rgba(0,229,255,.12), transparent 70%),
    radial-gradient(ellipse 560px 200px at 78% 36%, rgba(126,92,255,.11), transparent 70%),
    radial-gradient(circle at 48% 18%, rgba(72,232,255,.07), transparent 28%);
  filter:blur(24px); transform:translate3d(-2%,0,0) rotate(-2deg);
  animation:ambientDrift 22s ease-in-out infinite alternate;
}
.site-ambient-bg::after{
  content:""; position:absolute; inset:0;
  background-image:
    linear-gradient(rgba(72,232,255,.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(72,232,255,.022) 1px, transparent 1px),
    radial-gradient(circle at 18% 24%, rgba(72,232,255,.16) 0 1px, transparent 1.6px),
    radial-gradient(circle at 78% 68%, rgba(155,140,255,.13) 0 1px, transparent 1.6px);
  background-size:72px 72px,72px 72px,150px 150px,190px 190px;
  mask-image:linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
  -webkit-mask-image:linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
  opacity:.72; animation:ambientGrid 28s linear infinite;
}
@keyframes ambientDrift{
  0%{transform:translate3d(-3%,-1%,0) rotate(-2deg) scale(1)}
  50%{transform:translate3d(2%,2%,0) rotate(1deg) scale(1.035)}
  100%{transform:translate3d(-1%,4%,0) rotate(-1deg) scale(1.02)}
}
@keyframes ambientGrid{from{background-position:0 0,0 0,0 0,0 0}to{background-position:72px 36px,-36px 72px,150px 75px,-190px 95px}}
/* Non-hero sections now reveal the shared ambient background instead of painted section backgrounds. */
section:not(#hero){background:transparent!important}
section:not(#hero)::before{display:none!important}
body{background:#030811!important}
body::after{display:none!important}
@media(max-width:768px){
  .site-ambient-bg::before{filter:blur(18px);animation-duration:28s}
  .site-ambient-bg::after{background-size:88px 88px,88px 88px,180px 180px,220px 220px;opacity:.58}
}
@media(prefers-reduced-motion:reduce){
  .site-ambient-bg::before,.site-ambient-bg::after{animation:none!important}
}
`}</style>
      <div className="site-ambient-bg" aria-hidden="true" />
      <SEOContent />
      <a
        href="#main-content"
        style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
        onFocus={e => { e.target.style.left = '10px'; e.target.style.top = '10px'; e.target.style.width = 'auto'; e.target.style.height = 'auto'; }}
      >
        Skip to main content
      </a>
      <Nav />
      <main id="main-content" role="main" itemScope itemType="https://schema.org/WebPage">
        <article itemScope itemType="https://schema.org/SoftwareApplication">
          <meta itemProp="name" content="Collancer" />
          <meta itemProp="applicationCategory" content="MarketingApplication" />
          <meta itemProp="operatingSystem" content="Web" />
          <meta itemProp="description" content="India's first structured influencer booking marketplace powered by Collancer AI" />
          <Hero />
          <LogoMarquee />
          <ProblemSection />
          <ForBrands />
          <CleoSection />
          <RequirementsMarketplace />
          <ForCreators />
          <HowItWorks />
          <Categories />
          <SocialProof />
          <FAQSection />
          <JoinSection />
          <FounderSection />
        </article>
      </main>
      <Footer />
    </>
  );
}