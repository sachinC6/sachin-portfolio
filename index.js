gsap.registerPlugin(ScrollTrigger, Draggable);

// 1. CUSTOM CURSOR
const cursor = document.querySelector("#custom-cursor");
const blur = document.querySelector("#cursor-blur");
window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(blur, { x: e.clientX - 100, y: e.clientY - 100, duration: 0.3 });
});

// 2. HERO REVEAL
gsap.to(".reveal-text", { filter: "blur(0px)", opacity: 1, duration: 2, stagger: 0.3, ease: "power4.out" });

// 3. IMPROVED INFINITE SLIDER LOGIC
let iteration = 0;
const spacing = 0.15, cards = gsap.utils.toArray('.cards li');
gsap.set('.cards li', { xPercent: 400, opacity: 0, scale: 0 });

const animateFunc = element => {
    return gsap.timeline()
      .fromTo(element, 
        { scale: 0.5, opacity: 0, rotationY: -45 }, 
        { scale: 1, opacity: 1, rotationY: 0, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power2.inOut", immediateRender: false }
      )
      .fromTo(element, { xPercent: 450 }, { xPercent: -450, duration: 1, ease: "none", immediateRender: false }, 0);
};

const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
const playhead = { offset: 0 }, wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());
const scrub = gsap.to(playhead, {
    offset: 0, onUpdate() { 
        seamlessLoop.time(wrapTime(playhead.offset)); 
        // Dynamic Filter Audit: Highlight center card
        cards.forEach(card => {
            const x = gsap.getProperty(card, "xPercent");
            if (Math.abs(x) < 50) {
                gsap.to(card, { filter: "grayscale(0) brightness(1)", scale: 1.1, duration: 0.3 });
            } else {
                gsap.to(card, { filter: "grayscale(1) brightness(0.5)", scale: 1, duration: 0.3 });
            }
        });
    },
    duration: 0.5, ease: "power3", paused: true
});

const sliderTrigger = ScrollTrigger.create({
    trigger: ".gallery", start: "top top", end: "+=3000", pin: true,
    onUpdate(self) {
        scrub.vars.offset = (iteration + self.progress) * seamlessLoop.duration();
        scrub.invalidate().restart();
    }
});

// BUILDER
function buildSeamlessLoop(items, spacing, animateFunc) {
    let overlap = Math.ceil(1 / spacing),
        startTime = items.length * spacing + 0.5,
        loopTime = (items.length + overlap) * spacing + 1,
        rawSequence = gsap.timeline({paused: true}),
        seamlessLoop = gsap.timeline({paused: true, repeat: -1});
    for (let i = 0; i < items.length + overlap * 2; i++) {
        rawSequence.add(animateFunc(items[i % items.length]), i * spacing);
    }
    rawSequence.time(startTime);
    seamlessLoop.to(rawSequence, {time: loopTime, duration: loopTime - startTime, ease: "none"})
                .fromTo(rawSequence, {time: overlap * spacing + 1}, {time: startTime, duration: startTime - (overlap * spacing + 1), immediateRender: false, ease: "none"});
    return seamlessLoop;
}

// Nav
document.querySelector(".next").onclick = () => gsap.to(playhead, {offset: playhead.offset + spacing, duration: 0.6, ease: "expo.out", onUpdate: () => seamlessLoop.time(wrapTime(playhead.offset))});
document.querySelector(".prev").onclick = () => gsap.to(playhead, {offset: playhead.offset - spacing, duration: 0.6, ease: "expo.out", onUpdate: () => seamlessLoop.time(wrapTime(playhead.offset))});

// 4. CLICK RIPPLE (DO NOT REMOVE)
window.addEventListener("mousedown", () => gsap.to(cursor, { scale: 2, duration: 0.2, yoyo: true, repeat: 1 }));




// Click Ripple Effect for Contact Card
const contactBox = document.querySelector("#contact-trigger");

