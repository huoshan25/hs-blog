import en from "./en"
import zh from "./zn"

export const language = {
  en,
  zh
};

export type language = typeof zh;
export type Locale = keyof typeof language;