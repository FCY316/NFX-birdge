import { create } from "zustand";

interface AppState {
  addressType: string;
  setAddressType: (token: string) => void;
}

export const useAddressType = create<AppState>((set) => {
  // 初始化 token，尝试从本地存储中获取
  let initialAddressType: string = "hg";
  if (typeof window !== "undefined") {
    initialAddressType = localStorage.getItem("addressType") || "hg";
  }
  return {
    // 初始化的值
    addressType: initialAddressType,
    // 设置token
    setAddressType: (addressType: string) => {
      localStorage.setItem("addressType", addressType);
      return set({ addressType });
    },
  };
});

export default useAddressType;
