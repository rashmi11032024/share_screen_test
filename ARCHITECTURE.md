# Architecture Documentation

This document explains the technical architecture and design decisions of the Screen Share Test App.

## 🏗️ Overview

The application follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           Next.js App Router            │
├─────────────────────────────────────────┤
│  Pages Layer                            │
│  ├─ HomePage (/)                        │
│  └─ ScreenTestPage (/screen-test)      │
├─────────────────────────────────────────┤
│  Components Layer                       │
│  ├─ Button                              │
│  ├─ StreamPreview                       │
│  └─ PermissionStateDisplay              │
├─────────────────────────────────────────┤
│  Hooks Layer                            │
│  └─ useScreenShare                      │
├─────────────────────────────────────────┤
│  Utils Layer                            │
│  ├─ logger                              │
│  └─ browser                             │
├─────────────────────────────────────────┤
│  Types Layer                            │
│  └─ screenShare types                   │
├─────────────────────────────────────────┤
│           Browser Web API               │
│  navigator.mediaDevices.getDisplayMedia │
└─────────────────────────────────────────┘
```

## 📦 Core Modules

### 1. Custom Hook: useScreenShare

**Location:** `/hooks/useScreenShare.ts`

**Responsibility:** Complete screen sharing lifecycle management

**State Management:**
```typescript
{
  permissionState: PermissionState    // Current permission status
  stream: MediaStream | null          // Active media stream
  metadata: StreamMetadata | null     // Stream information
  error: Error | null                 // Error details
  isActive: boolean                   // Sharing active flag
}
```

**Methods:**
```typescript
requestScreenShare(): Promise<void>   // Start screen sharing
stopScreenShare(): void               // Stop screen sharing
```

**Key Features:**
- Isolated business logic
- Proper cleanup on unmount
- No memory leaks
- Comprehensive error handling
- Stream lifecycle detection

**Flow Diagram:**
```
┌─────────────────┐
│   IDLE STATE    │
└────────┬────────┘
         │ requestScreenShare()
         ▼
┌─────────────────┐
│   REQUESTING    │ ◄── Browser shows picker
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
GRANTED    CANCELLED/DENIED/ERROR
    │         │
    ▼         ▼
┌────────┐  ┌────────┐
│ ACTIVE │  │  IDLE  │
└───┬────┘  └────────┘
    │
    │ stopScreenShare() or track.onended
    ▼
┌────────┐
│  IDLE  │
└────────┘
```

### 2. Permission State Machine

**States:**
```typescript
enum PermissionState {
  IDLE        // No request made
  REQUESTING  // Waiting for user selection
  GRANTED     // Permission granted, streaming
  CANCELLED   // User cancelled picker
  DENIED      // Permission explicitly denied
  ERROR       // Unknown error occurred
}
```

**State Transitions:**
```
IDLE → REQUESTING → GRANTED → IDLE
             ├─→ CANCELLED → IDLE
             ├─→ DENIED → IDLE
             └─→ ERROR → IDLE
```

### 3. Components Architecture

#### Button Component
**Props:**
```typescript
{
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}
```

**Design:** Reusable, stateless, variant-based styling

#### StreamPreview Component
**Props:**
```typescript
{
  stream: MediaStream
  metadata: StreamMetadata
}
```

**Responsibilities:**
- Display live video preview
- Show stream metadata
- Handle video element lifecycle
- Display status indicators

**Key Implementation:**
```typescript
useEffect(() => {
  if (videoRef.current && stream) {
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  }
  
  return () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
}, [stream]);
```

#### PermissionStateDisplay Component
**Props:**
```typescript
{
  permissionState: PermissionState
  error: Error | null
}
```

**Responsibilities:**
- Show appropriate UI for each state
- Display error details
- Provide user guidance

### 4. Utility Modules

#### Logger
**Location:** `/utils/logger.ts`

**Methods:**
```typescript
logger.info(message, ...args)    // General information
logger.warn(message, ...args)    // Warnings
logger.error(message, ...args)   // Errors
logger.debug(message, ...args)   // Debug details
logger.group(label)              // Group start
logger.groupEnd()                // Group end
```

**Format:**
```
[ScreenShare] [2024-01-28T10:30:45.123Z] [INFO] User initiated screen share request
```

#### Browser Utils
**Location:** `/utils/browser.ts`

**Functions:**
```typescript
isScreenShareSupported(): boolean  // Check API availability
getBrowserInfo(): string           // Detect browser type
```

### 5. Type System

**Location:** `/types/screenShare.ts`

**Key Types:**
```typescript
// Permission states
enum PermissionState { ... }

// Display types from browser
type DisplayType = 'monitor' | 'window' | 'browser' | 'unknown'

// Stream metadata
interface StreamMetadata {
  displayType: DisplayType
  width: number
  height: number
  frameRate: number
}

// Hook return type
interface UseScreenShareReturn {
  permissionState: PermissionState
  stream: MediaStream | null
  metadata: StreamMetadata | null
  error: Error | null
  isActive: boolean
  requestScreenShare: () => Promise<void>
  stopScreenShare: () => void
}
```

## 🔄 Data Flow

### Screen Sharing Request Flow

```
User Action → Component → Hook → Browser API → Browser → Hook → Component → UI Update

1. User clicks "Start Screen Capture"
   ↓
