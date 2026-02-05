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

/* 
========================================
3. INFINITE FEATURED PROJECTS STRIP
========================================

PURPOSE: Seamless infinite horizontal scroll of featured projects

ARCHITECTURE DECISION:
- Separated from Bento grid to maintain distinct interaction models
- Uses GSAP repeat:-1 for infinite loop
- DOM cloning ensures no visual jump
- Auto-scrolls with pause on hover

IMPLEMENTATION DETAILS:
- Clones featured items for seamless loop
- Uses transform: translateX for GPU acceleration
- Respects prefers-reduced-motion
- Auto-scroll pauses on hover/focus

PERFORMANCE:
- Hardware-accelerated via transform
- Minimal DOM manipulation
- Efficient animation loop
*/

(function initFeaturedStrip() {
    const track = document.querySelector('.featured-track');
    
    // Exit if featured strip doesn't exist (graceful degradation)
    if (!track) return;
    
    const items = Array.from(track.children);
    
    // Clone items for seamless infinite loop
    // Need enough clones to prevent visual gap during loop
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
    
    // Calculate total width for animation
    const itemWidth = 350 + 30; // item width + gap
    const totalWidth = itemWidth * items.length;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        // Create seamless infinite animation
        // Duration: slower = more professional (30s for smooth viewing)
        const animation = gsap.to(track, {
            x: -totalWidth,
            duration: 30,
            ease: 'none',
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
            }
        });
        
        // Pause on hover for better UX
        track.addEventListener('mouseenter', () => animation.pause());
        track.addEventListener('mouseleave', () => animation.play());
        
        // Pause when user tabs into strip (accessibility)
        track.addEventListener('focusin', () => animation.pause());
        track.addEventListener('focusout', () => animation.play());
    }
    
    // Click handler: scroll to corresponding Bento tile
    document.querySelectorAll('.featured-item').forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.dataset.project;
            const bentoTile = document.querySelector(`[data-project="${projectId}"]`);
            if (bentoTile && bentoTile.classList.contains('bento-tile')) {
                bentoTile.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                
                // Brief highlight effect
                gsap.to(bentoTile, {
                    scale: 1.05,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
            }
        });
    });
})();

/* 
========================================
4. BENTO GRID INTERACTIONS
========================================

PURPOSE: Enhanced hover and scroll animations for Bento tiles

ARCHITECTURE:
- Spatial, hover-based interaction (not motion-based)
- Scroll-triggered reveal animations
- Premium depth effects
- Mobile-friendly adaptations

IMPLEMENTATION:
- GSAP ScrollTrigger for reveal animations
- Transform-based hover effects
- Staggered tile appearances
- Responsive behavior

WHY SEPARATED FROM INFINITE STRIP:
- Different interaction paradigms
- Bento = static spatial exploration
- Infinite = linear continuous motion
- Mixing them would confuse users
*/

(function initBentoGrid() {
    const bentoTiles = gsap.utils.toArray('.bento-tile');
    
    if (bentoTiles.length === 0) return;
    
    // Initial state: tiles start slightly scaled down and transparent
    gsap.set(bentoTiles, { 
        opacity: 0, 
        scale: 0.9,
        y: 30
    });
    
    // Scroll-triggered staggered reveal
    ScrollTrigger.batch(bentoTiles, {
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            overwrite: true
        }),
        start: 'top 85%',
        once: true
    });
    
    // Mobile: Toggle overlay on tap (enhance accessibility)
    if (window.innerWidth < 768) {
        bentoTiles.forEach(tile => {
            tile.addEventListener('click', function(e) {
                // Don't interfere with link clicks
                if (e.target.tagName === 'A') return;
                
                // Toggle expanded state
                this.classList.toggle('expanded');
            });
        });
    }
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

// KEYBOARD NAVIGATION - removed old carousel nav

// LAZY LOAD IMAGES - removed old carousel image loading

// Old carousel click handlers - removed

// Old flip card interactions - removed (replaced by Bento grid)

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

// Old flip card initialization removed
