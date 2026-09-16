import { useEffect, useRef } from 'react';

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

    // 部分钱包 WebView 收到发现请求后会再次公告 provider。发现流程不能依赖
    // provider 列表，否则会形成：请求 -> 公告 -> 状态更新 -> effect -> 再次请求。
    useEffect(() => {
        discoverWalletProviders();
    }, [discoverWalletProviders]);

    // 同一钱包自动连接失败后，不应在每次 provider 公告时重复尝试。
    const attemptedProviderRdns = useRef<string | null>(null);

    useEffect(() => {
        const providerRdns = getLocal(SELECTED_PROVIDER_STORAGE_KEY);
        const providerDetail = walletProviders.find(
            ({ info }) => info.rdns === providerRdns,
        );
        if (
            providerRdns &&
            !addressEvm &&
            providerDetail &&
            attemptedProviderRdns.current !== providerRdns
        ) {
            attemptedProviderRdns.current = providerRdns;
            connectWalletEvmStore(
                providerDetail.info.uuid,
                removeLocalToken,
                true,
                false,
            );
        }
    }, [
        addressEvm,
        connectWalletEvmStore,
        removeLocalToken,
        walletProviders,
    ]);
};