contactBox.addEventListener("click", function(e) {
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
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
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

// KEYBOARD NAVIGATION
document.addEventListener('keydown', (e) => {
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    
    if (e.key === 'ArrowRight' && nextBtn) {
        nextBtn.click();
    } else if (e.key === 'ArrowLeft' && prevBtn) {
        prevBtn.click();
    }
});

// LAZY LOAD IMAGES
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('.cards li').forEach(img => {
        imageObserver.observe(img);
    });
}

// PROJECT CAROUSEL CLICK TO SCROLL
document.querySelectorAll('.cards li').forEach((card, index) => {
    card.addEventListener('click', () => {
        const projectId = `project-${index + 1}`;
        const targetCard = document.getElementById(projectId);
        if (targetCard) {
            targetCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            // Highlight effect
            targetCard.style.transform = 'scale(1.05)';
            targetCard.style.borderColor = 'var(--accent)';
            
            // Remove highlight after 2 seconds
            setTimeout(() => {
                targetCard.style.transform = 'scale(1)';
                targetCard.style.borderColor = 'rgba(255,255,255,0.08)';
            }, 2000);
        }
    });
});

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
// FIX: Centralized configuration for easy tuning
/* Reason: All animation values in one place for maintainability */
const BENTO_CONFIG = {
    ROTATION_SENSITIVITY: 20, // Controls 3D tilt responsiveness
    REVEAL_DURATION: 0.8,     // Card reveal animation duration
    STAGGER_DELAY: 0.1,       // Delay between each card animation
    ENABLE_MOBILE_ANIMATIONS: false // Disable heavy animations on mobile
};

// FIX: Check for reduced motion preference
/* Reason: Accessibility - respect user's motion preferences */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// FIX: Single optimized animation system
/* Reason: Avoid multiple ScrollTriggers per card, combine into one timeline */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    const isMobile = window.innerWidth <= 768;
    
    // FIX: Single timeline per card instead of multiple triggers
    /* Reason: Better performance, easier to manage, prevents conflicts */
    gsap.utils.toArray('.flip-card').forEach((card, index) => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 65%',
                toggleActions: 'play none none reverse',
            }
        });
        
        // Reveal animation
        timeline.from(card, {
            y: 60,
            opacity: 0,
            scale: 0.9,
            duration: BENTO_CONFIG.REVEAL_DURATION,
            delay: index * BENTO_CONFIG.STAGGER_DELAY,
            ease: 'power3.out'
        });
    });

    // FIX: 3D tilt on outer wrapper, not inner (desktop only)
    /* Reason: Prevents conflict with flip-card-inner rotateY(180deg) */
    /* Tilt is now on .flip-card wrapper, flip animation stays on .flip-card-inner */
    if (!isMobile && BENTO_CONFIG.ENABLE_MOBILE_ANIMATIONS !== false) {
        document.querySelectorAll('.flip-card').forEach(card => {
            let tiltTimeline = null;
            
            card.addEventListener('mousemove', (e) => {
                // FIX: Don't tilt if card is flipped
                /* Reason: Avoid visual conflict with back-side view */
                const cardInner = card.querySelector('.flip-card-inner');
                const isFlipped = card.classList.contains('flipped');
                
                if (isFlipped) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation based on mouse position and sensitivity
                const rotateX = (y - centerY) / BENTO_CONFIG.ROTATION_SENSITIVITY;
                const rotateY = (centerX - x) / BENTO_CONFIG.ROTATION_SENSITIVITY;
                
                // FIX: Apply tilt to wrapper, keep perspective on card
                /* Reason: Separates tilt from flip transformation */
                if (tiltTimeline) tiltTimeline.kill();
                tiltTimeline = gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    duration: 0.3,
                    ease: 'power2.out',
                    transformPerspective: 1000,
                    transformStyle: 'preserve-3d'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                // Reset tilt
                if (tiltTimeline) tiltTimeline.kill();
                tiltTimeline = gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    }
}

// FIX: Clean up - removed parallax effect
/* Reason: Parallax on .flip-card conflicts with hover lift and tilt */
/* Keeping animations minimal for better performance on low-end devices */

// Stagger reveal for project grid
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
