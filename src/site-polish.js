// Launch polish layer kept outside the main React component.
// Applies final visual, copy, spacing, and performance polish after React mounts.

function polishCollancerFooter() {
  document.querySelectorAll('footer p').forEach((p) => {
    if (!p.textContent.includes('Made in India') || p.dataset.footerPolished === '1') return;
    p.dataset.footerPolished = '1';
    const originalIcon = p.querySelector('svg');
    p.replaceChildren();
    const first = document.createElement('span');
    first.className = 'footer-line footer-line-main';
    if (originalIcon) first.appendChild(originalIcon.cloneNode(true));
    first.append(document.createTextNode('2026 Collancer. All rights reserved.'));
    const second = document.createElement('span');
    second.className = 'footer-line footer-line-made';
    second.append(document.createTextNode('Made in India'));
    p.append(first, second);
  });
}

function polishHeroCopy() {
  const candidates = Array.from(document.querySelectorAll('h1, h2'));
  const hero = candidates.find((el) => {
    const text = el.textContent.trim().toLowerCase();
    return text.includes('brands') && text.includes('creators') && (text.includes('where') || text.includes('verified'));
  });
  if (!hero || hero.dataset.heroCopyPolished === '1') return;
  hero.innerHTML = 'The Future of Influencer Marketing<br/><span class="text-gradient">Starts Here</span>';
  hero.dataset.heroCopyPolished = '1';
  const desiredTagline = 'Connecting brands and creators without the chaos of agencies, forms, and endless DMs.';
  const section = hero.closest('section') || hero.parentElement;
  if (!section) return;
  const existing = Array.from(section.querySelectorAll('p, [role="paragraph"], .subtitle, .hero-subtitle')).find((el) => {
    if (el === hero || el.contains(hero)) return false;
    const text = el.textContent.trim();
    if (!text || text.length < 25 || text.length > 240) return false;
    return el.tagName.toLowerCase() === 'p' || el.classList.contains('subtitle') || el.classList.contains('hero-subtitle');
  });
  if (existing) {
    existing.textContent = desiredTagline;
    existing.dataset.heroTaglinePolished = '1';
  } else if (!section.querySelector('[data-collancer-hero-tagline="1"]')) {
    const tagline = document.createElement('p');
    tagline.dataset.collancerHeroTagline = '1';
    tagline.textContent = desiredTagline;
    section.insertBefore(tagline, hero.nextSibling);
  }
}

function injectMobileHeroPolish() {
  if (document.getElementById('collancer-mobile-hero-fix')) return;
  const style = document.createElement('style');
  style.id = 'collancer-mobile-hero-fix';
  style.textContent = `
    @media (max-width: 680px) {
      h1[data-hero-copy-polished="1"] { display:block !important; width:100% !important; max-width:94vw !important; margin-left:auto !important; margin-right:auto !important; font-size:clamp(36px,10.8vw,52px) !important; line-height:.98 !important; letter-spacing:-.045em !important; text-align:center !important; }
      h1[data-hero-copy-polished="1"] + p, [data-collancer-hero-tagline="1"] { display:block !important; width:100% !important; max-width:92vw !important; margin:13px auto 0 !important; padding:0 8px !important; font-size:14px !important; line-height:1.45 !important; text-align:center !important; }
      h1[data-hero-copy-polished="1"] ~ div button, h1[data-hero-copy-polished="1"] ~ div a { min-height:46px !important; }
    }
    @media (max-width:390px) {
      h1[data-hero-copy-polished="1"] { font-size:35px !important; }
      h1[data-hero-copy-polished="1"] + p, [data-collancer-hero-tagline="1"] { font-size:13.5px !important; line-height:1.42 !important; }
    }
  `;
  document.head.appendChild(style);
}

