gsap.registerPlugin(ScrollTrigger, Draggable);

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
        duration: 1.5, 
        stagger: 0.2, 
        ease: "power4.out" 
    })
    .from(".hero-subtext .role-tag", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    }, "-=0.5")
    .from(".mission-statement", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out"
    }, "-=0.3")
    .from(".scroll-indicator", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.5");

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

// Old carousel code - commented out as it's replaced by the carousel above
/*
    // ScrollTrigger for scroll-based control
    ScrollTrigger.create({
        trigger: ".gallery",
        start: "top top",
        end: "+=3000",
        pin: true,
        onUpdate(self) {
            scrub.vars.offset = self.progress * seamlessLoop.duration();
            scrub.invalidate().restart();
        }
    });

    // Draggable for mouse/touch control
    const proxy = document.createElement("div");
    let draggable = Draggable.create(proxy, {
        type: "x",
        trigger: ".cards",
        onDrag: function() {
            scrub.vars.offset += -this.deltaX * 0.001;
            scrub.invalidate().restart();
        },
        onDragEnd: function() {
            // Snap to nearest card
            let offset = scrub.vars.offset;
            let snapOffset = Math.round(offset / spacing) * spacing;
            gsap.to(playhead, {
                offset: snapOffset,
                duration: 0.5,
                ease: "power2.out",
                onUpdate: () => seamlessLoop.time(wrapTime(playhead.offset))
            });
        }
    })[0];

    // PREV/NEXT button controls with snapping
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    if (nextBtn) {
        nextBtn.onclick = () => {
            gsap.to(playhead, {
                offset: playhead.offset + spacing,
                duration: 0.5,
                ease: "power2.out",
                onUpdate: () => seamlessLoop.time(wrapTime(playhead.offset))
            });
        };
    }

    if (prevBtn) {
        prevBtn.onclick = () => {
            gsap.to(playhead, {
                offset: playhead.offset - spacing,
                duration: 0.5,
                ease: "power2.out",
                onUpdate: () => seamlessLoop.time(wrapTime(playhead.offset))
            });
        };
    }
}
*/

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
});

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
            color: '#fff',
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

// === AMD SLINGSHOT-LEVEL ENHANCEMENTS ===

// 1. SMOOTH SCROLL WITH MOMENTUM (Disabled for compatibility - using native smooth scroll)
// Note: Advanced smooth scrolling can interfere with ScrollTrigger
// Using CSS smooth-scroll-behavior instead for better compatibility

// 2. MAGNETIC BUTTON EFFECT
(function initMagneticButtons() {
    const buttons = document.querySelectorAll('.cta-btn, .nav-item');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
})();

// 3. PARALLAX BACKGROUND ELEMENTS (Subtle, non-conflicting)
(function initParallax() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Parallax grid background only
        gsap.to('.bg-grid', {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
})();

// 4. TEXT REVEAL ON SCROLL (Character-by-character animation)
(function initTextReveal() {
    if (typeof gsap !== 'undefined') {
        // Only apply to section headings, not all headings
        const headings = document.querySelectorAll('.section-label, .about-sec h3, #education h3, #experience h3');
        
        headings.forEach(heading => {
            // Skip if already has children elements or is in hero
            if (heading.children.length > 0 || heading.closest('.hero')) return;
            
            const text = heading.textContent;
            const wordsArray = text.split(' ');
            heading.innerHTML = '';
            
            // Split into words instead of characters for better readability
            wordsArray.forEach((word, i) => {
                const wordSpan = document.createElement('span');
                wordSpan.textContent = word;
                wordSpan.style.display = 'inline-block';
                wordSpan.style.opacity = '0';
                wordSpan.style.transform = 'translateY(20px)';
                wordSpan.style.marginRight = '0.3em';
                heading.appendChild(wordSpan);
            });
            
            // Animate words
            const wordSpans = heading.querySelectorAll('span');
            gsap.to(wordSpans, {
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: 'power3.out'
            });
        });
    }
})();

// 5. FLOATING ANIMATION FOR CARDS (Subtle hover-based)
(function initFloatingCards() {
    if (typeof gsap !== 'undefined') {
        // Only apply subtle floating on hover to avoid conflicts with scroll animations
        document.querySelectorAll('.flip-card, .cert-card, .achievement-card').forEach((card) => {
            card.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    y: -10,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        });
    }
})();

// 6. ENHANCED CUSTOM CURSOR WITH MAGNETIC EFFECT
(function enhanceCursor() {
    const cursor = document.querySelector("#custom-cursor");
    if (!cursor) return;
    
    // Add magnetic effect to interactive elements
    const magneticElements = document.querySelectorAll('a, button, .skill-badge, .flip-card');
    
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                scale: 2.5,
                backgroundColor: 'rgba(0, 255, 204, 0.3)',
                duration: 0.3
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: 'var(--accent)',
                duration: 0.3
            });
        });
    });
})();

// 7. IMAGE REVEAL ANIMATIONS (Mask effect)
(function initImageReveal() {
    if (typeof gsap !== 'undefined') {
        const images = document.querySelectorAll('.flip-card-front img, .cert-card img');
        
        images.forEach(img => {
            // Wrap image in container if not already wrapped
            if (!img.parentElement.classList.contains('img-reveal-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'img-reveal-wrapper';
                wrapper.style.overflow = 'hidden';
                wrapper.style.position = 'relative';
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
                
                // Create reveal overlay
                const overlay = document.createElement('div');
                overlay.className = 'img-reveal-overlay';
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.background = 'var(--bg)';
                overlay.style.transformOrigin = 'left';
                wrapper.appendChild(overlay);
                
                // Animate on scroll
                gsap.to(overlay, {
                    scrollTrigger: {
                        trigger: wrapper,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    scaleX: 0,
                    duration: 1,
                    ease: 'power4.inOut'
                });
                
                gsap.from(img, {
                    scrollTrigger: {
                        trigger: wrapper,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    scale: 1.3,
                    duration: 1,
                    ease: 'power4.out'
                });
            }
        });
    }
})();

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
    });
})();
