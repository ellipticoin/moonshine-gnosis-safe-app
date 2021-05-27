import {
  Button,
  Loader,
  Select,
  Title,
} from "@gnosis.pm/safe-react-components";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { SafeAppsSdkProvider, SafeAppsSdkSigner } from "./provider";
import Balance from "./Balance";
import { BigNumberInput } from "big-number-input";
import Box from "@material-ui/core/Box";
import Contract from "./contracts/Bridge.json";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { TOKENS_BY_NETWORK, BASE_TOKEN_ADDRESS } from "./constants";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { ethers } from "ethers";
import SafeAppsSDK, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";
import { getBaseTokenExchangeRate, underlyingToAmount } from "./helpers";

type ColdStrageProps = { sdk: SafeAppsSDK; safe: SafeInfo };
const ColdStorage = ({ sdk, safe }: ColdStrageProps) => {
  const [submitting, setSubmitting] = useState(false);
  const signer = useMemo(() => new SafeAppsSdkSigner(safe, sdk), [safe, sdk]);
  const provider = useMemo(() => new SafeAppsSdkProvider(safe, sdk), [
    safe,
    sdk,
  ]);
  const contract = useMemo(
    () => new ethers.Contract(Contract.address, Contract.abi, signer),
    [signer]
  );
  const tokens = TOKENS_BY_NETWORK[safe.network.toString()];
  const [token, setToken] = useState(tokens[0]);
  const [underlyingAmount, setUnderlyingAmount] = useState(0n);
  const [blockNumber, setBlockNumber] = useState(0);
  const [baseTokenExchangeRate, setBaseTokenExchangeRate] = useState<number>(0);
  const baseTokenAddress = BASE_TOKEN_ADDRESS[safe.network.toString()];
  useEffect(() => {
    const fetchBlockNumber = async () => {
      try {
        console.log("setting new block");
        const newBlockNumber = await provider.getBlockNumber();
        setBlockNumber(newBlockNumber);
      } catch (error) {
        console.log(error);
      }
    };

    const id = setInterval(() => {
      fetchBlockNumber();
    }, 30000);

    fetchBlockNumber();

    return () => clearInterval(id);
  });
  useEffect(() => {
    (async () => {
      const baseTokenExchangeRate = await getBaseTokenExchangeRate(
        baseTokenAddress,
        await provider.getSigner()
      );
      setBaseTokenExchangeRate(baseTokenExchangeRate);
    })();
  });
  const withdraw = useCallback(async () => {
    setSubmitting(true);
    try {
      const amount = underlyingToAmount(
        BigInt(baseTokenExchangeRate),
        token,
        underlyingAmount
      );
      console.log(amount);
      const tx = await contract.withdraw(amount, token.address);
      await tx.wait();
      setSubmitting(false);
    } catch (e) {
      alert(e);
    }
  }, [baseTokenExchangeRate, underlyingAmount, token, contract]);
  return (
    <Grid container direction="column" spacing={2}>
      <Grid container direction="row" spacing={4}>
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <Box px={2}>
              <Title size="sm">Bridge Balances</Title>
            </Box>
            <Table aria-label="simple table">
              <TableBody>
                {tokens.map((token) => (
                  <TableRow key={token.address}>
                    <TableCell component="th" scope="row">
                      <img
                        style={{
                          verticalAlign: "middle",
                          width: "20px",
                          marginRight: "15px",
                        }}
                        alt={token.label}
                        src={token.iconUrl}
                      />
                      {token.label}
                    </TableCell>
                    <TableCell align="right">
                      <Balance
                        address={"ellipticoin.eth"}
                        baseTokenExchangeRate={baseTokenExchangeRate}
                        blockNumber={blockNumber}
                        token={token}
                        safe={safe}
                        provider={provider}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <Box px={2}>
              <Title size="sm">Safe Balances</Title>
            </Box>
            <Table aria-label="simple table">
              <TableBody>
                {tokens.map((token) => (
                  <TableRow key={token.address}>
                    <TableCell component="th" scope="row">
                      <img
                        style={{
                          verticalAlign: "middle",
                          width: "20px",
                          marginRight: "15px",
                        }}
                        alt={token.label}
                        src={token.iconUrl}
                      />
                      {token.label}
                    </TableCell>
                    <TableCell align="right">
                      <Balance
                        address={safe.safeAddress}
                        baseTokenExchangeRate={baseTokenExchangeRate}
                        blockNumber={blockNumber}
                        safe={safe}
                        token={token}
                        provider={provider}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Grid item>
        <Title size="md">Withdraw To Cold Storage</Title>
      </Grid>
      <Grid item>
        <Select
          items={tokens.map((token) => ({ id: token.address, ...token }))}
          activeItemId={token.address}
          onItemClick={(address) =>
            setToken(
              tokens.find((token) => token.address === address) || tokens[0]
            )
          }
        />
      </Grid>
      <Grid item>
        <BigNumberInput
          decimals={token.decimals}
          onChange={(underlyingAmount) =>
            setUnderlyingAmount(BigInt(underlyingAmount))
          }
          value={underlyingAmount.toString()}
        />
      </Grid>
      <Grid item>
        {submitting ? (
          <Grid container direction="row" spacing={4}>
            <Grid item>
              <Loader size="md" />
            </Grid>
            <Grid item>
              <Button
                size="lg"
                variant="contained"
                color="primary"
                onClick={() => {
                  setSubmitting(false);
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Button
            size="lg"
            variant="contained"
            color="primary"
            onClick={withdraw}
          >
            Submit
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
export default ColdStorage;
