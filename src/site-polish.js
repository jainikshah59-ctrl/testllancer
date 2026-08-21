// Launch polish layer kept outside the main React component.
// Applies final visual and copy polish after React mounts.

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
  const candidates = Array.from(document.querySelectorAll('main h1, main h2, h1, h2'));
  const hero = candidates.find((el) => {
    const text = el.textContent.trim().toLowerCase();
    return text.includes('brands') && text.includes('creators') && (text.includes('where') || text.includes('verified'));
  });
  if (!hero) return;

  hero.innerHTML = 'The Future of Influencer Marketing<br/><span class="text-gradient">Starts Here</span>';
  hero.dataset.heroCopyPolished = '1';

  const desiredTagline = 'Connecting brands and creators without the chaos of agencies, forms, and endless DMs.';
  const section = hero.closest('section') || hero.parentElement;
  if (!section) return;

  // Replace the actual hero subtitle instead of relying on its previous wording.
  const existing = Array.from(section.querySelectorAll('p, [role="paragraph"], .subtitle, .hero-subtitle')).find((el) => {
    if (el === hero || el.contains(hero)) return false;
    const text = el.textContent.trim();
    if (!text || text.length < 25 || text.length > 240) return false;
    // Exclude button labels and legal/navigation copy.
    const tag = el.tagName.toLowerCase();
    return tag === 'p' || el.classList.contains('subtitle') || el.classList.contains('hero-subtitle');
  });

  if (existing) {
    existing.textContent = desiredTagline;
    existing.dataset.heroTaglinePolished = '1';
  } else if (!section.querySelector('[data-collancer-hero-tagline="1"]')) {
    const tagline = document.createElement('p');
    tagline.dataset.collancerHeroTagline = '1';
    tagline.textContent = desiredTagline;
    tagline.style.cssText = 'max-width:720px;margin:18px auto 0;text-align:center;color:rgba(226,232,240,.78);font-size:clamp(15px,1.45vw,19px);line-height:1.6;letter-spacing:-.01em;';
    hero.insertAdjacentElement('afterend', tagline);
  }
}

function injectAiDemoBackgrounds() {
  if (document.getElementById('collancer-ai-demo-bg-fix')) return;
  const style = document.createElement('style');
  style.id = 'collancer-ai-demo-bg-fix';
  style.textContent = `
    .creator-ai-live,.cleo-demo-shell{position:relative!important;isolation:isolate!important;overflow:hidden!important;background:#070a18!important;border:1px solid rgba(255,255,255,.14)!important;box-shadow:0 40px 120px rgba(0,0,0,.52),0 0 100px rgba(0,229,255,.08),inset 0 1px 0 rgba(255,255,255,.10)!important}
    .creator-ai-live::before,.cleo-demo-shell::before{content:""!important;position:absolute!important;inset:0!important;z-index:0!important;pointer-events:none!important;background:radial-gradient(circle at 12% 16%,rgba(0,229,255,.22),transparent 25%),radial-gradient(circle at 88% 18%,rgba(124,58,237,.21),transparent 26%),radial-gradient(circle at 78% 88%,rgba(179,136,255,.16),transparent 28%),linear-gradient(135deg,#070b1d 0%,#0b1027 48%,#100a22 100%)!important;transform:scale(1.08)!important;animation:collancerAiAtmosphere 11s ease-in-out infinite alternate!important}
    .creator-ai-live::after,.cleo-demo-shell::after{content:""!important;position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;opacity:.42!important;background-image:linear-gradient(rgba(255,255,255,.038) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.038) 1px,transparent 1px)!important;background-size:44px 44px!important;mask-image:radial-gradient(ellipse at center,black 15%,transparent 84%)!important;animation:collancerAiGrid 18s linear infinite!important}
    .creator-ai-live>*,.cleo-demo-shell>*{position:relative!important;z-index:3!important}
    .creator-ai-window,.cleo-windowbar,.creator-ai-chat,.cleo-chat{position:relative!important;z-index:4!important}
    .creator-ai-window,.cleo-windowbar{box-shadow:0 24px 80px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.07)!important;backdrop-filter:blur(18px)!important}
    .cleo-showcase .cleo-orbit,.cleo-demo-shell .cleo-orbit,.cleo-demo-shell .cleo-pulse-ring{display:none!important;animation:none!important}
    @keyframes collancerAiAtmosphere{from{transform:scale(1.08) translate3d(-1%,1%,0)}to{transform:scale(1.14) translate3d(2%,-2%,0)}}
    @keyframes collancerAiGrid{from{background-position:0 0,0 0}to{background-position:44px 44px,-44px 44px}}
    @media(max-width:680px){.creator-ai-live::after,.cleo-demo-shell::after{background-size:30px 30px!important;opacity:.28!important}}
    @media(prefers-reduced-motion:reduce){.creator-ai-live::before,.cleo-demo-shell::before,.creator-ai-live::after,.cleo-demo-shell::after{animation:none!important}}
  `;
  document.head.appendChild(style);
}

function runLaunchPolish() {
  polishCollancerFooter();
  polishHeroCopy();
  injectAiDemoBackgrounds();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runLaunchPolish, 0);
    setTimeout(runLaunchPolish, 350);
    setTimeout(runLaunchPolish, 1000);
  }, { once: true });
} else {
  setTimeout(runLaunchPolish, 0);
  setTimeout(runLaunchPolish, 350);
}

const footerObserver = new MutationObserver(() => {
  polishCollancerFooter();
  polishHeroCopy();
});
footerObserver.observe(document.documentElement, { childList: true, subtree: true });
