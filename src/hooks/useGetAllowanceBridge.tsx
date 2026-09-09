import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import { MaxUint256 } from 'ethers'; // 引入ethers库中的最大整数常量，用于无限授权额度
import { toast } from 'react-toastify';

import { evmCAddress } from '@/store/wallet/tools/contract/cAddress';
import useConnectWallet from '@/store/wallet/useConnectWallet';

import useListenerTransfer from './useListenerTransfer';

// 自定义钩子：用于获取和管理Bridge合约的授权额度
const useGetAllowanceBridge = () => {
    // 从useWallet钩子中获取钱包地址、链ID和合约实例
    const { address, chainId, contractEvm: { erc20, } } = useConnectWallet()

    // 定义一个状态变量，用于存储用户的授权额度
    const [allowanceBridge, setAllowanceBridge] = useState<bigint>(BigInt(0))

    // 获取监听交易事件的函数
    const listenerTransferF = useListenerTransfer()

    // 定义一个状态变量，用于标识加载状态
    const [allowanceBridgeLod, setLoading] = useState(false)

    // 获取授权额度的函数
    const getBridgeAllowance = useCallback(async () => {
        // 确保钱包地址和ERC20合约实例存在
        if (address && erc20 && chainId) {
            setLoading(true) // 启动加载状态
            try {
                // 查询授权额度
                const allowances = await erc20.allowance(address, evmCAddress[chainId].bridge.address)
                setAllowanceBridge(allowances) // 更新授权额度状态
            } catch (e) {
                setAllowanceBridge(BigInt(0)) // 出现错误时将授权额度设为0
                console.log('useGetAllowanceBridge', e)
            }
            setLoading(false) // 停止加载状态
        }
    }, [address, chainId, erc20])

    // 执行授权的函数
    const approveBridge = async (toastText?: { success: string, error: string }) => {
        // 确保ERC20合约实例存在
        if (erc20 && chainId) {
            setLoading(true) // 启动加载状态
            try {
                // 执行授权，授权额度为最大整数，表示无限授权
                const { hash } = await erc20.approve(evmCAddress[chainId].bridge.address, MaxUint256)

                // 使用交易哈希监听交易结果
                const relset = await listenerTransferF(hash)
                if (relset) {
                    toastText && toast.success(
                        toastText.success
                    );
                    // 重新查询授权额度
                    getBridgeAllowance()
                } else {
                    toastText && toast.error(
                        toastText.error
                    );
                }
            } catch (e) {
                console.log('useGetAllowanceBridge', e) // 打印错误信息
                setLoading(false) // 停止加载状态
            }
        }
    }

    // 初始化时或依赖变更时调用getAllowance查询授权额度
    useEffect(() => {
        getBridgeAllowance()
    }, [getBridgeAllowance])

    // 返回当前授权额度、加载状态、授权函数和查询额度函数
    return { allowanceBridge, allowanceBridgeLod, approveBridge, getBridgeAllowance }
}

export default useGetAllowanceBridge
