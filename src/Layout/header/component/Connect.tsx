import React, { useState } from 'react';

import {
    Button,
    Modal,
} from 'antd';
import { useTranslation } from 'react-i18next'; // 引入国际化 Hook
import { useNavigate } from 'react-router-dom';

import BalanceCom from '@/components/BalanceCom';
import Copy from '@/components/Copy';
import useAddressConvert from '@/hooks/useAddressConvert';
import useMainNetworkCoin from '@/hooks/useMainNetworkCoin';
import pullDown from '@/image/pullDown.svg';
import switchImg from '@/image/switchImg.svg';
import useConnectWallet from '@/store/wallet/useConnectWallet';
import { useConnectWalletInt } from '@/store/wallet/useConnectWalletInt';
import { mobileHidden } from '@/utils';
import Icon from '@/components/Icon';

const Connect = () => {
    const { t } = useTranslation(); // 使用国际化 Hook
    const router = useNavigate();

    useConnectWalletInt();
    const { changeAddressType, addressConvert } = useAddressConvert();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
        getMainNetworkCoin();
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const { address, connectWalletStore, disconnectWalletStore } = useConnectWallet();
    const { balanceLod, balance, getMainNetworkCoin } = useMainNetworkCoin(false);
    return (
        <div>
            {address ? (
                <div onClick={showModal} className='glass-card box-border flex items-center rounded-full border-0 h-7 sm:h-9 py-1 sm:py-1.5 pr-1 sm:pr-1.5 pl-2 sm:pl-3 cursor-pointer hover:shadow-lg transition-all duration-300'>
                    <div className='text-gray-700 font-semibold bg-white/60 text-xs sm:text-sm px-2 sm:px-2.5 py-0.5 cursor-pointer rounded-full'>
                        {mobileHidden(addressConvert(address), 4, 3)}
                    </div>
                    <Icon src={pullDown} className='w-2.5 sm:w-3.5 ml-1 sm:ml-1.5 cursor-pointer' />
                </div>
            ) : (
                <Button
                    className='h-7 sm:h-9 px-3 sm:px-5 text-xs sm:text-sm font-semibold rounded-full glass-card hover:shadow-lg transition-all duration-300'
                    onClick={() => {
                        connectWalletStore();
                    }}
                >
                    {t('header.connectWallet')} {/* 使用国际化文本 */}
                </Button>
            )}
            <Modal
                footer={null}
                title={<span className="gradient-text text-xl font-bold">{t('header.myWallet')}</span>}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleOk}
                className="modern-modal"
                styles={{
                    content: {
                        borderRadius: '24px',
                        overflow: 'hidden',
                    }
                }}
            >
                <div className="pt-5 whitespace-nowrap">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-700">{t('header.walletAddress')}</span>
                            <div
                                className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform duration-300 flex items-center justify-center"
                                onClick={changeAddressType}
                            >
                                <Icon src={switchImg} className="w-5 h-5" />
                            </div>
                        </div>
                        <div className='flex items-center text-sm font-medium text-gray-600 gap-1'>
                            <div>{t('header.fiboBalance')}</div>
                            <BalanceCom className='font-semibold text-gray-800' loading={balanceLod} balance={balance} />
                        </div>
                    </div>
                    <div className="glass-input-bg box-border mt-4 flex items-center justify-between py-4 px-4 rounded-2xl transition-all duration-300 hover:shadow-md">
                        <span className="text-gray-700 font-mono text-sm">{mobileHidden(addressConvert(address), 18, 5)}</span>
                        <Copy className='w-5 hover:scale-110 transition-transform duration-300' text={addressConvert(address)} />
                    </div>
                    <Button
                        className="mt-6 rounded-2xl h-12 font-semibold gradient-button"
                        block
                        onClick={() => {
                            handleOk();
                            disconnectWalletStore();
                            router('/');
                        }}
                    >
                        {t('header.disconnectWallet')}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default Connect;
