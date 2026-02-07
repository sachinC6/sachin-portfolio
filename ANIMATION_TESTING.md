# Animation Testing & Validation Guide

## Quick Start Testing

### Local Development Server

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

---

## Animation Checklist

### ✅ Page Load Animations (0-3s)

1. **Preloader** (0-1.5s)
   - [ ] Spinning cyan ring appears
   - [ ] "INITIALIZING" text with animated dots
   - [ ] Smooth fade-out at 1.5s
   - [ ] Main content fades in after preloader

2. **Hero Section** (0.5-3s)
   - [ ] "Sachin" heading reveals with blur → clear
   - [ ] "Chandra" heading reveals 0.2s after first
   - [ ] Role tags fade up with stagger
   - [ ] Mission statement fades in
   - [ ] Scroll indicator appears with bounce

**Expected Result**: Smooth sequential reveal, no jumps, professional timing

---

### ✅ Navigation Animations

#### Navbar Scroll Effect
1. Scroll down 100+ pixels
   - [ ] Background darkens and blurs more
   - [ ] Padding reduces smoothly
   - [ ] Cyan glow shadow appears
   - [ ] Border color changes to cyan

2. Scroll back to top
   - [ ] Effects reverse smoothly
   - [ ] Original state restored

#### Nav Links
1. Hover over "About", "Projects", etc.
   - [ ] Text color changes to cyan
   - [ ] Slight scale up (1.05x)
   - [ ] Smooth transition (0.3s)

#### Mobile Menu (resize to < 768px)
1. Click hamburger icon
   - [ ] Menu slides in from right
   - [ ] Hamburger transforms to X
   - [ ] Menu items are visible

2. Click nav link
   - [ ] Menu closes
   - [ ] Hamburger returns to normal

**Expected Result**: Buttery smooth, no lag, responsive

---

### ✅ Scroll-Based Reveal Animations

#### Section Entrance
1. Scroll to "About" section
   - [ ] Content fades up from 60px below
   - [ ] Smooth 1s animation
   - [ ] Triggers at 80% viewport

2. Scroll to "Education" section
   - [ ] Same fade-up behavior
   - [ ] Timeline items visible

3. Repeat for all sections:
   - [ ] Experience
   - [ ] Certifications
   - [ ] Achievements
   - [ ] Projects

**Expected Result**: Consistent reveal across all sections

---

### ✅ Skill Badges Animation

1. Scroll to skills section
   - [ ] Badges appear with stagger effect
   - [ ] Each badge scales from 0.8 to 1
   - [ ] Bounce effect (back.out easing)
   - [ ] 0.05s delay between badges

2. Hover over a skill badge
   - [ ] Lifts up 3px
   - [ ] Scales to 1.05
   - [ ] Cyan glow appears
   - [ ] Ripple effect from center

**Expected Result**: Playful, bouncy entrance; elegant hover

---

### ✅ Timeline Animations

#### Education & Experience
1. Scroll to timeline
   - [ ] Markers pulse with glow
   - [ ] Items slide in from left
   - [ ] 0.2s stagger between items
   - [ ] Timeline line gradient visible

2. Hover over timeline item
   - [ ] Cyan accent bar grows from left
   - [ ] Card slides right 8px
   - [ ] Shadow appears
   - [ ] Border changes to cyan

**Expected Result**: Professional timeline with smooth interactions

---

### ✅ Certification Cards

1. Scroll to certifications
   - [ ] Cards fade up with scale
   - [ ] 0.1s stagger between cards
   - [ ] Floating icon animation

2. Hover over a card
   - [ ] Lifts up 8px
   - [ ] Scales to 1.02
   - [ ] Radial cyan glow appears
   - [ ] Enhanced shadow

**Expected Result**: Premium card effect with depth

---

### ✅ Achievement Cards

1. Scroll to achievements
   - [ ] Cards slide in from left
   - [ ] 0.15s stagger
   - [ ] Icons visible

2. Hover over achievement
   - [ ] Slides right 8px
   - [ ] Scales slightly
   - [ ] Cyan bar animates from left edge
   - [ ] Shadow appears

**Expected Result**: Directional motion that guides eye

---

### ✅ Project Cards (Bento Gallery)

#### On Scroll
1. Scroll to projects section
   - [ ] Cards fade up with scale
   - [ ] Stagger effect (0.1s)
   - [ ] Grid layout visible

#### On Hover (Desktop)
1. Hover over a project card
   - [ ] Card lifts up 8px
   - [ ] Scales to 1.02
   - [ ] Cyan glow shadow appears
   - [ ] Gradient overlay fades in

2. Keep hovering
   - [ ] Image zooms to 1.08x
   - [ ] Brightness increases
   - [ ] Title lifts and letter-spacing increases

3. Move mouse around card
   - [ ] 3D tilt follows cursor
   - [ ] Smooth rotation (0.3s)
   - [ ] Perspective effect visible

4. Move mouse away
   - [ ] Card returns to flat
   - [ ] Smooth reset (0.5s)

5. Hover to flip (Desktop)
   - [ ] Card rotates 180° on Y-axis
   - [ ] Back side reveals
   - [ ] Details are readable

#### On Mobile (< 768px)
1. Tap a project card
   - [ ] Card flips to show back
   - [ ] Tap again flips back
   - [ ] No 3D tilt (disabled for performance)

**Expected Result**: Smooth, premium card interactions

---

### ✅ Button Interactions

#### CTA Buttons ("Contact")
1. Hover over button
   - [ ] Background slides in from left
   - [ ] Text color changes to black
   - [ ] Cyan glow appears
   - [ ] Button lifts 2px
   - [ ] Scale increases to 1.05

