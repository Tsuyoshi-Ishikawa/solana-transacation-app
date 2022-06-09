import { FC } from "react";
import { LAMPORTS_PER_SOL, PublicKey, ConfirmedTransaction } from "@solana/web3.js";


interface TransactionItemProps {
  publicKey: PublicKey;
  transaction: ConfirmedTransaction;
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
  const sender = trans.instructions[0].keys[0].pubkey.toBase58();
  const receiver = trans.instructions[0].keys[1].pubkey.toBase58();

  let amount = 0;
  if (meta) {
    amount = meta.preBalances[0] - meta.postBalances[0];
  }

  const maskedSender = mask(sender);
  const maskedReceiver = mask(receiver);

  return (
    <article>
      <p>Sender: {maskedSender} {sender === publicKey.toBase58() ? '(You)' : ''}</p>
      <p>Receiver: {maskedReceiver} {receiver === publicKey.toBase58() ? '(You)' : ''}</p>
      <p>Sender Balance: {(meta?.postBalances[0] || 0) / LAMPORTS_PER_SOL}SOL</p>
      <p>Sent Amount: {amount / LAMPORTS_PER_SOL}SOL</p>
      <p>Sent Fee: {(meta?.fee || 0) / LAMPORTS_PER_SOL}SOL</p>
      <p>TransactionTime(confirmedBlockTime): {time}</p>
    </article>
  );
};

interface TransactionsViewProps {
  publicKey: PublicKey;
  transactions?: Array<ConfirmedTransaction>;
}

const TransactionsView: FC<TransactionsViewProps> = ({
  publicKey,
  transactions,
}) => {
  if (!transactions) {
    return <div>No Items to show. Please connect the wallet.</div>;
  }
  return (
    <div className="space-x-2">
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
