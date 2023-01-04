<script lang="ts">
	import FullScreenContainer from './fullScreenContainer.svelte';
	import Icon from './icon.svelte';

	export let title: string='';
	export let content: string='';
	export let modalId: string='';

	export let showModal: boolean = false;

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

<div class="w-fit h-fit cursor-pointer dark:text-white" on:click={toggleModal} on:keyup>
	<Icon outline icon="information-circle"/>
</div>
