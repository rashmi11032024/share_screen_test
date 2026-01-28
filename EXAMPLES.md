# Code Examples & Usage Guide

This document provides code examples and usage patterns for the Screen Share Test App.

## 🎯 Quick Examples

### Basic Usage of useScreenShare Hook

```typescript
import { useScreenShare } from '@/hooks/useScreenShare';

function MyComponent() {
  const {
    permissionState,
    stream,
    metadata,
    isActive,
    requestScreenShare,
    stopScreenShare,
  } = useScreenShare();

  const handleStart = async () => {
    await requestScreenShare();
  };

  return (
    <div>
      <button onClick={handleStart}>Start Sharing</button>
      {isActive && <video ref={videoRef} autoPlay />}
    </div>
  );
}
```

### Handling Permission States

```typescript
import { PermissionState } from '@/types/screenShare';
import { useScreenShare } from '@/hooks/useScreenShare';

function PermissionHandler() {
  const { permissionState, error } = useScreenShare();

  switch (permissionState) {
    case PermissionState.IDLE:
      return <div>Ready to start</div>;
    
    case PermissionState.REQUESTING:
      return <div>Opening screen picker...</div>;
    
    case PermissionState.GRANTED:
      return <div>Sharing screen!</div>;
    
    case PermissionState.CANCELLED:
      return <div>You cancelled the picker</div>;
    
    case PermissionState.DENIED:
      return <div>Permission denied</div>;
    
    case PermissionState.ERROR:
      return <div>Error: {error?.message}</div>;
    
    default:
      return null;
  }
}
```

### Creating a Custom Button

```typescript
import { Button } from '@/components/Button';

function MyPage() {
  return (
    <div>
      {/* Primary button */}
      <Button variant="primary" onClick={handleClick}>
        Click Me
      </Button>

      {/* Secondary button */}
      <Button variant="secondary" onClick={handleBack}>
        Go Back
      </Button>

      {/* Danger button */}
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>

      {/* Loading state */}
      <Button loading={isLoading}>
        Loading...
      </Button>

      {/* Disabled */}
      <Button disabled>
        Cannot Click
      </Button>

      {/* Full width */}
      <Button fullWidth>
        Full Width Button
      </Button>
    </div>
  );
}
```

### Displaying Stream Preview

```typescript
import { StreamPreview } from '@/components/StreamPreview';
import { useScreenShare } from '@/hooks/useScreenShare';

function VideoDisplay() {
  const { stream, metadata, isActive } = useScreenShare();

  if (!isActive || !stream || !metadata) {
    return <div>No active stream</div>;
  }

  return <StreamPreview stream={stream} metadata={metadata} />;
}
```

## 🔧 Advanced Usage

### Custom Error Handling

```typescript
function AdvancedScreenShare() {
  const { requestScreenShare, error, permissionState } = useScreenShare();
  const [customError, setCustomError] = useState<string | null>(null);

  const handleRequest = async () => {
    setCustomError(null);
    
    try {
      await requestScreenShare();
    } catch (err) {
      // Additional error handling
      if (err instanceof Error) {
        setCustomError(`Failed to start sharing: ${err.message}`);
      }
    }
  };

  return (
    <div>
      <button onClick={handleRequest}>Start</button>
      {customError && <div className="error">{customError}</div>}
    </div>
  );
}
```

### Metadata Extraction Example

```typescript
function MetadataDisplay() {
  const { metadata, isActive } = useScreenShare();

  if (!isActive || !metadata) {
    return null;
  }

  const { displayType, width, height, frameRate } = metadata;

  return (
    <div className="metadata-grid">
      <div>
        <label>Type:</label>
        <span>{displayType}</span>
      </div>
      <div>
        <label>Resolution:</label>
        <span>{width} × {height}</span>
      </div>
      <div>
        <label>FPS:</label>
        <span>{frameRate}</span>
      </div>
    </div>
  );
}
```

### Stream Lifecycle Monitoring

```typescript
function StreamMonitor() {
  const { stream, isActive } = useScreenShare();
  const [streamInfo, setStreamInfo] = useState<any>(null);

  useEffect(() => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      
      setStreamInfo({
        id: stream.id,
        active: stream.active,
        trackId: track.id,
        trackState: track.readyState,
        trackMuted: track.muted,
      });

      // Monitor track changes
      track.onmute = () => console.log('Track muted');
      track.onunmute = () => console.log('Track unmuted');
      track.onended = () => console.log('Track ended');
    }
  }, [stream]);

  return (
    <div>
      <h3>Stream Info</h3>
      <pre>{JSON.stringify(streamInfo, null, 2)}</pre>
    </div>
  );
}
```

### Browser Support Check

```typescript
import { isScreenShareSupported, getBrowserInfo } from '@/utils/browser';

function BrowserCheck() {
  const [supported, setSupported] = useState(false);
  const [browser, setBrowser] = useState('');

  useEffect(() => {
    setSupported(isScreenShareSupported());
    setBrowser(getBrowserInfo());
  }, []);

  return (
    <div>
      <p>Browser: {browser}</p>
      <p>Supported: {supported ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### Custom Logger Usage

```typescript
import { logger } from '@/utils/logger';

