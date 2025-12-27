// your code goes here
gsap.registerPlugin(ScrollTrigger, TextPlugin, Flip);

/* HERO */
gsap.from(".hero-title", {
  y: -40,
  opacity: 0,
  duration: 1
});

gsap.to(".hero-subtitle", {
  text: "Electronics Engineering Student | VLSI Design",
  duration: 2,
  delay: 0.6
});

/* SECTIONS */
gsap.utils.toArray(".section").forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 40,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: "top 85%"
    }
  });
});

/* SKILLS */
gsap.utils.toArray(".fill").forEach(bar => {
  gsap.to(bar, {
    width: bar.dataset.width,
    duration: 1.5,
    scrollTrigger: {
      trigger: bar,
      start: "top 90%"
    }
  });
});

/* ===== SCRUBBED BENTO GALLERY ===== */

let flipCtx;

const createTween = () => {
  const gallery = document.querySelector("#gallery-8");
  const items = gallery.querySelectorAll(".gallery__item");

  flipCtx && flipCtx.revert();
  gallery.classList.remove("gallery--final");

  flipCtx = gsap.context(() => {
    gallery.classList.add("gallery--final");
    const state = Flip.getState(items);
    gallery.classList.remove("gallery--final");

    const flip = Flip.to(state, {
      ease: "expoScale(1, 5)",
      simple: true
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: gallery,
        start: "center center",
        end: "+=100%",
        scrub: true,
        pin: gallery.parentNode
      }
    }).add(flip);
  });
};

createTween();
window.addEventListener("resize", createTween);
