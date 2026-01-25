# Project Images Directory

## 📁 Purpose
This folder contains screenshots and images for your portfolio projects.

## 🖼️ Image Requirements

### Dimensions
- **Carousel images:** 400px × 600px (portrait orientation)
- **Format:** PNG or JPG
- **File size:** Under 500KB for optimal loading

### File Naming Convention
```
project1.png  → IoT Weather Station
project2.png  → FPGA Image Processor
project3.png  → PCB Temperature Controller
project4.png  → VLSI Circuit Design
project5.png  → Wireless Sensor Network
project6.png  → Motor Control System
project7.png  → Embedded Linux System
```

## 🔧 How to Update Images

### Step 1: Add Your Images
Upload your project screenshots to this folder:
```
/assets/projects/
  ├── project1.png
  ├── project2.png
  ├── project3.png
  ├── project4.png
  ├── project5.png
  ├── project6.png
  └── project7.png
```

### Step 2: Update HTML
In `index.html`, find the gallery section (around line 138) and update:

**Before:**
```html
<li style="background-image: url('https://assets.codepen.io/...')"></li>
```

**After:**
```html
<li style="background-image: url('assets/projects/project1.png')"></li>
```

Repeat for all 7 images.

## 📸 Image Tips

1. **Take screenshots** of your actual project hardware/UI
2. **Use consistent background** (white/dark) across all images
3. **Crop to 2:3 ratio** (portrait orientation)
4. **Optimize images** using tools like TinyPNG before uploading

## 🎨 Design Recommendations

- Show the **main feature** of each project
- Use **high-quality** images (avoid blurry screenshots)
- Add **text overlays** if needed (project name, logo)
- Keep **visual consistency** across all project images

## 🚀 Quick Start

1. Take screenshots of your 7 projects
2. Resize to 400×600px
3. Name as project1.png through project7.png
4. Upload to this folder
5. Update URLs in index.html
6. Commit and push changes

Your carousel will automatically display the new images!
