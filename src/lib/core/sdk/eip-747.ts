import { ethereumSupported } from "./eip-1193";

export async function addAsset(
    type: string,
    options: {
        address: string,
        symbol: string,
        decimals: number,
        image: string,
    }
) {
    if(!ethereumSupported()) return;
    return await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: type,
        options: options
      },
    })
  }