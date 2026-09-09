import { BrowserProvider } from 'ethers';

import { chainParams } from '@/collocate';

/**
 * 切换以太坊网络链
 * @param provider - 以太坊浏览器提供者 (BrowserProvider)
 * @param chainID - 目标链的 ID (number)
 */
export const changeChainID = async (
  provider: BrowserProvider,
  chainID: number
) => {
  const params = [{ chainId: `0x${chainID.toString(16)}` }];
  try {
    await (provider as any).send("wallet_switchEthereumChain", params);
    return true;
  } catch (e: any) {
    console.log("changeChainID", e);
    const errorCode = e?.info?.error?.code ?? e?.code;
    if (errorCode !== 4001 && errorCode !== "ACTION_REJECTED") {
      const added = await addChainID(provider, chainID);
      if (!added) return false;

      try {
        await (provider as any).send("wallet_switchEthereumChain", params);
        return true;
      } catch (switchError) {
        console.log("changeChainID-after-add", switchError);
      }
    }
    return false;
  }
};

/**
 * 添加新的以太坊网络链
 * @param provider - 以太坊浏览器提供者 (BrowserProvider)
 * @param chainID - 目标链的 ID (number)
 */
export const addChainID = async (
  provider: BrowserProvider,
  chainID: number
) => {
  try {
    if (!chainParams[chainID]) return false;
    // 构造链的配置信息
    const data = {
      ...chainParams[chainID], // 获取对应链 ID 的参数配置
      chainId: `0x${chainID.toString(16)}`, // 转换为 16 进制格式
    };
    // 调用以太坊钱包的方法添加新的链
    await (provider as any).send("wallet_addEthereumChain", [data]);
    return true;
  } catch (e) {
    console.log("useChangeChain", e);
    return false;
  }
};
