import { Connection, PublicKey, TransactionResponse } from "@solana/web3.js";

export async function getTransactions(
  connection: Connection,
  address: PublicKey
): Promise<Array<TransactionResponse>> {
  const transSignatures = await connection.getConfirmedSignaturesForAddress2(
    address
  );

  const transactions = new Array<TransactionResponse>();
  for (let i = 0; i < transSignatures.length; i++) {
    const signature = transSignatures[i].signature;
    const confirmedTransaction = await connection.getTransaction(
      signature
    );
    if (confirmedTransaction) {
      transactions.push(confirmedTransaction);
    }
  }
  return transactions;
}
