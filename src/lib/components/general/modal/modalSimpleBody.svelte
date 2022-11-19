<script lang="ts">
    export let title: string='';
	export let content: string='';
</script>

<div class='text-2xl font-bold border-b pb-4'>{title}</div>
<div class='mt-4'>{@html content}</div>