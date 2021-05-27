import { useState, useEffect } from "react";
import { Token } from "./constants";
import { balanceOf } from "./helpers";
import { SafeAppsSdkProvider } from "./provider";

type BalanceProps = {
  address: string;
  token: Token;
  provider: SafeAppsSdkProvider;
  safe: any;
  blockNumber: number;
  baseTokenExchangeRate: number;
};

const Balance = ({
  address,
  token,
  provider,
  blockNumber,
  baseTokenExchangeRate,
}: BalanceProps) => {
  const [balance, setBalance] = useState("");
  useEffect(() => {
    (async () => {
      setBalance(
        await balanceOf(provider, baseTokenExchangeRate, token, address)
      );
    })();
  }, [blockNumber, address, baseTokenExchangeRate, provider, token]);
  return (
    <>
      {balance} {}
    </>
  );
};

export default Balance;
