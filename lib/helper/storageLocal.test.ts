import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "./storageLocal.ts";

type StorageMock = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

function createStorageMock(
  initialData: Record<string, string> = {}
): StorageMock {
  const store = new Map<string, string>(Object.entries(initialData));

  return {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

function setBrowserGlobals(storage: StorageMock): void {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: {},
  });

  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    writable: true,
    value: storage,
  });
}

function clearBrowserGlobals(): void {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: undefined,
  });

  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    writable: true,
    value: undefined,
  });
}

afterEach(() => {
  clearBrowserGlobals();
});

test("returns undefined for missing key", () => {
  setBrowserGlobals(createStorageMock());
  assert.equal(loadFromLocalStorage("missing-key"), undefined);
});

test("returns parsed value for valid JSON without validator", () => {
  setBrowserGlobals(createStorageMock({ profile: '{"name":"Ada"}' }));
  assert.deepEqual(loadFromLocalStorage<{ name: string }>("profile"), {
    name: "Ada",
  });
});

test("returns undefined for invalid JSON", () => {
  setBrowserGlobals(createStorageMock({ broken: "{not-json" }));
  assert.equal(loadFromLocalStorage("broken"), undefined);
});

test("returns validated value when validator passes", () => {
  setBrowserGlobals(createStorageMock({ ok: '{"id":7}' }));
  const validate = (value: unknown): value is { id: number } => {
    return (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof value.id === "number"
    );
  };

  assert.deepEqual(loadFromLocalStorage("ok", validate), { id: 7 });
});

test("returns undefined when validator fails", () => {
  setBrowserGlobals(createStorageMock({ bad: '{"id":"7"}' }));
  const validate = (value: unknown): value is { id: number } => {
    return (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof value.id === "number"
    );
  };

  assert.equal(loadFromLocalStorage("bad", validate), undefined);
});

test("saveToLocalStorage writes serialized value in browser context", () => {
  const storage = createStorageMock();
  setBrowserGlobals(storage);

  saveToLocalStorage({ feature: true }, "settings");

  assert.equal(storage.getItem("settings"), '{"feature":true}');
});

test("SSR/no-window behavior: load returns undefined and save does not throw", () => {
  clearBrowserGlobals();
  assert.equal(loadFromLocalStorage("any"), undefined);
  assert.doesNotThrow(() => saveToLocalStorage({ value: 1 }, "key"));
});

test("save error path logs and does not throw", () => {
  setBrowserGlobals({
    getItem() {
      return null;
    },
    setItem() {
      throw new Error("quota exceeded");
    },
  });

  const originalConsoleError = console.error;
  let errorCalled = false;

  try {
    console.error = (...args: unknown[]) => {
      errorCalled = true;
      assert.equal(args[0], "Error saving to localStorage:");
      assert.equal(args[1], "key");
    };

    assert.doesNotThrow(() => saveToLocalStorage({ a: 1 }, "key"));
    assert.equal(errorCalled, true);
  } finally {
    console.error = originalConsoleError;
  }
});
