// Animate skill bars with GSAP
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('.skill-fill').forEach(bar => {
    gsap.fromTo(bar, 
        {width: "0%"}, 
        {
            width: bar.getAttribute('data-width'), 
            duration: 1.5, 
            scrollTrigger: {
                trigger: bar,
                start: "top 80%",
            }
        });
});

// Animate sections on scroll
gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
        }
    });
});

// Dark/Light mode toggle
document.querySelector('.toggle-btn').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const btn = document.querySelector('.toggle-btn');
    btn.textContent = document.body.classList.contains('light-mode') ? 'Dark Mode' : 'Light Mode';
});
