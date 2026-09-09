// 该组件用于展示钱包余额，支持加载状态显示和格式化显示余额数值。

import { formatUnits } from 'ethers';

import { formatNumber } from '@/utils';
import { LoadingOutlined } from '@ant-design/icons';

// BalanceCom 组件接收余额数据并格式化显示，加载中则显示 Loading 图标。
const BalanceCom = ({
  balance,     // 表示以最小单位表示的余额（如 wei）
  loading,     // 是否处于加载状态
  className,    // 可选的自定义样式类
  unit = 18,    // 精度
  qText = '',   // 前面
  text = '',    // 后面
  isFormatUnits = true, // 是否格式化为以 ETH 为单位的浮点数，默认为 true
}: { balance: bigint, loading: boolean, className?: string, unit?: number, isFormatUnits?: boolean, text?: string, qText?: string }) => {
  return (
    <div className={`${className} `}>
      {qText && qText}
      {loading ? (
        // 如果处于加载中，显示加载图标
        <LoadingOutlined className='leading-none' />
      ) : (
        // 否则将余额格式化为以 ETH 为单位的浮点数，并保留 4 位小数
        isFormatUnits ? formatNumber(formatUnits(balance, unit), 4) : formatNumber(Number(balance) + '', 4)
      )}
      {text && text}
    </div>
  )
}

export default BalanceCom