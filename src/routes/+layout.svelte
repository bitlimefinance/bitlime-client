<script lang="ts">
	import Nav from '$lib/components/nav.svelte';
	import { connectMetamask } from '$lib/metamask/core';
	import { showLoading, theme } from '$lib/stores/ui-theming';
	import { onMount, tick } from 'svelte';
	import '../app.css';
	import { connected, setAccounts } from '$lib/stores/application';
	import Spinner from '$lib/components/general/spinner.svelte';
	import { loadWeb3 } from '$lib/core/web3Manager';
	import { writeLocalStorage } from '$lib/core/utils/localStorage';
	import FullScreenContainer from '$lib/components/general/fullScreenContainer.svelte';
	import { _themes, _WALLETS } from '$lib/globals';
	import ConnectModal from '$lib/components/connect/connectModal.svelte';
		
	const setBodyTheme = () => {
		try{
			if (document) {
				let body:HTMLBodyElement = document.getElementsByTagName('body')[0];
				if (!body) return;
				if ($theme && $theme == _themes.dark) {
					body?.classList.add('dark');
				} else {
					body?.classList.remove('dark');
				}
			}
		}catch(e){
			console.error(e);
		}
	};

	theme.subscribe((value: string) => {
		writeLocalStorage('theme', value);
		setBodyTheme();
	});

	connected.subscribe(() => {
		setAccounts();
	});

	onMount(async () => {
		try{
			await loadWeb3();
			setBodyTheme();
			await connectMetamask();
			await tick();
			setInterval(() => {
				try {
					setAccounts();
				} catch (error) {
					console.error(error)
				};
			}, 2000);
		}catch(e){
			console.error(e);
		}finally{
			showLoading.set(false);
		}
	});
</script>

<div id="global-container" class="min-h-screen bg-emerald-100 bg-opacity-70 dark:bg-opacity-100 dark:bg-zinc-900">
	{#if $showLoading}
		<FullScreenContainer zIndex='1000' noBg>
			<div class="flex flex-col space-y-4 p-0">
				<div class="flex w-full justify-center">
					<Spinner size={'70'} additionalClassList='text-gray-600 dark:text-gray-800'/>
				</div>
				<div class="animate-pulse text-center text-gray-200 w-full text-4xl p-0">BitLime</div>
			</div>
		</FullScreenContainer>
	{/if}
	<ConnectModal/>
	<Nav/>
	<slot />
</div>