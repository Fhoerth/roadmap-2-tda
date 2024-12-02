export function assert<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`Value is null or undefined: ${value}`);
  }
}
