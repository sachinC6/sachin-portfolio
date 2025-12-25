gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Typing animation
gsap.to(".hero-subtitle", {
  text: "Electronics Engineering Student | VLSI Design",
  duration: 2,
  delay: 0.5
});

// Section fade-in
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

// Skill bars
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
