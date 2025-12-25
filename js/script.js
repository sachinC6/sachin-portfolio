gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

// Typewriter header
gsap.to("header h1", { duration: 2, text: "Sachin Chandra", ease: "power1.inOut" });

// Scroll animation for sections
gsap.utils.toArray('section').forEach(section => {
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

// Skill bars animation
document.querySelectorAll('.skill-fill').forEach(bar => {
    gsap.fromTo(bar, 
        {width: "0%"}, 
        {width: bar.getAttribute('data-width'), duration: 1.5, scrollTrigger: {
            trigger: bar,
            start: "top 90%"
        }}
    );
});

// Project card hover animation (optional)
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {scale:1.05, duration:0.3});
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {scale:1, duration:0.3});
    });
});

// Dark/Light mode toggle
document.querySelector('.toggle-btn').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const btn = document.querySelector('.toggle-btn');
    btn.textContent = document.body.classList.contains('light-mode') ? 'Dark Mode' : 'Light Mode';
});
