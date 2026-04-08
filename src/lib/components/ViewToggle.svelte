<script module>
	import { fade } from 'svelte/transition';
</script>

<script lang="ts">
	let {
		viewMode,
		onChange
	}: {
		viewMode: 'fridge' | 'cards' | 'list';
		onChange: (mode: 'fridge' | 'cards' | 'list') => void;
	} = $props();

	const modes = [
		{
			id: 'fridge',
			label: 'Fridge',
			icon: 'M18 4v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2Z'
		},
		{ id: 'cards', label: 'Cards', icon: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z' }, // Simplified icon paths for illustration
		{ id: 'list', label: 'List', icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' }
	];
</script>

<div
	class="flex w-full gap-1 rounded-2xl border border-indigo-100/50 bg-indigo-50/50 p-1.5 md:w-auto"
>
	{#each modes as mode (mode.id)}
		<button
			in:fade={{ duration: 200 }}
			onclick={() => onChange(mode.id as 'fridge' | 'cards' | 'list')}
			class={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 md:flex-none
        ${viewMode === mode.id ? 'border border-indigo-100/50 bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-700'}`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				{#if mode.id === 'fridge'}
					<path d="M18 4v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2Z"></path>
					<path d="M6 10h12"></path>
					<path d="M10 6v5"></path>
					<path d="M10 14v5"></path>
				{:else if mode.id === 'cards'}
					<rect width="7" height="7" x="3" y="3" rx="1" /><rect
						width="7"
						height="7"
						x="14"
						y="3"
						rx="1"
					/><rect width="7" height="7" x="14" y="14" rx="1" /><rect
						width="7"
						height="7"
						x="3"
						y="14"
						rx="1"
					/>
				{:else}
					<line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line
						x1="8"
						x2="21"
						y1="18"
						y2="18"
					/><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line
						x1="3"
						x2="3.01"
						y1="18"
						y2="18"
					/>
				{/if}
			</svg>
			<span class="hidden md:inline">{mode.label}</span>
		</button>
	{/each}
</div>
