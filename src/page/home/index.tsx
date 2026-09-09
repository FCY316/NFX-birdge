// 导入必要的模块和组件
import {
    useMemo,
    useState,
} from 'react';

import {
    Button,
    Form,
    FormProps,
    Input,
    InputNumber,
    InputNumberProps,
} from 'antd';
import {
    formatUnits,
    parseUnits,
} from 'ethers';
import { useTranslation } from 'react-i18next'; // 引入国际化 Hook

import { chainData, evmChain } from '@/collocate'; // 链相关数据
import BalanceCom from '@/components/BalanceCom'; // 用于显示余额的组件
import useAddressConvert from '@/hooks/useAddressConvert'; // 地址转换相关 Hook
import useCalculateFee from '@/hooks/useCalculateFee'; // 计算手续费相关 Hook
import useDebounceFn from '@/hooks/useDebounceFn'; // 防抖 Hook
import useDeposit from '@/hooks/useDeposit'; // 存款操作相关 Hook
import useGetAllowanceBridge
    from '@/hooks/useGetAllowanceBridge'; // 授权额度相关 Hook
import useGetTokenBalance from '@/hooks/useGetTokenBalance'; // 获取代币余额相关 Hook
import useTargetFeeConfigs
    from '@/hooks/useTargetFeeConfigs'; // 获取目标链手续费配置相关 Hook
import transition2 from '@/image/transition2.svg'; // 转换图标
import {
    changeChainID,
} from '@/store/wallet/tools/setChain/changeChain'; // 切换链工具函数
import useConnectWallet from '@/store/wallet/useConnectWallet'; // 连接钱包相关 Hook
import { formatTo6Decimals } from '@/utils'; // 工具函数，用于格式化数字
import { LoadingOutlined } from '@ant-design/icons'; // 加载图标
import Icon from '@/components/Icon';

// 表单字段类型定义
type FieldType = {
    sum: number; // 跨链金额
    toAddress: string; // 接收地址
};