2. Click button
   - [ ] Scales down to 0.95
   - [ ] Springs back to 1.05
   - [ ] Smooth feedback

**Expected Result**: Satisfying click feedback

---

### ✅ Custom Cursor

1. Move mouse around page
   - [ ] Small cyan dot follows instantly
   - [ ] Large blur follows with delay
   - [ ] Smooth motion

2. Click anywhere
   - [ ] Cursor scales to 2x
   - [ ] Returns to normal
   - [ ] Quick animation (0.2s)

**Expected Result**: Elegant cursor tracking

---

### ✅ Scroll Indicator

1. Look at hero section bottom
   - [ ] "Scroll to Navigate" text visible
   - [ ] Down arrow (↓) visible
   - [ ] Bounces continuously
   - [ ] Arrow pulses with fade

**Expected Result**: Inviting scroll animation

---

### ✅ Role Tags (Hero Section)

1. Hover over "VLSI Engineer"
   - [ ] Background slides in from left
   - [ ] Text turns black
   - [ ] Tag lifts 4px
   - [ ] Scales to 1.05
   - [ ] Cyan glow shadow

2. Repeat for other tags
   - [ ] "Embedded Systems"
   - [ ] "FPGA Developer"

**Expected Result**: Interactive hero elements

---

## Performance Testing

### Frame Rate Check

**Chrome DevTools**:
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Scroll through page
5. Stop recording

**Check for**:
- [ ] Consistent 60 FPS
- [ ] No dropped frames
- [ ] No layout thrashing
- [ ] GPU acceleration active

### Memory Usage
1. Scroll through entire page
2. Check memory usage
   - [ ] Should stay < 100MB
   - [ ] No memory leaks

### Network
- [ ] GSAP loads from CDN
- [ ] No 404 errors
- [ ] Images load properly

---

## Browser Testing

### Desktop

#### Chrome
- [ ] All animations work
- [ ] Custom cursor works
- [ ] 3D tilt works
- [ ] Smooth scrolling

#### Firefox
- [ ] All animations work
- [ ] backdrop-filter supported
- [ ] Performance good

#### Safari
- [ ] All animations work
- [ ] Webkit prefixes work
- [ ] No visual glitches

#### Edge
- [ ] All animations work
- [ ] Chromium-based, same as Chrome

### Mobile

#### iOS Safari
- [ ] Touch works
- [ ] Flip cards work (tap)
- [ ] No 3D tilt (disabled)
- [ ] Smooth performance

#### Chrome Mobile
- [ ] Touch works
- [ ] Animations smooth
- [ ] No lag

---

## Accessibility Testing

### Reduced Motion
1. Enable "Reduce Motion" in OS settings
   - [ ] Animations simplified or removed
   - [ ] No jarring movements
   - [ ] Content still accessible

### Keyboard Navigation
1. Tab through page
   - [ ] All links focusable
   - [ ] Focus indicators visible
   - [ ] Logical tab order

### Screen Reader
1. Use screen reader (NVDA/JAWS)
   - [ ] Content is readable
   - [ ] Images have alt text
   - [ ] Structure is logical

---

## Edge Cases

### Very Slow Connection
1. Simulate slow 3G
   - [ ] Preloader shows during load
   - [ ] Graceful degradation if GSAP doesn't load
   - [ ] Content still readable

### Large Viewport (4K)
- [ ] Layout doesn't break
- [ ] Animations scale properly
- [ ] Text readable

### Small Viewport (320px)
- [ ] Mobile menu works
- [ ] Cards stack properly
- [ ] Text doesn't overflow

---

## Debugging

### GSAP Not Loading
```javascript
// Check in console
console.log(typeof gsap); // Should be "object"
console.log(typeof ScrollTrigger); // Should be "object"
```

### Animation Not Triggering
```javascript
// Enable ScrollTrigger markers
ScrollTrigger.create({
    markers: true, // Shows trigger points
    // ... rest of config
});
```

### Performance Issues
```javascript
// Check FPS
const fps = new Stats();
document.body.appendChild(fps.dom);
```

---

## Expected Behavior Summary

| Element | Animation Type | Duration | Easing |
|---------|---------------|----------|--------|
| Preloader | Fade out | 0.5s | ease |
| Hero text | Blur reveal | 1.5s | power4.out |
| Role tags | Fade up | 0.8s | power3.out |
| Sections | Fade up | 1s | power3.out |
| Cards | Hover lift | 0.4s | cubic-bezier |
| Buttons | Scale feedback | 0.2s | power2.out |
| Cursor | Follow | 0.1s | none |
| Scroll indicator | Bounce | 2s | ease-in-out |

---

## Common Issues & Fixes

### Issue: Animations too fast
**Fix**: Increase duration values in GSAP

### Issue: Stagger too slow
**Fix**: Reduce stagger value (0.15s → 0.1s)

### Issue: Hover jittery
**Fix**: Ensure will-change is not overused

### Issue: Mobile lag
**Fix**: Disable 3D effects on mobile

### Issue: Scroll jumpy
**Fix**: Add `scroll-behavior: smooth` to CSS

---

## Sign-Off Checklist

Before deployment:
- [ ] All page load animations tested
- [ ] All scroll reveals tested
- [ ] All hover effects tested
- [ ] Mobile tested
- [ ] Desktop tested
- [ ] Performance is 60 FPS
- [ ] No console errors
- [ ] Reduced motion works
- [ ] Cross-browser tested
- [ ] Accessibility checked

---

**Testing Status**: Ready for QA ✅
**Last Updated**: 2026-02-07
**Tested By**: Development Team
