import { Theme, createMuiTheme } from "@material-ui/core/styles";
import { ethers } from "ethers";
import { ETH } from "./constants";
import ERC20 from "./contracts/ERC20.json";
const { formatUnits } = ethers.utils;

export function themeToMuiTheme(theme: any): Theme {
  return createMuiTheme({
    palette: {
      primary: {
        main: theme.colors.primary,
        light: theme.colors.primaryLight,
        dark: theme.colors.primaryLight,
        contrastText: theme.colors.primaryLight,
      },
      secondary: {
        main: theme.colors.secondary,
        light: theme.colors.secondaryLight,
        dark: theme.colors.secondaryLight,
        contrastText: theme.colors.secondaryLight,
      },
      error: {
        main: theme.colors.error,
        light: theme.colors.errorLight,
        dark: theme.colors.errorLight,
        contrastText: theme.colors.errorLight,
      },
    },
  });
}

export async function balanceOf(
  provider: any,
  baseTokenExchangeRate: number,
  token: any,
  address: any
) {
  const erc20 = new ethers.Contract(token.address, ERC20.abi, provider);

  if (token.address === ETH.address) {
    return formatUnits(await provider.getBalance(address), token.decimals);
  } else {
    const balance = await erc20.balanceOf(address);
    if (token.label === "cDAI") {
      return amountToUnderlying(baseTokenExchangeRate, balance);
    } else {
      return formatUnits(balance, token.decimals);
    }
  }
}

export async function amountToUnderlying(
  baseTokenExchangeRate: number,
  amount: number
) {
  return ((amount * baseTokenExchangeRate) / Math.pow(10, 36)).toString();
}

export function underlyingToAmount(
  baseTokenExchangeRate: bigint,
  token: any,
  value: bigint
) {
  if (token.label === "cDAI") {
    return ((value * BigInt(10n) ** 28n) / baseTokenExchangeRate).toString();
  } else {
    return value;
  }
}

export async function getBaseTokenExchangeRate(
  contractAddress: any,
  signer: any
) {
  const cToken = new ethers.Contract(
    contractAddress,
    ["function exchangeRateCurrent() view returns(uint256)"],
    signer
  );

  return Number(await cToken.exchangeRateCurrent());
}
