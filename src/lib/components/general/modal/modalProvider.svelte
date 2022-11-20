<script lang="ts">
	import { randomString } from '$lib/core/utils/utilities';
	// import { recordData } from '$lib/analytics';
	import { createEventDispatcher, onMount } from 'svelte';

	export let shownByDefault: boolean = false;
	export let modalId: string = 'qa-modal';
	export let btnText: string = 'Show modal';
	export let btnClassList: string =
		'text-white bg-zinc-900 hover:bg-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-cyan-600 disabled:opacity-80 disabled:hover:bg-zinc-900 disabled:dark:bg-cyan-600';
	export let btnIcon: string ='';
	export let onlyIcon: boolean =false;
	export let iconColor: string ='gray-400';
	export let hideBtn: boolean = false;
	export let hideCloseIcon: boolean =false;
	export let drawerL: boolean =false;
	export let drawerR: boolean =false;
	export let width: string ='60';
	export let drawerWidth: string ='80';
	export let disableCloseModalByClickingOutside: boolean = false;
	export let additionalModalClassList: string = '';
	export let fullScreen: boolean;
	export let widthUsePixels: boolean = false;
	export let noStyle: boolean = false;

	let isDrawer: boolean = drawerL || drawerR;

	let currentDisplayState: string = shownByDefault ? 'block' : 'none';
	let observer: MutationObserver;

	const dispatch = createEventDispatcher();

	let modal: any;

	let mId: string = modalId&&modalId!=''?modalId:randomString(5);

	const toggleModal = () => {
		try {
			modal.style.display = 'block';
		} catch (error) {
			console.log(error);
		}
	};
	const hideModal = () => {
		try {
			modal.style.display = 'none';
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		fullScreen = fullScreen ? fullScreen : window.innerWidth < 720;

		// Get the modal
		modal = document.getElementById(modalId);

		observer = new MutationObserver(function (mutationsList, observer) {
			for (let mutation of mutationsList) {
				if (currentDisplayState != modal.style.display) {
					switch (modal.style.display) {
						case 'none':
							dispatch('close', { targetId: modalId });
							//logModalToggle('close');
							break;

						default:
							dispatch('open', { targetId: modalId });
							//logModalToggle('open');
							break;
					}
				}
			}
		});
		observer.observe(modal, { attributes: true });

		// Get the <button> element that closes the modal
		let close = document.getElementById('close-' + modalId);

		// When the user clicks on <button> (done), close the modal
		if (close) {
			close.onclick = function () {
				modal.style.display = 'none';
			};
		}
		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function (event) {
			if (event.target == modal && !disableCloseModalByClickingOutside) {
				modal.style.display = 'none';
			}
		};

		if (shownByDefault) {
			modal.style.display = 'block';
		}

		currentDisplayState = modal.style.display;
	});

	let style: string = `padding: 0.75rem; width: ${fullScreen?'100':(isDrawer?drawerWidth:width)}${widthUsePixels?'px':'%'};`;
</script>

<div id={mId} class="modal">
	<!-- Modal content -->
	<div class={`modal-content${drawerL&&!fullScreen?' left-drawer':''}${drawerR&&!fullScreen?' right-drawer':''}${fullScreen?' full-screen':''} bg-white rounded-lg ${additionalModalClassList}`} style={noStyle?'':style}>
		{#if !hideCloseIcon}
			<div class="w-full flex justify-end -mb-5 z-50">
				<div on:click={()=>{hideModal()}} on:keyup={()=>{hideModal()}} class="z-50 cursor-pointer">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</div>
			</div>
		{/if}
		<slot />
	</div>
</div>

{#if !hideBtn}
	<button
		id={'toggle-button-' + mId}
		class={onlyIcon?`p-0 m-0 text-${iconColor}`:btnClassList}
		on:click={() => {
			toggleModal();
		}}
	>
		{#if !onlyIcon}
			{btnText}
			{#if btnIcon&&btnIcon!=''}
				{@html btnIcon}
			{/if}
		{:else if !hideBtn&&onlyIcon&&btnIcon&&btnIcon!=''}
			{@html btnIcon}
		{/if}
	</button>
{/if}

<style>
	/* The Modal (background) */
	.modal {
		display: none; /* Hidden by default */
		position: fixed; /* Stay in place */
		z-index: 100000000000000; /* Sit on top */
		left: 0;
		top: 0;
		width: 100%; /* Full width */
		height: 100%; /* Full height */
		overflow: auto; /* Enable scroll if needed */
		background-color: rgb(0, 0, 0); /* Fallback color */
		background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
	}

	/* Modal Content/Box */
	.modal-content {
		margin: 5% auto; /* 15% from the top and centered */
		border: 1px none;
	}
	
	.left-drawer {
		background-color: #fefefe;
		margin: 0%; /* 15% from the top and centered */
		padding: 20px;
		border: 1px solid #888;
		height: 100vh;
		border-radius: 0;
	}
	
	.right-drawer {
		background-color: #fefefe;
		margin-top: 0;
		margin-bottom: 0;
		margin-right: 0;
		padding: 20px;
		border: 1px solid #888;
		height: 100vh;
		border-radius: 0;
	}

	.full-screen {
		background-color: #fefefe;
		margin: 0%; /* 0% from the top and centered */
		padding: 20px;
		border: none;
		width: 100vw; /* Could be more or less, depending on screen size */
		height: 100vh;
		border-radius: 0;
	}
</style>
