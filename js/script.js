// Animate skill bars
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => {
            bar.style.width = bar.getAttribute('data-width');
        }, 300);
    });
});

// Dark/Light mode toggle
document.querySelector('.toggle-btn').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const btn = document.querySelector('.toggle-btn');
    btn.textContent = document.body.classList.contains('light-mode') ? 'Dark Mode' : 'Light Mode';
});
