import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Set timezone and mock date
process.env.TZ = 'UTC';
const mockDate = new Date('2025-10-01T00:00:00.000Z');
global.Date = class extends Date {
  constructor(date?: string | number | Date) {
    return date ? super(date as any) : mockDate;
  }
  static now() {
    return mockDate.getTime();
  }
} as DateConstructor;

// Clean up after each test case
afterEach(() => {
  cleanup();
});