<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/nav.svelte';
	import { connectMetamask } from '$lib/core/sdk/wallets/metamask';
	import { mainHeight_, showLoading, theme } from '$lib/stores/ui-theming';
	import { onMount, tick } from 'svelte';
	import { accounts, chainsList, connected, init, networkCoin, selectedNetwork, setAccounts, showConnenct, tokensList } from '$lib/stores/application';
	import Spinner from '$lib/components/general/spinner.svelte';
	import { readLocalStorage, writeLocalStorage } from '$lib/core/utils/localStorage';
	import FullScreenContainer from '$lib/components/general/fullScreenContainer.svelte';
	import { _themes, _WALLETS } from '$lib/globals';
	import { recordData } from '$lib/core/utils/analytics';
	import { ENV } from '$lib/stores/envVars';
	import { afterNavigate } from '$app/navigation';
	import { subscribeToEvent } from '$lib/core/sdk/eip-1193';
	import Footer from '$lib/components/footer.svelte';
	import { chains, tokens } from '$lib/core/contents/fallbacks';
	import { setProvider } from '$lib/core/sdk/web3/provider/lib';
	import { debug, debugError } from '$lib/core/utils/debug';
	import SelectNetwork from '$lib/components/connect/selectNetwork.svelte';
	import WalletModal from '$lib/blw/walletModal.svelte';
	import { generateSalt } from '$lib/core/utils/cipher/passworder';
	import TxConfirmation from '$lib/blw/components/txConfirmation.svelte';
	import { loadWorker, workerResolveMessage } from '$lib/blw/lib/worker/workerApi';
	import { Action } from '$lib/blw/lib/worker/types';
	import { askNotificationPermission } from '$lib/core/utils/browserNotifications';

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
		try {
			if (mounted) {
				window.bl_rpc = value?.rpc;
				await setProvider(value?.rpc);
			};
		} catch (error) {
			debugError(error);
		}
		try {
			networkCoin.set({
					"is_native": true,
					"image": value?.logo,
					"name": value?.name,
					"symbol": value?.currency_symbol,
					"decimals": value?.decimals,
					"chain_id": value?.id,
					"address": "native",
				});
		} catch (error) {
			debugError(error);
		}
	});
	let clickCount = 0;
	const botGuard = () => {
		clickCount++;
		if (clickCount > 15) {
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
			debug(data);
			ENV.set(data?.env);
			if (data?.chainsList?.response?.results && data?.chainsList?.response?.results?.length > 0) chainsList.set(data?.chainsList?.response?.results);
			else chainsList.set(chains);
			if (data?.tokensList?.response?.results && data?.tokensList?.response?.results?.length > 0) tokensList.set(data?.tokensList?.response?.results);
			else tokensList.set(tokens);
			mainHeight = window.innerHeight - nav.offsetHeight - footer.offsetHeight;
			mainHeight_.set(mainHeight);
			mounted = true;
			subscribeToEvent('disconnect', () => {
				window.alert('You have been disconnected from your wallet. The page will reload after dismissing this alert.');
				accounts.set([]);
			});
			subscribeToEvent('connect', () => {
				window.alert('You have been disconnected from your wallet. The page will reload after dismissing this alert.');
				accounts.set([]);
			});
			
			if(window) window.bl_rpc = $selectedNetwork?.rpc;
			await setProvider($selectedNetwork?.rpc);
			setBodyTheme();
			await tick();
			loadWorker();
			askNotificationPermission();
			// setInterval(() => {
			// 	clickCount = 0;
			// }, 1000);
			// document.addEventListener('click', botGuard);
		}catch(e){
			debugError(e);
		}finally{
			init.set(true);
		}
	});
</script>

<div id="global-container" class="min-h-screen bg-white bg-opacity-70 dark:bg-opacity-100 dark:bg-zinc-900">
	{#if $showLoading}
		<FullScreenContainer alwaysShow zIndex='1000' noBg>
			<div class="flex flex-col space-y-4 p-0">
				<div class="flex w-full justify-center">
					<Spinner size={'70'} additionalClassList='text-gray-600 dark:text-gray-800'/>
				</div>
				<div class="animate-pulse text-center text-gray-200 w-full text-4xl p-0">BitLime</div>
			</div>
		</FullScreenContainer>
	{:else if !mounted}
		<FullScreenContainer alwaysShow zIndex='0' noBg noBackDrop>
			<div class="flex flex-col space-y-4 p-0">
				<div class="flex w-full justify-center">
					<Spinner size={'40'} additionalClassList='text-gray-600 dark:text-gray-800'/>
				</div>
			</div>
		</FullScreenContainer>
	{/if}
	<Nav bind:element={nav}/>
	<main class="mx-auto" style="min-height: {mainHeight}px; display: {mounted?"block":"none"}; max-width: 1080px;">
		<slot/>
	</main>
	<span class="{mainHeight?'':'opacity-0'}">
		<Footer bind:element={footer}/>
	</span>
</div>

<SelectNetwork/>
<WalletModal/>
<TxConfirmation />
