
<script lang="ts">
	import { balanceOf } from "$lib/core/sdk/erc20";
	import { getBaseWfEndpoint } from "$lib/core/sdk/internal-api/utils";
	import { accounts } from "$lib/stores/application";

    let balance: number;

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
{balance}
<div class="mt-10 border dark:border-zinc-700 p-3 rounded-md space-y-3">
    <button on:click={async ()=>{balance =  await balanceOf({address: $accounts[0], tokenAddress: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C'})}} class="block bg-green-500 p-2 rounded-lg">
        test
    </button>
</div>