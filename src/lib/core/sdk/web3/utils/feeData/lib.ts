import { web3Provider } from "../../provider/lib";
import { txPreflight } from "../../transactions/txPreflight";


export const getGasPrice = async () => {
    txPreflight();
    const gas = await web3Provider.getGasPrice();
    return gas;
}

export const estimateGas = async (data: any, from: string, value: string) => {
    txPreflight();
    const gas = await web3Provider.estimateGas({ data, from, value, gasPrice: await getGasPrice() });
    return await gas.toString();
}