# GSAP Infinite Card Slider Implementation

## Overview
This implementation provides a professional, infinite card slider based on the official GSAP CodePen demo: "Infinite scrolling, dragging, and snapping cards with GSAP and ScrollTrigger".

## Features Implemented

### ✅ Core Requirements Met

1. **GSAP + ScrollTrigger + Draggable** - All three libraries are integrated
2. **Infinite Looping** - Cards loop seamlessly in both directions
3. **Scroll-based Navigation** - Scrolling advances cards smoothly
4. **Drag Support** - Mouse/touch dragging works on the cards
5. **Snapping** - Cards snap to positions after scroll or drag
6. **buildSeamlessLoop()** - Uses iteration-based looping logic
7. **No Fake Infinity** - Real infinite loop, not CSS marquee
8. **Professional Implementation** - Clean, production-ready code

### Implementation Details

#### HTML Structure
```html
<section class="gallery" id="projects">
    <div class="gallery-header">
        <h2 class="section-label">Projects Showcase</h2>
        <p>Drag or Scroll to Rotate • Click to View Details ↓</p>
    </div>
    <ul class="cards">
        <li style="background-image: url('...')" role="img" aria-label="Project 1"></li>
        <!-- More cards -->
    </ul>
    <div class="actions">
        <button class="prev">PREV</button>
        <div class="divider"></div>
        <button class="next">NEXT</button>
    </div>
</section>
```

#### CSS Positioning
- Gallery section: `min-height: 100vh` with flexbox centering
- Cards container: `position: relative` for absolute card positioning
- Individual cards: `position: absolute` with `will-change: transform, opacity, filter`
- Cursor changes to `grab` on hover, `grabbing` on drag

#### JavaScript Logic

##### buildSeamlessLoop() Function
```javascript
function buildSeamlessLoop(items, spacing, animateFunc) {
    let overlap = Math.ceil(1 / spacing),
        startTime = items.length * spacing + 0.5,
        loopTime = (items.length + overlap) * spacing + 1,
        rawSequence = gsap.timeline({ paused: true }),
        seamlessLoop = gsap.timeline({ paused: true, repeat: -1 });
    
    // Build sequence with overlap for seamless loop
    for (let i = 0; i < items.length + overlap * 2; i++) {
        rawSequence.add(animateFunc(items[i % items.length]), i * spacing);
    }
    
    rawSequence.time(startTime);
    seamlessLoop
        .to(rawSequence, { time: loopTime, duration: loopTime - startTime, ease: "none" })
        .fromTo(rawSequence, 
            { time: overlap * spacing + 1 }, 
            { time: startTime, duration: startTime - (overlap * spacing + 1), immediateRender: false, ease: "none" }
        );
    
    return seamlessLoop;
}
```

##### ScrollTrigger Integration
- Pins the gallery section while scrolling
- Maps scroll progress to timeline position
- Tracks iteration for bi-directional infinite scrolling
- Scrub duration: 0.5s with power3 easing

##### Draggable Integration
- Type: "x" (horizontal drag)
- Trigger: ".cards" element
- onDrag: Updates offset based on delta movement
- onDragEnd: Snaps to nearest card position

##### PREV/NEXT Buttons
- Advance/retreat by one `spacing` unit
- Duration: 0.5s
- Easing: power2.out
- Update playhead offset with smooth animation

## How It Works

### The Seamless Loop Concept

1. **Overlap Calculation**: Creates extra instances of cards before and after the main sequence
2. **Timeline Construction**: Builds a linear timeline of all card animations
3. **Loop Creation**: Creates an infinite timeline that plays forward then jumps back seamlessly
4. **Time Wrapping**: Uses `gsap.utils.wrap()` to keep time values within valid range

### Animation Flow

1. Cards initialize off-screen (`xPercent: 400, opacity: 0, scale: 0`)
2. Each card animates in and out with a yoyo effect
3. Cards move from 400% to -400% horizontally
4. Overlapping ensures there's always a card visible
5. Timeline loops infinitely without visible seams

### User Interactions

**Scrolling:**
- Scroll down → Cards advance forward
- Scroll up → Cards move backward
- Pinned section allows extended scroll range

**Dragging:**
- Drag left → Cards move forward
- Drag right → Cards move backward
- Release → Snaps to nearest card

**Button Clicks:**
- NEXT → Advances one card
- PREV → Goes back one card

## Configuration

```javascript
const spacing = 0.1; // Time between cards (lower = tighter spacing)
```

Adjust this value to change:
- Number of visible cards
- Speed of transitions
- Snap points

## Browser Compatibility

- **GSAP 3.12.2** loaded from CDN
- Works on all modern browsers
- Touch events supported on mobile
- Gracefully degrades if GSAP fails to load

## Performance Optimizations

1. `will-change: transform, opacity, filter` - GPU acceleration hint
2. `paused: true` on timelines - Manual control for efficiency
3. Minimal DOM manipulation - All animation via GSAP
4. Single scrubber instance - Reused for all updates

## Differences from Original Demo

**Kept:**
- buildSeamlessLoop() logic (iteration-based)
- ScrollTrigger integration
- Draggable support
- Snapping behavior
- Infinite loop mechanism

**Simplified:**
- Removed 3D rotation effects for cleaner look
- Removed center card highlighting (grayscale effect)
- Simplified animation function for better performance

**Added:**
- PREV/NEXT button controls with snapping
- Better semantic HTML structure
- Accessibility attributes (role, aria-label)
- CSS cursor feedback (grab/grabbing)

## Testing Checklist

- [x] Cards initialize properly
- [x] buildSeamlessLoop() creates infinite timeline
- [x] ScrollTrigger pins section
- [x] Scrolling advances cards
- [x] Dragging moves cards
- [x] Snapping works on drag release
- [x] PREV/NEXT buttons function
- [x] No visible loop seams
- [x] Works in both directions
- [x] Responsive on mobile

## Usage

Simply scroll to the Projects section or navigate using:
- **Mouse Wheel** - Scroll through projects
- **Touch Drag** - Swipe on mobile/tablet
- **Mouse Drag** - Click and drag
- **PREV/NEXT** - Click navigation buttons

## Credits

Based on the official GSAP CodePen demo by GreenSock.
Implementation follows GSAP best practices for infinite horizontal sliders.
