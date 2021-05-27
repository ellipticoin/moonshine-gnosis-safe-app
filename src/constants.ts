import daiIcon from "./images/asset_DAI.svg";
import cDaiIcon from "./images/asset_cDAI.png";
import ethIcon from "./images/asset_ETH.svg";
import renBtcIcon from "./images/asset_RBTC.png";
export type TokenMetaData = {
  iconUrl: string;
  decimals: number;
};

type TokenMetaDataByLabel = {
  [key: string]: TokenMetaData;
};

export const TOKENS: TokenMetaDataByLabel = {
  DAI: { iconUrl: daiIcon, decimals: 18 },
  cDAI: { iconUrl: cDaiIcon, decimals: 8 },
  renBTC: { iconUrl: renBtcIcon, decimals: 8 },
};

export type Token = {
  label: string;
  address: string;
  iconUrl: string;
  decimals: number;
};
type TokensByNetwork = {
  [key: string]: Array<Token>;
};
export const ETH: Token = {
  address: "0x0000000000000000000000000000000000000000",
  label: "Ether",
  iconUrl: ethIcon,
  decimals: 18,
};
export const TOKENS_BY_NETWORK: TokensByNetwork = {
  MAINNET: [
    ETH,
    ...[
      ["DAI", "0x6b175474e89094c44da98b954eedeac495271d0f"],
      ["cDAI", "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643"],
      ["renBTC", "0xeb4c2781e4eba804ce9a9803c67d0893436bb27d"],
    ].map(([label, address]) => ({ address, label, ...TOKENS[label] })),
  ],
  RINKEBY: [
    ETH,
    ...[
      ["DAI", "0x5596ac7380a934802e782e0ff6471d642e488674"],
      ["cDAI", "0x6d7f0754ffeb405d23c51ce938289d4835be3b14"],
      ["renBTC", "0x804d9Dc7363593CcFeedbF685d76EE8f0fD844cC"],
    ].map(([label, address]) => ({ address, label, ...TOKENS[label] })),
  ],
};

type BaseTokenByNetwork = {
  [key: string]: string;
};
export const BASE_TOKEN_ADDRESS: BaseTokenByNetwork = {
  MAINNET: "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643",
  RINKEBY: "0x6d7f0754ffeb405d23c51ce938289d4835be3b14",
};
