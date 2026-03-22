(() => {
  const root = document.documentElement;

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");

  if (toggle && links) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      links.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Orbo-style slide tint switching (no libraries)
  const sections = Array.from(document.querySelectorAll("main > section.section"));
  if (!sections.length) return;

  const css = getComputedStyle(root);
  const tokens = {
    lavender: css.getPropertyValue("--color-slide-lavender").trim(),
    peach: css.getPropertyValue("--color-slide-peach").trim(),
    pink: css.getPropertyValue("--color-slide-pink").trim(),
  };

  const hasSlideTokens = Object.values(tokens).every(Boolean);
  if (!hasSlideTokens) return;

  const themeFor = (sec) => {
    if (sec.classList.contains("slide-peach")) return tokens.peach;
    if (sec.classList.contains("slide-pink")) return tokens.pink;
    return tokens.lavender;
  };

  const pickActive = () => {
    const targetY = window.innerHeight * 0.35;
    let best = sections[0];
    let bestDist = Infinity;

    for (const s of sections) {
      const d = Math.abs(s.getBoundingClientRect().top - targetY);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
    }
    return best;
  };

  let current = null;
  const update = () => {
    const active = pickActive();
    if (active === current) return;
    current = active;
    root.style.setProperty("--scroll-tint", themeFor(active));
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true }
  );

  update();
})();