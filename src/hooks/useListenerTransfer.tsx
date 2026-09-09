import useConnectWallet from '@/store/wallet/useConnectWallet';

// 监听交易是否成功
const useListenerTransfer = () => {
    // 拿到provider
    const { provider } = useConnectWallet()
    const listenerTransferF = (transactionHash: any) => {
        return new Promise((reslove, reject) => {
            provider?.once(transactionHash, (receipt: any) => {
                if (receipt.status) {
                    reslove(true);
                }
                reslove(false);
            });
        });
    };
    return listenerTransferF
}

export default useListenerTransfer
