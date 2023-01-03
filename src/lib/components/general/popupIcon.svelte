<script lang="ts">
	import FullScreenContainer from './fullScreenContainer.svelte';
	import Icon from './icon.svelte';

	export let title: string='';
	export let content: string='';
	export let modalId: string='';
	export let size: number = 5;

	let showModal: boolean = false;

	const toggleModal = () => {
		showModal = !showModal;
	}
</script>


<FullScreenContainer
	id={modalId}
	bind:show={showModal}
	>
	<div class='w-96 max-w-md rounded-lg bg-white dark:bg-zinc-900'>
		<div class='text-2xl font-bold border-b dark:border-b-zinc-700 pb-4 flex items-end justify-between'>
			<div>{title || 'Info'}</div>
			<div class='cursor-pointer w-fit h-fit' on:click={toggleModal} on:keyup>
				<Icon icon='x-mark'/>
			</div>
		</div>
		<div class='mt-4'>{@html content}</div>
	</div>
</FullScreenContainer>

<div class="w-fit h-fit cursor-pointer" on:click={toggleModal} on:keyup>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-{size} h-{size}">
		<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
	</svg>
</div>
