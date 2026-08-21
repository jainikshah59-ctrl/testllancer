// Small launch polish layer kept outside the main React component.
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', polishCollancerFooter, { once: true });
} else {
  polishCollancerFooter();
}

const footerObserver = new MutationObserver(polishCollancerFooter);
footerObserver.observe(document.documentElement, { childList: true, subtree: true });
