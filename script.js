// Animate skill bars
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width');
    });
});

// Dark/Light mode toggle
document.querySelector('.toggle-btn').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const btn = document.querySelector('.toggle-btn');
    btn.textContent = document.body.classList.contains('light-mode') ? 'Dark Mode' : 'Light Mode';
});

// Project filtering
function filterProjects(category){
    const buttons = document.querySelectorAll('.filter-btns button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    document.querySelectorAll('.project-card').forEach(card => {
        if(category === 'all' || card.getAttribute('data-category') === category){
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
