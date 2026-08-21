// Launch polish layer kept outside the main React component.
// It also applies the AI demo background after React mounts, because App.jsx
// injects its large CSS block at runtime and can otherwise override this file.

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

function injectAiDemoBackgrounds() {
  if (document.getElementById('collancer-ai-demo-bg-fix')) return;

  const style = document.createElement('style');
  style.id = 'collancer-ai-demo-bg-fix';
  style.textContent = `
    /* FINAL AI DEMO BACKGROUND — injected after App.jsx styles */
    .creator-ai-live,
    .cleo-demo-shell {
      position:relative!important;
      isolation:isolate!important;
      overflow:hidden!important;
      background:#070a18!important;
      border:1px solid rgba(255,255,255,.14)!important;
      box-shadow:0 40px 120px rgba(0,0,0,.52),0 0 100px rgba(0,229,255,.08),inset 0 1px 0 rgba(255,255,255,.10)!important;
    }

    .creator-ai-live::before,
    .cleo-demo-shell::before {
      content:""!important;
      position:absolute!important;
      inset:0!important;
      z-index:0!important;
      pointer-events:none!important;
      background:
        radial-gradient(circle at 12% 16%,rgba(0,229,255,.22),transparent 25%),
        radial-gradient(circle at 88% 18%,rgba(124,58,237,.21),transparent 26%),
        radial-gradient(circle at 78% 88%,rgba(179,136,255,.16),transparent 28%),
        linear-gradient(135deg,#070b1d 0%,#0b1027 48%,#100a22 100%)!important;
      transform:scale(1.08)!important;
      animation:collancerAiAtmosphere 11s ease-in-out infinite alternate!important;
    }

    .creator-ai-live::after,
    .cleo-demo-shell::after {
      content:""!important;
      position:absolute!important;
      inset:0!important;
      z-index:1!important;
      pointer-events:none!important;
      opacity:.42!important;
      background-image:
        linear-gradient(rgba(255,255,255,.038) 1px,transparent 1px),
        linear-gradient(90deg,rgba(255,255,255,.038) 1px,transparent 1px)!important;
      background-size:44px 44px!important;
      mask-image:radial-gradient(ellipse at center,black 15%,transparent 84%)!important;
      animation:collancerAiGrid 18s linear infinite!important;
    }

    .creator-ai-live > *,
    .cleo-demo-shell > * {
      position:relative!important;
      z-index:3!important;
    }

    .creator-ai-window,
    .cleo-windowbar,
    .creator-ai-chat,
    .cleo-chat {
      position:relative!important;
      z-index:4!important;
    }

    .creator-ai-window,
    .cleo-windowbar {
      box-shadow:0 24px 80px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.07)!important;
      backdrop-filter:blur(18px)!important;
    }

    @keyframes collancerAiAtmosphere {
      from { transform:scale(1.08) translate3d(-1%,1%,0); }
      to { transform:scale(1.14) translate3d(2%,-2%,0); }
    }
    @keyframes collancerAiGrid {
      from { background-position:0 0,0 0; }
      to { background-position:44px 44px,-44px 44px; }
    }

    @media(max-width:680px){
      .creator-ai-live::after,.cleo-demo-shell::after{background-size:30px 30px!important;opacity:.28!important}
    }
    @media(prefers-reduced-motion:reduce){
      .creator-ai-live::before,.cleo-demo-shell::before,.creator-ai-live::after,.cleo-demo-shell::after{animation:none!important}
    }
  `;
  document.head.appendChild(style);
}

function runLaunchPolish() {
  polishCollancerFooter();
  injectAiDemoBackgrounds();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // React may mount after DOMContentLoaded, so give it a tick first.
    setTimeout(runLaunchPolish, 0);
    setTimeout(runLaunchPolish, 350);
  }, { once: true });
} else {
  setTimeout(runLaunchPolish, 0);
}

const footerObserver = new MutationObserver(() => {
  polishCollancerFooter();
  injectAiDemoBackgrounds();
});
footerObserver.observe(document.documentElement, { childList: true, subtree: true });
