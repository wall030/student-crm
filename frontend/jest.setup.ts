import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }),
});

const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (/Cross origin.*forbidden/.test(args[0])) {
            return; // Suppress specific CORS errors
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError; // Restore original behavior after tests
});
