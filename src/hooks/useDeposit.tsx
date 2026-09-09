import {
    useCallback,
    useState,
} from 'react';

import { toast } from 'react-toastify'; // 用于显示通知消息

import useConnectWallet
    from '@/store/wallet/useConnectWallet'; // 自定义 Hook，用于连接钱包

import useListenerTransfer from './useListenerTransfer'; // 自定义 Hook，用于监听交易事件

// 定义 useDeposit 自定义 Hook，用于处理存款操作
const useDeposit = (successFun?: Function, errorFun?: Function) => {
    const [depositLod, setDeposit] = useState(false); // 加载状态
    const { contractEvm: { bridge } } = useConnectWallet(); // 从自定义 Hook 中获取合约实例
    const listenerTransferF = useListenerTransfer(); // 获取监听交易事件的函数

    // 定义存款操作的回调函数
    const deposit = useCallback(async (chain: number, amount: bigint, address: string, toastText?: { success: string, error: string }) => {
        if (bridge) { // 确保合约实例存在
            try {
                setDeposit(true); // 设置加载状态为 true
                const { hash } = await bridge.deposit(chain, amount, address); // 调用合约方法进行存款操作
                // 使用交易哈希监听交易结果
                const relset = await listenerTransferF(hash);
                if (relset) { // 如果交易成功
                    toastText && toast.success(
                        toastText.success // 显示成功通知
                    );
                    successFun && successFun(); // 调用成功回调函数
                } else { // 如果交易失败
                    toastText && toast.error(
                        toastText.error // 显示错误通知
                    );
                    errorFun && errorFun(); // 调用错误回调函数
                }
            } catch (error) {
                console.log('useDeposit', error); // 捕获并打印错误
            } finally {
                setDeposit(false); // 无论成功或失败，重置加载状态
            }
        }
    }, [errorFun, listenerTransferF, successFun, bridge]); // 依赖项包括合约实例

    // 返回存款操作的函数和加载状态
    return {
        deposit, // 存款操作的函数
        depositLod, // 加载状态
    };
};

// 导出 useDeposit 自定义 Hook
export default useDeposit;
