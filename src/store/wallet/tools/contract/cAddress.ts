import { Interface, InterfaceAbi } from "ethers"; // 从 ethers.js 中引入 Interface 类型和 ABI 接口类型

import rec20 from "./abi/erc20.json";
import bridge from "./abi/bridge.json";
import { evmChain } from "@/collocate";

/**
 * 定义一个对象 `evmCAddress`，用于存储 EVM 链（以 chainId 为键）上部署的所有合约地址与 ABI 信息
 * 格式为：
 * {
 *   [chainId: string]: {
 *     [contractName: string]: {
 *       address: string;      // 合约地址
 *       abi: Interface | InterfaceAbi;  // 合约 ABI，可以是 ethers 的 Interface 实例或原始 ABI 对象
 *     }
 *   }
 * }
 */
export const evmCAddress: {
  [key: string]: {
    [contractName: string]: { address: string; abi: Interface | InterfaceAbi };
  };
} = {
  [evmChain[0]]: {
    // erc20 合约配置
    erc20: {
      // address: "0x8AB13cEF518432124Ca9823264bDcF18B9C72a42", // 合约地址
      address: process.env.REACT_APP_1677_ERC20_ADDRESS as string, // 从环境变量中获取 ERC20 合约地址，若未设置则使用默认地址
      abi: rec20, // 引入的 USDT 合约 ABI（ERC20 格式）
    },
    // 桥的合约配置
    bridge: {
      // address: "0xDdAd48Bd32bD485e12bd8115b49cd761e6859b5f",
      address: process.env.REACT_APP_1677_BRIDGE_ADDRESS as string, // 从环境变量中获取 Bridge 合约地址，若未设置则使用默认地址
      abi: bridge,
    },
  },
  [evmChain[1]]: {
    // erc20 合约配置
    erc20: {
      // address: "0x5a0ee0f97969f1a2c6ff8774021c6370d04a830c", // 合约地址
      address: process.env.REACT_APP_56_ERC20_ADDRESS as string, // 从环境变量中获取 ERC20 合约地址，若未设置则使用默认地址
      abi: rec20, // 引入的 USDT 合约 ABI（ERC20 格式）
    },
    // 桥的合约配置
    bridge: {
      // address: "0xDdAd48Bd32bD485e12bd8115b49cd761e6859b5f",
      address: process.env.REACT_APP_56_BRIDGE_ADDRESS as string, // 从环境变量中获取 Bridge 合约地址，若未设置则使用默认地址
      abi: bridge,
    },
  },
};
