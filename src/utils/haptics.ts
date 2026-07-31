/**
 * Krithiq AI Mobile Haptic Feedback Utility
 * Provides subtle tactile vibration patterns for mobile web interaction
 */

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'listening' | 'command';

export const triggerHaptic = (pattern: HapticPattern = 'light') => {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (pattern) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate(35);
        break;
      case 'success':
        // Two light pulses
        navigator.vibrate([15, 40, 25]);
        break;
      case 'warning':
        navigator.vibrate([30, 50, 30]);
        break;
      case 'error':
        // Three quick pulses
        navigator.vibrate([40, 30, 40, 30, 50]);
        break;
      case 'listening':
        // Gentle pulse on voice trigger start
        navigator.vibrate([12, 30, 18]);
        break;
      case 'command':
        // Quick energetic double tap
        navigator.vibrate([20, 30, 20]);
        break;
      default:
        navigator.vibrate(10);
    }
  } catch (e) {
    // Ignore unsupported hardware / user interaction policies
  }
};
