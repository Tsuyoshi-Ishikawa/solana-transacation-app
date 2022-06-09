import { FC } from "react";
import { LAMPORTS_PER_SOL, PublicKey, TransactionResponse } from "@solana/web3.js";


interface TransactionItemProps {
  publicKey: PublicKey;
  transaction: TransactionResponse;
}

const mask = (address: String) =>
  `${address.slice(0, 4)}...${address.slice(
    address.length - 4,
    address.length
  )}`;

const TransactionItem: FC<TransactionItemProps> = ({
  publicKey,
  transaction,
}: TransactionItemProps) => {
  const meta = transaction.meta;
  const trans = transaction.transaction;
  const time = new Date(
    transaction.blockTime! * 1000
  ).toLocaleString();
  const sender = trans.message.accountKeys[0].toBase58();
  const receiver = trans.message.accountKeys[1].toBase58();

  let amount = 0;
  if (meta) {
    amount = meta.preBalances[0] - meta.postBalances[0];
  }

  const maskedSender = mask(sender);
  const maskedReceiver = mask(receiver);

  return (
    <article className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <div className="text-gray-500 font-bold text-xl mb-1"><span>Sender:</span>
        <span className="ml-2 text-purple-500">{maskedSender}{sender === publicKey?.toBase58() ? '(You)' : ''}</span>
      </div>
      <p>
        <span className="text-gray-500 font-bold">receiver:</span>
        <span className="ml-2 text-purple-500">{maskedReceiver} {receiver === publicKey?.toBase58() ? '(You)' : ''}</span>
      </p>
      <p>
        <span className="text-gray-500 font-bold">Sender Balance:</span>
        <span className="ml-2 text-purple-500">{(meta?.postBalances[0] || 0) / LAMPORTS_PER_SOL}SOL</span>
      </p>
      <p>
        <span className="text-gray-500 font-bold">Sent Amount:</span>
        <span className="ml-2 text-purple-500">{amount / LAMPORTS_PER_SOL}SOL</span>
      </p>
      <p>
        <span className="text-gray-500 font-bold">Sent Fee:</span>
        <span className="ml-2 text-purple-500">{(meta?.fee || 0) / LAMPORTS_PER_SOL}SOL</span>
      </p>
      <p>
        <span className="text-gray-500 font-bold">TransactionTime(confirmedBlockTime):</span>
        <span className="ml-2 text-purple-500">{time}</span>
      </p>
    </article>
  );
};

interface TransactionsViewProps {
  publicKey: PublicKey;
  transactions?: Array<TransactionResponse>;
}

const TransactionsView: FC<TransactionsViewProps> = ({
  publicKey,
  transactions,
}) => {
  if (!transactions) {
    return <div>No Items to show. Please connect the wallet.</div>;
  }
  return (
    <div className="space-y-6">
      {transactions.map((trans, index) => (
        <TransactionItem
          key={index}
          transaction={trans}
          publicKey={publicKey}
        />
      ))}
    </div>
  );
};

export default TransactionsView;
