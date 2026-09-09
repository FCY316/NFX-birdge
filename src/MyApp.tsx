import './style/index.css';

import AppRouter from '@/router';

import StyleProvider from './components/StyleProvider';
import WalletProviderModal from './components/WalletProviderModal';

// import "@/log/index";
function MyApp() {

  return (
    <div className="MyApp">
      <StyleProvider >
        <WalletProviderModal />
        <AppRouter />
      </StyleProvider>
    </div>
  );
}

export default MyApp;
