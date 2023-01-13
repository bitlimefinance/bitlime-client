
<script lang="ts">
	import { transferTokens } from "$lib/core/sdk/erc20";
	import { getBaseWfEndpoint } from "$lib/core/sdk/internal-api/utils";
	import { LMC_ADDRESS } from "$lib/core/sdk/lime";
	import { ADDRESS_0 } from "$lib/core/sdk/web3";
	import { accounts } from "$lib/stores/application";

    let res: any;
    const test = async () => {
        let response = await fetch(getBaseWfEndpoint()+'test2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 3731fbe289453a2d195b38a0c4c7c9fb`,
            },
            body: JSON.stringify({
                email: 'g.signups.mail@gmail.com'
            })
        });
        res = await response.json();
    }
</script>

{res?.response?.id}<br>
{res?.response?.email}
<div class="mt-10 border dark:border-zinc-700 p-3 rounded-md space-y-3">
    <button on:click={test} class="block bg-green-500 p-2 rounded-lg">
        test
    </button>
</div>
<br>
<div class="mt-10 border dark:border-zinc-700 p-3 rounded-md space-y-3">
    <button
        on:click={async ()=>{
            transferTokens({
                to: '0x5a437B1C43035ED28E4F3a612768B541C8B4dCC1',
                amount: '10000000000000000000', // 10 tokens
                tokenAddress: LMC_ADDRESS,
                from: $accounts[0]
            });
        }}
        class="block bg-green-500 p-2 rounded-lg"
        >
        test
    </button>
</div>