import { FC, useState } from "react";
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { sendToken } from "../web3/transfer";

interface SenderProps {
  connection: Connection;
  onTransactionCompleted: () => void;
}

const Send: FC<SenderProps> = ({ connection, onTransactionCompleted }) => {
  const { publicKey, signTransaction } = useWallet();
  const [amount, setAmount] = useState(0);
  const [destAddress, setDestAddress] = useState("");

  const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestAddress(e.target.value ? e.target.value.toString() : "");
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value) ? Number(e.target.value) : 0);
  };

  const isDisabled = () => {
    return amount <= 0 || destAddress.length === 0;
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    await sendToken(
      connection,
      publicKey!,
      destAddress,
      signTransaction!,
      amount
    );
    onTransactionCompleted();
  };

  return (
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Address
        </label>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="receiver"
          type="text"
          placeholder="Receiver Address"
          onChange={handleChangeAddress}
          required
          value={destAddress}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Lamports
        </label>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="lamports"
          type="text"
          placeholder=""
          onChange={handleChangeAmount}
          required
          value={amount}
        />
      </div>
      <div className="flex items-center justify-between">
        <button className="bg-solana-purple hover:bg-solana-deep-purple text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          disabled={isDisabled()}
          onClick={handleSubmit}
        >
          Send Token
        </button>
      </div>
    </form>
  );
};

export default Send;
