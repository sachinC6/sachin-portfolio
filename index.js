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
        const projectId = `project-card-${index + 1}`;
        const targetCard = document.getElementById(projectId);
        if (targetCard) {
            targetCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            // Highlight effect
            targetCard.classList.add('highlighted');
            setTimeout(() => {
                targetCard.classList.remove('highlighted');
            }, 1000);
        }
    });
});

// ============================================
// FLIP CARD MOBILE INTERACTION
// ============================================

// Initialize flip cards on mobile
function initFlipCards() {
    // Only apply click-to-flip on mobile devices
    if (window.innerWidth < 768) {
        const flipCards = document.querySelectorAll('.flip-card');
        
        flipCards.forEach(card => {
            // Remove existing event listener if any
            card.removeEventListener('click', toggleFlip);
            // Add click event listener
            card.addEventListener('click', toggleFlip);
        });
    } else {
        // Remove flipped class on desktop (uses hover instead)
        const flipCards = document.querySelectorAll('.flip-card');
        flipCards.forEach(card => {
            card.classList.remove('flipped');
            card.removeEventListener('click', toggleFlip);
        });
    }
}

// Toggle flip state
function toggleFlip() {
    this.classList.toggle('flipped');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initFlipCards);

// Re-initialize on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initFlipCards();
    }, 250);
});

