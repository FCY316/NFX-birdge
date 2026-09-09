import { BrowserProvider, JsonRpcSigner } from "ethers";
import { toast } from "react-toastify";
import { create } from "zustand";

import { evmChain } from "@/collocate";
import { objKeyObjectType } from "@/interface";
import useWalletPop from "@/store/walletPop";

import connectedWalletEvm from "../tools/connected/connectedWalletEvm";
import contractEvm, { intContractEvm } from "../tools/contract/contractEvm";
import {
  Eip6963ProviderDetail,
  findEip6963Provider,
  getEip6963Providers,
  requestEip6963Providers,
  subscribeEip6963Providers,
} from "../tools/eip6963";
import { changeChainID } from "../tools/setChain/changeChain";
import { removeLocal, setLocal } from "../tools/strage";
import {
  watchSetAddressEvm,
  watchSetNetWorkEvm,
} from "../tools/watch/watchEvm";

/** UUID 仅在当前页面会话有效；刷新页面后以 rdns 重新匹配上次选择的钱包。 */
const SELECTED_PROVIDER_STORAGE_KEY = "walletEvmProviderRdns";

interface ConnectWalletEvmState {
  connectWalletEvmStore: (
    providerUuid?: string,
    watchChangeFun?: Function,
    changeChain?: boolean,
    requestAccess?: boolean,
  ) => Promise<boolean>;
  disconnectWalletEvmStore: () => void;
  discoverWalletProviders: () => void;
  walletProviders: Eip6963ProviderDetail[];
  chainId: number | null;
  walletNameEvm: string | null;
  walletProviderUuidEvm: string | null;
  addressEvm: string;
  providerEvm: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  contractEvm: objKeyObjectType;
}

/** 当前 DApp 只保留一组账户与网络监听器。 */
let stopWatching: (() => void) | undefined;

const toChainId = (chainId: bigint | number | string) => Number(chainId);

/**
 * 使用 Zustand 创建一个管理 EVM 兼容钱包连接状态的 store
 * 该 store 提供钱包的连接、断开和状态管理功能
 */
export const useConnectWalletEvmStore = create<ConnectWalletEvmState>(
  (set) => {
    const clearWatching = () => {
      stopWatching?.();
      stopWatching = undefined;
    };

    const connectWalletEvmStore = async (
      providerUuid?: string,
      watchChangeFun?: Function,
      changeChain = true,
      requestAccess = true,
    ) => {
      requestEip6963Providers();

      if (!providerUuid) {
        useWalletPop.getState().setOpenWallet(true);
        return false;
      }

      const providerDetail = findEip6963Provider(providerUuid);
      if (!providerDetail) {
        console.warn(`未找到 EIP-6963 provider: ${providerUuid}`);
        return false;
      }

      try {
        let connectedWallet = await connectedWalletEvm(
          providerDetail,
          requestAccess,
        );
        if (!connectedWallet) return false;

        let chainId = toChainId(
          (await connectedWallet.providerEvm.getNetwork()).chainId,
        );
        if (!evmChain.includes(chainId) && changeChain) {
          const switched = await changeChainID(
            connectedWallet.providerEvm,
            evmChain[0],
          );
          if (!switched) return false;

          connectedWallet = await connectedWalletEvm(providerDetail, false);
          if (!connectedWallet) return false;
          chainId = toChainId(
            (await connectedWallet.providerEvm.getNetwork()).chainId,
          );
        }
        clearWatching();
        const stopAddressWatching = watchSetAddressEvm(
          providerDetail.provider,
          async (accounts) => {
            if (accounts.length === 0) {
              disconnectWalletEvmStore();
              watchChangeFun?.();
              return;
            }

            const reconnected = await connectWalletEvmStore(
              providerUuid,
              watchChangeFun,
              false,
              false,
            );
            if (reconnected) watchChangeFun?.();
          },
        );
        const stopNetworkWatching = watchSetNetWorkEvm(
          providerDetail.provider,
          async (changedChainId) => {
            const reconnected = await connectWalletEvmStore(
              providerUuid,
              watchChangeFun,
              false,
              false,
            );
            if (reconnected) watchChangeFun?.();

            const numericChainId = toChainId(changedChainId);
            if (!evmChain.includes(numericChainId)) {
              toast.warning(`您当前处于 ${numericChainId} 链，无法为您提供服务。`);
            }
          },
        );
        stopWatching = () => {
          stopAddressWatching();
          stopNetworkWatching();
        };

        const contract = contractEvm(chainId, connectedWallet.signer);
        setLocal(SELECTED_PROVIDER_STORAGE_KEY, providerDetail.info.rdns);
        set({
          addressEvm: connectedWallet.addressEvm,
          providerEvm: connectedWallet.providerEvm,
          signer: connectedWallet.signer,
          contractEvm: contract,
          walletNameEvm: providerDetail.info.name,
          walletProviderUuidEvm: providerUuid,
          chainId,
        });
        return true;
      } catch (error) {
        console.error("error-connectedWalletEvm", error);
        return false;
      }
    };

    /**
     * 断开当前连接的 EVM 兼容钱包
     */
    const disconnectWalletEvmStore = () => {
      clearWatching();
      removeLocal(SELECTED_PROVIDER_STORAGE_KEY);
      set({
        addressEvm: "",
        providerEvm: null,
        walletNameEvm: null,
        walletProviderUuidEvm: null,
        signer: null,
        chainId: null,
        contractEvm: intContractEvm,
      });
    };

    const discoverWalletProviders = () => requestEip6963Providers();
    subscribeEip6963Providers((walletProviders) => set({ walletProviders }));

    const walletNameEvm = null;
    return {
      discoverWalletProviders,
      walletProviders: getEip6963Providers(),
      walletProviderUuidEvm: null,
      connectWalletEvmStore, // 连接钱包方法
      addressEvm: "", // 钱包地址，初始为空
      walletNameEvm, // 钱包名称，初始为空
      disconnectWalletEvmStore, // 断开钱包方法
      chainId: null, // 当前链ID，初始为空
      providerEvm: null, // 钱包提供者，初始为 null
      signer: null, // 钱包签名者，初始为 null
      contractEvm: intContractEvm,
    };
  }
);

export { SELECTED_PROVIDER_STORAGE_KEY };
