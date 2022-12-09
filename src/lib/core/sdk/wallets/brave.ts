import { ethereumSupported } from "../eip-1193";


export const braveWalletInstalled: boolean = ethereumSupported() && window.ethereum.isBraveWallet;