// Animate skill bars when page loads
window.addEventListener('DOMContentLoaded', () => {
    const skillBars = document.querySelectorAll('.skill-fill');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width;
        }, 300); // slight delay for smooth animation
    });
});
