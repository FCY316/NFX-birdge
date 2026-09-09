// 导入必要的 React 钩子和模块
import {
    useCallback,
    useState,
} from 'react';

import useConnectWallet
    from '@/store/wallet/useConnectWallet'; // 自定义 Hook，用于连接钱包

// 定义 useCalculateFee 自定义 Hook，用于计算手续费
const useCalculateFee = () => {
    const [calculateFeeLod, setLoading] = useState(false); // 加载状态
    const { contractEvm: { bridge } } = useConnectWallet(); // 从自定义 Hook 中获取合约实例
    const [fee, setFee] = useState({
        baseFee: BigInt(0), // 基础手续费
        protocolFee: BigInt(0), // 协议手续费
    });

    // 定义计算手续费的函数
    const calculateFee = useCallback(async (amount: bigint, chain: number) => {
        if (bridge) { // 确保合约实例存在
            try {
                setLoading(true); // 设置加载状态为 true
                const fee = await bridge.calculateFee(chain, amount); // 调用合约方法计算手续费
                setFee(fee); // 更新手续费状态
                return fee; // 返回手续费
            } catch (error) {
                console.log('calculateFee', error); // 捕获并打印错误
            } finally {
                setLoading(false); // 无论成功或失败，重置加载状态
            }
        }
    }, [bridge]); // 依赖项包括合约实例

    // 返回计算手续费的函数、加载状态和手续费数据
    return {
        calculateFee, // 计算手续费的函数
        calculateFeeLod, // 加载状态
        fee, // 手续费数据
    };
};

// 导出 useCalculateFee 自定义 Hook
export default useCalculateFee;
