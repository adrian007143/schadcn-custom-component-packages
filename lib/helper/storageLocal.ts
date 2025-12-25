export function loadFromLocalStorage<T>(key: string): T | undefined {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : undefined;
  } catch {
    return undefined;
  }
}

export function saveToLocalStorage<T>(data: T, key: string): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.error("Error saving to localStorage:", key);
  }
}
