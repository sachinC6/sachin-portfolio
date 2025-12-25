gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Hero text animation
gsap.from(".hero-title", {
  opacity: 0,
  y: -40,
  duration: 1
});

gsap.from(".hero-subtitle", {
  opacity: 0,
  y: 30,
  duration: 1,
  delay: 0.5
});

// Section reveal
gsap.utils.toArray(".section").forEach(section => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1
  });
});

// Skill bars animation
gsap.utils.toArray(".fill").forEach(bar => {
  const width = bar.getAttribute("data-width");
  gsap.to(bar, {
    width: width,
    scrollTrigger: {
      trigger: bar,
      start: "top 85%",
    },
    duration: 1.5,
    ease: "power2.out"
  });
});

// SVG rotation animation
gsap.to(".project-svg circle", {
  rotation: 360,
  transformOrigin: "50% 50%",
  repeat: -1,
  duration: 6,
  ease: "linear"
});
