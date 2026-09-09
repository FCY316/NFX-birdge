import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import useConnectWallet from '@/store/wallet/useConnectWallet';

const useGetTokenBalance = () => {
  const { address, contractEvm: { erc20 } } = useConnectWallet()
  const [tokenBalance, setTokenBalance] = useState(BigInt(0)) // 初始化代币余额状态
  const [tokenBalanceLod, setLoading] = useState(false) // 初始化加载状态
  const getTokenBalance = useCallback(async () => {
    setLoading(true) // 设置加载状态为 true
    try {
      if (address && erc20) { // 确保地址和合约实例存在
        const balance = await erc20.balanceOf(address) // 调用合约方法获取余额
        setTokenBalance(balance) // 更新状态
      }
    } catch (error) {
      console.error("Error fetching token balance:", error) // 捕获并打印错误
    }
    setLoading(false) // 设置加载状态为 false
  }, [address, erc20]) // 依赖项数组，确保在地址或合约实例变化时重新获取余额
  useEffect(() => {
    getTokenBalance()
  }, [getTokenBalance])
  return {
    tokenBalance,
    getTokenBalance, // 返回余额和获取余额的函数
    tokenBalanceLod,
  }
}

export default useGetTokenBalance
