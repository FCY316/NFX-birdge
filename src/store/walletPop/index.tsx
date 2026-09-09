import { create } from "zustand";

interface WalletPopState {
  openWallet: boolean;
  setOpenWallet: (openWallet?: boolean) => void;
}

/** 全局钱包选择弹窗的开关状态。 */
const useWalletPop = create<WalletPopState>((set) => ({
  openWallet: false,
  setOpenWallet: (openWallet = true) => set({ openWallet }),
}));

export default useWalletPop;
