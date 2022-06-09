import { Connection, PublicKey, ConfirmedTransaction } from "@solana/web3.js";

export async function getTransactions(
  connection: Connection,
  address: PublicKey
): Promise<Array<ConfirmedTransaction>> {
  const transSignatures = await connection.getConfirmedSignaturesForAddress2(
    address
  );

  const transactions = new Array<ConfirmedTransaction>();
  for (let i = 0; i < transSignatures.length; i++) {
    const signature = transSignatures[i].signature;
    const confirmedTransaction = await connection.getConfirmedTransaction(
      signature
    );
    if (confirmedTransaction) {
      transactions.push(confirmedTransaction);
    }
  }
  return transactions;
}
