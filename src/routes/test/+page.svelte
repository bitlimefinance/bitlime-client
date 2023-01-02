<script>
	import getChains from "$lib/core/sdk/internal-api/calls/getChains";
	import getTokens from "$lib/core/sdk/internal-api/calls/getTokens";

</script>

<div class="space-x-3 p-5">
    <button
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        on:click={()=>{getTokens()}}
    >
        Test Get Tokens
    </button>

    <button
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        on:click={()=>{getChains()}}
    >
        Test Get Chains
    </button>
</div>