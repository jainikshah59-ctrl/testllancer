import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import BlogPage from './pages/BlogPage';
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
  AlertCircle, ThumbsDown, ArrowRight, PhoneOff, MessagesSquare, Banknote as BanknoteIcon, Gift
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, limit } from "firebase/firestore";
import emailjs from '@emailjs/browser';

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

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Sora:wght@400;500;600;700;800&display=swap');
`;

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
    --ff-display: 'Sora', sans-serif;
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

  #motion-bg { position:fixed; inset:0; z-index:0; pointer-events:none; width:100%; height:100%; }

  section { position: relative; z-index: 1; }

  .glass-card {
    background: linear-gradient(160deg, rgba(17,17,40,0.97) 0%, rgba(10,10,26,0.99) 100%);
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
    background:linear-gradient(135deg, #00e5ff 0%, #00b4d8 50%, #7c3aed 100%);
    color:#000;
    box-shadow:0 0 0 1px rgba(0,229,255,0.4) inset, 0 4px 0 #005577, 0 8px 40px rgba(0,229,255,0.3), 0 0 80px rgba(0,229,255,0.08);
    transition:all 0.3s var(--ease-out-expo);
    position:relative; overflow:hidden;
  }
  .btn-glow::after {
    content:''; position:absolute; top:0; left:-100%; width:50%; height:100%;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    transform:skewX(-25deg);
    animation:btnShine 4s ease-in-out infinite;
  }
  .btn-glow:hover { transform:translateY(-3px); box-shadow:0 0 0 1px rgba(0,229,255,0.6) inset, 0 6px 0 #005577, 0 20px 60px rgba(0,229,255,0.4), 0 0 100px rgba(0,229,255,0.12); }
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

  .page-fade-enter { animation: pageFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  .page-fade-exit  { animation: pageFadeOut 0.45s cubic-bezier(0.4,0,0.2,1) forwards; }

  @keyframes pageFadeIn {
    0%   { opacity:0; transform: translateY(28px) scale(0.985); filter: blur(6px); }
    60%  { opacity:1; filter: blur(0px); }
    100% { opacity:1; transform: translateY(0) scale(1); filter: blur(0px); }
  }
  @keyframes pageFadeOut {
    0%   { opacity:1; transform: translateY(0) scale(1); filter: blur(0px); }
    100% { opacity:0; transform: translateY(-20px) scale(0.98); filter: blur(8px); }
  }

  .blog-section-fade { animation: blogFadeIn 0.65s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes blogFadeIn {
    0%   { opacity:0; transform: translateY(32px) scale(0.97); filter: blur(5px); }
    55%  { opacity:1; filter: blur(0px); }
    100% { opacity:1; transform: translateY(0) scale(1); filter: blur(0px); }
  }

  .blog-card-enter { animation: blogCardIn 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes blogCardIn {
    0%   { opacity:0; transform: translateY(40px) scale(0.96); filter: blur(4px); }
    60%  { opacity:1; filter: blur(0px); }
    100% { opacity:1; transform: translateY(0) scale(1); filter: blur(0px); }
  }

  .blog-open-enter { animation: blogOpenIn 0.75s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes blogOpenIn {
    0%   { opacity:0; transform: translateY(36px) scale(0.97); filter: blur(7px); }
    50%  { opacity:1; filter: blur(0px); }
    100% { opacity:1; transform: translateY(0) scale(1); filter: blur(0px); }
  }

  .blog-close-exit { animation: blogCloseOut 0.4s cubic-bezier(0.4,0,0.2,1) forwards; }
  @keyframes blogCloseOut {
    0%   { opacity:1; transform: translateY(0) scale(1); filter: blur(0px); }
    100% { opacity:0; transform: translateY(24px) scale(0.97); filter: blur(6px); }
  }

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
  #how-it-works .toggle-pill {
    display: inline-flex;
    justify-content: center;
  }
  #how-it-works .glass-card {
    width: 100%;
  }
  @media (max-width: 768px) {
    #how-it-works > div { width: 100%; }
    #how-it-works .toggle-pill { width: min(100%, 360px); }
    #how-it-works .toggle-pill button { min-width: 0; }
  }

  .toggle-pill button.active {
    background:linear-gradient(135deg, var(--cyan), #0099cc);
    color:#000;
    box-shadow:0 2px 0 #005577, 0 4px 16px rgba(0,229,255,0.25);
  }

  .creator-card {
    background:linear-gradient(160deg, rgba(20,20,42,0.95), rgba(12,12,26,0.98));
    border:1px solid var(--border); border-radius:20px; padding:24px;
    transition:all 0.5s var(--ease-out-expo); position:relative; overflow:hidden;
  }
  .creator-card:hover { transform:translateY(-8px) scale(1.02); border-color:rgba(179,136,255,0.3); box-shadow:0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(179,136,255,0.15), 0 0 60px rgba(179,136,255,0.08); }

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
    background:rgba(5,5,14,0.92);
    backdrop-filter:blur(32px) saturate(1.4);
    border-bottom:1px solid rgba(0,229,255,0.08);
    box-shadow: 0 1px 0 rgba(0,229,255,0.06), 0 4px 32px rgba(0,0,0,0.4);
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
/* COLLANCER 3D SPATIAL REDESIGN — visual-only layer */
:root{--bg:#03050b;--bg-elevated:#07101a;--bg-card:rgba(9,17,28,.72);--bg-card-hover:rgba(12,25,40,.82);--cyan:#48e8ff;--cyan-dim:#14b8d4;--purple:#9b8cff;--purple-dim:#6d5dfc;--pink:#ff7cc8;--text:#f5f8ff;--text-muted:#94a6bb;--text-dim:#63758a;--border:rgba(180,220,255,.10);--border-hover:rgba(112,231,255,.34);--ease-out-expo:cubic-bezier(.16,1,.3,1)}
body{background:radial-gradient(circle at 50% -10%,rgba(32,132,255,.13),transparent 34%),radial-gradient(circle at 85% 28%,rgba(123,92,255,.09),transparent 27%),#03050b}
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:9997;opacity:.34;background:radial-gradient(500px circle at var(--mx,50%) var(--my,50%),rgba(56,224,255,.08),transparent 65%);mix-blend-mode:screen}
.nav-bar{padding:10px clamp(14px,3vw,34px)!important;height:auto!important}.nav-bar>div{min-height:58px;padding:7px 10px 7px 14px;border:1px solid rgba(255,255,255,.085);border-radius:22px;background:linear-gradient(180deg,rgba(9,18,29,.76),rgba(5,11,19,.58));backdrop-filter:blur(24px) saturate(145%);-webkit-backdrop-filter:blur(24px) saturate(145%);box-shadow:0 18px 60px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.08);position:relative;overflow:hidden}.nav-bar>div::before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(100deg,transparent,rgba(72,232,255,.07) 48%,transparent 78%);transform:translateX(-100%);animation:navSheen 9s ease-in-out infinite}@keyframes navSheen{0%,60%{transform:translateX(-100%)}78%,100%{transform:translateX(100%)}}
section{isolation:isolate;scroll-margin-top:96px}section::before{content:'';position:absolute;width:min(760px,75vw);height:260px;left:50%;top:8%;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(35,190,255,.065),transparent 70%);filter:blur(28px);pointer-events:none;z-index:-1}
.glass-card{background:linear-gradient(135deg,rgba(255,255,255,.055),transparent 34%),linear-gradient(180deg,rgba(12,24,38,.78),rgba(5,12,21,.78));border:1px solid rgba(170,220,255,.105);border-radius:28px;backdrop-filter:blur(26px) saturate(140%);-webkit-backdrop-filter:blur(26px) saturate(140%);box-shadow:0 1px 0 rgba(255,255,255,.08) inset,0 -1px 0 rgba(0,0,0,.35) inset,0 18px 55px rgba(0,0,0,.28);transform:translateZ(0);will-change:transform}.glass-card::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(420px circle at var(--spot-x,50%) var(--spot-y,0%),rgba(72,232,255,.11),transparent 58%);opacity:0;transition:opacity .45s ease}.glass-card::after{height:1px;background:linear-gradient(90deg,transparent 4%,rgba(255,255,255,.18),rgba(72,232,255,.22),transparent 96%)}.glass-card:hover{transform:translateY(-8px) rotateX(1deg);border-color:rgba(105,225,255,.28);box-shadow:0 30px 90px rgba(0,0,0,.42),0 0 0 1px rgba(72,232,255,.04),0 0 70px rgba(0,202,255,.075),0 1px 0 rgba(255,255,255,.12) inset}.glass-card:hover::before{opacity:1}
.feat-icon,.number-ring{position:relative;box-shadow:0 10px 28px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.12);transform:translateZ(16px)}.feat-icon::after,.number-ring::after{content:'';position:absolute;inset:6px;border-radius:inherit;border:1px solid rgba(255,255,255,.05);pointer-events:none}
h1,h2,h3,.section-title{font-family:'Sora',sans-serif!important;letter-spacing:-.045em!important}.section-title{line-height:1.04!important}.text-gradient{background:linear-gradient(110deg,#f7fbff,#6deaff 31%,#8f7cff 70%,#f0a4ff);background-size:220% auto;animation:gradientFlow 8s ease-in-out infinite}@keyframes gradientFlow{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}
.btn-glow,.btn-outline{border-radius:16px!important;position:relative;overflow:hidden;transform:translateZ(0);box-shadow:0 12px 34px rgba(0,0,0,.24),0 1px 0 rgba(255,255,255,.18) inset!important}.btn-glow{background:linear-gradient(135deg,#6bf1ff,#21c9ee 48%,#7d6bff 120%)!important;box-shadow:0 14px 40px rgba(29,207,240,.24),0 1px 0 rgba(255,255,255,.35) inset!important}.btn-glow::before,.btn-outline::before{content:'';position:absolute;inset:1px;border-radius:inherit;pointer-events:none;background:linear-gradient(120deg,rgba(255,255,255,.20),transparent 38%,rgba(255,255,255,.05))}.btn-glow:hover,.btn-outline:hover{transform:translateY(-4px) scale(1.015)!important}
.badge{backdrop-filter:blur(16px);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 8px 25px rgba(0,0,0,.18)}.brand-logo-tile{display:flex;align-items:center;justify-content:center;width:104px;min-width:104px;height:64px;padding:0 4px;flex-shrink:0;transition:transform .45s var(--ease-out-expo),filter .45s ease;position:relative}.brand-logo-tile:hover{transform:translateY(-4px) scale(1.06);filter:drop-shadow(0 0 18px rgba(72,232,255,.18))}.brand-logo-plate{display:contents}.brand-logo-tile img{max-width:88px;max-height:32px;width:auto;height:auto;display:block;filter:none!important;opacity:1!important;object-fit:contain;transition:transform .4s ease,filter .4s ease}.brand-logo-tile:hover img{transform:scale(1.06)}.brand-logo-fallback{font-family:var(--ff-display);font-size:18px;font-weight:900;letter-spacing:-.04em;white-space:nowrap}
.marquee-container{mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.logo-marquee-section{margin-top:16px!important}
@media(max-width:768px){.logo-marquee-section{margin-top:12px!important}}
.reveal{transform:translate3d(0,34px,0) scale(.985);filter:blur(7px);opacity:0;transition:opacity 1s var(--ease-out-expo),transform 1.1s var(--ease-out-expo),filter 1.1s var(--ease-out-expo)}.reveal.visible,.reveal.is-visible{transform:translate3d(0,0,0) scale(1);filter:blur(0);opacity:1}.glass-card>*{position:relative;z-index:1}

.hero-background-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:0;pointer-events:none;filter:saturate(.92) contrast(1.04) brightness(.72)}
.hero-video-overlay{position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(circle at 50% 45%,rgba(3,9,20,.16),rgba(3,5,12,.56) 72%),linear-gradient(180deg,rgba(2,5,12,.58) 0%,rgba(2,5,12,.18) 38%,rgba(2,5,12,.74) 100%)}
@media(max-width:768px){.hero-background-video{object-position:center center;filter:saturate(.9) contrast(1.03) brightness(.64)}.hero-video-overlay{background:linear-gradient(180deg,rgba(2,5,12,.66) 0%,rgba(2,5,12,.24) 38%,rgba(2,5,12,.78) 100%)}}
#hero{min-height:min(900px,100svh);display:flex;align-items:center}
@keyframes glowPulse{0%,100%{opacity:.45;transform:scale(1)}50%{opacity:.8;transform:scale(1.06)}}.glow-cyan{animation:glowPulse 5s ease-in-out infinite}.glow-purple{animation:glowPulse 6s ease-in-out infinite reverse}.glow-red{animation:glowPulse 7s ease-in-out infinite}
button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible{outline:2px solid #63eaff;outline-offset:4px;box-shadow:0 0 0 5px rgba(72,232,255,.12)}
@media (prefers-reduced-motion:reduce){body::after,.nav-bar>div::before,.text-gradient,.glow-cyan,.glow-purple,.glow-red{animation:none!important}html{scroll-behavior:auto!important}.reveal{filter:none;transform:none;transition:none}}@media (max-width:768px){.nav-bar>div{border-radius:18px;min-height:52px}section{scroll-margin-top:78px}.glass-card{border-radius:22px;backdrop-filter:blur(20px) saturate(125%)}body::after{display:none}}

/* FINAL VISUAL FIXES — glyph-clipped gradients + premium spatial polish */
.text-gradient,.text-gradient-cyan,.text-gradient-purple,.text-gradient-warm{
  display:inline!important;
  background-color:transparent!important;
  -webkit-background-clip:text!important;
  background-clip:text!important;
  -webkit-text-fill-color:transparent!important;
  color:transparent!important;
  box-decoration-break:clone;
  -webkit-box-decoration-break:clone;
}
.text-gradient{background-image:linear-gradient(100deg,#f8fbff 0%,#61eaff 34%,#9a8cff 70%,#f0b0ff 100%)!important;background-size:200% 100%!important;animation:finalGradientFlow 7s ease-in-out infinite}
.text-gradient-cyan{background-image:linear-gradient(100deg,#f6fdff,#51e9ff 58%,#62a8ff)!important}
.text-gradient-purple{background-image:linear-gradient(100deg,#a99cff,#f08bff)!important}
.text-gradient-warm{background-image:linear-gradient(100deg,#ffd28a,#ff8e4f)!important}
@keyframes finalGradientFlow{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}
/* prevent accidental gradient backgrounds from painting empty rectangular text boxes */
span.text-gradient,span.text-gradient-cyan,span.text-gradient-purple,span.text-gradient-warm{width:auto!important;height:auto!important;min-width:0!important;min-height:0!important}


/* CINEMATIC HERO STAGE */
#hero{isolation:isolate!important;overflow:hidden!important}50%{transform:translateY(-12px)}}
#hero h1{font-size:clamp(44px,6.1vw,88px)!important;line-height:.98!important;letter-spacing:-.065em!important;text-shadow:0 12px 45px rgba(0,0,0,.35)}
#hero p{max-width:700px!important;font-size:clamp(16px,1.55vw,21px)!important;color:#aab9c9!important}
.glass-card{background:linear-gradient(145deg,rgba(255,255,255,.065),rgba(255,255,255,.018) 30%,rgba(4,12,21,.72) 100%)!important;border-color:rgba(170,220,255,.12)!important;border-radius:30px!important;backdrop-filter:blur(30px) saturate(150%)!important;box-shadow:0 1px 0 rgba(255,255,255,.09) inset,0 -1px 0 rgba(0,0,0,.5) inset,0 22px 70px rgba(0,0,0,.28)!important}
.glass-card:hover{transform:translateY(-9px) perspective(1000px) rotateX(1deg)!important;border-color:rgba(96,224,255,.30)!important;box-shadow:0 34px 100px rgba(0,0,0,.46),0 0 65px rgba(0,203,255,.08),inset 0 1px 0 rgba(255,255,255,.13)!important}
.btn-glow{background:linear-gradient(135deg,#8af5ff,#31d4f1 48%,#8b7dff 120%)!important;color:#021018!important;border-radius:17px!important;min-height:54px}
.btn-outline{background:rgba(255,255,255,.025)!important;border-color:rgba(170,220,255,.18)!important;border-radius:17px!important;min-height:54px;backdrop-filter:blur(18px)}
@media(max-width:768px){#hero h1{font-size:clamp(38px,10vw,58px)!important}}
@media(max-width:768px){#hero{min-height:auto!important;align-items:flex-start!important;padding-top:78px!important;padding-bottom:14px!important}#hero .reveal{transition-delay:0s}#hero p{margin-bottom:10px!important;line-height:1.55!important}.marquee-container{height:58px}.brand-logo-tile{width:92px;min-width:92px;height:52px}.brand-logo-tile img{max-width:78px;max-height:28px}}

@media(max-width:768px){
  #hero .badge{box-sizing:border-box;width:fit-content;max-width:calc(100vw - 32px);margin-inline:auto;overflow-wrap:anywhere}
  #hero > div[style*='max-width: 920px']{max-width:100%!important}
}
@media(prefers-reduced-motion:reduce){.text-gradient,}




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

const HOW_IT_WORKS_CREATOR = [
  { num: "01", icon: "✨", title: "Create Your Profile", desc: "List your niche, platform, city, prices, and categories. Get verified by our team in 24 hours.", color: "var(--cyan)" },
  { num: "02", icon: "📩", title: "Receive Bookings", desc: "Brands discover you and send booking requests directly. Review their brief instantly.", color: "var(--purple)" },
  { num: "03", icon: "🎨", title: "Deliver Content", desc: "Accept the brief, create the content, and deliver within the agreed timeline.", color: "var(--pink)" },
  { num: "04", icon: "💰", title: "Get Paid", desc: "Payment is released to your account automatically after delivery. No chasing, no waiting.", color: "var(--amber)" },
];

const HOW_IT_WORKS_BIZ = [
  { num: "01", icon: "🔍", title: "Discover Creators", desc: "Browse verified Indian creators by niche, city, budget & platform. Or ask Collancer AI for instant recommendations.", color: "var(--cyan)" },
  { num: "02", icon: "📋", title: "Choose & Book", desc: "Select your promotion type, fill your campaign brief, and confirm your order in under 2 minutes.", color: "var(--purple)" },
  { num: "03", icon: "💳", title: "Pay Securely", desc: "Pay via UPI, card, or net banking through Razorpay. Your payment is held safely until delivery.", color: "var(--pink)" },
  { num: "04", icon: "🚀", title: "Campaign Goes Live", desc: "Creator delivers your promotion. Track in real time. Leave a review. Done.", color: "var(--amber)" },
];

const FEATURES_CREATOR = [
  { icon: "🌟", title: "Free Profile Listing", desc: "Create your Collancer profile without upfront listing fees or a monthly subscription.", color: "rgba(0,229,255,0.08)", border: "rgba(0,229,255,0.2)", accent: "var(--cyan)" },
  { icon: "💸", title: "Payment Protection", desc: "Creator fees are collected upfront and held securely. Complete the agreed work and your payout is released through the platform flow.", color: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)", accent: "var(--green)" },
  { icon: "🎯", title: "Set Your Own Rates", desc: "Offer Stories, Reels, YouTube Videos, Shorts, Personal Videos and Personal Ads — with your own pricing for each format.", color: "rgba(255,110,180,0.08)", border: "rgba(255,110,180,0.2)", accent: "var(--pink)" },
  { icon: "📋", title: "Get Structured Brand Briefs", desc: "See campaign requirements, budgets, deliverables and timelines clearly instead of piecing together details from DMs.", color: "rgba(179,136,255,0.08)", border: "rgba(179,136,255,0.2)", accent: "var(--purple)" },
  { icon: "🏆", title: "Build Verified Reputation", desc: "Completed collaborations and verified reviews strengthen your profile and make it easier for brands to trust your work.", color: "rgba(255,179,71,0.08)", border: "rgba(255,179,71,0.2)", accent: "var(--amber)" },
  { icon: "📈", title: "Track Your Earnings", desc: "Keep your bookings, campaign status, payout history and creator activity organized in one place.", color: "rgba(0,229,255,0.08)", border: "rgba(0,229,255,0.2)", accent: "var(--cyan)" },
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
  const { pathname } = useLocation();
  useEffect(() => {
    // Keep revealed content visible once it has entered the viewport.
    // The observer also picks up newly rendered content (for example when
    // switching the Brands / Creators tabs in How It Works).
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 45);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    const observeAll = () => {
      document.querySelectorAll('.reveal, .reveal-scale').forEach(el => {
        if (!el.classList.contains('visible')) observer.observe(el);
      });
    };

    const t = setTimeout(observeAll, 50);
    const mutation = new MutationObserver(() => observeAll());
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(t);
      mutation.disconnect();
      observer.disconnect();
    };
  }, [pathname]);
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
  const fadeTo = useFadeNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'For Brands', id: 'for-brands' },
    { label: 'For Creators', id: 'for-creators' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'FAQ', id: 'faq' },
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
              <img src="/logo.png" alt="Collancer Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
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
            <button onClick={() => fadeTo('/blog')} style={{
              color: 'var(--text-muted)', fontSize: 14, fontWeight: 500,
              textDecoration: 'none', transition: 'color 0.3s',
              fontFamily: 'var(--ff-body)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
              onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >Blog</button>
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
            <div style={{ width: 40, height: 40, borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src="/logo.png" alt="Collancer Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
            </div>
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
          <button onClick={() => { setMenuOpen(false); fadeTo('/blog'); }} style={{
            display: 'block', width: '100%', textAlign: 'center', padding: '18px 0',
            fontSize: 20, fontWeight: 600, color: 'var(--text)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            background: 'none', border: 'none', borderTop: '1px solid rgba(255,255,255,0.04)',
            cursor: 'pointer', fontFamily: 'var(--ff-body)'
          }}>Blog</button>
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
    const onMove = (e) => { setMousePos({ x: e.clientX, y: e.clientY }); document.documentElement.style.setProperty('--mx', `${e.clientX}px`); document.documentElement.style.setProperty('--my', `${e.clientY}px`); };
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
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector('.brand-logo-fallback');
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <span className="brand-logo-fallback" style={{display:'none', color:brand.color}}>{brand.fallback}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ PROBLEM SECTION — COMPACT ═══ */
function ProblemSection() {
  const { isMobile } = useDevice();
  const problems = [
    { icon: <MessagesSquare size={28} />, title: "DM & WhatsApp Chaos", short: "Campaigns still begin with scattered DMs, unclear briefs, missing budgets and endless follow-ups.", color: "#f87171", stat: "Too fragmented", statLabel: "discovery, negotiation and delivery live in different places" },
    { icon: <Users size={28} />, title: "Agency Layers & Markups", short: "Multiple intermediaries can add commissions, hide campaign values and make creator–brand pricing harder to understand.", color: "#fb923c", stat: "Less transparency", statLabel: "when too many middlemen sit between brands and creators" },
    { icon: <ClipboardList size={28} />, title: "Collab Form Fatigue", short: "Creators jump between Google Forms, Instagram stories, WhatsApp groups and spreadsheets just to find genuine opportunities.", color: "#a78bfa", stat: "Too many forms", statLabel: "with no single place to track applications and outcomes" },
    { icon: <IndianRupee size={28} />, title: "Payment Uncertainty", short: "Informal deals and long payment cycles leave creators chasing invoices while brands lack a consistent transaction workflow.", color: "#f59e0b", stat: "Payment risk", statLabel: "when terms, delivery and payout aren't structured upfront" },
    { icon: <TrendingDown size={28} />, title: "Follower Count ≠ Fit", short: "Brands need the right audience and engagement—not just a large follower number—and creators need a fair way to show their value.", color: "#22d3ee", stat: "Better matching", statLabel: "starts with niche, audience, content quality and campaign fit" },
  ];

  return (
    <section id="problem" aria-label="The Problem with Influencer Marketing in India" style={{ padding: isMobile ? '48px 16px' : 'clamp(64px, 8vw, 96px) clamp(16px, 4vw, 24px)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge badge-red reveal" style={{ marginBottom: 20 }}>The Problem</div>
          <h2 className="section-title reveal">
            Influencer Marketing in India<br />
            <span className="glow-red">is Completely Broken</span>
          </h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 'clamp(14px,2vw,17px)', maxWidth: 560, margin: '20px auto 0', lineHeight: 1.7, transitionDelay: '0.1s' }}>
            Creator marketing is growing, but the workflow is still fragmented across DMs, spreadsheets, invoices and payment follow-ups. Collancer brings discovery, briefs, bookings and payment protection into one structured flow.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 'clamp(12px,2vw,20px)', marginBottom: 40 }}>
          {problems.map((p, i) => (
            <div key={i} className="glass-card reveal spotlight-card" style={{ padding: 28, transitionDelay: `${i * 0.08}s`, borderLeft: `3px solid ${p.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, color: p.color }}>
                {p.icon}
                <span style={{ fontFamily: 'var(--ff-display)', fontSize: 16, fontWeight: 800 }}>{p.title}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{p.short}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: `${p.color}0f`, minWidth: 0, border: `1px solid ${p.color}25`, borderRadius: 12, padding: '10px 16px' }}>
                <span className="problem-stat-value" style={{ fontFamily: 'var(--ff-display)', fontSize: 24, fontWeight: 800, color: p.color }}>{p.stat}</span>
                <span className="problem-stat-label" style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{p.statLabel}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card reveal" style={{ padding: 'clamp(24px,4vw,36px)', textAlign: 'center', background: 'linear-gradient(180deg, rgba(248,113,113,0.04), rgba(10,10,26,0.98))', borderColor: 'rgba(248,113,113,0.15)' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--cyan)', fontSize: 14, fontWeight: 700 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 15 }}>Collancer is the fix — structured, secure, AI-powered.</span>
            <div className="lucide-anim"><ArrowDown size={22} color="var(--cyan)" /></div>
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
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 'clamp(14px,2vw,18px)', maxWidth: 560, margin: '20px auto 0', lineHeight: 1.7, transitionDelay: '0.1s' }}>
            Discover verified Indian creators across 25 niches, compare fit and pricing, or ask Collancer AI to help narrow the shortlist.
          </p>
        </div>

        {/* Compact comparison */}
        <div className="reveal glass-card" style={{ marginBottom: 40, padding: 'clamp(20px,4vw,36px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 24 }}>
            <div style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--red)', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 14 }}>
                <X size={14} /> Without Collancer
              </div>
              {["Search across Instagram, agencies, WhatsApp and spreadsheets", "Agency layers can add markups and slow approvals", "Campaign briefs, creator rates and usage terms are often scattered", "Pay before the workflow is clearly defined — then chase delivery or revisions"].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                  <X size={13} style={{ color: 'var(--red)', marginTop: 3, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--cyan)', fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 14 }}>
                <Check size={14} /> With Collancer
              </div>
              {["Use Collancer AI and creator signals to narrow the right shortlist", "See creator rates, formats, deliverables and campaign terms clearly", "Run a structured booking without unnecessary agency layers", "Pay securely through Razorpay with the platform booking protection flow"].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                  <Check size={13} style={{ color: 'var(--green)', marginTop: 3, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="reveal glass-card" style={{ marginBottom: 32, padding: 'clamp(20px,4vw,30px)', background: 'linear-gradient(135deg, rgba(248,113,113,0.04), rgba(179,136,255,0.04))', borderColor: 'rgba(179,136,255,0.16)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, color:'var(--purple)', fontFamily:'var(--ff-display)', fontWeight:800, fontSize:15 }}><AlertTriangle size={18}/> What brands are dealing with today</div>
          <div style={{ display:'grid', gridTemplateColumns:isMobile ? '1fr' : 'repeat(3,1fr)', gap:12 }}>
            {[['Agency dependency','Briefs, negotiations and approvals can pass through multiple layers before reaching the creator.'],['Form + spreadsheet overload','Teams collect creator applications in forms, then manually sort, compare and follow up.'],['Unclear ROI & fit','Follower count alone does not tell a brand whether a creator matches the audience or campaign goal.']].map(([title,desc],i)=>(<div key={i} style={{padding:16,borderRadius:14,background:'rgba(255,255,255,.025)',border:'1px solid rgba(255,255,255,.06)'}}><div style={{fontWeight:700,fontSize:13,marginBottom:6}}>{title}</div><div style={{color:'var(--text-muted)',fontSize:12,lineHeight:1.6}}>{desc}</div></div>))}
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

        <div className="reveal glass-card" style={{ marginBottom: 40, padding: 'clamp(20px,4vw,30px)', background: 'linear-gradient(135deg, rgba(255,110,180,0.04), rgba(179,136,255,0.04))', borderColor: 'rgba(255,110,180,0.15)' }}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,color:'var(--pink)',fontFamily:'var(--ff-display)',fontWeight:800,fontSize:15}}><AlertCircle size={18}/> The creator-side problems are bigger than finding a collab</div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:12}}>
            {[['Collab form overload','Every opportunity has another form, another WhatsApp group and another spreadsheet—making it hard to track what you applied for.'],['Agency & middleman opacity','Creators may not know the original campaign value, commission structure, usage rights or who actually controls the deal.'],['Payment + proof problems','Creators can finish content and still spend weeks chasing invoices, approvals and payouts.']].map(([title,desc],i)=>(<div key={i} style={{padding:16,borderRadius:14,background:'rgba(255,255,255,.025)',border:'1px solid rgba(255,255,255,.06)'}}><div style={{fontWeight:700,fontSize:13,marginBottom:6}}>{title}</div><div style={{color:'var(--text-muted)',fontSize:12,lineHeight:1.6}}>{desc}</div></div>))}
          </div>
        </div>

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
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 'clamp(15px,2vw,18px)', maxWidth: 560, margin: '20px auto 0', lineHeight: 1.7, transitionDelay: '0.1s' }}>
            Post a clear campaign brief and let relevant creators pitch you with their rates, timelines and reasons they fit the campaign.
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
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 'clamp(13px,1.8vw,17px)', maxWidth: 600, margin: '20px auto 0', lineHeight: 1.75, transitionDelay: '0.1s' }}>
            Create your profile once, get discovered by brands, receive clear briefs, and manage paid collaborations without the usual DM chaos.
          </p>
        </div>

        {/* Creator pain → solution */}
        <div className="reveal glass-card" style={{ marginBottom: 48, padding: 'clamp(20px,4vw,36px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 16 : 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 14, color: 'var(--red)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ThumbsDown size={14} /> Creator Life Before Collancer
              </div>
              {[
                "Collab forms scattered across Instagram, WhatsApp groups and creator communities",
                "Agencies or middlemen can make rates, commissions and campaign values unclear",
                "Unpaid work, delayed payouts and repeated follow-ups after content goes live",
                "No single profile showing your rates, formats, reputation and completed collaborations",
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <X size={13} style={{ color: 'var(--red)', marginTop: 3, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 14, color: 'var(--purple)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={14} /> Creator Life with Collancer
              </div>
              {[
                "Brands arrive with structured briefs, clear deliverables and defined budgets",
                "Your rates and promotion formats are clear before a booking starts",
                "Payment is secured through the platform before you begin the agreed work",
                "Verified reviews and completed work build a stronger creator profile over time",
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <Check size={13} style={{ color: 'var(--green)', marginTop: 3, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>{item}</span>
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

        <div className="glass-card reveal" style={{ padding: 'clamp(28px,5vw,56px) clamp(20px,4vw,40px)', textAlign: 'center', background: 'linear-gradient(160deg, rgba(179,136,255,0.08) 0%, rgba(255,110,180,0.04) 50%, rgba(10,10,26,0.98) 100%)', borderColor: 'rgba(179,136,255,0.2)', boxShadow: '0 0 80px rgba(179,136,255,0.06)' }}>
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(179,136,255,0.2), rgba(255,110,180,0.1))', border: '1px solid rgba(179,136,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={32} className="lucide-anim" style={{ color: 'var(--purple)' }} />
            </div>
          </div>
          <h3 style={{ fontFamily: "var(--ff-display)", fontSize: 'clamp(20px,3vw,32px)', fontWeight: 800, marginBottom: 14 }}>Ready to turn your content into brand opportunities?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Create your free creator profile and make your rates, niche and content visible to brands looking for the right creator fit.
          </p>
          <button className="btn-glow" style={{ fontSize: 17, padding: '18px 48px' }} onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}>
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
    <section id="how-it-works" aria-label="How Collancer Works for Brands and Creators" style={{ padding: isMobile ? '56px 16px' : 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 24px)' }}>
      <div style={{ width: '100%', maxWidth: 980, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="badge badge-green reveal" style={{ marginBottom: 20 }}>Simple Process</div>
          <h2 className="section-title reveal">How <span className="text-gradient">Collancer Works</span></h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', fontSize: 18, maxWidth: 580, margin: '20px auto 28px', lineHeight: 1.7 }}>
            A structured path from creator discovery to delivery — with clear terms and payment protection built in.
          </p>
          <div className="toggle-pill reveal" style={{ margin: '0 auto', justifyContent: 'center', width: 'fit-content', maxWidth: '100%' }}>
            <button className={active === 'brand' ? 'active' : ''} onClick={() => setActive('brand')}>For Brands</button>
            <button className={active === 'creator' ? 'active' : ''} onClick={() => setActive('creator')}>For Creators</button>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: 860, margin: '0 auto' }}>
          <div style={{ position: 'absolute', left: 23, top: 56, bottom: 60, width: 2, background: 'linear-gradient(to bottom, var(--cyan), var(--purple), transparent)', zIndex: 0 }} className="hide-mobile" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {steps.map((st, i) => (
              <div key={`${active}-${i}`} className="reveal" style={{ display: 'flex', gap: isMobile ? 12 : 24, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                {!isMobile && <div className="number-ring" style={{ background: `color-mix(in srgb, ${st.color} 12%, #0a0a1a)`, border: `2px solid ${st.color}50`, color: st.color, flexShrink: 0 }}>{st.num}</div>}
                <div className="glass-card spotlight-card" style={{ flex: 1, padding: isMobile ? 18 : 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, borderRadius: 12, background: `color-mix(in srgb, ${st.color} 10%, #0f0f22)`, border: `1px solid ${st.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <EmojiToIcon emoji={st.icon} size={isMobile ? 18 : 20} />
                    </div>
                    <div>
                      {isMobile && <div style={{ fontFamily: 'var(--ff-display)', fontSize: 10, fontWeight: 700, color: st.color, marginBottom: 2, letterSpacing: 0.5 }}>STEP {st.num}</div>}
                      <h3 style={{ fontFamily: "var(--ff-display)", fontSize: isMobile ? 15 : 18, fontWeight: 700, color: st.color }}>{st.title}</h3>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75 }}>{st.desc}</p>
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
  const [form, setForm] = useState({ name: '', email: '', type: '', phone: '', platform: '', socialUsername: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [igFollowed, setIgFollowed] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async () => {
    setError('');

    // ── Firebase config guard ──────────────────────────────────────────────
    // If the Vercel environment variables are missing, every Firestore call
    // hangs forever with no error. Catch this early and show a clear message.
    const missingVars = [
      'VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_APP_ID',
      'VITE_EMAILJS_SERVICE_ID', 'VITE_EMAILJS_TEMPLATE_ID', 'VITE_EMAILJS_PUBLIC_KEY',
    ].filter(k => !import.meta.env[k]);
    if (missingVars.length > 0) {
      setError('Configuration error: Firebase environment variables are not set. Please add them in Vercel → Settings → Environment Variables, then redeploy.');
      return;
    }

    // Honeypot check — if the hidden field is filled, it's a bot
    if (form._hp) return;

    // Validate
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0]);
      return;
    }

    // Creator-specific: platform and username are required
    if (tab === 'creator') {
      if (!form.platform) { setError('Please select your platform (Instagram or YouTube).'); return; }
      if (!form.socialUsername || form.socialUsername.trim().length < 2) { setError('Please enter your username on the selected platform.'); return; }
    }

    // Client-side rate limit
    if (!clientRateCheck()) {
      setError('Too many submissions. Please wait a minute and try again.');
      return;
    }

    setLoading(true);

    // ── 12-second timeout: prevents the button being stuck on "Submitting..."
    // if Firebase hangs (e.g. missing env vars, network issue, Firestore rules block).
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('Request timed out. Please check your internet connection and try again. If the problem persists, email us at help@collancer.in');
    }, 12000);

    try {
      // Sanitize all inputs before writing to database
      const cleanName  = sanitize(form.name);
      const cleanEmail = sanitize(form.email).toLowerCase();
      const cleanPhone = sanitize(form.phone);
      const cleanType  = sanitize(form.type);
      const cleanPlatform = sanitize(form.platform);
      const cleanUsername = sanitize(form.socialUsername);

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
        clearTimeout(timeoutId);
        setSubmitted(true); // silently succeed — do not reveal db contents
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "registrations"), {
        name:             cleanName,
        email:            cleanEmail,
        phone:            cleanPhone,
        niche:            cleanType,
        platform:         cleanPlatform || null,
        socialUsername:   cleanUsername || null,
        registrationType: tab,
        submittedAt:      serverTimestamp(),
        status:           'new',
      });

      // ── Send welcome email via EmailJS ─────────────────────────────────────
      // Fires silently — if email fails, registration still succeeds.
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_name:  cleanName,
            to_email: cleanEmail,
            reg_type: tab === 'creator' ? 'Creator' : 'Brand',
            niche:    cleanType || '—',
            platform: cleanPlatform || '—',
            username: cleanUsername ? `@${cleanUsername}` : '—',
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch (emailErr) {
        // Email failure is non-blocking — registration already saved to Firestore
        console.warn('[Collancer] EmailJS failed (non-critical):', emailErr?.text || emailErr);
      }
      clearTimeout(timeoutId);
      setSubmitted(true);
    } catch (err) {
      clearTimeout(timeoutId);
      const code = err?.code || 'unknown';
      const msg  = err?.message || String(err);
      console.error('[Collancer] Firebase error:', code, msg);

      // Show user-friendly messages for common Firebase errors
      if (code === 'permission-denied' || code === 'PERMISSION_DENIED') {
        setError('Submission blocked by database security rules. Please check Firestore rules in the Firebase console allow writes to the "registrations" collection.');
      } else if (code === 'unavailable' || code === 'failed-precondition') {
        setError('Could not reach the database. Please check your internet connection and try again.');
      } else if (msg.includes('400') || msg.includes('API key')) {
        setError('Invalid Firebase API key. Please verify your VITE_FIREBASE_API_KEY environment variable in Vercel.');
      } else {
        setError(`Submission failed [${code}]: ${msg}`);
      }
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

              {/* Creator-only: Platform + Username */}
              {tab === 'creator' && (
                <>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={form.platform}
                      onChange={e => setForm(p => ({ ...p, platform: e.target.value, socialUsername: '' }))}
                      required
                      style={{
                        background: form.platform ? 'rgba(179,136,255,0.07)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.platform ? 'rgba(179,136,255,0.45)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 14,
                        padding: isMobile ? '14px 44px 14px 16px' : '14px 44px 14px 18px',
                        color: form.platform ? 'var(--text)' : 'var(--text-dim)',
                        fontSize: isMobile ? 16 : 15,
                        outline: 'none',
                        fontFamily: 'var(--ff-body)',
                        width: '100%',
                        appearance: 'none',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(179,136,255,0.5)'}
                      onBlur={e => e.target.style.borderColor = form.platform ? 'rgba(179,136,255,0.45)' : 'rgba(255,255,255,0.1)'}
                    >
                      <option value="" disabled>Select Platform *</option>
                      <option value="instagram">📸 Instagram</option>
                      <option value="youtube">▶️ YouTube</option>
                    </select>
                    {/* Custom chevron icon */}
                    <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-dim)' }}>
                      <ChevronDown size={16} />
                    </div>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: isMobile ? 14 : 16, top: '50%', transform: 'translateY(-50%)',
                      fontSize: 14, fontWeight: 700, color: form.platform === 'instagram' ? 'var(--pink)' : form.platform === 'youtube' ? 'var(--red)' : 'var(--text-dim)',
                      pointerEvents: 'none', transition: 'color 0.2s',
                    }}>@</div>
                    <input
                      type="text"
                      placeholder={
                        form.platform === 'instagram' ? 'Instagram Username *' :
                        form.platform === 'youtube'   ? 'YouTube Channel Handle *' :
                        'Platform Username *'
                      }
                      value={form.socialUsername}
                      maxLength={100}
                      autoComplete="off"
                      onChange={e => setForm(p => ({ ...p, socialUsername: e.target.value.replace(/^@+/, '') }))}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.socialUsername ? 'rgba(179,136,255,0.45)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 14,
                        padding: isMobile ? '14px 16px 14px 32px' : '14px 18px 14px 34px',
                        color: 'var(--text)',
                        fontSize: isMobile ? 16 : 15,
                        outline: 'none',
                        fontFamily: 'var(--ff-body)',
                        width: '100%',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(179,136,255,0.5)'}
                      onBlur={e => e.target.style.borderColor = form.socialUsername ? 'rgba(179,136,255,0.45)' : 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                </>
              )}

              <div style={{ background: tab === 'brand' ? 'rgba(0,229,255,0.05)' : 'rgba(179,136,255,0.05)', border: `1px solid ${tab === 'brand' ? 'rgba(0,229,255,0.2)' : 'rgba(179,136,255,0.2)'}`, borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: tab === 'brand' ? 'var(--cyan)' : 'var(--purple)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {tab === 'brand' ? <Building2 size={14} className='lucide-anim' /> : <Sparkles size={14} className='lucide-anim' />}
                  {tab === 'brand' ? 'What you get as an early brand' : 'Benefits of this registration'}
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

              {error && <p style={{ textAlign: 'center', fontSize: 13, color: '#ff6b6b', marginTop: 8, padding: '10px 14px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.4)', borderRadius: 10, wordBreak: 'break-all', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 6 }}>
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} /> {error}
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
              {tab === 'creator' && (
                <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowCommunityModal(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      background: 'linear-gradient(135deg, #ff6eb4 0%, #b388ff 100%)',
                      border: 'none',
                      borderRadius: 18,
                      padding: isMobile ? '16px 18px' : '18px 24px',
                      width: '100%', maxWidth: 440,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'var(--ff-body)',
                      boxShadow: '0 10px 30px rgba(255,110,180,0.28)',
                      transition: 'all 0.3s var(--ease-out-expo)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(255,110,180,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,110,180,0.28)'; }}
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Users size={28} color="#fff" className='lucide-anim' />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4, letterSpacing: '-0.2px' }}>
                        Join Our Creator Community
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, fontWeight: 500 }}>
                        Click here to get daily Paid/barter collab opportunities and PR forms
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {showCommunityModal && (
                <div
                  style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: '#0a0a14',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'flex-start',
                    overflowY: 'auto',
                  }}
                  onClick={() => setShowCommunityModal(false)}
                >
                  <div
                    onClick={e => e.stopPropagation()}
                    style={{
                      width: '100%', minHeight: '100%',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center',
                      paddingBottom: 40,
                    }}
                  >
                    {/* Close button — top right */}
                    <button
                      onClick={() => setShowCommunityModal(false)}
                      aria-label="Close"
                      style={{
                        position: 'fixed', top: 16, right: 16, zIndex: 10001,
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '50%',
                        width: 38, height: 38,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      <X size={18} />
                    </button>

                    {verifying ? (
                      /* ── Verifying state — centred full-screen ── */
                      <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        minHeight: '100svh', padding: '0 24px', textAlign: 'center',
                      }}>
                        <div style={{
                          width: 60, height: 60, borderRadius: '50%',
                          border: '3px solid rgba(255,255,255,0.08)',
                          borderTop: '3px solid var(--pink)',
                          margin: '0 auto 24px',
                          animation: 'lucideSpin 0.9s linear infinite',
                        }} />
                        <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
                          Verifying follow…
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7 }}>
                          Please wait a moment while we confirm.
                        </p>
                      </div>

                    ) : !igFollowed ? (
                      /* ── One quick step — full-screen with GIF ── */
                      <>
                        {/* GIF — 4:5 frame, full width, flush to top */}
                        <div style={{
                          width: '100%',
                          aspectRatio: '4 / 5',
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: '#0a0a14',
                        }}>
                          <img
                            src="/InShot_20260619_082039424.gif"
                            alt="Join our community"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </div>

                        {/* Text + button section below the GIF */}
                        <div style={{
                          width: '100%', maxWidth: 480,
                          padding: '28px 24px 0',
                          textAlign: 'center',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Users size={36} className='lucide-anim' style={{ color: 'var(--pink)' }} />
                          </div>
                          <h3 style={{
                            fontFamily: 'var(--ff-display)', fontSize: 24, fontWeight: 800,
                            margin: 0, lineHeight: 1.2,
                          }}>
                            One quick step!
                          </h3>
                          <p style={{
                            color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7,
                            margin: 0, maxWidth: 340,
                          }}>
                            Click the button below to follow us on Instagram, then come back here after following to join the community.
                          </p>
                          <button
                            onClick={() => {
                              window.open('https://www.instagram.com/collancerr', '_blank', 'noopener,noreferrer');
                              setVerifying(true);
                              setTimeout(() => {
                                setVerifying(false);
                                setIgFollowed(true);
                              }, 8000);
                            }}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 10,
                              background: 'linear-gradient(135deg, rgba(255,110,180,0.18), rgba(179,136,255,0.18))',
                              border: '1px solid rgba(255,110,180,0.4)',
                              borderRadius: 50, padding: '14px 32px',
                              fontSize: 15, fontWeight: 700,
                              color: 'var(--pink)',
                              cursor: 'pointer',
                              fontFamily: 'var(--ff-body)',
                              transition: 'all 0.3s var(--ease-out-expo)',
                              marginTop: 4,
                            }}
                          >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <defs>
                                <linearGradient id="ig-grad-modal" x1="0%" y1="100%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#f09433"/>
                                  <stop offset="25%" stopColor="#e6683c"/>
                                  <stop offset="50%" stopColor="#dc2743"/>
                                  <stop offset="75%" stopColor="#cc2366"/>
                                  <stop offset="100%" stopColor="#bc1888"/>
                                </linearGradient>
                              </defs>
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-grad-modal)" strokeWidth="2" fill="none"/>
                              <circle cx="12" cy="12" r="4" stroke="url(#ig-grad-modal)" strokeWidth="2" fill="none"/>
                              <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig-grad-modal)"/>
                            </svg>
                            Follow us on Instagram
                          </button>
                        </div>
                      </>

                    ) : (
                      /* ── Awesome, thank you — centred full-screen ── */
                      <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        minHeight: '100svh', padding: '0 24px', textAlign: 'center', gap: 16,
                      }}>
                        <Users size={40} className='lucide-anim' style={{ color: 'var(--pink)', marginBottom: 8 }} />
                        <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: 24, fontWeight: 800, margin: 0 }}>
                          Awesome, thank you!
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 320 }}>
                          Now tap below to join our creator community group on WhatsApp.
                        </p>
                        <a
                          href="https://chat.whatsapp.com/EBdkVN8TGTiDndBcF6EFxr?s=cl&p=a&ilr=4"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowCommunityModal(false)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 10,
                            background: 'linear-gradient(135deg, rgba(74,222,128,0.18), rgba(0,229,255,0.18))',
                            border: '1px solid rgba(74,222,128,0.4)',
                            borderRadius: 50, padding: '14px 32px',
                            fontSize: 15, fontWeight: 700,
                            color: 'var(--green)',
                            textDecoration: 'none',
                            transition: 'all 0.3s var(--ease-out-expo)',
                            marginTop: 8,
                          }}
                        >
                          <Users size={18} className='lucide-anim' />
                          Join Creator Community
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
              India has millions of creators and brands — yet they still find each other over chaotic DMs. We are changing that. Collancer is the infrastructure India&apos;s creator economy has always deserved.
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
                <img src="/logo.png" alt="Collancer Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--ff-display)", fontSize: 20, fontWeight: 800, lineHeight: 1.1 }}>Coll<span className="glow-cyan">ancer</span></div>
                <div style={{ fontSize: 9, fontWeight: 500, color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>where influence meets industry</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.75 }}>
              India's first structured influencer booking marketplace for creators across 25 niches, powered by Collancer AI.
            </p>
          </div>

          <div style={{ display: 'flex', gap: isMobile ? 32 : 'clamp(32px, 5vw, 64px)', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Platform</div>
            {['For Creators', 'How It Works', 'Categories', 'Collancer AI', 'Join Early'].map(l => {
                const ids = { 'For Creators': '#for-creators', 'How It Works': '#how-it-works', 'Categories': '#categories', 'Collancer AI': '#cleo', 'Join Early': '#join' };
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
                { label: 'help@collancer.in', href: 'mailto:help@collancer.in' },
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
              { label: 'Privacy Policy', href: 'mailto:help@collancer.in?subject=Privacy%20Policy%20Request' },
              { label: 'Terms of Service', href: 'mailto:help@collancer.in?subject=Terms%20of%20Service%20Request' }
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
      <h2>Collancer — India's Number One Influencer Booking Marketplace | Get Discovered as a Creator</h2>
      <p>
        Collancer is India's first structured influencer booking marketplace, powered by Collancer AI.
        Indian content creators can list their profile for free, get discovered across 25 content niches,
        and receive structured, paid bookings in under 2 minutes.
        Secure payments via Razorpay with a 100% automatic refund guarantee for every booking. Made in India, for India.
      </p>

      <h2>What is Collancer?</h2>
      <p>
        Collancer is an AI-powered influencer marketing platform and booking marketplace for India's creator economy.
        It solves the core problems creators face — unverified DMs, no payment protection,
        unstructured negotiations, and chasing payments — with a fully digital, structured,
        escrow-backed booking system powered by Collancer AI.
      </p>

      <h2>For Creators — Get Paid for Your Influence</h2>
      <p>
        Indian content creators can list their profiles for free, receive structured booking requests,
        and get paid securely via escrow. No more chasing payments over DMs.
      </p>
      <ul>
        <li>Free Listing: Get discovered completely free — no upfront cost, no monthly fees</li>
        <li>Guaranteed Payment: 100% of your fee collected upfront and held in escrow — released automatically on delivery</li>
        <li>6 Promotion Types: Stories, Reels, Videos, Shorts, Personal Videos, Personal Ads — set your own prices</li>
        <li>Requirements Marketplace: See live campaign briefs looking for creators in your niche and send proposals</li>
        <li>Build Reputation: Collect verified reviews to attract more bookings</li>
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
        Collancer AI is Collancer's built-in AI assistant for creator discovery and campaign matching. Collancer AI supports
        natural language creator search, head-to-head creator comparisons, reach estimates,
        and niche-perfect matching — helping the right opportunities find the right creators faster.
      </p>

      <h2>How Collancer Works for Creators</h2>
      <ol>
        <li>Create Your Profile: List your niche, platform, city, prices, and categories. Get verified by our team in 24 hours.</li>
        <li>Receive Bookings: Get discovered and receive booking requests directly. Review the brief instantly.</li>
        <li>Deliver Content: Accept the brief, create the content, and deliver within the agreed timeline.</li>
        <li>Get Paid: Payment is released to your account automatically after delivery. No chasing, no waiting.</li>
      </ol>

      <h2>25 Influencer Marketing Niches Covered</h2>
      <p>
        Collancer covers creators across 25 content niches including Fashion, Beauty and Makeup, Food and Beverages,
        Fitness and Health, Tech and Gadgets, Gaming, Travel, Finance and Investing, Wellness and Mental Health,
        Cars and Automotive, Home and Interior Design, Shopping and E-commerce, Jewelry and Accessories,
        Baby and Parenting, Sports, Music, Books and Education, Sustainability and Eco, Real Estate,
        Film and Entertainment, Pet Care, Photography, Comedy and Memes, and Crypto and Web3.
      </p>

      <h2>6 Types of Influencer Promotions You Can Offer</h2>
      <ul>
        <li>Instagram Story: 24-hour disappearing content, high reach, swipe-up links</li>
        <li>Instagram Reel: Short-form video with massive organic discovery potential</li>
        <li>YouTube Video: Long-form dedicated or integrated video promotion</li>
        <li>YouTube Shorts: 60-second branded Short with high discoverability</li>
        <li>Personal Video: Custom branded video content</li>
        <li>Personal Ad: Creator-made ad creative</li>
      </ul>

      <h2>Secure Payments and Refund Policy</h2>
      <p>
        All payments on Collancer are processed via Razorpay and held in escrow. Payments are released to
        creators only after confirmed delivery, so creators are always paid for completed work.
        If a booking falls through or a deadline is missed, the booking party receives an automatic refund —
        keeping every transaction trustworthy for creators on the platform.
      </p>

      <h2>Frequently Asked Questions about Collancer</h2>

      <h3>What makes Collancer different from other influencer platforms in India?</h3>
      <p>
        Collancer combines AI-powered creator matching via Collancer AI, escrow payment protection through Razorpay, a requirements marketplace,
        structured briefs, and verified creator signals in one digital workflow. It replaces fragmented DM-based negotiations
        with a clearer path from discovery and proposal to booking and delivery.
      </p>

      <h3>Is Collancer free for creators?</h3>
      <p>
        Yes. Creators can list their profiles on Collancer completely free. There are no upfront costs or monthly fees.
        Collancer takes a small platform commission only when a successful booking is completed.
      </p>

      <h3>How many influencers are on Collancer?</h3>
      <p>
        Creator onboarding is currently in progress. Each creator profile is reviewed by the Collancer team before approval,
        with checks focused on real engagement, audience context and content quality.
      </p>

      <h3>Which cities does Collancer cover?</h3>
      <p>
        Collancer covers creators from all major Indian cities including Mumbai, Delhi, Bengaluru, Hyderabad,
        Chennai, Pune, Kolkata, Ahmedabad, Jaipur, Surat, and tier-2 cities across India.
      </p>

      <h3>Who founded Collancer?</h3>
      <p>
        Collancer was founded by Jainik Dand, Founder and CEO. The company was founded in 2026 with the mission
        to build the infrastructure India's creator economy has always deserved — replacing chaotic DMs
        with a structured, secure, AI-powered marketplace for creators.
      </p>

      <address>
        <strong>Collancer</strong><br />
        India's First Structured Influencer Booking Marketplace<br />
        Email: <a href="mailto:help@collancer.in">help@collancer.in</a><br />
        Website: <a href="https://collancer.in">https://collancer.in</a>
      </address>

      {/* Additional internal links for crawlers */}
      <nav aria-label="Section links">
        <a href="https://collancer.in/#for-creators">Join Collancer as a Creator</a>
        {' | '}
        <a href="https://collancer.in/#how-it-works">How Collancer Works</a>
        {' | '}
        <a href="https://collancer.in/#categories">Browse Influencer Categories</a>
        {' | '}
        <a href="https://collancer.in/#cleo">Meet Collancer AI</a>
        {' | '}
        <a href="https://collancer.in/#faq">Frequently Asked Questions</a>
        {' | '}
        <a href="https://collancer.in/blog/">Influencer Marketing Blog</a>
        {' | '}
        <a href="https://collancer.in/#founder">About the Founder</a>
      </nav>
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
      a: "Registration process for creators is currently in progress. Every creator is manually verified by the Collancer team within 24 hours — we check real engagement, audience geography, and content quality before approval."
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
            href="mailto:help@collancer.in"
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
            <Mail size={14} /> help@collancer.in
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══ JOIN REDIRECT ═══
   Handles collancer.in/join — redirects to the homepage and auto-scrolls to
   the registration (#join) section. Works for direct URL visits, shared links,
   and the sitemap entry that tells Google this URL = the sign-up section. */
function JoinRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    // Replace current history entry so the back-button goes to where they came from,
    // not to /join (which would just redirect again).
    navigate('/', { replace: true });
    // After navigation, scroll to the join section once the homepage has mounted.
    // Two rAF frames ensure React has flushed the new route before we try getElementById.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById('join');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Fallback: retry a few times for slower devices
          let tries = 0;
          const retry = setInterval(() => {
            const target = document.getElementById('join');
            if (target) { target.scrollIntoView({ behavior: 'smooth' }); clearInterval(retry); }
            if (++tries > 10) clearInterval(retry);
          }, 100);
        }
      });
    });
  }, [navigate]);
  // Render nothing — the redirect happens immediately
  return null;
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
      'hero', 'problem', 'for-brands', 'for-creators', 'how-it-works',
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

function useScrollRestriction() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) return;

    let maxScroll = 0;

    const computeCutoff = () => {
      const founderEl = document.getElementById('founder');
      if (!founderEl) return;
      const cutoff = founderEl.offsetTop + founderEl.offsetHeight;
      maxScroll = Math.max(0, cutoff - window.innerHeight);
    };

    // Block scrolling past the founder section using input events only —
    // no scrollTo() calls in scroll listeners, which causes jitter/vibration.
    const onWheel = (e) => {
      if (window.scrollY >= maxScroll && e.deltaY > 0) {
        e.preventDefault();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      const dy = touchStartY - e.touches[0].clientY;
      if (window.scrollY >= maxScroll && dy > 0) {
        e.preventDefault();
      }
    };

    const onKeyDown = (e) => {
      if (['ArrowDown', 'PageDown', 'End', ' '].includes(e.key) && window.scrollY >= maxScroll) {
        e.preventDefault();
      }
    };

    const raf = requestAnimationFrame(() => {
      setTimeout(() => {
        computeCutoff();
        if (maxScroll > 0 && window.scrollY > maxScroll) {
          window.scrollTo({ top: maxScroll, behavior: 'instant' });
        }
      }, 120);
    });

    window.addEventListener('resize', computeCutoff, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', computeCutoff);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isHome]);
}

// ─── useFadeNavigate ─────────────────────────────────────────────────────────
// Fades the page out before navigating, then the new page fades in via
// PageTransition. Call fadeTo('/path') instead of navigate('/path') to get
// the smooth cross-fade effect.
export function useFadeNavigate() {
  const navigate = useNavigate();
  const fadeTo = useCallback((to) => {
    const el = document.getElementById('page-transition-wrapper');
    if (el) {
      el.classList.remove('page-fade-enter');
      el.classList.add('page-fade-exit');
      const tid = setTimeout(() => {
        // Clean up exit class before navigation so the enter animation
        // runs cleanly on the next page mount
        el.classList.remove('page-fade-exit');
        navigate(to);
      }, 420);
      // Safety: if the element is gone (e.g. unmounted), clear timer
      return () => clearTimeout(tid);
    } else {
      navigate(to);
    }
  }, [navigate]);
  return fadeTo;
}

// ─── PageTransition ───────────────────────────────────────────────────────────
// Plays a fade-in only on route changes. The class is removed after the
// animation completes so it never re-triggers on unrelated re-renders.
function PageTransition({ children }) {
  const { pathname } = useLocation();
  const wrapperRef = useRef(null);
  const prevPathname = useRef(null);

  useEffect(() => {
    if (prevPathname.current === null) {
      // First mount — play enter once then remove the class
      prevPathname.current = pathname;
      const el = wrapperRef.current;
      if (!el) return;
      el.classList.add('page-fade-enter');
      const tid = setTimeout(() => el.classList.remove('page-fade-enter'), 750);
      return () => clearTimeout(tid);
    }
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      const el = wrapperRef.current;
      if (!el) return;
      el.classList.remove('page-fade-exit');
      el.classList.remove('page-fade-enter');
      void el.offsetWidth; // force reflow
      el.classList.add('page-fade-enter');
      const tid = setTimeout(() => el.classList.remove('page-fade-enter'), 750);
      return () => clearTimeout(tid);
    }
  }, [pathname]);

  return (
    <div id="page-transition-wrapper" ref={wrapperRef} style={{ width: '100%' }}>
      {children}
    </div>
  );
}

// Scrolls to the top of the page on every route change — no flashes of
// mid-page content when navigating to /blog or back to /.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Reset both window and body scroll so neither retains position
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [pathname]);
  return null;
}

function usePremiumMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const updatePointer = (e) => { root.style.setProperty('--mx', `${e.clientX}px`); root.style.setProperty('--my', `${e.clientY}px`); };
    window.addEventListener('pointermove', updatePointer, { passive: true });
    const cards = Array.from(document.querySelectorAll('.glass-card'));
    const cleanups = [];
    cards.forEach((card) => {
      const move = (e) => { const r=card.getBoundingClientRect(); card.style.setProperty('--spot-x', `${((e.clientX-r.left)/r.width)*100}%`); card.style.setProperty('--spot-y', `${((e.clientY-r.top)/r.height)*100}%`); };
      card.addEventListener('pointermove', move, { passive: true }); cleanups.push(() => card.removeEventListener('pointermove', move));
    });
    return () => { window.removeEventListener('pointermove', updatePointer); cleanups.forEach((fn)=>fn()); };
  }, []);
}


export default function App() {
  useRevealAnimation();
  usePremiumMotion();
  useAnalytics();
  useScrollRestriction();

  // ── Hash scroll on load ──────────────────────────────────────────────────
  // When someone visits /#faq, /#for-creators, etc., React mounts and then
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
    // Set page language for accessibility and SEO
    document.documentElement.lang = 'en';
  }, []);

  return (
    <>
      {/* Persistent across all routes — moving these outside Routes prevents
          the canvas from unmounting on navigation (which killed the animation loop)
          and keeps global CSS active on /blog so z-index stacking stays correct. */}
      <style>{FONTS}{CSS}</style>
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

      <ScrollToTop />
      <PageTransition>
      <Routes>
        <Route path="/join" element={<JoinRedirect />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/" element={
          <>
            {/* SEO: Fully crawlable static content for search engines */}
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
                <ForCreators />
                <HowItWorks />
                <Categories />
                <SocialProof />
                <FAQSection />
                <JoinSection />
                <FounderSection />
              </article>
            </main>
          </>
        } />
    </Routes>
    </PageTransition>
    </>
  );
}