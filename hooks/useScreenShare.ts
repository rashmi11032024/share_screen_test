'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  PermissionState,
  StreamMetadata,
  UseScreenShareReturn,
  DisplayType,
} from '@/types/screenShare';
import { logger } from '@/utils/logger';

/**
 * Custom hook for managing screen sharing lifecycle
 * Handles permissions, stream management, and cleanup
 */
export const useScreenShare = (): UseScreenShareReturn => {
  const [permissionState, setPermissionState] = useState<PermissionState>(
    PermissionState.IDLE
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [metadata, setMetadata] = useState<StreamMetadata | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);

  /**
   * Extract display type from video track settings
   */
  const getDisplayType = (track: MediaStreamTrack): DisplayType => {
    logger.debug('Extracting display type from track');
    
    const settings = track.getSettings();
    logger.debug('Track settings:', settings);
    
    // @ts-ignore - displaySurface is not in TypeScript definitions yet
    const displaySurface = settings.displaySurface;
    
    if (displaySurface === 'monitor') return 'monitor';
    if (displaySurface === 'window') return 'window';
    if (displaySurface === 'browser') return 'browser';
    
    logger.warn('Unknown display surface type:', displaySurface);
    return 'unknown';
  };

  /**
   * Extract stream metadata from video track
   */
  const extractMetadata = useCallback((mediaStream: MediaStream): StreamMetadata => {
    logger.group('Extracting stream metadata');
    
    const videoTrack = mediaStream.getVideoTracks()[0];
    
    if (!videoTrack) {
      logger.error('No video track found in stream');
      logger.groupEnd();
      throw new Error('No video track found');
    }
    
    const settings = videoTrack.getSettings();
    
    const metadata: StreamMetadata = {
      displayType: getDisplayType(videoTrack),
      width: settings.width || 0,
      height: settings.height || 0,
      frameRate: settings.frameRate || 0,
    };
    
    logger.info('Stream metadata extracted:', metadata);
    logger.groupEnd();
    
    return metadata;
  }, []);

  /**
   * Clean up media stream and tracks
   */
  const cleanupStream = useCallback((mediaStream: MediaStream | null) => {
    if (!mediaStream) {
      logger.debug('No stream to cleanup');
      return;
    }
    
    logger.group('Cleaning up stream');
    
    const tracks = mediaStream.getTracks();
    logger.debug(`Stopping ${tracks.length} track(s)`);
    
    tracks.forEach((track, index) => {
      logger.debug(`Stopping track ${index + 1}: ${track.kind} - ${track.label}`);
      track.stop();
    });
    
    logger.info('Stream cleanup complete');
    logger.groupEnd();
  }, []);

  /**
   * Handle stream end event
   */
  const handleStreamEnd = useCallback(() => {
    logger.warn('Stream ended - user stopped sharing or browser ended stream');
    
    if (!isMountedRef.current) {
      logger.debug('Component unmounted, skipping state updates');
      return;
    }
    
    setIsActive(false);
    setPermissionState(PermissionState.IDLE);
    setStream(null);
    setMetadata(null);
    
    logger.info('State reset after stream end');
  }, []);

  /**
   * Request screen sharing permission and start capture
   */
  const requestScreenShare = useCallback(async () => {
    logger.group('Requesting screen share');
    logger.info('User initiated screen share request');
    
    // Reset error state
    setError(null);
    setPermissionState(PermissionState.REQUESTING);
    
    try {
      logger.debug('Calling getDisplayMedia API');
      
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 30 },
        },
        audio: false,
      });
      
      logger.info('Screen share permission granted');
      logger.debug('Stream obtained:', {
        id: mediaStream.id,
        active: mediaStream.active,
        trackCount: mediaStream.getTracks().length,
      });
      
      // Extract metadata
      const streamMetadata = extractMetadata(mediaStream);
      
      // Set up stream end listener
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        logger.debug('Setting up onended listener for video track');
        
        videoTrack.onended = () => {
          logger.warn('Video track ended event fired');
          handleStreamEnd();
        };
      }
      
      // Update state only if component is still mounted
      if (isMountedRef.current) {
        setPermissionState(PermissionState.GRANTED);
        setStream(mediaStream);
        setMetadata(streamMetadata);
        setIsActive(true);
        
        logger.info('Screen share started successfully');
      } else {
        logger.warn('Component unmounted during request, cleaning up stream');
        cleanupStream(mediaStream);
      }
      
      logger.groupEnd();
      
    } catch (err: any) {
      logger.group('Screen share request failed');
      logger.error('Error occurred:', err);
      
      if (!isMountedRef.current) {
        logger.debug('Component unmounted, skipping error handling');
        logger.groupEnd();
        return;
      }
      
      // Determine the type of error
      if (err.name === 'NotAllowedError') {
        if (err.message.includes('cancelled') || err.message.includes('dismiss')) {
          logger.warn('User cancelled the screen picker');
          setPermissionState(PermissionState.CANCELLED);
        } else {
          logger.warn('Permission denied by user or system');
          setPermissionState(PermissionState.DENIED);
        }
      } else if (err.name === 'NotFoundError') {
        logger.error('No screen/window/tab was selected');
        setPermissionState(PermissionState.CANCELLED);
      } else if (err.name === 'NotSupportedError') {
        logger.error('Screen sharing not supported');
        setPermissionState(PermissionState.ERROR);
      } else if (err.name === 'AbortError') {
        logger.warn('Request was aborted');
        setPermissionState(PermissionState.CANCELLED);
      } else {
        logger.error('Unknown error occurred');
        setPermissionState(PermissionState.ERROR);
      }
      
      setError(err);
      setIsActive(false);
      
      logger.groupEnd();
    }
  }, [extractMetadata, handleStreamEnd, cleanupStream]);

  /**
   * Stop screen sharing manually
   */
  const stopScreenShare = useCallback(() => {
    logger.info('Manual stop screen share requested');
    
    if (!stream) {
      logger.warn('No active stream to stop');
      return;
    }
    
    cleanupStream(stream);
    
    if (isMountedRef.current) {
      setIsActive(false);
      setPermissionState(PermissionState.IDLE);
      setStream(null);
      setMetadata(null);
      
      logger.info('Screen share stopped successfully');
    }
  }, [stream, cleanupStream]);

  /**
   * Cleanup on component unmount
   */
  useEffect(() => {
    logger.debug('useScreenShare hook mounted');
    
    return () => {
      logger.debug('useScreenShare hook unmounting - cleaning up');
      isMountedRef.current = false;
      
      if (stream) {
        cleanupStream(stream);
      }
    };
  }, [stream, cleanupStream]);

  return {
    permissionState,
    stream,
    metadata,
    error,
    isActive,
    requestScreenShare,
    stopScreenShare,
  };
};
