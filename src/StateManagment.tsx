import React, { useState, useMemo, useCallback } from "react";
import { Button, TextField, Title } from "@gnosis.pm/safe-react-components";
import { Grid } from "@material-ui/core";
import { SafeAppsSdkSigner } from "./provider";
import { ethers } from "ethers";
import Contract from "./contracts/Bridge.json";
import SafeAppsSDK, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";

type StateManagmentProps = { sdk: SafeAppsSDK; safe: SafeInfo };
const StateManagment = ({ sdk, safe }: StateManagmentProps) => {
  const [lastRedeemId, setLastReedeemId] = useState("");
  const signer = useMemo(() => new SafeAppsSdkSigner(safe, sdk), [safe, sdk]);
  const contract = useMemo(
    () => new ethers.Contract(Contract.address, Contract.abi, signer),
    [signer]
  );
  const resetRedeems = useCallback(async () => {
    contract.resetRedeems(lastRedeemId);
  }, [contract, lastRedeemId]);
  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Title size="sm">Reset Redeems</Title>
        </Grid>
        <Grid item>
          <TextField
            id="standard-name"
            label="Last Redeem ID"
            value={lastRedeemId}
            onChange={(e: any) => setLastReedeemId(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            size="lg"
            variant="contained"
            color="primary"
            onClick={() => resetRedeems()}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default StateManagment;
