'use client';

import React, { useEffect, useRef } from 'react';
import { StreamMetadata } from '@/types/screenShare';
import { logger } from '@/utils/logger';

interface StreamPreviewProps {
  stream: MediaStream;
  metadata: StreamMetadata;
}

/**
 * Component to display live screen sharing preview
 */
export const StreamPreview: React.FC<StreamPreviewProps> = ({ stream, metadata }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    logger.debug('StreamPreview: Setting up video element');
    
    if (videoRef.current && stream) {
      logger.debug('StreamPreview: Attaching stream to video element');
      videoRef.current.srcObject = stream;
      
      // Play the video
      videoRef.current.play().catch((err) => {
        logger.error('StreamPreview: Error playing video', err);
      });
    }

    return () => {
      logger.debug('StreamPreview: Cleaning up video element');
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  const displayTypeLabels: Record<string, string> = {
    monitor: 'Entire Screen',
    window: 'Application Window',
    browser: 'Browser Tab',
    unknown: 'Unknown Source',
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Status Badge */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="font-semibold">Screen Stream Active</span>
        </div>
      </div>

      {/* Video Preview */}
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto"
        />
        
        {/* Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="text-white text-sm space-y-1">
            <p className="font-semibold">
              📺 {displayTypeLabels[metadata.displayType]}
            </p>
            <p className="opacity-90">
              📐 Resolution: {metadata.width} × {metadata.height}
            </p>
            <p className="opacity-90">
              🎬 Frame Rate: {metadata.frameRate} fps
            </p>
          </div>
        </div>
      </div>

      {/* Metadata Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Stream Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="bg-white p-3 rounded">
            <p className="text-gray-600 font-medium">Display Type</p>
            <p className="text-gray-900 font-semibold">
              {displayTypeLabels[metadata.displayType]}
            </p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="text-gray-600 font-medium">Resolution</p>
            <p className="text-gray-900 font-semibold">
              {metadata.width} × {metadata.height}
            </p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="text-gray-600 font-medium">Frame Rate</p>
            <p className="text-gray-900 font-semibold">{metadata.frameRate} fps</p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          <span className="font-semibold">Note:</span> This is a local preview only.
          No recording or backend streaming is happening.
        </p>
      </div>
    </div>
  );
};
