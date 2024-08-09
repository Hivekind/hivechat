import { atom } from "recoil";
import { AtomEffect } from "recoil";

// see https://stackoverflow.com/a/74256045
const store = typeof window !== "undefined" ? window.localStorage : null;

export const localStorageEffect: (key: string) => AtomEffect<any> =
  (key) =>
  ({ setSelf, onSet }) => {
    if (store) {
      const savedValue = store.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue, _, isReset) => {
        isReset
          ? store.removeItem(key)
          : store.setItem(key, JSON.stringify(newValue));
      });
    }
  };

export const apiKeysState = atom({
  key: "apiKeysState",
  default: {
    openai: "",
    anthropic: "",
    gemini: "",
  },
  effects: [localStorageEffect("apiKeys")],
});