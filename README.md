# Screen Share Test App

A production-quality web application for testing browser screen sharing capabilities using the native Web API (`getDisplayMedia`). Built with Next.js, TypeScript, and Tailwind CSS.

![Screen Share Test App](./screenshots/homepage.png)

## 🎯 Features

### Core Functionality
- ✅ **Browser Support Detection** - Automatically checks if the browser supports screen sharing
- ✅ **Permission Management** - Handles all permission states (requesting, granted, denied, cancelled)
- ✅ **Live Stream Preview** - Real-time preview of shared screen with metadata display
- ✅ **Stream Lifecycle Detection** - Detects when user stops sharing via browser UI
- ✅ **Retry Flow** - Clean retry mechanism without memory leaks
- ✅ **Mobile-Safe Layout** - Responsive design that works on all screen sizes

### Technical Highlights
- 🔧 **Custom Hook Architecture** - Screen sharing logic isolated in `useScreenShare` hook
- 🧩 **Reusable Components** - Stateless, reusable UI components
- 🧹 **Proper Cleanup** - No memory leaks, all tracks properly released
- 📝 **Comprehensive Logging** - Debug statements throughout the flow
- 🎨 **Custom UI** - No third-party UI libraries, built from scratch
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern browser (Chrome 72+, Edge 79+, Firefox 66+, Safari 13+)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd screen-share-test

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
screen-share-test/
├── app/
│   ├── page.tsx                    # Homepage (Part A)
│   ├── screen-test/
│   │   └── page.tsx                # Screen test page (Part B & C)
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── Button.tsx                  # Reusable button component
│   ├── StreamPreview.tsx           # Live video preview component
│   └── PermissionStateDisplay.tsx  # Permission state UI component
├── hooks/
│   └── useScreenShare.ts           # Custom screen sharing hook
├── types/
│   └── screenShare.ts              # TypeScript type definitions
├── utils/
│   ├── browser.ts                  # Browser compatibility utilities
│   └── logger.ts                   # Centralized logging utility
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🔄 Screen Sharing Flow

### Step 1: Homepage (`/`)
1. App checks browser support using `navigator.mediaDevices.getDisplayMedia`
2. If supported, shows "Start Screen Test" button
3. If unsupported, displays browser compatibility message
4. On button click, navigates to `/screen-test`

### Step 2: Permission Request (`/screen-test`)
1. User clicks "Start Screen Capture" button
2. App calls `getDisplayMedia({ video: { frameRate: { ideal: 30 } }, audio: false })`
3. Browser shows native screen picker dialog
4. App handles distinct states:
   - **Requesting** - Waiting for user to select screen
   - **Granted** - User selected and granted permission
   - **Cancelled** - User closed picker without selecting
   - **Denied** - Permission explicitly denied
   - **Error** - Unknown error occurred

### Step 3: Live Preview
Once permission is granted:
1. Display live video preview in `<video>` element
2. Extract and display metadata:
   - Display type (monitor/window/browser tab)
   - Actual resolution from `track.getSettings()`
   - Frame rate
3. Set up stream lifecycle listeners using `track.onended`

### Step 4: Stream End Detection
The app detects when sharing stops via:
- User clicking browser's "Stop sharing" button
- User closing the shared tab/window
- Browser ending stream unexpectedly

When detected:
1. UI updates immediately
2. All tracks are released
3. Video element is cleared
4. User sees "Screen Sharing Stopped" message

### Step 5: Retry Flow
After sharing stops:
1. "Retry Screen Test" button appears
2. Clicking retry starts fresh `getDisplayMedia` request
3. No stream reuse - prevents memory leaks
4. Clean state reset

## 🎨 UI Components

### Button Component
Reusable button with variants (primary, secondary, danger) and states (loading, disabled).

```typescript
<Button 
  onClick={handleClick} 
  variant="primary" 
  loading={isLoading}
  disabled={isDisabled}
>
  Click Me
</Button>
```

### StreamPreview Component
Displays live video preview with metadata overlay and information cards.

### PermissionStateDisplay Component
Shows appropriate UI for each permission state with icons and helpful messages.

## 🧪 Testing Guide

### Manual Testing Checklist

**Browser Support:**
- [ ] Test in Chrome (should work)
- [ ] Test in Edge (should work)
- [ ] Test in Firefox (should work)
- [ ] Test in Safari (should work with caveats)
- [ ] Test in mobile browsers (gracefully shows unsupported message)

**Permission States:**
- [ ] Grant permission - should show live preview
- [ ] Cancel picker - should show cancellation message
- [ ] Deny permission - should show denial message
- [ ] Test with different display types (screen, window, tab)

