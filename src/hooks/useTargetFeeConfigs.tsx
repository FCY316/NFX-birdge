// 导入必要的 React 钩子和模块
import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import useConnectWallet
    from '@/store/wallet/useConnectWallet'; // 自定义 Hook，用于连接钱包

// 定义 useTargetFeeConfigs 自定义 Hook，用于获取目标链的手续费配置
const useTargetFeeConfigs = (chain: number) => {
    // 从自定义 Hook 中获取合约实例
    const { contractEvm: { bridge } } = useConnectWallet();

    // 定义状态变量
    const [targetFeeConfigs, setTargetFeeConfigs] = useState({
        baseFee: BigInt(0), // 固定手续费
        protocolFeeRatio: BigInt(0), // 百分比手续费（基点，10000 = 100%）
        minAmount: BigInt(0), // 最小转账金额
        maxAmount: BigInt(0)  // 最大转账金额
    });
    const [targetFeeConfigsLod, setLoading] = useState(false); // 加载状态

    // 定义获取目标链手续费配置的函数
    const getTargetFeeConfigs = useCallback(async () => {
        if (bridge) { // 确保合约实例存在
            try {
                setLoading(true); // 设置加载状态为 true
                const res = await bridge.targetFeeConfigs(chain); // 调用合约方法获取手续费配置
                setTargetFeeConfigs(res); // 更新手续费配置状态
            } catch (error) {
                console.log('getTargetFeeConfigs', error); // 捕获并打印错误
            } finally {
                setLoading(false); // 无论成功或失败，重置加载状态
            }
        }
    }, [bridge, chain]); // 依赖项包括合约实例和目标链 ID

    // 在组件挂载或目标链 ID 变化时调用 getTargetFeeConfigs
    useEffect(() => {
        getTargetFeeConfigs();
    }, [getTargetFeeConfigs]);

    // 返回手续费配置和加载状态
    return {
        targetFeeConfigs, // 手续费配置
        targetFeeConfigsLod // 加载状态
    };
};

// 导出 useTargetFeeConfigs 自定义 Hook
export default useTargetFeeConfigs;
