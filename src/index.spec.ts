import { main } from './index';

describe('index.ts', () => {
  test('should be callable', () => {
    expect(() => main()).not.toThrow();
  });
});
