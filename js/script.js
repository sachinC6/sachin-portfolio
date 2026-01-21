gsap.registerPlugin(ScrollTrigger, TextPlugin, Flip);

/* =========================
   HERO ANIMATION
========================= */
gsap.from(".hero-title", { y: -40, opacity: 0, duration: 1 });
gsap.to(".hero-subtitle", { text: "An enthusiastic learner | Electronics Engineering Student | VLSI Design& Technology", duration: 2, delay: 0.6 });

/* =========================
   SECTIONS SCROLL FADE
========================= */
gsap.utils.toArray(".section").forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 40,
    duration: 1,
    scrollTrigger: { trigger: section, start: "top 85%" }
  });
});

/* =========================
   SKILLS BARS
========================= */
gsap.utils.toArray(".fill").forEach(bar => {
  gsap.to(bar, {
    width: bar.dataset.width,
    duration: 1.5,
    scrollTrigger: { trigger: bar, start: "top 90%" }
  });
});

/* =========================
   BENTO GALLERY FLIP
========================= */
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

    const flip = Flip.to(state, { ease: "expoScale(1,5)", simple: true });

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

/* =========================
   CURSOR TRAIL EMOJIS
========================= */
function playAnimation(shape) {
  let tl = gsap.timeline();
  tl.from(shape, { opacity: 0, scale: 0, ease: "elastic.out(1,0.3)" })
    .to(shape, { rotation: "random([-360, 360])" }, "<")
    .to(shape, { y: "120vh", ease: "back.in(.4)", duration: 1 }, 0);
}

let flair = gsap.utils.toArray(".flair");
let gap = 100;
let index = 0;
let wrapper = gsap.utils.wrap(0, flair.length);
gsap.defaults({ duration: 1});

let mousePos = { x: 0, y: 0 };
let lastMousePos = mousePos;

window.addEventListener("mousemove", e => { mousePos = { x: e.x, y: e.y }; });

gsap.ticker.add(ImageTrail);

function ImageTrail() {
  let travelDistance = Math.hypot(lastMousePos.x - mousePos.x, lastMousePos.y - mousePos.y);
  if (travelDistance > gap) { animateImage(); lastMousePos = mousePos; }
}

function animateImage() {
  let wrappedIndex = wrapper(index);
  let shape = flair[wrappedIndex];
  gsap.killTweensOf(shape);

  gsap.set(shape, { opacity: 1, left: mousePos.x, top: mousePos.y });
  playAnimation(shape);
  index++;
}
