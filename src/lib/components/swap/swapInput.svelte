<script lang="ts">
	import Button from "../general/button.svelte";
	import Input from "../general/input.svelte";

    export let id: string = 'swap-input';
    export let value: number;
    
    let input: HTMLInputElement;
    let inputIsFocused:boolean = false;

    const focus = () => {
        input?.focus();
    }

</script>


<div on:click={focus} on:keyup={focus} id="{id}-container" class='bg-base-200 rounded-lg p-3 border {inputIsFocused?'border-primary':'border-transparent'}'>
    <div class="flex space-x-1 items-center cursor-pointer bg-slate-400 bg-opacity-10 w-fit rounded-lg p-2">
        <Button
            label="Select a token"
            classList="bg-transparent font-semibold"
            />
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>                              
        </div>
    </div>
    <Input
        bind:isFocused={inputIsFocused}
        bind:value
        bind:input={input}
        id={id}
        type="number"
        additionalClasses="text-4xl w-full"
        style="background-color: transparent; border: none; outline: none;"
        />
</div>