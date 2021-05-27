import { Tab as Tab2 } from "@gnosis.pm/safe-react-components";
import React, { useState } from "react";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import Box from "@material-ui/core/Box";
import ColdStorage from "./ColdStorage";
import StateManagment from "./StateManagment";

function TabPanel(props: any) {
  const { children, value, id, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== id}
      id={`simple-tabpanel-${id}`}
      aria-labelledby={`simple-tab-${id}`}
      {...other}
    >
      {value === id && <Box p={3}>{children}</Box>}
    </div>
  );
}

const App: React.FC = () => {
  const { sdk, safe } = useSafeAppsSDK();
  const [selected, setSelected] = useState("ColdStorage");
  return (
    <>
      <Tab2
        onChange={setSelected}
        variant="contained"
        selectedTab={selected}
        items={[
          { id: "ColdStorage", label: "Cold Storage", icon: "loadSafe" },
          { id: "StateManagment", label: "State Managment", icon: "recover" },
        ]}
        fullWidth
      />
      <TabPanel value={selected} id="ColdStorage">
        <ColdStorage safe={safe} sdk={sdk} />
      </TabPanel>
      <TabPanel value={selected} id="StateManagment">
        <StateManagment safe={safe} sdk={sdk} />
      </TabPanel>
    </>
  );
};

export default App;
