import { WalletContextProvider } from '../contexts/WalletContextProvider';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { AppBar } from '../components/AppBar';

require('@solana/wallet-adapter-react-ui/styles.css');
import '../styles/globals.css'

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
          <Head>
            <title>Solana transaction app</title>
          </Head>

          <WalletContextProvider>
            <AppBar/>
            <Component {...pageProps} />
          </WalletContextProvider>
        </>
    );
};

export default App;