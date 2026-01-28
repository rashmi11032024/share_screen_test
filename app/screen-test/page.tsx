'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useScreenShare } from '@/hooks/useScreenShare';
import { Button } from '@/components/Button';
import { StreamPreview } from '@/components/StreamPreview';
import { PermissionStateDisplay } from '@/components/PermissionStateDisplay';
import { PermissionState } from '@/types/screenShare';
import { logger } from '@/utils/logger';

export default function ScreenTestPage() {
  const router = useRouter();
  const {
    permissionState,
    stream,
    metadata,
    error,
    isActive,
    requestScreenShare,
    stopScreenShare,
  } = useScreenShare();

  useEffect(() => {
    logger.info('ScreenTestPage mounted');
    
    return () => {
      logger.info('ScreenTestPage unmounted');
    };
  }, []);

  const handleStartCapture = async () => {
    logger.info('User clicked "Start Screen Capture" button');
    await requestScreenShare();
  };

  const handleStopCapture = () => {
    logger.info('User clicked "Stop Screen Sharing" button');
    stopScreenShare();
  };

  const handleRetry = async () => {
    logger.info('User clicked "Retry Screen Test" button');
    await requestScreenShare();
  };

  const handleBackToHome = () => {
    logger.info('User clicked "Back to Home" button');
    router.push('/');
  };

  // Determine if we should show the initial capture button
  const showInitialButton =
    permissionState === PermissionState.IDLE ||
    permissionState === PermissionState.CANCELLED ||
    permissionState === PermissionState.DENIED ||
    permissionState === PermissionState.ERROR;

  // Determine if we're in requesting state
  const isRequesting = permissionState === PermissionState.REQUESTING;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Screen Sharing Test
          </h1>
          <p className="text-gray-600">
            Test your browser's screen sharing capabilities
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          {/* Permission State Display */}
          <PermissionStateDisplay
            permissionState={permissionState}
            error={error}
          />

          {/* Initial State - Show Start Button */}
          {showInitialButton && (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🎥</div>
              <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to Test Screen Sharing
                </h2>
                <p className="text-gray-600 mb-6">
                  Click the button below to request screen sharing permission.
                  You'll be able to select which screen, window, or tab to share.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={handleStartCapture}
                  disabled={isRequesting}
                  loading={isRequesting}
                  fullWidth
                >
                  {isRequesting ? 'Opening Screen Picker...' : 'Start Screen Capture'}
                </Button>
                
                <Button
                  onClick={handleBackToHome}
                  variant="secondary"
                  fullWidth
                >
                  ← Back to Home
                </Button>
              </div>

              {/* Instructions */}
              {permissionState === PermissionState.IDLE && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What will happen:
                  </h3>
                  <ul className="text-sm text-gray-700 text-left space-y-1.5 max-w-md mx-auto">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Your browser will show a screen picker dialog</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Select which screen/window/tab to share</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Grant permission to start screen sharing</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>View a live preview of your shared screen</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Active State - Show Stream Preview */}
          {isActive && stream && metadata && (
            <div className="space-y-6">
              <StreamPreview stream={stream} metadata={metadata} />
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleStopCapture} variant="danger">
                  Stop Screen Sharing
                </Button>
                <Button onClick={handleBackToHome} variant="secondary">
                  Back to Home
                </Button>
              </div>

              {/* Help Text */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-semibold">Tip:</span> You can also stop
                  sharing by clicking the browser's "Stop sharing" button or
                  closing the shared tab/window.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stream Stopped - Show Retry Options */}
        {!isActive &&
          permissionState === PermissionState.IDLE &&
          stream === null &&
          error !== null  && (
            <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center space-y-6">
              <div className="text-6xl mb-4">✋</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Screen Sharing Stopped
                </h2>
                <p className="text-gray-600">
                  The screen sharing session has ended. You can start a new test
                  or return to the homepage.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <Button onClick={handleRetry} fullWidth>
                  Retry Screen Test
                </Button>
                <Button onClick={handleBackToHome} variant="secondary" fullWidth>
                  Back to Home
                </Button>
              </div>
            </div>
          )}

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(
                {
                  permissionState,
                  isActive,
                  hasStream: !!stream,
                  hasMetadata: !!metadata,
                  hasError: !!error,
                  errorName: error?.name,
                  errorMessage: error?.message,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
