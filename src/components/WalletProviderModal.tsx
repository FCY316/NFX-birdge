import { Button, Empty, Modal } from "antd";
import { useEffect, useState } from "react";

import useConnectWallet from "@/store/wallet/useConnectWallet";
import useWalletPop from "@/store/walletPop";

/** 在应用根部挂载的钱包选择弹窗，供任意页面发起连接时复用。 */
const WalletProviderModal = () => {
  const { openWallet, setOpenWallet } = useWalletPop();
  const {
    connectWalletStore,
    discoverWalletProviders,
    walletProviders,
  } = useConnectWallet();
  const [connectingUuid, setConnectingUuid] = useState<string>();

  useEffect(() => {
    if (openWallet) discoverWalletProviders();
  }, [discoverWalletProviders, openWallet]);

  const connectProvider = async (providerUuid: string) => {
    setConnectingUuid(providerUuid);
    const connected = await connectWalletStore(providerUuid);
    setConnectingUuid(undefined);
    if (connected) setOpenWallet(false);
  };

  return (
    <Modal
      title="选择钱包"
      open={openWallet}
      footer={null}
      onCancel={() => setOpenWallet(false)}
    >
      {walletProviders.length ? (
        <div className="flex flex-col gap-2">
          {walletProviders.map(({ info }) => (
            <Button
              block
              key={info.uuid}
              className="flex h-12 items-center justify-start"
              loading={connectingUuid === info.uuid}
              onClick={() => connectProvider(info.uuid)}
            >
              <img
                alt=""
                className="mr-3 h-6 w-6 rounded"
                src={info.icon}
              />
              <span>{info.name}</span>
            </Button>
          ))}
        </div>
      ) : (
        <Empty description="未发现支持 EIP-6963 的钱包扩展">
          <Button type="primary" onClick={discoverWalletProviders}>
            重新检测
          </Button>
        </Empty>
      )}
    </Modal>
  );
};

export default WalletProviderModal;
