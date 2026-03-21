# Sachin Chandra — Portfolio

Personal portfolio site for Sachin Chandra, Electronics Engineering student specialising in VLSI Design, Embedded Systems, and FPGA Development.

**Live site:** https://sachinc6.github.io/sachin-portfolio/

---

## Stack

- Plain HTML / CSS / JavaScript (no build step required)
- [GSAP](https://gsap.com/) + ScrollTrigger for scroll-based animations
- Hosted on **GitHub Pages**

---

## Running locally

```bash
# Clone the repo
git clone https://github.com/sachinC6/sachin-portfolio.git
cd sachin-portfolio

# Open directly in a browser — no server needed for basic viewing
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows

# Or use any static file server, e.g.:
npx serve .
python3 -m http.server 8080
```

---

## Deploying to GitHub Pages

1. Push your changes to the `main` branch.
2. In the repository **Settings → Pages**, set:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `root`
3. GitHub Pages will publish the site automatically within a minute or two.

The live URL follows the pattern:
```
https://<username>.github.io/<repo-name>/
```

---

## Project structure

```
sachin-portfolio/
├── index.html        # Main HTML — all sections
├── style.css         # All styles (dark/light theme, responsive, animations)
├── index.js          # Animations (GSAP), theme toggle, mobile menu, scroll FX
├── assets/
│   └── projects/     # Local project SVG placeholder images
│       ├── project5.svg
│       └── project7.svg
└── js/
    └── gsap.min.js   # GSAP offline fallback
```

---

## Performance notes

- GSAP + ScrollTrigger are loaded from CDN with an offline fallback (`js/gsap.min.js`).
- All below-the-fold project images use `loading="lazy"`.
- Scroll event listeners use `{ passive: true }`.
- Animations respect `prefers-reduced-motion`.
- The custom cursor is hidden on touch/hover-none devices.
- The carousel and Draggable plugin have been removed to eliminate the 3000px scroll-pin jank.

---

## Contact

- **Email:** sachinc625@gmail.com
- **GitHub:** [sachinC6](https://github.com/sachinC6)
- **LinkedIn:** [Sachin Chandra](https://www.linkedin.com/in/sachin-c-11b9843a6)
