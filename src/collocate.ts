export const evmChain = [1677, 56]; // 支持的链ID列表
export const chainParams: any = {
  1677: {
    chainId: 1677,
    chainName: "InterstellarChain", // 自定义链的名称
    nativeCurrency: {
      name: "HUGE",
      symbol: "HUGE",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.interstellarchain.org"],
    blockExplorerUrls: ["https://scan.interstellarchain.org/"],
  },
  56: {
    chainId: 56,
    chainName: "BSC",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  97: {
    chainId: 97,
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-testnet-rpc.publicnode.com"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
  },
};

export const chainData = [
  { chainName: "INTERSTELLAR", symbol: "NFX", chainID: evmChain[0] },
  { chainName: "BNB Chain", symbol: "NFX", chainID: evmChain[1] },
];
