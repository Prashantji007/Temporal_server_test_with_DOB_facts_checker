/// <reference types="@testing-library/jest-dom" />
/// <reference types="jest" />

declare namespace NodeJS {
  interface Global {
    ResizeObserver: any;
  }
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toBeDisabled(): R;
    }
  }
}

export {};