function injectAiDemoBackgrounds() {
  if (document.getElementById('collancer-ai-demo-bg-fix')) return;
  const style = document.createElement('style');
  style.id = 'collancer-ai-demo-bg-fix';
  style.textContent = `
    .cleo-demo-shell{position:relative!important;isolation:isolate!important;overflow:hidden!important;background:#070a18!important;border:1px solid rgba(255,255,255,.14)!important;box-shadow:0 40px 120px rgba(0,0,0,.52),0 0 100px rgba(0,229,255,.08),inset 0 1px 0 rgba(255,255,255,.10)!important}
    .cleo-demo-shell::before{content:""!important;position:absolute!important;inset:0!important;z-index:0!important;pointer-events:none!important;background:radial-gradient(circle at 12% 16%,rgba(0,229,255,.22),transparent 25%),radial-gradient(circle at 88% 18%,rgba(124,58,237,.21),transparent 26%),radial-gradient(circle at 78% 88%,rgba(179,136,255,.16),transparent 28%),linear-gradient(135deg,#070b1d 0%,#0b1027 48%,#100a22 100%)!important;transform:scale(1.08)!important;animation:collancerAiAtmosphere 11s ease-in-out infinite alternate!important}
    .cleo-demo-shell::after{content:""!important;position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;opacity:.42!important;background-image:linear-gradient(rgba(255,255,255,.038) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.038) 1px,transparent 1px)!important;background-size:44px 44px!important;mask-image:radial-gradient(ellipse at center,black 15%,transparent 84%)!important;animation:collancerAiGrid 18s linear infinite!important}
    .cleo-demo-shell>*{position:relative!important;z-index:3!important}
    .cleo-windowbar,.cleo-chat{position:relative!important;z-index:4!important}
    .cleo-demo-shell .cleo-window{box-shadow:0 24px 80px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.07)!important;backdrop-filter:blur(18px)!important}
    .cleo-showcase .cleo-orbit,.cleo-demo-shell .cleo-orbit,.cleo-demo-shell .cleo-pulse-ring{display:none!important;animation:none!important}
    @keyframes collancerAiAtmosphere{from{transform:scale(1.08) translate3d(-1%,1%,0)}to{transform:scale(1.14) translate3d(2%,-2%,0)}}
    @keyframes collancerAiGrid{from{background-position:0 0,0 0}to{background-position:44px 44px,-44px 44px}}

    /* Creator CTA and AI demo must read as two separate sections on every viewport. */
    .creator-profile-cta-section{margin-bottom:24px!important}
    .creator-ai-section{margin-top:24px!important}

    /* Keep the creator header compact without shrinking the actual demo content. */
    .creator-ai-status{white-space:nowrap!important;display:inline-flex!important;align-items:center!important;flex-shrink:0!important}
    .creator-ai-orb{width:26px!important;height:26px!important;min-width:26px!important;min-height:26px!important;flex:0 0 26px!important;border-radius:8px!important}
    .creator-ai-orb svg{width:12px!important;height:12px!important}

    /* Touch devices do not need expensive hover transforms or large blur layers. */
    @media (hover:none) and (pointer:coarse) {
      .glass-card:hover,.btn-glow:hover,.btn-outline:hover{transform:none!important;box-shadow:none}
      .cleo-demo-shell .cleo-window{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
    }
    @media(max-width:680px){
      .cleo-demo-shell::after{background-size:30px 30px!important;opacity:.20!important}
      .creator-profile-cta-section{margin-bottom:20px!important}
      .creator-ai-section{margin-top:20px!important}
      .creator-ai-windowbar{gap:8px!important}
      .creator-ai-windowbar>div:nth-child(2){min-width:0!important}
      .creator-ai-windowbar>div:nth-child(2)>div:first-child{font-size:13px!important}
      .creator-ai-windowbar>div:nth-child(2)>div:nth-child(2){font-size:10px!important;white-space:nowrap!important}
      .creator-ai-status{font-size:10px!important}
    }
    @media(prefers-reduced-motion:reduce){
      *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
      .cleo-demo-shell::before,.cleo-demo-shell::after{animation:none!important}
    }
  `;
  document.head.appendChild(style);
}

function polishCreatorAiDemo() {
  const demo = document.querySelector('.creator-ai-window');
  if (!demo) return;

  const windowbar = demo.querySelector('.creator-ai-windowbar');
  if (windowbar) {
    const textColumn = windowbar.querySelector(':scope > div:nth-child(2)');
    if (textColumn) {
      const tagline = textColumn.querySelector(':scope > div:nth-child(2)');
      if (tagline && tagline.textContent.trim() !== 'Creator assistant') {
        tagline.textContent = 'Creator assistant';
      }
    }
  }

  const status = demo.querySelector('.creator-ai-status');
  if (status) {
    status.style.whiteSpace = 'nowrap';
    status.style.display = 'inline-flex';
    status.style.alignItems = 'center';
    status.style.flexShrink = '0';
  }

  demo.dataset.headerPolished = '1';
}

function polishCreatorSectionSpacing() {
  const sections = Array.from(document.querySelectorAll('section'));
  const profileSection = sections.find((section) => section.textContent.includes('List Your Profile Free'));
  const creatorSection = sections.find((section) => section.textContent.includes('MEET COLLANCER AI FOR CREATORS'));
  if (profileSection) profileSection.classList.add('creator-profile-cta-section');
  if (creatorSection) creatorSection.classList.add('creator-ai-section');
}

function runLaunchPolish() {
  polishCollancerFooter();
  polishHeroCopy();
  injectMobileHeroPolish();
  injectAiDemoBackgrounds();
  polishCreatorAiDemo();
  polishCreatorSectionSpacing();
}

let polishQueued = false;
function queueLaunchPolish() {
  if (polishQueued) return;
  polishQueued = true;
  requestAnimationFrame(() => {
    polishQueued = false;
    runLaunchPolish();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', queueLaunchPolish, { once: true });
} else {
  queueLaunchPolish();
}

const polishObserver = new MutationObserver(() => queueLaunchPolish());
polishObserver.observe(document.documentElement, { childList: true, subtree: true });