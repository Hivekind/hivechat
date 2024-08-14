import { AtomEffect } from "recoil";
import crypto from "crypto";

function encrypt(text: string) {
  const secret = crypto.randomBytes(16).toString("hex");
  const iv = crypto.randomBytes(8).toString("hex");
  const cipher = crypto.createCipheriv("aes-256-cbc", secret, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${encrypted}g${secret}g${iv}`;
}

function decrypt(encrypted: string) {
  const [encryptedText, secret, iv] = encrypted.split("g");
  const decipher = crypto.createDecipheriv("aes-256-cbc", secret, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

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

export const encryptedLocalStorageEffect: (key: string) => AtomEffect<any> =
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
