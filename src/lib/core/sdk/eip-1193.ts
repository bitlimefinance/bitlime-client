

export const isConnected = async () => {
    let connected: boolean = false;
    try {
        if (window && window?.ethereum) {
            connected = Boolean(window.ethereum.isConnected());
            if (!connected) return false;
            let ethAccounts = await window.ethereum?.request({ method: 'eth_accounts' });
            if(ethAccounts && ethAccounts.length && ethAccounts.length > 0) connected = true;
        }
    } catch (error) {
        console.error(error);
    } finally {
        return connected;
    }
}