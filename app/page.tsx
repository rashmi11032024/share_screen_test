'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { isScreenShareSupported, getBrowserInfo } from '@/utils/browser';
import { logger } from '@/utils/logger';

export default function HomePage() {
  const router = useRouter();
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [browserInfo, setBrowserInfo] = useState<string>('');

  useEffect(() => {
    logger.info('HomePage mounted - checking browser support');
    
    const supported = isScreenShareSupported();
    const browser = getBrowserInfo();
    
    setIsSupported(supported);
    setBrowserInfo(browser);
    
    logger.info('Browser support check result:', {
      supported,
      browser,
    });
  }, []);

  const handleStartTest = () => {
    logger.info('User clicked "Start Screen Test" button');
    
    if (!isSupported) {
      logger.warn('Screen share not supported, preventing navigation');
      return;
    }
    
    logger.info('Navigating to /screen-test');
    router.push('/screen-test');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🖥️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Screen Share Test App
          </h1>
          <p className="text-gray-600">
            Test your browser's screen sharing capabilities
          </p>
        </div>

        {/* Loading State */}
        {isSupported === null && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <p className="text-gray-600 mt-4">Checking browser support...</p>
          </div>
        )}

        {/* Supported Browser */}
        {isSupported === true && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✅</div>
                <div>
                  <h3 className="font-semibold text-green-900">
                    Browser Supported
                  </h3>
                  <p className="text-sm text-green-800 mt-1">
                    Your browser ({browserInfo}) supports screen sharing. You're
                    ready to proceed with the test.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What to expect:</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">1️⃣</span>
                  <span>Request permission to share your screen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">2️⃣</span>
                  <span>Select which screen/window/tab to share</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">3️⃣</span>
                  <span>View live preview of your shared screen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">4️⃣</span>
                  <span>Test stopping and retrying screen share</span>
                </li>
              </ul>
            </div>

            <Button onClick={handleStartTest} fullWidth>
              Start Screen Test →
            </Button>
          </div>
        )}

        {/* Unsupported Browser */}
        {isSupported === false && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">❌</div>
                <div>
                  <h3 className="font-semibold text-red-900">
                    Browser Not Supported
                  </h3>
                  <p className="text-sm text-red-800 mt-1">
                    Your current browser ({browserInfo}) does not support the
                    screen sharing API (getDisplayMedia).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Recommended Browsers:
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Google Chrome (version 72+)</li>
                <li>• Microsoft Edge (version 79+)</li>
                <li>• Firefox (version 66+)</li>
                <li>• Safari (version 13+)</li>
              </ul>
            </div>

            <Button onClick={handleStartTest} disabled fullWidth>
              Start Screen Test (Unsupported)
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            This application tests browser screen sharing capabilities using the
            native Web API.
          </p>
        </div>
      </div>
    </div>
  );
}
