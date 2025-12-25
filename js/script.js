// Animate skill bars
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width');
    });
});
