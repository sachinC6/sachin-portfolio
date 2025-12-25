// Animate SVG icon continuously
gsap.to(".project-icon path", {
    strokeDasharray: "150",
    strokeDashoffset: "0",
    repeat: -1,
    yoyo: true,
    duration: 2,
    ease: "power1.inOut"
});

// Animate the circle moving in a small loop using MotionPath
gsap.to(".project-icon circle", {
    motionPath:{
        path: [{x:0, y:0},{x:5, y:-5},{x:0, y:-10},{x:-5, y:-5},{x:0,y:0}],
        autoRotate: true
    },
    repeat: -1,
    yoyo: true,
    duration: 3,
    ease:"power1.inOut"
});
