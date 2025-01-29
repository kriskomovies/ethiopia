import { AppProps } from 'next/app';
import Layout from '@/components/layout/layout';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/redux/store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from '@/components/theme-provider/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import AppModal from '@/components/app-modal/app-modal';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

const endpoint = process.env.NEXT_PUBLIC_PCL || 'no-pcl';
const wallets = [new PhantomWalletAdapter()];
import '@/styles/globals.css';
const TaxManageApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Layout>
                  <Component {...pageProps} />
                  <AppModal />
                </Layout>
                <Toaster />
              </LocalizationProvider>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default TaxManageApp;
