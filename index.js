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

// 3. PROJECT CAROUSEL - MODULAR ROTATION SYSTEM
(function setupCarousel() {
    const slides = Array.from(document.querySelectorAll('.cards li'));
    if (!slides.length) return;
    
    const CONFIG = {
        slideCount: slides.length,
        intervalSize: 0.15,
        viewportPin: 3000,
        mouseMultiplier: 0.0008
    };
    
    // Setup initial positions
    slides.forEach(item => {
        gsap.set(item, { x: '400%', opacity: 0, scale: 0.3 });
    });
    
    // Individual slide animation generator
    function generateSlideMotion(element) {
        const tween = gsap.timeline();
        tween.to(element, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)'
        }).to(element, {
            x: '-400%',
            duration: 0.8,
            ease: 'linear'
        }, 0.2);
        return tween;
    }
    
    // Circular sequence builder using modular indexing
    function assembleLoopSequence() {
        const master = gsap.timeline({ paused: true });
        const wrapper = gsap.timeline({
            paused: true,
            repeat: -1,
            onRepeat: function() {
                // Prevent timeline jump at loop boundary using public API
                const currentTime = this.time();
                const totalDuration = this.duration();
                if (currentTime >= totalDuration - 0.001) {
                    this.totalTime(this.totalTime() + totalDuration - 0.002);
                }
            }
        });
        
        // Build extended sequence with wraparound
        const extended = CONFIG.slideCount * 3;
        for (let i = 0; i < extended; i++) {
            const slideIdx = i % CONFIG.slideCount;
            master.add(generateSlideMotion(slides[slideIdx]), i * CONFIG.intervalSize);
        }
        
        const startPoint = CONFIG.slideCount * CONFIG.intervalSize;
        const endPoint = CONFIG.slideCount * CONFIG.intervalSize * 2;
        
        wrapper.fromTo(master, 
            { time: startPoint },
            { time: endPoint, duration: endPoint - startPoint, ease: 'none' }
        );
        
        return wrapper;
    }
    
    const loopController = assembleLoopSequence();
    const snapToInterval = gsap.utils.snap(CONFIG.intervalSize);
    
    // Shared drag calculation logic
    function calculateDragPosition(deltaX) {
        const shift = deltaX * CONFIG.mouseMultiplier;
        return snapToInterval(loopController.time() - shift);
    }
    
    // Scroll integration with pinning
    ScrollTrigger.create({
        trigger: '.gallery-wrapper',
        start: 'top top',
        end: `+=${CONFIG.viewportPin}`,
        pin: true,
        scrub: 1,
        onUpdate: function(instance) {
            const advancement = instance.progress * loopController.duration();
            loopController.time(snapToInterval(advancement));
        }
    });
    
    // Drag interaction handler
    Draggable.create('.gallery-wrapper', {
        type: 'x',
        inertia: true,
        onDrag: function() {
            loopController.time(calculateDragPosition(this.deltaX));
        },
        onThrowUpdate: function() {
            loopController.time(calculateDragPosition(this.deltaX));
        }
    });
})();

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

// KEYBOARD NAVIGATION - DISABLED FOR BENTO LAYOUT
/* CAROUSEL CONVERSION NOTE: Keyboard navigation for carousel disabled */
// document.addEventListener('keydown', (e) => {
//     const nextBtn = document.querySelector('.next');
//     const prevBtn = document.querySelector('.prev');
//     
//     if (e.key === 'ArrowRight' && nextBtn) {
//         nextBtn.click();
//     } else if (e.key === 'ArrowLeft' && prevBtn) {
//         prevBtn.click();
//     }
// });

// LAZY LOAD IMAGES - DISABLED FOR CAROUSEL (carousel hidden)
/* CAROUSEL CONVERSION NOTE: Lazy loading for carousel cards disabled since carousel is hidden */
// if ('IntersectionObserver' in window) {
//     const imageObserver = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const img = entry.target;
//                 img.style.opacity = '1';
//                 imageObserver.unobserve(img);
//             }
//         });
//     });
//     
//     document.querySelectorAll('.cards li').forEach(img => {
//         imageObserver.observe(img);
//     });
// }

