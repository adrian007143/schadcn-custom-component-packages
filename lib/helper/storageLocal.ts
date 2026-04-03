export function loadFromLocalStorage<T>(
  key: string,
  validate?: (value: unknown) => value is T
): T | undefined {
  // Guard server-side usage where localStorage is unavailable.
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return undefined;
  }

  let item: string | null;
  try {
    item = localStorage.getItem(key);
  } catch {
    return undefined;
  }

  if (!item) {
    return undefined;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(item) as unknown;
  } catch {
    return undefined;
  }

  if (validate && !validate(parsed)) {
    return undefined;
  }

  return parsed as T;
}

export function saveToLocalStorage<T>(data: T, key: string): void {
  // Guard server-side usage where localStorage is unavailable.
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", key, error);
  }
}
