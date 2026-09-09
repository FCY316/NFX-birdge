// store.ts
import { create } from "zustand";

interface AppState {
  language: string | null;
  setLanguage: (language: string) => void;
}

export const useLanguage = create<AppState>((set) => ({
  // 初始化的值
  language: localStorage.getItem("language") || null,
  // 设置language
  setLanguage: (language: string) => {
    localStorage.setItem("language", language);
    return set({ language });
  },
}));

export default useLanguage;
