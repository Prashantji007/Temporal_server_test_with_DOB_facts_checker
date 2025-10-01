import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

// Extend Vitest's expect method
expect.extend(matchers);

// Mock window if it's not defined (for jsdom)
if (typeof window === 'undefined') {
  const { window } = require('jsdom').JSDOM.fragment('');
  global.window = window;
}

// Mock ResizeObserver
window.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Set timezone and mock date
vi.useFakeTimers();
vi.setSystemTime(new Date('2025-10-01T00:00:00.000Z'));

// Clean up after each test case
afterEach(() => {
  cleanup();
});