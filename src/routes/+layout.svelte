<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/nav.svelte';
	import { connectMetamask } from '$lib/core/sdk/wallets/metamask';
	import { showLoading, theme } from '$lib/stores/ui-theming';
	import { onMount, tick } from 'svelte';
	import { accounts, connected, init, selectedNetwork, setAccounts } from '$lib/stores/application';
	import Spinner from '$lib/components/general/spinner.svelte';
	import { loadWeb3 } from '$lib/core/sdk/web3';
	import { writeLocalStorage } from '$lib/core/utils/localStorage';
	import FullScreenContainer from '$lib/components/general/fullScreenContainer.svelte';
	import { _themes, _WALLETS } from '$lib/globals';
	import { recordData } from '$lib/core/utils/analytics';
	import { B_KEY, ENV } from '$lib/stores/envVars';
	import { afterNavigate } from '$app/navigation';
	import { subscribeToEvent } from '$lib/core/sdk/eip-1193';
	import Footer from '$lib/components/footer.svelte';

	/** @type {import('./$types').LayoutData} */
	export let data: any;

	let mounted = false;

	const setBodyTheme = () => {
		try{
			if (mounted) {
				writeLocalStorage('theme', $theme);
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

	$: mounted, setBodyTheme();
	theme.subscribe(setBodyTheme);

	connected.subscribe(setAccounts);

	selectedNetwork.subscribe(async (value: any) => {
		if (mounted) {
			window.bl_rpc = value?.rpc;
			await loadWeb3(value?.rpc);
		};
	});

	let clickCount = 0;
	const botGuard = () => {
		clickCount++;
		if (clickCount > 15) {
			window.web3 = null;
			mounted = false;
			window.alert('Wait, you might be a bot. The page will reload after dismissing this alert.');
			window.location.reload();
		}
	};

	afterNavigate(async () => {
		try{
			recordData('PAGE_LOAD', {});
		}catch(e){
			console.error(e);
		}
	});

	let nav: HTMLElement, footer: HTMLElement;
	let mainHeight: number = 0;
	onMount(async () => {
		try{
			mounted = true;
			mainHeight = window.innerHeight - nav.offsetHeight - footer.offsetHeight;
			subscribeToEvent('disconnect', () => {
				window.alert('You have been disconnected from your wallet. The page will reload after dismissing this alert.');
				accounts.set([]);
			});
			subscribeToEvent('connect', () => {
				window.alert('You have been disconnected from your wallet. The page will reload after dismissing this alert.');
				accounts.set([]);
			});
			ENV.set(data?.envVars?.ENV);
			if(window) window.bl_rpc = $selectedNetwork?.rpc;
			await loadWeb3($selectedNetwork?.rpc);
			setBodyTheme();
			await connectMetamask();
			await tick();
			setInterval(() => {
				clickCount = 0;
			}, 1000);
			document.addEventListener('click', botGuard);
		}catch(e){
			console.error(e);
		}finally{
			init.set(true);
		}
	});
</script>


<div id="global-container" class="min-h-screen bg-emerald-100/[0.4] bg-opacity-70 dark:bg-opacity-100 dark:bg-zinc-900">
	{#if $showLoading}
		<FullScreenContainer alwaysShow zIndex='1000' noBg>
			<div class="flex flex-col space-y-4 p-0">
				<div class="flex w-full justify-center">
					<Spinner size={'70'} additionalClassList='text-gray-600 dark:text-gray-800'/>
				</div>
				<div class="animate-pulse text-center text-gray-200 w-full text-4xl p-0">BitLime</div>
			</div>
		</FullScreenContainer>
	{/if}
	<Nav bind:element={nav}/>
	<main style="min-height: {mainHeight}px;">
		<slot />
	</main>
	<span class="{mainHeight?'':'opacity-0'}">
		<Footer bind:element={footer}/>
	</span>
</div>