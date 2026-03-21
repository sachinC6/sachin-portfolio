gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference (accessibility)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. CUSTOM CURSOR
const cursor = document.querySelector("#custom-cursor");
const blur = document.querySelector("#cursor-blur");
window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(blur, { x: e.clientX - 100, y: e.clientY - 100, duration: 0.3 });
});

// 2. HERO REVEAL - Enhanced with staggered content reveal
const heroTimeline = gsap.timeline({ delay: 0.5 });
heroTimeline
    .to(".reveal-text", { 
        filter: "blur(0px)", 
        opacity: 1, 
        y: 0,
        duration: 1, 
        stagger: 0.15, 
        ease: "power4.out" 
    })
    .from(".hero-subtext .role-tag", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
    }, "-=0.4")
    .from(".mission-statement", {
        opacity: 0,
        y: 15,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.3")
    .from(".scroll-indicator", {
        opacity: 0,
        y: 15,
        duration: 0.5,
        ease: "power2.out"
    }, "-=0.3");


// CLICK RIPPLE (DO NOT REMOVE)
window.addEventListener("mousedown", () => gsap.to(cursor, { scale: 2, duration: 0.2, yoyo: true, repeat: 1 }));

// Click Ripple Effect for Contact Card
const contactBox = document.querySelector("#contact-trigger");

if (contactBox) contactBox.addEventListener("click", function(e) {
    const ripple = document.createElement("span");
    this.appendChild(ripple);

    const x = e.clientX - this.getBoundingClientRect().left;
    const y = e.clientY - this.getBoundingClientRect().top;

    gsap.set(ripple, {
        position: "absolute",
        left: x,
        top: y,
        width: 10,
        height: 10,
        background: "rgba(0, 255, 204, 0.4)",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none"
    });

    gsap.to(ripple, {
        scale: 60,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        onComplete: () => ripple.remove()
    });
});

// PRELOADER
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const main = document.getElementById('main');
    
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            
            // Fade in main content after preloader
            if (main) {
                gsap.from(main, {
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out'
                });
            }
        }, 200);
    }
});

// THEME TOGGLE
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const root = document.documentElement;

if (themeToggle && themeIcon) {
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

// === FLIP CARDS MOBILE INTERACTION ===
function initFlipCards() {
    const isMobile = window.innerWidth < 768;
    const flipCards = document.querySelectorAll('.flip-card');
    
    if (isMobile) {
        flipCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Prevent flipping if clicking on links
                if (e.target.tagName === 'A') return;
                
                this.classList.toggle('flipped');
            });
        });
    } else {
        // Remove flipped class on desktop (hover handles it)
        flipCards.forEach(card => {
            card.classList.remove('flipped');
        });
    }
}

// === MOBILE MENU TOGGLE ===
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-item, .cta-btn').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initFlipCards);

// Re-initialize on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initFlipCards, 250);
});

// === NAVBAR SCROLL EFFECT ===
const navbar = document.querySelector('nav');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add background and shadow when scrolled down
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
}, { passive: true });

// === NAV LINK HOVER EFFECTS ===
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('mouseenter', function() {
        gsap.to(this, {
            color: 'var(--accent)',
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    link.addEventListener('mouseleave', function() {
        gsap.to(this, {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#fff',
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// === SCROLL-BASED SECTION ANIMATIONS ===
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    // Animate all sections on scroll
    gsap.utils.toArray('.section').forEach((section, index) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out'
        });
    });
    
    // Animate skill badges
    gsap.utils.toArray('.skill-badge').forEach((badge, index) => {
        gsap.from(badge, {
            scrollTrigger: {
                trigger: badge,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            scale: 0.8,
            y: 20,
            duration: 0.5,
            delay: index * 0.05,
            ease: 'back.out(1.7)'
        });
    });
    
    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            x: -50,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power3.out'
        });
    });
    
    // Animate certification cards
    gsap.utils.toArray('.cert-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });
    
    // Animate achievement cards
    gsap.utils.toArray('.achievement-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            x: -40,
            duration: 0.7,
            delay: index * 0.15,
            ease: 'power3.out'
        });
    });
}

// === BUTTON HOVER EFFECTS ===
document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mousedown', function() {
        gsap.to(this, {
            scale: 0.95,
            duration: 0.1,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseup', function() {
        gsap.to(this, {
            scale: 1.05,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});

// === IMAGE PLACEHOLDER FALLBACK ===
document.addEventListener('DOMContentLoaded', () => {
    const flipCardImages = document.querySelectorAll('.flip-card-front img');
    
    flipCardImages.forEach((img, index) => {
        img.addEventListener('error', function() {
            // Create SVG placeholder
            const projectNum = index + 1;
            const svg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3Crect width='400' height='600' fill='%23111'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='60' fill='%2300ffcc'%3EProject ${projectNum}%3C/text%3E%3C/svg%3E`;
            this.src = svg;
        });
    });
});

// === BENTO GALLERY ENHANCEMENTS ===
/* 
 * BENTO LAYOUT ANIMATIONS:
 * - Replaces carousel rotation with simultaneous tile display
 * - Scroll-based reveal with stagger effect
 * - 3D tilt on hover (desktop only)
 * - All projects visible at once in a grid
 * 
 * NOTE: Parallax scroll effect removed to avoid transform conflicts with hover lift and tilt
 */

// Bento Gallery - scroll-based card reveal
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    gsap.utils.toArray('.flip-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            y: 60,
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
}

// 3. PROJECTS GRID REVEAL
/* Entire grid fades in when scrolled into view */
if (typeof gsap !== 'undefined') {
    gsap.from('.projects-grid', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out'
    });
}

// 8. SCROLL PROGRESS INDICATOR
(function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--accent), #00d4ff);
        z-index: 10000;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });
})();
