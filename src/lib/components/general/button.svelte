<script lang="ts">
	import { camelCase } from '$lib/core/utils/utilities';
	import { createEventDispatcher } from 'svelte';
	export let type: string = "button";
	export let disabled: boolean = false;
	export let label: string = '';
	export let asyncLabel: string = '';
	export let classList: string =
		'text-white bg-emerald-500 hover:bg-emerald-600 font-medium rounded-lg text-sm px-4 py-2 text-center disabled:opacity-80 disabled:btn-ghost disabled:cursor-default';
	export let additionalClassList: string = '';
	export let asyncAction: (() => Promise<void>) | null = null;
	// TODO: implement
	// export let link: string = '';

	const dispatch = createEventDispatcher();

	export let showLoading = false;

	const onClick = function (this: HTMLButtonElement) {
		if (asyncAction) {
			// If this is a submit button, don't run the async action until the form is valid.
			if (this.type === 'submit') {
				const form = this.closest('form');
				if (!form?.checkValidity()) {
					return;
				}
			}
			showLoading = true;
			asyncAction().finally(() => {
				showLoading = false;
			});
		} else {
			dispatch('click');
		}
	};

	// https://stackoverflow.com/a/53229567/3878933
	// If we end up wanting to use this in other places, move it out into a utility file.
	type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
	type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

	interface ButtonProps extends svelte.JSX.HTMLAttributes<HTMLButtonElement> {
		label: any;
		additionalClassList?: string;
	}

	type AsyncButtonProps = svelte.JSX.HTMLAttributes<HTMLButtonElement> &
		ButtonProps & {
			asyncLabel: string;
			asyncAction: () => Promise<void>;
		};

	interface LinkProps extends svelte.JSX.HTMLAttributes<HTMLAnchorElement> {
		label: any;
		// TODO: implement
		link: boolean;
	}

</script>

<button
	disabled={showLoading || disabled}
	type={type}
	class={`${classList} flex flex-row gap-2 items-center ${showLoading ? '' : 'w-full sm:w-auto'} ${additionalClassList}`}
	on:click={onClick}
	data-testid={camelCase(label)}
>
	{#if showLoading}
		<svg
			role="status"
			class="inline mr-3 w-4 h-4 text-white animate-spin"
			viewBox="0 0 100 101"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
				fill="#E5E7EB"
			/>
			<path
				d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
				fill="currentColor"
			/>
		</svg>
		{asyncLabel}
	{:else}
		{label}
	{/if}
	{#if !showLoading}
		<slot />
	{/if}
</button>
