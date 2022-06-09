import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionBlockhashCtor,
} from "@solana/web3.js";
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";

export async function sendToken(
  connection: Connection,
  address: PublicKey,
  destPubkeyStr: string,
  signTransaction: SignerWalletAdapterProps["signTransaction"],
  lamports: number = 10000000
) {
  try {
    const destPubkey = new PublicKey(destPubkeyStr);

    const instruction = SystemProgram.transfer({
      fromPubkey: address!,
      toPubkey: destPubkey,
      lamports,
    });

    const trans = await generateTransaction({
      connection,
      feePayer: address,
      instruction,
    });

    const signature = await signAndSendTransaction(
      connection,
      signTransaction,
      trans
    );
    
    const latestBlockHash = await connection.getLatestBlockhash();
    const strategy = {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature,
    };

    // https://stackoverflow.com/questions/68744958/solana-commitment-vs-preflightcommitment
    // https://docs.solana.com/developing/clients/jsonrpc-api#configuring-state-commitment
    // await connection.confirmTransaction(signature, "confirmed");
    await connection.confirmTransaction(strategy, "confirmed");
  } catch (e) {
    console.warn("Failed", e);
  }
}

async function generateTransaction({
  connection,
  feePayer,
  instruction,
}: {
  connection: Connection;
  feePayer: PublicKey;
  instruction: TransactionInstruction;
  }): Promise<Transaction> {
  const lastBlockhash = await connection.getLatestBlockhash();
  console.log({ lastBlockhash });
  const options: TransactionBlockhashCtor = {
    feePayer,
    blockhash: lastBlockhash.blockhash,
    lastValidBlockHeight: lastBlockhash.lastValidBlockHeight,
  };
  const transaction = new Transaction(options);
  transaction.add(instruction);
  return transaction;
}

async function signAndSendTransaction(
  connection: Connection,
  signTransaction: SignerWalletAdapterProps["signTransaction"],
  transaction: Transaction
): Promise<string> {
  const signedTrans = await signTransaction(transaction);
  const signature = await connection.sendRawTransaction(
    signedTrans.serialize()
  );
  return signature;
}
