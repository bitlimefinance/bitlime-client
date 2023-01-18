import type { EtherUnit } from "$lib/core/descriptors/types";
import { debugError } from "$lib/core/utils/debug";
import { ethers } from "ethers";

export const noOfDecimalsToUnits = (decimals: number = 18) => {
    let decimalsString = decimals.toString();
    let unitMap: {
        [key: string]: Array<EtherUnit>
    } = {
        '0': ['noether'],
        '1': ['wei'],
        '3': ['kwei', 'Kwei', 'babbage', 'femtoether'],
        '6': ['mwei', 'Mwei', 'lovelace', 'picoether'],
        '9': ['gwei', 'Gwei', 'shannon', 'nanoether', 'nano'],
        '12': ['szabo', 'microether', 'micro'],
        '15': ['finney', 'milliether', 'milli'],
        '18': ['ether'],
        '21': ['kether', 'grand'],
        '24': ['mether'],
        '27': ['gether'],
        '30': ['tether']
    };

    if (unitMap[decimalsString]) return unitMap[decimalsString][0];
    else return null;
}

export const toWei = (amount: string, unit: EtherUnit | null) => {
    try {
        return ethers.utils.parseUnits(amount, unit || 'ether').toString(); // type: string | null
    } catch (error) {
        debugError(error);
        return null;
    }
}

export const fromWei = (amount: string | number, unit: EtherUnit | null) => {
    try {
        if(typeof amount === 'number') amount = amount.toString();
        return ethers.utils.formatUnits(amount, unit || 'ether'); // type: string | null
    } catch (error) {
        debugError(error);
        return null;
    }
}
