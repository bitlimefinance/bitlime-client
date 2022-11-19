<script lang='ts'>
	export let text: string='';
	export let bg: string='bg-gray-100';
	export let color: string='text-gray-500';
	export let opacity: string='opacity-100';
</script>

<span
	class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium {opacity} {bg} {color}"
	>{text}</span
>
