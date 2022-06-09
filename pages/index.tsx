import type { NextPage } from 'next'
import { useEffect, useState, useCallback } from "react";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl, TransactionResponse } from '@solana/web3.js';
import { getTransactions } from '../web3/transaction';
import TransactionsView from '../components/Transaction';
import Send from '../components/Send';

const network = WalletAdapterNetwork.Devnet;
const connection = new Connection(clusterApiUrl(network), "confirmed");

const Home: NextPage = () => {
  const { publicKey } = useWallet();
  const [transactions, setTransactions] =
    useState<Array<TransactionResponse>>();
  
  useEffect(() => {
    const fetchTransactions = async () => {
      if (publicKey) {
        const transactions = await getTransactions(connection, publicKey);
        setTransactions(transactions);
      }
    };
    fetchTransactions();
  }, [publicKey]);

  // Update the list after the transaction
  const handleOnTransactionComplete = useCallback(
    async () => {
    if (publicKey) {
      const transactions = await getTransactions(connection, publicKey);
      setTransactions(transactions);
      }
    },
    [publicKey],
  );

  return (
    <div className='space-x-4'>
      {publicKey && (
        <Send
          connection={connection}
          onTransactionCompleted={handleOnTransactionComplete}
        />
      )}
      <TransactionsView transactions={transactions} publicKey={publicKey!} />
    </div>
  )
}

export default Home
