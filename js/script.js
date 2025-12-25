gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Hero typing
gsap.to(".hero-subtitle", {
  text: "Electronics Engineering Student | VLSI Design & Technology",
  duration: 2,
  delay: 0.8
});

// Section animation
gsap.utils.toArray(".section").forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: "top 80%"
    }
  });
});

// Skill bars
gsap.utils.toArray(".fill").forEach(bar => {
  gsap.to(bar, {
    width: bar.dataset.width,
    duration: 1.5,
    scrollTrigger: {
      trigger: bar,
      start: "top 85%"
    }
  });
});

// SVG rotation
gsap.to(".project-svg circle", {
  rotation: 360,
  transformOrigin: "50% 50%",
  repeat: -1,
  duration: 8,
  ease: "linear"
});
