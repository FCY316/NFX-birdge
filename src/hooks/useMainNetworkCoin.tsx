/**
 * @description 获取主网币余额 Hook
 * @param begin - 是否在进入页面时就立即获取余额，默认 true
 * @returns balance: 主网币余额（bigint）
 *          balanceLod: 是否正在加载中
 *          getMainNetworkCoin: 手动触发获取余额函数
 */
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import useConnectWallet from '@/store/wallet/useConnectWallet';

// 当前钱包地址的主网币余额，默认为 0
const useMainNetworkCoin = (begin: boolean = true) => {
    const [balance, setBalance] = useState<bigint>(BigInt(0))
    // 是否处于加载状态
    const [balanceLod, setLoading] = useState(false)
    // 获取连接钱包的地址和 provider（此处为 EVM 网络）
    const { address, provider } = useConnectWallet()
    // 获取当前钱包地址的主网币余额（如 ETH、BNB 等）
    const getMainNetworkCoin = useCallback(async () => {
        if (provider) {
            setLoading(true)
            try {
                const res = await provider?.getBalance(address)
                setBalance(res)
            } catch (e) {
                console.log('useMainNetworkCoin', e);
                setBalance(BigInt(0))
            }
            setLoading(false)
        }
    }, [address, provider])
    // 如果 begin 为 true，则在组件挂载时立即调用获取余额的函数
    useEffect(() => {
        begin && getMainNetworkCoin()
    }, [begin, getMainNetworkCoin])
    return { balance, balanceLod, getMainNetworkCoin }
}

export default useMainNetworkCoin