**Stream Lifecycle:**
- [ ] Stop via browser UI - should detect and update UI
- [ ] Stop via app button - should clean up properly
- [ ] Close shared tab - should detect and update UI
- [ ] Minimize/maximize window - stream should continue

**Retry Flow:**
- [ ] Retry after cancellation - should work
- [ ] Retry after denial - should work
- [ ] Retry after successful share - should start fresh stream
- [ ] Multiple retries - no memory leaks

**Edge Cases:**
- [ ] Rapid clicking on buttons - no crashes
- [ ] Navigate away during request - proper cleanup
- [ ] Multiple tabs open - each manages own state
- [ ] Browser refresh during sharing - state resets correctly

## 🐛 Debugging

The app includes comprehensive logging throughout the flow. Open browser DevTools console to see:

```
[ScreenShare] [timestamp] [INFO] User initiated screen share request
[ScreenShare] [timestamp] [DEBUG] Calling getDisplayMedia API
[ScreenShare] [timestamp] [INFO] Screen share permission granted
[ScreenShare] [timestamp] [DEBUG] Stream obtained: {...}
```

Debug logs show:
- Permission state transitions
- Stream lifecycle events
- Track settings and metadata
- Cleanup operations
- Error details

## 📸 Screenshots

### Homepage
![Homepage](./screenshots/homepage.png)
*Browser support detection and start screen*

### Permission Request
![Permission Requesting](./screenshots/requesting.png)
*Waiting for user to select screen*

### Live Preview
![Live Preview](./screenshots/preview.png)
*Active screen sharing with metadata display*

### Stream Stopped
![Stream Stopped](./screenshots/stopped.png)
*Retry flow after sharing ends*

## ⚠️ Known Limitations & Browser Quirks

### Chrome/Edge
- ✅ Full support for all features
- ✅ Reliable `displaySurface` detection
- ✅ Proper `onended` event firing
- ⚠️ Frame rate may differ from requested 30fps

### Firefox
- ✅ Good support for screen sharing
- ⚠️ `displaySurface` may not be available in older versions
- ⚠️ Tab sharing requires additional permission

### Safari
- ⚠️ Requires HTTPS or localhost
- ⚠️ `displaySurface` not always available
- ⚠️ Some metadata may be limited
- ⚠️ iOS Safari doesn't support screen sharing

### General Limitations
- 📱 Mobile browsers generally don't support screen sharing
- 🔒 HTTPS required for production (works on localhost for development)
- 🖥️ Resolution and frame rate depend on screen/window/tab selected
- ⚡ Performance varies based on screen size and browser

## 🔧 Technical Details

### Stream Configuration
```typescript
navigator.mediaDevices.getDisplayMedia({
  video: {
    frameRate: { ideal: 30 }  // Request 30fps (browser may adjust)
  },
  audio: false  // No audio capture
})
```

### Metadata Extraction
```typescript
const settings = track.getSettings();
const metadata = {
  displayType: settings.displaySurface,  // 'monitor' | 'window' | 'browser'
  width: settings.width,                 // Actual resolution width
  height: settings.height,               // Actual resolution height
  frameRate: settings.frameRate          // Actual frame rate
};
```

### Cleanup Pattern
```typescript
useEffect(() => {
  return () => {
    // Cleanup on unmount
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };
}, [stream]);
```

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Web API:** MediaDevices.getDisplayMedia

## 📚 API Reference

### getDisplayMedia()
- **MDN:** https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
- **Spec:** https://w3c.github.io/mediacapture-screen-share/

### MediaStreamTrack
- **MDN:** https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack
- **Events:** `onended`, `onmute`, `onunmute`

## 🤝 Contributing

This is a test application. Feel free to:
- Report issues
- Suggest improvements
- Add features
- Fix bugs

## 📝 License

MIT License - feel free to use this code for learning and testing purposes.

## 👨‍💻 Development Notes

### Code Quality
- ✅ TypeScript for type safety
- ✅ ESLint configuration
- ✅ Proper error handling
- ✅ Comprehensive logging
- ✅ No memory leaks
- ✅ Clean code architecture

### Best Practices Implemented
- Separation of concerns (hooks, components, utils)
- Proper React patterns (useCallback, useEffect cleanup)
- Exhaustive error handling
- User-friendly error messages
- Mobile-first responsive design
- Accessibility considerations

## 🔍 Troubleshooting

### "Permission denied" error
- Check browser permissions in Settings
- Ensure HTTPS (or localhost for development)
- Try different browser

### Video not showing
- Check console for errors
- Verify stream is active
- Try different display source

### Memory leaks
- All cleanup is automatic
- Check console for cleanup logs
- Refresh page if concerned

## 📞 Support

For issues or questions:
1. Check the console logs
2. Review the debugging section
3. Test in different browser
4. Check browser compatibility

---

**Built with ❤️ for screen sharing testing**
