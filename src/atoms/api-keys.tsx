import { atom } from "recoil";
import { AtomEffect } from "recoil";
import crypto from "crypto";

// temporary secret and iv for encryption
const secret = "0123456789abcdef0123456789abcdef";
const iv = "0123456789abcdef";

// see https://stackoverflow.com/a/74256045
const store = typeof window !== "undefined" ? window.localStorage : null;

export const localStorageEffect: (key: string) => AtomEffect<any> =
  (key) =>
  ({ setSelf, onSet }) => {
    if (store) {
      const savedValue = store.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(decrypt(savedValue)));
      }

      onSet((newValue, _, isReset) => {
        isReset
          ? store.removeItem(key)
          : store.setItem(key, encrypt(JSON.stringify(newValue)));
      });
    }
  };

export const openAIApiKeyState = atom({
  key: "openAIApiKeyState",
  default: "",
  effects: [localStorageEffect("openAIApiKey")],
});

export const geminiApiKeyState = atom({
  key: "geminiApiKeyState",
  default: "",
  effects: [localStorageEffect("geminiApiKey")],
});

function encrypt(text: string) {
  const cipher = crypto.createCipheriv("aes-256-cbc", secret, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encrypted: string) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", secret, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
