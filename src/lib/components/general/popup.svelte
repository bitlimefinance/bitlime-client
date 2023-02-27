<script lang="ts">
	import { disableScroll, enableScroll } from '$lib/core/utils/utilities';
	import { onMount } from 'svelte';
	import FullScreenContainer from './fullScreenContainer.svelte';
	import Icon from './icon.svelte';

	export let title: string='';
	export let content: string='';
	export let modalId: string='';
	export let maxWidth: number=460;
	export let showModal: boolean = false;

	const modalVisibilityChanged = () => {
		if(!mounted) return;
		if(showModal) disableScroll();
		else enableScroll();
	}

	const toggleModal = () => {
		showModal = !showModal;
	}

	$: showModal, modalVisibilityChanged();

	let innerHeight: number = 0;
	let innerWidth: number = 0;
	let mounted: boolean = false;

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:window bind:innerHeight={innerHeight} bind:innerWidth={innerWidth}/>

<FullScreenContainer
	id={modalId}
	bind:show={showModal}
	>
	<div class='rounded-lg bg-white dark:bg-zinc-900 overflow-y-auto' style="max-height: {innerHeight-100}px; width: {maxWidth}px; max-width: {maxWidth}px">
		<div class='text-xl font-semibold border-b dark:border-b-zinc-700 pb-2 flex items-center justify-between'>
			<div class="h-fit w-fit">{title || 'Info'}</div>
			<div class='cursor-pointer w-fit h-fit hover:opacity-50' on:click={toggleModal} on:keyup>
				<Icon icon='x-mark'/>
			</div>
		</div>
		<div class='mt-4 dark:text-zinc-200'>{@html content}</div>
	</div>
</FullScreenContainer>
