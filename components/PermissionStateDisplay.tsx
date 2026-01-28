'use client';

import React from 'react';
import { PermissionState } from '@/types/screenShare';

interface PermissionStateDisplayProps {
  permissionState: PermissionState;
  error: Error | null;
}

/**
 * Component to display different permission states with appropriate UI
 */
export const PermissionStateDisplay: React.FC<PermissionStateDisplayProps> = ({
  permissionState,
  error,
}) => {
  // Don't render anything for idle or granted states (handled elsewhere)
  if (
    permissionState === PermissionState.IDLE ||
    permissionState === PermissionState.GRANTED
  ) {
    return null;
  }

  const stateConfigs = {
    [PermissionState.REQUESTING]: {
      title: 'Requesting Permission',
      message: 'Please select a screen, window, or tab to share in the browser dialog.',
      icon: '🔄',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
    },
    [PermissionState.CANCELLED]: {
      title: 'Screen Sharing Cancelled',
      message: 'You cancelled the screen selection. Click "Retry" to try again.',
      icon: '❌',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-900',
    },
    [PermissionState.DENIED]: {
      title: 'Permission Denied',
      message:
        'Screen sharing permission was denied. Please check your browser settings and try again.',
      icon: '🚫',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
    },
    [PermissionState.ERROR]: {
      title: 'Error Occurred',
      message: error?.message || 'An unknown error occurred while requesting screen share.',
      icon: '⚠️',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-900',
    },
  };

  const config = stateConfigs[permissionState];

  if (!config) {
    return null;
  }

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-lg p-6 max-w-2xl mx-auto`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{config.icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">{config.title}</h3>
          <p className="text-sm opacity-90">{config.message}</p>
          
          {error && permissionState === PermissionState.ERROR && (
            <div className="mt-3 p-3 bg-white/50 rounded border border-current/20">
              <p className="text-xs font-mono">
                <span className="font-semibold">Error Name:</span> {error.name}
              </p>
              <p className="text-xs font-mono mt-1">
                <span className="font-semibold">Details:</span> {error.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
