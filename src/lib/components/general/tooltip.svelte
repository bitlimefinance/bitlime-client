<script lang="ts">
	export let content:String = '';
	export let title:String = '';
	export let classList:String = 'tooltip p-3 lg:max-w-lg md:max-w-md bg-white text-black dark:bg-zinc-800 border rounded-xl shadow dark:border-gray-700 dark:text-white';
	export let additionalClassList:String = '';
	export let invertY:boolean = false;
	export let invertX:boolean = false;

	let isHovered = false;
	let x;
	let y;

	function mouseOver(event) {
		isHovered = true;
		x = invertX ? event.pageX - 150 : event.pageX + 5;
		y = invertY ? event.pageY - 60 : event.pageY + 5;
	}
	function mouseMove(event) {
		x = invertX ? event.pageX - 150 : event.pageX + 5;
		y = invertY ? event.pageY - 60 : event.pageY + 5;
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>

<div on:mouseover={mouseOver} on:mouseleave={mouseLeave} on:mousemove={mouseMove}>
	<slot />
</div>

{#if content && content != ''}
	{#if isHovered}
		<div
			style="top: {y}px; left: {x}px;"
			class={classList + ' ' + additionalClassList}
		>
			{#if title&&title!=''}
				<div class="font-medium">{title}</div>
			{/if}
			<span class="text-sm font-normal">
				{@html content}
			</span>
		</div>
	{/if}
{/if}

<style>
	.tooltip {
		z-index: 1000000;
		position: absolute;
	}
</style>
