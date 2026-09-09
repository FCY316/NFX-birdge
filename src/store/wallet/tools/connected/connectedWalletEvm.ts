import { ethers } from "ethers";

import { Eip6963ProviderDetail } from "../eip6963";

/**
 * 使用指定的 EIP-6963 provider 创建 ethers 连接对象。
 * requestAccess=false 只请求 eth_accounts，可用于静默恢复与事件同步。
 */
const connectedWalletEvm = async (
  providerDetail: Eip6963ProviderDetail,
  requestAccess = true,
) => {
  const method = requestAccess ? "eth_requestAccounts" : "eth_accounts";
  const accounts = await providerDetail.provider.request({ method });

  if (!Array.isArray(accounts) || typeof accounts[0] !== "string") {
    return null;
  }

  const providerEvm = new ethers.BrowserProvider(providerDetail.provider as any);
  const signer = await providerEvm.getSigner(accounts[0]);
  const addressEvm = await signer.getAddress();

  return {
    providerEvm,
    addressEvm,
    signer,
  };
};

export default connectedWalletEvm;
