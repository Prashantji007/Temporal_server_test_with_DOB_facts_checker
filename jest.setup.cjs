require('@testing-library/jest-dom');

global.ResizeObserver = require('resize-observer-polyfill');

// Set fixed date for tests
const mockDate = new Date('2025-10-01T00:00:00.000Z');
const RealDate = Date;
global.Date = class extends RealDate {
  constructor(date) {
    return date ? super(date) : mockDate;
  }
};
global.Date.now = () => mockDate.getTime();

// Mock window.matchMedia
window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Set timezone for consistent date testing
process.env.TZ = 'UTC';