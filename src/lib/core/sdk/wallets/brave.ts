import { ethereumSupported } from "../eip-1193";


export const braveWalletInstalled: boolean = ethereumSupported() && window.ethereum.isBraveWallet;

export const braveWalletInstalledAsync: boolean = ethereumSupported() && await window.ethereum.request({
    method: 'web3_clientVersion'
  }).then((clientVersion) => {
    return clientVersion.split('/')[0] === 'BraveWallet'
  })