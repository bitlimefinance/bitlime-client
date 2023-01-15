import { web3Provider } from "../../provider/lib";
import { txPreflight } from "../../transactions/txPreflight";


export const getLatestBlock = async () => {
    txPreflight();
    const gas = await web3Provider.getBlockNumber();
    return gas;
}