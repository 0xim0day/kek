import React, { useState } from 'react';

const ConnectWalletModal = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState('');

  const handleConnectMetaMask = async () => {
    if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          setConnectedWallet(signer);
        } catch (error) {
          console.log(error);
        }
    } else {
        console.log('Metamask not detected');
    }
  };

  const handleConnectWalletConnect = async () => {
    const walletConnectProvider = new WalletConnectProvider({
        rpc: {
          1: 'https://mainnet.infura.io/v3/e816c740ffda419ca263c9e9444be829',
        },
    });
    try {
        await walletConnectProvider.enable();
        const provider = new ethers.providers.Web3Provider(walletConnectProvider);
        const signer = provider.getSigner();
        setConnectedWallet(signer);
    } catch (error) {
        console.log(error);
    }
  };

  const handleConnectBinance = async () => {
    const binanceChainProvider = window.BinanceChain;
    try {
        await binanceChainProvider.enable();
        const provider = new ethers.providers.Web3Provider(binanceChainProvider);
        const signer = provider.getSigner();
        setConnectedWallet(signer);
    } catch (error) {
        console.log(error);
    }
  };

  const handleConnectWallet = async () => {
    switch (provider) {
      case 'Metamask':
        await handleConnectMetaMask();
        break;
      case 'WalletConnect':
        await handleConnectWalletConnect();
        break;
      case 'Binance':
        await handleConnectBinance();
        break;
      default:
        console.log('Provider not supported');
    }
  };

  return (
    <div
      className={`modal ${isOpen ? 'modal-open' : ''}`}
      onClick={() => onClose()}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Connect Wallet</h2>
        <button onClick={() => setProvider('Metamask')}>Metamask</button>
        <button onClick={() => setProvider('WalletConnect')}>
          WalletConnect
        </button>
        <button onClick={() => setProvider('Binance')}>Binance</button>
        <button onClick={handleConnectWallet}>Connect</button>
      </div>
    </div>
  );
};

const handleAddTokens = () => {
    // реализовать функционал для вызова функции AllowTokens
}

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Connect Wallet</button>
      <button onClick={handleAddTokens}>Add</button>
      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default App;