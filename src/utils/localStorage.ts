/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import { useState } from "react";
import { ZodType, z } from "zod";

/**
 *
 * @param item string that reperesent key in local storage you wanna get
 * @param schema optional parameter to parse value from local storage
 * @returns item from localStorage | null
 */
export const getItemFromStorage = <T extends unknown>(
  item: string,
  schema: ZodType<T, any> = z.any(),
): T | null => {
  try {
    const itemFromStorage = localStorage.getItem(item);

    /**
     * if item is string representing null OR undefined -> return null
     */
    if (
      typeof itemFromStorage === "string" &&
      (itemFromStorage === "undefined" || itemFromStorage === "null")
    )
      return null;

    /**
     * if item is simple string -> return the value as it is
     */
    if (typeof itemFromStorage === "string") return itemFromStorage as T;

    return itemFromStorage ? schema.parse(JSON.parse(itemFromStorage)) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const setItemInStorage = (item: string, value: unknown): boolean => {
  try {
    localStorage.setItem(item, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const removeItemFromStorage = (item: string) => {
  localStorage.removeItem(item);
};

export const useStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);

      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
