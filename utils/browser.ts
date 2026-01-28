import { logger } from './logger';

/**
 * Check if the browser supports screen sharing
 */
export const isScreenShareSupported = (): boolean => {
  logger.debug('Checking browser screen share support');
  
  const hasNavigator = typeof navigator !== 'undefined';
  const hasMediaDevices = hasNavigator && 'mediaDevices' in navigator;
  const hasGetDisplayMedia = hasMediaDevices && 'getDisplayMedia' in navigator.mediaDevices;
  
  logger.debug('Browser support check:', {
    hasNavigator,
    hasMediaDevices,
    hasGetDisplayMedia,
  });
  
  return hasGetDisplayMedia;
};

/**
 * Get browser information for debugging
 */
export const getBrowserInfo = (): string => {
  if (typeof navigator === 'undefined') {
    return 'Unknown (no navigator)';
  }
  
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) {
    return 'Chrome';
  } else if (userAgent.includes('Edg')) {
    return 'Edge';
  } else if (userAgent.includes('Firefox')) {
    return 'Firefox';
  } else if (userAgent.includes('Safari')) {
    return 'Safari';
  }
  
  return 'Unknown';
};
