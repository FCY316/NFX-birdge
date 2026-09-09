import { useCallback } from 'react';

import { bech32 } from 'bech32';
import {
    getAddress,
    getBytes,
    hexlify,
    isAddress,
} from 'ethers';

import useAddressType from '@/store/addressType';

export function evmToHg(address: string): string {
    const bytes = getBytes(getAddress(address));
    return bech32.encode('hg', bech32.toWords(bytes));
}

export function hgToEvm(address: string): string {
    const decoded = bech32.decode(address);

    if (decoded.prefix !== 'hg') {
        throw new Error('Expected an hg1 MOCIUS address');
    }

    const bytes = Uint8Array.from(bech32.fromWords(decoded.words));
    if (bytes.length !== 20) {
        throw new Error('Invalid MOCIUS account address length');
    }

    return getAddress(hexlify(bytes));
}

// 转换地址，支持 EVM 的 0x 格式和 MOCIUS 的 hg 格式
const useAddressConvert = () => {
    const { addressType, setAddressType } = useAddressType();

    const addressConvert = useCallback((address: string) => {
        if (!address) return address;

        try {
            const normalizedAddress = address.toLowerCase();
            if (addressType === '0x') {
                return normalizedAddress.startsWith('0x') ? address : hgToEvm(normalizedAddress);
            }

            if (addressType === 'hg' || 'fb') {
                return normalizedAddress.startsWith('hg') ? normalizedAddress : evmToHg(address);
            }

            return address;
        } catch (e) {
            console.log('useAddressConvert', e);
            return address;
        }
    }, [addressType]);

    // 判断是否为正确的 0x 或 hg 地址
    const validateAddress = (addr: string) => {
        try {
            if (addr.toLowerCase().startsWith('hg')) {
                return isAddress(hgToEvm(addr.toLowerCase()));
            }
            return addr.toLowerCase().startsWith('0x') && isAddress(addr);
        } catch (err) {
            return false;
        }
    };

    // 判断是否为正确的 0x 地址
    const validateAddress0x = (addr: string) => {
        try {
            return addr.toLowerCase().startsWith('0x') && isAddress(addr);
        } catch (err) {
            return false;
        }
    };

    // 判断是否为正确的 hg 地址
    const validateAddressHg = (addr: string) => {
        try {
            return addr.toLowerCase().startsWith('hg') && isAddress(hgToEvm(addr.toLowerCase()));
        } catch (err) {
            return false;
        }
    };

    // 切换地址展示格式
    const changeAddressType = () => {
        const type = addressType === '0x' ? 'hg' : '0x';
        setAddressType(type);
    };

    return {
        changeAddressType,
        addressConvert,
        validateAddress,
        validateAddress0x,
        validateAddressHg,
        transition0x: hgToEvm,
        transitionhg: evmToHg,
    };
};

export default useAddressConvert;