// PROJECT CAROUSEL CLICK TO SCROLL - DISABLED FOR BENTO LAYOUT
/* CAROUSEL CONVERSION NOTE: Carousel click-to-scroll disabled - projects now in Bento grid */
// document.querySelectorAll('.cards li').forEach((card, index) => {
//     card.addEventListener('click', () => {
//         const projectId = `project-${index + 1}`;
//         const targetCard = document.getElementById(projectId);
//         if (targetCard) {
//             targetCard.scrollIntoView({ 
//                 behavior: 'smooth', 
//                 block: 'center' 
//             });
//             // Highlight effect
//             targetCard.style.transform = 'scale(1.05)';
//             targetCard.style.borderColor = 'var(--accent)';
//             
//             // Remove highlight after 2 seconds
//             setTimeout(() => {
//                 targetCard.style.transform = 'scale(1)';
//                 targetCard.style.borderColor = 'rgba(255,255,255,0.08)';
//             }, 2000);
//         }
//     });
// });

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
/* 
 * BENTO LAYOUT ANIMATIONS:
 * - Replaces carousel rotation with simultaneous tile display
 * - Scroll-based reveal with stagger effect
 * - 3D tilt on hover (desktop only)
 * - All projects visible at once in a grid
 * 
 * NOTE: Parallax scroll effect removed to avoid transform conflicts with hover lift and tilt
 */

// Configuration for easy tuning
const BENTO_CONFIG = {
    ROTATION_SENSITIVITY: 20,     // Controls 3D tilt responsiveness
    REVEAL_DURATION: 0.8,         // Card reveal animation duration
    STAGGER_DELAY: 0.1,           // Delay between each card animation
    DISABLE_MOBILE_TILT: true     // Disable tilt on mobile for performance
};

// Check for reduced motion preference (accessibility)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Bento Gallery Animations
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    const isMobile = window.innerWidth <= 768;
    
    // 1. SCROLL-BASED REVEAL ANIMATION
    /* All cards animate in with stagger as user scrolls to projects section */
    gsap.utils.toArray('.flip-card').forEach((card, index) => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 65%',
                toggleActions: 'play none none reverse',
            }
        });
        
        // Reveal animation with fade, lift, and scale
        timeline.from(card, {
            y: 60,
            opacity: 0,
            scale: 0.9,
            duration: BENTO_CONFIG.REVEAL_DURATION,
            delay: index * BENTO_CONFIG.STAGGER_DELAY,
            ease: 'power3.out'
        });
    });

    // 2. SUBTLE PARALLAX SCROLL EFFECT - DISABLED
    /* 
     * REMOVED: Parallax effect was causing transform conflicts with hover lift and 3D tilt
     * Reason: Multiple transforms on same element can override each other
     * For parallax, would need a wrapper element approach
     */
    // gsap.utils.toArray('.flip-card').forEach((card, index) => {
    //     const direction = index % 2 === 0 ? 1 : -1;
    //     gsap.to(card, {
    //         y: direction * BENTO_CONFIG.PARALLAX_AMOUNT,
    //         scrollTrigger: {
    //             trigger: '.projects-grid',
    //             start: 'top bottom',
    //             end: 'bottom top',
    //             scrub: 1,
    //         }
    //     });
    // });

    // 2. 3D TILT ON HOVER (Desktop Only)
    /* Mouse movement creates interactive 3D tilt effect */
    if (!isMobile || !BENTO_CONFIG.DISABLE_MOBILE_TILT) {
        document.querySelectorAll('.flip-card').forEach(card => {
            let tiltTimeline = null;
            
            card.addEventListener('mousemove', (e) => {
                // Don't tilt if card is flipped - early return to avoid unnecessary calculations
                const isFlipped = card.classList.contains('flipped');
                if (isFlipped) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation based on mouse position
                const rotateX = (y - centerY) / BENTO_CONFIG.ROTATION_SENSITIVITY;
                const rotateY = (centerX - x) / BENTO_CONFIG.ROTATION_SENSITIVITY;
                
                // Apply tilt to wrapper (separate from flip transformation)
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
                // Reset tilt smoothly
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
