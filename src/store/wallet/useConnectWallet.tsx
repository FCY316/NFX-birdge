import { useConnectWalletEvmStore } from './connectWallet/useWalletEvm';
import { changeChainID } from './tools/setChain/changeChain';

/** 当前项目仅支持 EVM 的钱包连接 Hook。 */
const useConnectWallet = () => {
    // 使用EVM钱包状态管理
    const { addressEvm, connectWalletEvmStore, disconnectWalletEvmStore, discoverWalletProviders, walletProviders, providerEvm, walletNameEvm, walletProviderUuidEvm, chainId, signer, contractEvm } = useConnectWalletEvmStore()

    const changeChainIDFun = (chainID: number) => {
        if (providerEvm) return changeChainID(providerEvm, chainID)
        return Promise.resolve(false)
    }

    return {
        address: addressEvm,
        connectWalletStore: connectWalletEvmStore,
        disconnectWalletStore: disconnectWalletEvmStore,
        discoverWalletProviders,
        walletProviders,
        provider: providerEvm,
        walletName: walletNameEvm,
        walletProviderUuid: walletProviderUuidEvm,
        chainId,
        changeChainIDFun,
        signer,
        contractEvm,
    }
}

export default useConnectWallet
