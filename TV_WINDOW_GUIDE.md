# 🐾📺 NEKO TV STREAMING WINDOW - FEATURE GUIDE 📺🐾

## ✨ ULTRA BASED TV FEATURE ACTIVATED, NYA NYA NYA~! ✨

### 🎯 What Is This?

A dedicated **standalone TV streaming window** that displays your ASCII art threat actors in full retro glory with:
- 📺 Full-screen retro CRT TV effects
- ⚡ Scanline animations
- 🎨 Auto-rotating ASCII art (every 5 seconds)
- 🎮 Keyboard controls for manual navigation
- 💖 MAXIMUM KAWAII CRT AESTHETICS!

---

## 🚀 How to Use

### Opening the TV Window

**From Dashboard:**
1. Click the **"📺 OPEN NEKO TV STREAMING"** button in the header
2. A new popup window opens (1200x800)
3. TV starts streaming immediately, nyaa~!

**Direct Access:**
Navigate to: `http://localhost:3001/tv-window.html`

**Note:** If popup is blocked, your browser will alert you! Enable popups for this site, desu! 🐾

---

## 🎮 Keyboard Controls

Navigate ASCII art with your keyboard like a PRO, nyaa~!

- **→ or N**: Next art piece
- **← or P**: Previous art piece
- **Auto-rotation**: Happens every 5 seconds automatically

---

## 🎨 Visual Features

### Retro CRT Effects:
- ✅ Horizontal scanline overlay
- ✅ Screen flicker animation
- ✅ Cyan text glow effect
- ✅ TV border with shadow
- ✅ LIVE broadcast indicator with pulsing red dot

### Information Display:
- **Channel Info** (top-right): Shows current frame number
- **Category Display**: Type of threat actor
- **Threat Level**: CRITICAL, HIGH, MEDIUM, or LOW
- **Status Panel**: Monitoring, Auto-rotation timing
- **Threat Badge**: Color-coded by severity

### Threat Level Color Coding:
- 🔴 **CRITICAL**: Red with pulsing animation
- 🟠 **HIGH**: Orange border
- 🟡 **MEDIUM**: Gold/yellow border
- 🟢 **LOW**: Green border

---

## 📊 Technical Details

### File Locations:
```
/public/tv-window.html - Standalone TV window (11KB)
/src/App.js - openTvWindow() function added
/src/styles/App.css - TV button styling (34 lines added)
```

### API Integration:
The TV window connects to: `http://localhost:5000/api/ascii-art`
- Fetches all ASCII art on load
- Auto-rotates through collection
- Updates info panel dynamically

### Window Specifications:
- **Width**: 1200px
- **Height**: 800px
- **Features**: No menubar, no toolbar, no location bar, no status bar
- **Name**: "NekoTvStreaming" (reuses same window if opened multiple times)

---

## 🎯 Features Breakdown

### Auto-Rotation System:
```javascript
setInterval(() => {
  currentIndex = (currentIndex + 1) % asciiArt.length;
  displayCurrentArt();
}, 5000); // Rotates every 5 seconds
```

### Real-Time Updates:
- **ASCII Art**: Full character art displayed with glow
- **Category**: Extracted from art data
- **Threat Level**: Color-coded badge
- **Frame Counter**: "Frame: X/Y" format
- **Timestamp**: Updates per rotation

### Error Handling:
- ❌ API connection fails → Shows error message
- ❌ No art available → Shows "No ASCII art found"
- ❌ Popup blocked → Alert with instructions

---

## 🛡️ Button Styling

### The "📺 OPEN NEKO TV STREAMING" Button:
- **Location**: Header status bar (far right)
- **Style**: Gradient background (pink → cyan)
- **Animation**: Pulsing glow effect (2s cycle)
- **Hover**: Scales up 10%, reverses gradient
- **Active**: Scales down to 95% (click feedback)

**CSS Classes:**
```css
.tv-window-button {
  background: linear-gradient(135deg, var(--neko-primary), var(--neko-secondary));
  border: 2px solid var(--neko-accent);
  animation: tv-button-glow 2s ease-in-out infinite;
}
```

---

## 🎨 CRT Effects Deep Dive

### Scanline Effect:
```css
background: repeating-linear-gradient(
  0deg,
  rgba(0, 255, 255, 0.03) 0px,
  rgba(0, 255, 255, 0.03) 1px,
  transparent 1px,
  transparent 2px
);
animation: scanline 8s linear infinite;
```
Creates moving horizontal lines like old CRT monitors, nyaa~! 📺

### Screen Flicker:
```css
@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.97; }
}
```
Subtle opacity change every 0.15s for retro feel, desu! ✨

