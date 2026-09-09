import { useEffect } from 'react';

import {
    SELECTED_PROVIDER_STORAGE_KEY,
    useConnectWalletEvmStore,
} from './connectWallet/useWalletEvm';
import { getLocal } from './tools/strage';

/**
 * 自定义 Hook，用于在组件中初始化 Solana 钱包连接
 * @param chain 当前区块链类型
 */
export const useConnectWalletInt = (removeLocalToken?: Function) => {
    const {
        addressEvm,
        connectWalletEvmStore,
        discoverWalletProviders,
        walletProviders,
    } = useConnectWalletEvmStore();
    useEffect(() => {
        const providerRdns = getLocal(SELECTED_PROVIDER_STORAGE_KEY);
        const providerDetail = walletProviders.find(
            ({ info }) => info.rdns === providerRdns,
        );
        if (providerRdns && !addressEvm && providerDetail) {
            connectWalletEvmStore(
                providerDetail.info.uuid,
                removeLocalToken,
                true,
                false,
            );
        }

        discoverWalletProviders();
    }, [
        addressEvm,
        connectWalletEvmStore,
        discoverWalletProviders,
        removeLocalToken,
        walletProviders,
    ]);
};
