
export const getTokensList = async () => {
    return fetch('https://sphynx-vxjbhxcjrqmicheiftxk.bubbleapps.io/api/1.1/obj/tokens')
        .then(response => response.json())
        .then(data => {
            if (data.response) return data.response;
            else return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export const getChainsList = async () => {
    return fetch('https://sphynx-vxjbhxcjrqmicheiftxk.bubbleapps.io/api/1.1/obj/evm_chains')
        .then(response => response.json())
        .then(data => {
            if (data.response) return data.response;
            else return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}