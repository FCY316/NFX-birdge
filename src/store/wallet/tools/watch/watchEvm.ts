import { Eip1193Provider } from "../eip6963";

/**
 * 监听当前选中 provider 的账户变更。
 * 返回的清理函数只移除本应用注册的 handler，不影响其它模块或第三方库。
 */
export const watchSetAddressEvm = (
  provider: Eip1193Provider,
  fun?: (accounts: string[]) => void,
) => {
  const handler = (...args: unknown[]) => {
    const accounts = args[0];
    fun?.(
      Array.isArray(accounts)
        ? accounts.filter((item): item is string => typeof item === "string")
        : [],
    );
  };

  provider.on?.("accountsChanged", handler);
  return () => provider.removeListener?.("accountsChanged", handler);
};

/** 监听当前选中 provider 的网络变更。 */
export const watchSetNetWorkEvm = (
  provider: Eip1193Provider,
  fun?: (chainId: string) => void,
) => {
  const handler = (...args: unknown[]) => {
    const chainId = args[0];
    if (typeof chainId === "string") fun?.(chainId);
  };

  provider.on?.("chainChanged", handler);
  return () => provider.removeListener?.("chainChanged", handler);
};
