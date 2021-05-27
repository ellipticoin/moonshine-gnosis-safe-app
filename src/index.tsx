import { Loader, Title, theme } from "@gnosis.pm/safe-react-components";

import App from "./App";
import GlobalStyle from "./GlobalStyle";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import React from "react";
import ReactDOM from "react-dom";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import { ThemeProvider } from "styled-components";
import { themeToMuiTheme } from "./helpers";

console.log(themeToMuiTheme(theme));
ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={themeToMuiTheme(theme)}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <SafeProvider
          loader={
            <>
              <Title size="md">Waiting for Safe...</Title>
              <Loader size="md" />
            </>
          }
        >
          <App />
        </SafeProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