2. Component calls requestScreenShare()
   ↓
3. Hook calls navigator.mediaDevices.getDisplayMedia()
   ↓
4. Browser shows native screen picker
   ↓
5. User selects screen/window/tab
   ↓
6. Browser returns MediaStream
   ↓
7. Hook extracts metadata
   ↓
8. Hook sets up onended listener
   ↓
9. Hook updates state
   ↓
10. Component receives new state
   ↓
11. UI shows video preview
```

### Stream Lifecycle Flow

```
Request → Active → Ended → Cleanup

1. getDisplayMedia() called
   ↓
2. MediaStream obtained
   ↓
3. VideoTrack.onended listener attached
   ↓
4. Stream is active
   ↓
5. User stops sharing (via browser or app)
   ↓
6. onended event fires
   ↓
7. Cleanup function runs
   ↓
8. Tracks stopped
   ↓
9. State reset
   ↓
10. UI updated
```

## 🧹 Memory Management

### Cleanup Strategy

**Hook Level:**
```typescript
useEffect(() => {
  // Cleanup on unmount
  return () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };
}, [stream]);
```

**Component Level:**
```typescript
useEffect(() => {
  // Setup video element
  if (videoRef.current && stream) {
    videoRef.current.srcObject = stream;
  }
  
  // Cleanup video element
  return () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
}, [stream]);
```

**Lifecycle Events:**
```typescript
videoTrack.onended = () => {
  // Clean up when browser ends stream
  cleanupStream(stream);
  resetState();
};
```

### Memory Leak Prevention

1. **Track Stopping:** All tracks explicitly stopped
2. **Ref Cleanup:** Video element srcObject cleared
3. **Event Listeners:** Automatically cleaned up with track
4. **State Reset:** All state variables reset on cleanup
5. **Mounted Check:** State updates only when component mounted

## 🎯 Design Patterns

### 1. Custom Hook Pattern
- Encapsulates complex logic
- Reusable across components
- Testable in isolation
- Clear API surface

### 2. Compound Component Pattern
- Components work together
- Flexible composition
- Single responsibility
- Loose coupling

### 3. Controlled Component Pattern
- Parent controls state
- Predictable data flow
- Easy to debug
- Testable

### 4. Error Boundary Pattern (Future)
- Graceful error handling
- User-friendly messages
- Recovery mechanisms
- Error logging

## 🔐 Security Considerations

### 1. Browser API Security
- HTTPS required in production
- User permission required
- No data sent to backend
- Local preview only

### 2. Permission Model
- User must grant permission
- Permission can be revoked
- No storage of permission state
- Respects browser privacy settings

### 3. Data Privacy
- No recording
- No transmission
- No storage
- Client-side only

## 📊 Performance Considerations

### 1. Component Optimization
```typescript
// Memoized callbacks
const handleStart = useCallback(() => {
  requestScreenShare();
}, [requestScreenShare]);

// Prevent unnecessary re-renders
React.memo(StreamPreview);
```

### 2. Lazy Loading
- Pages loaded on demand
- Components split automatically
- Assets optimized

### 3. Resource Management
- Streams cleaned up immediately
- Video elements reused
- No accumulation of resources

## 🧪 Testability

### Unit Testing Approach
```typescript
// Mock getDisplayMedia
const mockGetDisplayMedia = jest.fn();
navigator.mediaDevices.getDisplayMedia = mockGetDisplayMedia;

// Test hook
const { result } = renderHook(() => useScreenShare());
await act(async () => {
  await result.current.requestScreenShare();
});

expect(result.current.isActive).toBe(true);
```

### Integration Testing Approach
```typescript
// Test full flow
render(<ScreenTestPage />);
fireEvent.click(screen.getByText('Start Screen Capture'));
await waitFor(() => {
  expect(screen.getByText('Stream Active')).toBeInTheDocument();
});
```

## 🔮 Future Enhancements

### Planned Improvements
1. Audio capture option
2. Recording capability
3. Screenshot feature
4. Quality settings
5. Multiple stream support
6. Analytics integration
7. Error recovery strategies
8. Advanced metadata display

### Architecture Evolution
```
Current: Standalone app
   ↓
Future: Reusable library
   ↓
Later: SDK with additional features
```

## 📚 Technology Decisions

### Why Next.js?
- ✅ Built-in routing
- ✅ Server-side rendering (if needed)
- ✅ Optimal performance
- ✅ Great developer experience
- ✅ Production-ready

### Why TypeScript?
- ✅ Type safety
- ✅ Better IDE support
- ✅ Fewer runtime errors
- ✅ Self-documenting code
- ✅ Refactoring confidence

### Why Tailwind CSS?
- ✅ Utility-first approach
- ✅ No CSS files to manage
- ✅ Consistent design system
- ✅ Small bundle size
- ✅ Mobile-first

### Why Custom Hook?
- ✅ Separation of concerns
- ✅ Testable logic
- ✅ Reusable across components
- ✅ Clean component code
- ✅ Easy to maintain

## 🎓 Learning Resources

For understanding the architecture:
1. Read the code in order: types → utils → hooks → components → pages
2. Follow a request through the data flow
3. Enable debug logging and observe
4. Modify and experiment
5. Read browser API documentation

---

**Architecture designed for clarity, maintainability, and extensibility**
