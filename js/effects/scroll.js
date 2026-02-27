    // SCROLL REVEAL ANIMATIONS
    // ═══════════════════════════════════════
export const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });

export function initReveals() {
      document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
    }
    // Initialize after a short delay to ensure DOM is ready
    // Watch for dynamically added .reveal elements
export const bodyObserver = new MutationObserver(mutations => {
      mutations.forEach(mut => {
        mut.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            // Because overflow: hidden limits IntersectionObserver, ensure `.reveal` is active if it's visible,
            // or just rely entirely on the manual IntersectionObserver running.
            if (node.classList && node.classList.contains('reveal')) revealObserver.observe(node);
            const reveals = node.querySelectorAll('.reveal');
            if (reveals && reveals.length) reveals.forEach(el => revealObserver.observe(el));
          }
        });
      });
    });
    // Watch dynamically bound panels so intersection observer can be hooked correctly.
export const hireContent = document.getElementById('hire-content');
    if (hireContent) bodyObserver.observe(hireContent, { childList: true, subtree: true });

    // Initial run
    initReveals();

    // ═══════════════════════════════════════
