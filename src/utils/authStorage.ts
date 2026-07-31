/**
 * Krithiq AI - Secure Storage & Session Helpers
 */

import { User, AuthSession, AuthStep, UserRole } from '../types';

const STORAGE_KEYS = {
  SESSION: 'krithiq_auth_session',
  USER: 'krithiq_auth_user',
  STEP: 'krithiq_auth_step',
};

export const getStoredSession = (): AuthSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored auth session', e);
    return null;
  }
};

export const saveSession = (session: AuthSession) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session', e);
  }
};

export const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored user', e);
    return null;
  }
};

export const saveUser = (user: User) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user', e);
  }
};

export const getStoredAuthStep = (): AuthStep | null => {
  try {
    return (localStorage.getItem(STORAGE_KEYS.STEP) as AuthStep) || null;
  } catch (e) {
    return null;
  }
};

export const saveAuthStep = (step: AuthStep) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STEP, step);
  } catch (e) {
    console.error('Failed to save auth step', e);
  }
};

export const clearAuthStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.STEP);
  } catch (e) {
    console.error('Failed to clear auth storage', e);
  }
};

export const generateSecureToken = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
};
