/**
 * Screen sharing permission states
 */
export enum PermissionState {
  IDLE = 'idle',
  REQUESTING = 'requesting',
  GRANTED = 'granted',
  CANCELLED = 'cancelled',
  DENIED = 'denied',
  ERROR = 'error',
}

/**
 * Display type from media stream
 */
export type DisplayType = 'monitor' | 'window' | 'browser' | 'unknown';

/**
 * Screen sharing stream metadata
 */
export interface StreamMetadata {
  displayType: DisplayType;
  width: number;
  height: number;
  frameRate: number;
}

/**
 * Screen sharing hook state
 */
export interface ScreenShareState {
  permissionState: PermissionState;
  stream: MediaStream | null;
  metadata: StreamMetadata | null;
  error: Error | null;
  isActive: boolean;
}

/**
 * Screen sharing hook return type
 */
export interface UseScreenShareReturn extends ScreenShareState {
  requestScreenShare: () => Promise<void>;
  stopScreenShare: () => void;
}
