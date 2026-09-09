import { Contract, JsonRpcSigner } from "ethers";

import { objKeyObjectType } from "@/interface"; // 引入自定义类型，表示合约对象的结构

import { evmCAddress } from "./cAddress"; // 引入所有链的合约地址和 ABI

/**
 * 根据传入的链 ID 和签名器，生成对应链上的所有合约实例
 * @param chainIdWithoutSuffix - 数字类型的链 ID
 * @param signer - ethers.js 中的签名器，用于与合约交互
 * @returns 包含所有合约实例的对象，如果不存在对应链或 signer 为空，则返回空对象
 */
export const intContractEvm: objKeyObjectType = {
  erc20: null,
  doubleStaking: null,
  token: null,
};
const contractEvm = (
  chainIdWithoutSuffix: number,
  signer: JsonRpcSigner | null,
): objKeyObjectType => {
  try {
    let obj: objKeyObjectType = { ...intContractEvm }; // 初始化返回的合约对象容器
    // 将链 ID 转为字符串并获取对应链的合约列表
    const chainContracts = evmCAddress[String(chainIdWithoutSuffix)];

    // 如果该链没有配置合约，或者 signer 为空，直接返回空对象
    if (!chainContracts || !signer) return obj;

    // 遍历该链上的所有合约配置
    for (const contractName in chainContracts) {
      const { address, abi } = chainContracts[contractName];
      // 创建合约实例并存入对象中
      if (!address) continue;
      obj[contractName] = new Contract(address, abi, signer);
    }

    return obj; // 返回包含合约实例的对象
  } catch (e) {
    console.log("useNewContract", e); // 捕获并打印错误
    return intContractEvm; // 发生异常时返回空对象
  }
};

export default contractEvm;
