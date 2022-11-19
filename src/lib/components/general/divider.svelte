
<script lang="ts">
    export let line: boolean=false;
    export let lineColor: string='gray-100'
    export let pxSpace: string='10';
</script>

<div class="w-full flex items-center" style={`height: ${pxSpace}px;`}>
    <div class={`w-full border border-b-0 border-r-0 border-l-0 border-t-${line?'1':'0'} border-${lineColor}`}/>
</div>