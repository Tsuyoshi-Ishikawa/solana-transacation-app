import { FC } from 'react';

import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export const AppBar: FC = props => {
  const { wallet } = useWallet();
  return (
    <div>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <a href="https://solana.com/ja" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Solana</span>
          </a>
          <div className="hidden w-full md:block md:w-auto" id="mobile-menu">
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
              <li>
                <WalletMultiButton />
              </li>
              {wallet && (
                <li>
                  <WalletDisconnectButton
                  />
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