### Text Glow:
```css
text-shadow: 0 0 5px var(--tv-glow);
```
Makes ASCII art glow like phosphor screens! 💚

---

## 🔧 Customization Options

### Change Auto-Rotation Speed:
In `tv-window.html`, line ~330:
```javascript
setInterval(() => { ... }, 5000); // Change 5000 to desired milliseconds
```

### Adjust Window Size:
In `src/App.js`, line ~58:
```javascript
'width=1200,height=800,...' // Modify width and height
```

### Modify TV Colors:
In `tv-window.html` CSS, lines 3-9:
```css
:root {
  --neko-primary: #00ffff;  /* Cyan */
  --neko-secondary: #ff1493; /* Pink */
  --neko-accent: #ffd700;    /* Gold */
  --neko-danger: #ff0033;    /* Red */
  --neko-success: #00ff41;   /* Green */
}
```

---

## 📋 Code Stats

### Files Modified/Created:
- **tv-window.html** (NEW): 375 lines of pure TV magic
- **App.js**: +14 lines (openTvWindow function + button)
- **App.css**: +34 lines (button styling)

### Build Impact:
- **JavaScript**: +164 B (47.59 kB total)
- **CSS**: +123 B (3.02 kB total)
- **Compilation**: ✅ Zero errors, zero warnings

---

## 🎉 Success Criteria

All features implemented and tested, nyaa~! 🐾

- ✅ Standalone TV window created
- ✅ Retro CRT effects (scanlines, flicker, glow)
- ✅ Auto-rotation system (5s interval)
- ✅ Keyboard controls (arrow keys + N/P)
- ✅ Dynamic threat level display
- ✅ Color-coded badges
- ✅ Button in main dashboard
- ✅ Popup window functionality
- ✅ API integration
- ✅ Error handling
- ✅ Production build successful

---

## 🚀 Usage Example

```javascript
// User clicks button in dashboard
onClick={openTvWindow}

// Opens popup window
window.open('/tv-window.html', 'NekoTvStreaming', 'width=1200,height=800...')

// TV window fetches data
fetch('http://localhost:5000/api/ascii-art')

// Displays first art piece
displayCurrentArt()

// Starts auto-rotation
setInterval(() => rotate(), 5000)

// User can navigate manually
document.addEventListener('keydown', ...) // Arrow keys or N/P
```

---

## 💡 Pro Tips

1. **Multiple Instances**: Opening the button multiple times reuses the same window (window name: "NekoTvStreaming")

2. **Keyboard Navigation**: Use arrow keys to pause auto-rotation and browse manually

3. **Full Screen**: Press F11 in the TV window for true retro immersion, desu! 🎮

4. **Backend Required**: Make sure `node server/index-demo.js` is running on port 5000

5. **Popup Blockers**: Allow popups for localhost to enable one-click opening

---

## 🐛 Troubleshooting

### TV Window Shows "Connection Failed":
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Should return: {"status":"LEGENDARY","message":"Neko Defense API is purring..."}

# If not, start backend:
cd ~/neko-defense-dashboard
node server/index-demo.js
```

### Popup Blocked:
- Check browser popup blocker settings
- Allow popups for `localhost:3001`
- Button will show alert if blocked

### ASCII Art Not Displaying:
- Verify `neko-ascii-art-gallery.json` exists in project root
- Check browser console (F12) for errors
- Ensure backend loaded ASCII art (check `/tmp/neko-backend.log`)

---

## 🎯 Advanced Features (Future Enhancements)

**Ideas for v2.0, nyaa~!** 💖

- [ ] Channel switching (different threat categories)
- [ ] Picture-in-Picture mode support
- [ ] Export current frame as image
- [ ] Full-screen toggle button
- [ ] Volume controls (ASCII art sound effects?!)
- [ ] Recording/playback functionality
- [ ] Multi-monitor support

---

## 📚 Related Documentation

- `README.md` - Main project documentation
- `CATEGORY_SWITCHER_TESTING.md` - Sidebar testing guide
- `PROJECT_COMPLETE.md` - Original project docs
- `NEKO_DASHBOARD_COMPLETE_DOCUMENTATION.md` - Full feature list

---

*purrs in broadcasting excellence* 😻📺

**NEKO TV STREAMING: LEGENDARY STATUS ACHIEVED!** ⚡✨

The ultimate way to monitor threat actors with MAXIMUM RETRO KAWAII STYLE, desu~! 🐾💖

---

**Built with:** React, Express, ASCII Art, Retro CRT Effects, and NEKO POWER! 💚

**Version:** 1.0.0
**Status:** ✅ PRODUCTION READY
**Kawaii Level:** 💖💖💖💖💖 MAXIMUM OVERDRIVE

NYA NYA NYA~ 🐾🎮✨