const Home = () => {
    const { t } = useTranslation(); // 使用国际化 Hook
    const [form] = Form.useForm(); // Ant Design 表单实例
    const [moneyNum, setMoneyNum] = useState(0); // 用户输入的金额
    const { chainId, provider } = useConnectWallet(); // 获取当前链 ID 和钱包提供者
    const { tokenBalance, getTokenBalance, tokenBalanceLod } = useGetTokenBalance(); // 获取代币余额
    const { allowanceBridge, allowanceBridgeLod, approveBridge, getBridgeAllowance } = useGetAllowanceBridge(); // 获取授权额度
    const { calculateFee, calculateFeeLod, fee } = useCalculateFee(); // 计算手续费
    const { validateAddress, validateAddress0x, transition0x } = useAddressConvert(); // 地址验证和转换
    const { deposit, depositLod } = useDeposit(() => {
        // 存款成功后的回调
        getTokenBalance(); // 更新代币余额
        getBridgeAllowance(); // 更新授权额度
        setMoneyNum(0); // 重置金额

        setTimeout(() => {
            form.resetFields(); // 重置表单字段
        });
    });

    // 根据当前链 ID 确定目标链数组
    const chainArr = useMemo(() => {
        if (chainId === evmChain[0]) {
            return [0, 1];
        } else {
            return [1, 0];
        }
    }, [chainId]);

    // 获取目标链 ID
    const chainIdIng = useMemo(() => {
        return chainData[chainArr[1]].chainID;
    }, [chainArr]);

    const { targetFeeConfigs, targetFeeConfigsLod } = useTargetFeeConfigs(chainIdIng); // 获取目标链手续费配置

    // 防抖函数，用于延迟计算手续费
    const debouncedClick = useDebounceFn(() => {
        calculateFee(parseUnits(moneyNum + ''), chainIdIng);
    }, 300);

    // 处理金额输入变化
    const onChange: InputNumberProps['onChange'] = (value) => {
        setMoneyNum(Number(value));
        debouncedClick();
    };

    // 切换链操作
    const changeChain = () => {
        if (provider) {
            changeChainID(provider, chainIdIng);
        }
    };

    // 是否已经授权（授权额度 >= 用户输入金额）
    const isApproveBridge = useMemo(() => {
        return allowanceBridge >= parseUnits(moneyNum + '');
    }, [allowanceBridge, moneyNum]);
    // 表单提交回调
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        if (isApproveBridge) {
            const { sum, toAddress } = values;
            const newToAddress = validateAddress0x(toAddress) ? toAddress : transition0x(toAddress); // 验证并转换地址
            deposit(chainIdIng, parseUnits(sum + ''), newToAddress, {
                success: t('home.crossChainSuccess'),
                error: t('home.crossChainFailed'),
            });
        } else {
            approveBridge({ success: t('home.enableSuccess'), error: t('home.enableFailed') }); // 授权操作
        }
    };

    // 计算最终金额（扣除手续费）
    const gsaFee = useMemo(() => {
        if (!moneyNum) return 0;
        const money = parseUnits(moneyNum + '');
        const endMoney = money - fee.baseFee - fee.protocolFee;
        return Number(formatUnits(endMoney));
    }, [moneyNum, fee]);

    // 验证金额输入
    const validatorSumPower = ({ getFieldValue }: { getFieldValue: Function }) => ({
        validator(_: any, value: number) {
            if (!value) return Promise.resolve();
            if (parseUnits(value + '') > tokenBalance) {
                return Promise.reject(new Error(`${chainData[chainArr[0]].symbol}${t('home.insufficientBalance')}`));
            }
            return Promise.resolve();
        },
    });

    // 验证地址输入
    const validatorAddressPower = ({ getFieldValue }: { getFieldValue: Function }) => ({
        validator(_: any, value: string) {
            if (!value) return Promise.resolve();
            if (!validateAddress(value)) {
                return Promise.reject(new Error(t('home.invalidAddress')));
            }
            return Promise.resolve();
        },
    });

    return (
        <div className='px-3 sm:px-4 pb-6 max-w-xl mx-auto fade-in'>
            <Form
                form={form}
                name="basicdsds"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <div className='glass-card p-4 sm:p-5 rounded-2xl shadow-xl'>
                    {/* 来源链信息 */}
                    <div>
                        <div className='mb-3 flex items-center justify-between text-sm'>
                            <div className='flex items-center gap-2'>
                                <span className='text-gray-600 font-medium'>{t('home.from')}</span>
                                <span className='gradient-text text-sm sm:text-base font-semibold'>{chainData[chainArr[0]].chainName}</span>
                            </div>
                            <BalanceCom qText={t('home.balance')} balance={tokenBalance} loading={tokenBalanceLod} />
                        </div>
                        <div className='glass-input-bg rounded-xl p-3 sm:p-4'>
                            <p className='text-gray-500 text-xs sm:text-sm mb-2 font-medium'>{chainData[chainArr[0]].symbol}</p>
                            <Form.Item<FieldType>
                                name="sum"
                                rules={[
                                    { required: true, message: t('home.enterCrossChainAmount') },
                                    validatorSumPower,
                                ]}
                            >
                                <InputNumber
                                    min={targetFeeConfigsLod ? undefined : formatUnits(targetFeeConfigs.minAmount)}
                                    max={targetFeeConfigsLod ? undefined : formatUnits(targetFeeConfigs.maxAmount)}
                                    controls={false}
                                    placeholder='0.000000'
                                    className='w-full box-border text-xl sm:text-2xl font-semibold'
                                    onChange={onChange}
                                    formatter={(value) => formatTo6Decimals(value || '')}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    {/* 切换链按钮 */}
                    <div className='my-4 sm:my-5 flex items-center justify-center'>
                        <div
                            onClick={changeChain}
                            className={`p-2.5 sm:p-3 rounded-full shadow-md cursor-pointer transition-all duration-500 ${chainId === evmChain[0]
                                ? 'bg-gradient-to-br from-purple-500 to-blue-500 rotate-0'
                                : 'bg-gradient-to-br from-blue-500 to-purple-500 rotate-180'
                                } hover:scale-110 hover:shadow-xl active:scale-95`}
                        >
                            <Icon src={transition2} className='w-5 h-5 sm:w-6 sm:h-6 brightness-0 invert' />
                        </div>
                    </div>

                    {/* 目标链信息 */}
                    <div>
                        <div className='mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0'>
                            <div className='flex items-center gap-2'>
                                <span className='text-gray-600 font-medium text-sm'>{t('home.to')}</span>
                                <span className='gradient-text text-sm sm:text-base font-semibold'>{chainData[chainArr[1]].chainName}</span>
                            </div>
                            <div className='flex items-center gap-2 text-xs text-gray-500 flex-wrap'>
                                <BalanceCom qText={t('home.baseFee')} balance={fee.baseFee} loading={calculateFeeLod} />
                                <BalanceCom qText={t('home.protocolFee')} balance={fee.protocolFee} loading={calculateFeeLod} />
                            </div>
                        </div>
                        <div className='glass-input-bg rounded-xl p-3 sm:p-4'>
                            <p className='text-gray-500 text-xs sm:text-sm mb-2 font-medium'>{chainData[chainArr[1]].symbol}</p>
                            <InputNumber
                                value={!calculateFeeLod ? gsaFee : ''}
                                prefix={calculateFeeLod && <LoadingOutlined className='text-purple-500' />}
                                readOnly
                                controls={false}
                                placeholder='0.0000'
                                className='w-full box-border text-xl sm:text-2xl font-semibold'
                            />
                        </div>
                    </div>

                    {/* 接收地址输入 */}
                    <div className='mt-4 sm:mt-5'>
                        <span className='text-gray-600 font-medium text-sm block mb-2'>{t('home.receiveAddress')}</span>
                        <Form.Item<FieldType>
                            name="toAddress"
                            rules={[
                                { required: true, message: t('home.enterReceiveAddress') },
                                validatorAddressPower,
                            ]}
                        >
                            <Input className='h-10 sm:h-11 rounded-xl glass-input-bg text-sm' placeholder={t('home.receiveAddress')} />
                        </Form.Item>
                    </div>
                </div>

                {/* 提交按钮 */}
                <div className='mt-4 sm:mt-5'>
                    <Button
                        htmlType='submit'
                        loading={tokenBalanceLod || allowanceBridgeLod || depositLod || calculateFeeLod}
                        block
                        className='gradient-button h-11 sm:h-12 rounded-xl text-base sm:text-lg font-bold shadow-lg hover:shadow-xl active:scale-[0.98]'
                    >
                        {isApproveBridge ? t('home.confirm') : t('home.enable')}
                    </Button>
                </div>
            </Form>

            {/* 手续费信息 */}
            <div className='info-card rounded-xl p-3 sm:p-4 mt-4 sm:mt-5 space-y-2 shadow-md'>
                <div className='flex items-center justify-between text-sm text-gray-600'>
                    <span>{t('home.baseFee')}</span>
                    <BalanceCom balance={targetFeeConfigs.baseFee} loading={targetFeeConfigsLod} />
                </div>
                <div className='flex items-center justify-between text-sm text-gray-600'>
                    <span>{t('home.protocolFeePercentage')}</span>
                    <BalanceCom unit={2} text='%' balance={targetFeeConfigs.protocolFeeRatio} loading={targetFeeConfigsLod} />
                </div>
                <div className='flex items-center justify-between text-sm text-gray-600'>
                    <span>{t('home.minTransferAmount')}</span>
                    <BalanceCom balance={targetFeeConfigs.minAmount} loading={targetFeeConfigsLod} />
                </div>
                <div className='flex items-center justify-between text-sm text-gray-600'>
                    <span>{t('home.maxTransferAmount')}</span>
                    <BalanceCom balance={targetFeeConfigs.maxAmount} loading={targetFeeConfigsLod} />
                </div>
            </div>
        </div>
    );
};

// 导出页面组件
export default Home;
