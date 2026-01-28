# Testing Guide

Complete testing documentation for the Screen Share Test App.

## 🧪 Test Categories

### 1. Browser Compatibility Tests

#### Chrome (Recommended)
- [ ] **Version 72+** - Full support expected
- [ ] Screen picker shows all options (Screen, Window, Tab)
- [ ] `displaySurface` metadata available
- [ ] `onended` event fires correctly
- [ ] Frame rate matches requested (or close)

#### Microsoft Edge
- [ ] **Version 79+** - Full support expected
- [ ] Same behavior as Chrome (Chromium-based)
- [ ] All features working

#### Firefox
- [ ] **Version 66+** - Good support
- [ ] Screen picker may look different
- [ ] Tab sharing may require additional permission
- [ ] `displaySurface` available in recent versions

#### Safari
- [ ] **Version 13+** - Partial support
- [ ] Requires HTTPS (even localhost must use https://)
- [ ] `displaySurface` may not be available
- [ ] Some metadata might be limited

#### Mobile Browsers
- [ ] iOS Safari - Shows "unsupported" message
- [ ] Chrome Mobile - Shows "unsupported" message
- [ ] Firefox Mobile - Shows "unsupported" message
- [ ] UI remains functional and responsive

### 2. Permission Flow Tests

#### Initial Request
```
Action: Click "Start Screen Capture"
Expected: 
  ✓ Button shows loading state
  ✓ Screen picker dialog opens
  ✓ UI shows "Requesting Permission" state
  ✓ Console logs permission request
```

#### Grant Permission
```
Action: Select screen/window/tab and click "Share"
Expected:
  ✓ Video preview appears
  ✓ Metadata displays correctly (type, resolution, fps)
  ✓ "Stream Active" badge shows
  ✓ Console logs successful grant
```

#### Cancel Permission
```
Action: Close picker without selecting
Expected:
  ✓ Shows "Screen Sharing Cancelled" message
  ✓ Retry button appears
  ✓ Console logs cancellation
  ✓ No video element present
```

#### Deny Permission
```
Action: Block permission from browser settings, then request
Expected:
  ✓ Shows "Permission Denied" message
  ✓ Instructions to check browser settings
  ✓ Console logs denial
  ✓ Retry button available
```

### 3. Stream Lifecycle Tests

#### Normal Start and Stop
```
1. Start sharing
   ✓ Preview shows correct content
   ✓ All metadata accurate
   
2. Click "Stop Screen Sharing" button
   ✓ Video element clears
   ✓ Tracks are stopped (check console)
   ✓ "Sharing Stopped" message appears
   ✓ Retry option available
```

#### Browser UI Stop
```
1. Start sharing
2. Use browser's "Stop sharing" button
Expected:
   ✓ App detects stream end immediately
   ✓ UI updates to "Stopped" state
   ✓ Console shows "onended" event fired
   ✓ All cleanup occurs
```

#### Close Shared Window/Tab
```
1. Share a specific window or tab
2. Close that window/tab
Expected:
   ✓ App detects stream end
   ✓ UI updates appropriately
   ✓ No errors in console
```

### 4. Display Type Tests

#### Entire Screen
```
Action: Select "Entire Screen" in picker
Expected:
  ✓ displayType shows "monitor"
  ✓ Resolution matches screen resolution
  ✓ Preview shows full screen
```

#### Application Window
```
Action: Select specific window
Expected:
  ✓ displayType shows "window"
  ✓ Resolution matches window size
  ✓ Preview shows selected window
```

#### Browser Tab
```
Action: Select specific tab
Expected:
  ✓ displayType shows "browser"
  ✓ Resolution matches tab size
  ✓ Preview shows selected tab
```

### 5. Retry Flow Tests

#### Retry After Cancel
```
1. Cancel initial request
2. Click "Retry Screen Test"
Expected:
   ✓ Fresh picker dialog opens
   ✓ No reference to old stream
   ✓ Console shows new request
   ✓ Works normally if granted
```

#### Retry After Deny
```
1. Deny initial request
2. Click "Retry Screen Test"
Expected:
   ✓ New request initiated
   ✓ Same denial if not changed in settings
   ✓ No memory leaks
```

#### Multiple Retries
```
1. Request → Cancel
2. Retry → Cancel
3. Retry → Cancel
4. Retry → Grant
Expected:
   ✓ Each retry is independent
   ✓ No accumulated state
   ✓ No memory leaks (check browser memory)
```

#### Retry After Success
```
1. Share screen successfully
2. Stop sharing
3. Click "Retry Screen Test"
Expected:
   ✓ Previous stream is cleaned up
   ✓ New stream is independent
   ✓ No memory leaks
```

### 6. Edge Case Tests

#### Rapid Clicking
```
Action: Click "Start" button multiple times rapidly
Expected:
  ✓ Only one request is made
  ✓ Button is disabled during request
  ✓ No duplicate pickers
  ✓ No crashes
```

#### Navigate During Request
```
1. Click "Start Screen Capture"
2. Immediately navigate back to home
Expected:
  ✓ Cleanup occurs
  ✓ No memory leaks
  ✓ No errors in console
```

#### Refresh During Sharing
```
1. Start sharing
2. Refresh the page
Expected:
  ✓ State resets
  ✓ Stream stops
  ✓ Clean app restart
```

#### Multiple Tabs
```
1. Open app in Tab A, start sharing
2. Open app in Tab B, start sharing
Expected:
  ✓ Each tab manages own state
  ✓ No interference between tabs
  ✓ Both can share simultaneously
```

#### Minimize/Maximize Window
```
Action: Minimize shared window, then maximize
Expected:
  ✓ Stream continues
  ✓ No interruption
  ✓ Video preview updates
```

#### Change Shared Window Size
```
Action: Resize the shared window
Expected:
  ✓ Preview updates
  ✓ Metadata may or may not update (browser-dependent)
  ✓ No crashes
```

### 7. UI/UX Tests

#### Responsive Design
- [ ] Desktop (1920×1080) - Layout looks good
- [ ] Laptop (1366×768) - Layout looks good
- [ ] Tablet (768×1024) - Layout adapts
- [ ] Mobile (375×667) - Layout stacks correctly

#### Loading States
- [ ] Button shows loading spinner during request
- [ ] Loading text is clear
- [ ] Button is disabled when loading

#### Error Messages
- [ ] All error states show appropriate messages
- [ ] Messages are user-friendly (not technical)
- [ ] Icons/emojis enhance clarity
- [ ] Actionable instructions provided

#### Navigation
- [ ] "Back to Home" works from all states
- [ ] "Start Screen Test" navigates correctly
- [ ] Browser back button works
- [ ] URLs are correct (/  and /screen-test)

### 8. Memory Leak Tests

#### Check for Leaks
```
1. Start sharing → Stop → Retry (10 times)
2. Open Chrome DevTools → Memory tab → Take heap snapshot
3. Check for unreleased MediaStream objects

Expected:
  ✓ No accumulation of MediaStream objects
  ✓ Tracks are properly stopped
  ✓ Memory usage stable
```

#### Long Session Test
```
1. Share screen for 5+ minutes
2. Stop sharing
3. Check memory

Expected:
  ✓ Memory usage doesn't grow indefinitely
  ✓ Cleanup is complete
```

### 9. Console Debugging Tests

#### Check Debug Logs
```
Expected Console Output Flow:

[ScreenShare] [timestamp] [INFO] HomePage mounted - checking browser support
[ScreenShare] [timestamp] [INFO] User clicked "Start Screen Test" button
[ScreenShare] [timestamp] [INFO] ScreenTestPage mounted
[ScreenShare] [timestamp] [INFO] User initiated screen share request
[ScreenShare] [timestamp] [DEBUG] Calling getDisplayMedia API
[ScreenShare] [timestamp] [INFO] Screen share permission granted
[ScreenShare] [timestamp] [DEBUG] Stream obtained: {id: "...", active: true, ...}
[ScreenShare] [timestamp] [INFO] Stream metadata extracted: {displayType: "monitor", ...}
[ScreenShare] [timestamp] [INFO] Screen share started successfully
```

#### Error Logs
```
When errors occur, check for:
  ✓ Error name logged
  ✓ Error message logged
  ✓ Stack trace if available
  ✓ State logged for debugging
```

### 10. Performance Tests

#### Metrics to Check
- [ ] Time to Interactive (TTI) < 3s
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Video preview latency < 200ms
- [ ] Button click response < 100ms
- [ ] Stream start time < 1s (after permission)

#### Resource Usage
- [ ] Memory usage reasonable (< 200MB)
- [ ] CPU usage acceptable during streaming
- [ ] No unnecessary re-renders
- [ ] Smooth animations

## 🔧 Manual Testing Checklist

Before marking complete, test:

### Homepage Testing
- [ ] Page loads correctly
- [ ] Browser support detection works
- [ ] Supported browser shows green message
- [ ] Unsupported browser shows red message
- [ ] "Start Screen Test" button works
- [ ] Button disabled when unsupported
- [ ] Mobile responsive

### Screen Test Page Testing
- [ ] Initial state shows correctly
- [ ] "Start Screen Capture" opens picker
- [ ] All permission states handled
- [ ] Video preview appears when granted
- [ ] Metadata displays correctly
- [ ] "Stop" button works
- [ ] Browser stop button detected
- [ ] "Retry" flow works
- [ ] "Back to Home" works
- [ ] Mobile responsive

### Cross-Browser Testing
- [ ] Chrome - All features work
- [ ] Edge - All features work
- [ ] Firefox - All features work
- [ ] Safari - Works with limitations
- [ ] Mobile - Shows unsupported gracefully

## 🐛 Known Issues to Verify

1. **Safari HTTPS Requirement**: Verify error message is helpful
2. **Firefox Tab Sharing**: Confirm additional permission is handled
3. **Mobile Detection**: Ensure graceful degradation
4. **Resolution Changes**: Check if metadata updates

## 📊 Test Results Template

```
Browser: _________________
Version: _________________
OS: _________________
Date: _________________

✅ PASS | ❌ FAIL | ⚠️ PARTIAL

[ ] Browser detection
[ ] Permission grant
[ ] Permission cancel
[ ] Permission deny
[ ] Video preview
[ ] Metadata display
[ ] Manual stop
[ ] Browser stop
[ ] Retry flow
[ ] Memory cleanup
[ ] UI responsive
[ ] Console logs

Notes:
_____________________
```

## 🎯 Critical Path Testing

Minimum viable test path:
1. ✅ Open homepage
2. ✅ Click "Start Screen Test"
3. ✅ Grant permission
4. ✅ Verify video preview
5. ✅ Stop sharing
6. ✅ Retry
7. ✅ Navigate home

If all pass, app is functional.

## 🔍 Debugging Failed Tests

### Video doesn't show
```
Check:
1. Console for errors
2. Network tab for blocked requests
3. Browser permissions
4. HTTPS requirement
5. Video element srcObject
```

### Permission denied
```
Check:
1. Browser settings
2. HTTPS vs HTTP
3. Console error details
4. Try different browser
```

### Memory leaks
```
Check:
1. Are tracks stopped in console?
2. Heap snapshot shows MediaStream objects?
3. Memory tab shows growth?
4. Try cleanup function manually
```

## 📝 Test Automation Ideas

For future automation:
- Playwright/Cypress for UI testing
- Jest for unit testing hooks
- Mock getDisplayMedia for CI/CD
- Visual regression testing
- Performance monitoring

---

**Happy Testing! 🧪**