function MyComponent() {
  const handleAction = () => {
    logger.info('User performed action');
    
    logger.group('Action Details');
    logger.debug('Detail 1:', { value: 123 });
    logger.debug('Detail 2:', { value: 456 });
    logger.groupEnd();
    
    try {
      // Some operation
      logger.info('Operation successful');
    } catch (error) {
      logger.error('Operation failed:', error);
    }
  };

  return <button onClick={handleAction}>Do Action</button>;
}
```

## 🎨 Styling Examples

### Tailwind Utility Classes

```typescript
function StyledComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Title
        </h1>
        
        <div className="bg-white rounded-lg shadow-xl p-6">
          Content
        </div>
      </div>
    </div>
  );
}
```

### Responsive Design

```typescript
function ResponsiveLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded">Card 1</div>
      <div className="bg-white p-4 rounded">Card 2</div>
      <div className="bg-white p-4 rounded">Card 3</div>
    </div>
  );
}
```

### Custom Animations

```typescript
function AnimatedButton() {
  return (
    <button className="
      px-6 py-3 
      bg-blue-600 text-white rounded-lg
      transition-all duration-200
      hover:bg-blue-700 hover:scale-105
      active:scale-95
      focus:ring-2 focus:ring-blue-500
    ">
      Animated Button
    </button>
  );
}
```

## 🧪 Testing Examples

### Testing the Hook

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useScreenShare } from '@/hooks/useScreenShare';

describe('useScreenShare', () => {
  it('should start in idle state', () => {
    const { result } = renderHook(() => useScreenShare());
    
    expect(result.current.permissionState).toBe(PermissionState.IDLE);
    expect(result.current.isActive).toBe(false);
    expect(result.current.stream).toBe(null);
  });

  it('should request screen share', async () => {
    const { result } = renderHook(() => useScreenShare());
    
    await act(async () => {
      await result.current.requestScreenShare();
    });
    
    // Assert based on mock implementation
  });
});
```

### Testing Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## 🔄 Common Patterns

### Loading State Pattern

```typescript
function LoadingExample() {
  const [isLoading, setIsLoading] = useState(false);
  const { requestScreenShare } = useScreenShare();

  const handleStart = async () => {
    setIsLoading(true);
    try {
      await requestScreenShare();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleStart} loading={isLoading}>
      {isLoading ? 'Starting...' : 'Start Sharing'}
    </Button>
  );
}
```

### Error Boundary Pattern

```typescript
class ScreenShareErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    logger.error('Screen share error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Retry Pattern

```typescript
function RetryExample() {
  const { requestScreenShare, permissionState } = useScreenShare();
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const handleRetry = async () => {
    if (retryCount >= MAX_RETRIES) {
      alert('Maximum retries reached');
      return;
    }

    setRetryCount(prev => prev + 1);
    await requestScreenShare();
  };

  return (
    <div>
      <button onClick={handleRetry} disabled={retryCount >= MAX_RETRIES}>
        Retry ({retryCount}/{MAX_RETRIES})
      </button>
    </div>
  );
}
```

## 🎓 Best Practices

### 1. Always Clean Up

```typescript
// ✅ Good
useEffect(() => {
  return () => {
    if (stream) {
      cleanupStream(stream);
    }
  };
}, [stream]);

// ❌ Bad
useEffect(() => {
  // No cleanup
}, [stream]);
```

### 2. Handle All States

```typescript
// ✅ Good
switch (permissionState) {
  case PermissionState.IDLE:
  case PermissionState.REQUESTING:
  case PermissionState.GRANTED:
  case PermissionState.CANCELLED:
  case PermissionState.DENIED:
  case PermissionState.ERROR:
    // Handle each state
}

// ❌ Bad
if (permissionState === PermissionState.GRANTED) {
  // Only handle one state
}
```

### 3. Use TypeScript Types

```typescript
// ✅ Good
const metadata: StreamMetadata = {
  displayType: 'monitor',
  width: 1920,
  height: 1080,
  frameRate: 30,
};

// ❌ Bad
const metadata = {
  displayType: 'monitor',
  width: 1920,
  height: 1080,
  frameRate: 30,
};
```

### 4. Add Debug Logging

```typescript
// ✅ Good
const handleClick = () => {
  logger.info('User clicked button');
  doSomething();
  logger.info('Action completed');
};

// ❌ Bad
const handleClick = () => {
  doSomething();
};
```

## 💡 Tips & Tricks

### Tip 1: Use useCallback for Event Handlers
```typescript
const handleStart = useCallback(async () => {
  await requestScreenShare();
}, [requestScreenShare]);
```

### Tip 2: Memoize Expensive Computations
```typescript
const metadataDisplay = useMemo(() => {
  if (!metadata) return null;
  return formatMetadata(metadata);
}, [metadata]);
```

### Tip 3: Extract Complex Logic
```typescript
// Instead of inline logic
const isButtonDisabled = 
  permissionState === PermissionState.REQUESTING ||
  permissionState === PermissionState.GRANTED;

// Use a custom hook
function useButtonState() {
  const { permissionState } = useScreenShare();
  return permissionState === PermissionState.REQUESTING ||
         permissionState === PermissionState.GRANTED;
}
```

---

**Happy Coding! 💻**
