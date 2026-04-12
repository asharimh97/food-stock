<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import type { FoodItem } from '../models/food';
	import { selectedFoodItem } from '../stores/dialog';

	let { item, onRemove }: { item: FoodItem; onRemove: (id: string) => void } = $props();

	let daysLeft = $derived.by(() => {
		const end = new SvelteDate(item.bestBefore);
		const start = new SvelteDate();
		start.setHours(0, 0, 0, 0);
		return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
	});

	let statusColor = $derived.by(() => {
		if (daysLeft < 0) return 'bg-rose-100 border-rose-200 text-rose-900';
		if (daysLeft <= 1) return 'bg-orange-100 border-orange-300 text-orange-950';
		if (daysLeft <= 3) return 'bg-amber-100 border-amber-300 text-amber-950';
		return 'bg-[#7a907d] border-transparent text-white';
	});

	const categoryIcon: Record<string, string> = {
		vegie: '🥦',
		fruit: '🍎',
		red_meat: '🥩',
		fish: '🐟',
		packaged: '🥫',
		other: '🍽️'
	};

	function handleCardClick() {
		$selectedFoodItem = item;
	}
</script>

<button
	class={`relative flex h-full min-h-[160px] flex-col items-start rounded-[20px] border p-4 text-left ${statusColor} w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:ring-2 focus:ring-slate-400 focus:outline-none`}
	onclick={handleCardClick}
>
	<div class="mb-auto text-[40px] leading-none drop-shadow-sm">
		{categoryIcon[item.category] || '🥑'}
	</div>

	<div class="mt-4 w-full pr-8">
		<h3 class="mb-1 truncate text-[16px] leading-tight font-bold capitalize opacity-95">
			{item.name}
		</h3>
		<p
			class="mb-1 flex items-center gap-2 text-[20px] leading-none font-black tracking-tight text-current"
		>
			{#if daysLeft < 0}
				Expired
			{:else if daysLeft === 0}
				Today
			{:else if daysLeft === 1}
				Tomorrow
			{:else}
				{daysLeft} days
			{/if}
		</p>
		<p
			class="flex flex-wrap items-center gap-1 text-[11px] font-semibold tracking-wide capitalize opacity-75"
		>
			{item.storageLocation} • {item.state}
			{#if item.amount}
				• {item.amount}
			{/if}
		</p>
	</div>

	<div
		role="button"
		tabindex="0"
		class={`absolute right-4 bottom-4 z-10 rounded-xl p-2.5 shadow-sm transition-all outline-none hover:scale-105 active:scale-95 ${
			daysLeft > 3
				? 'bg-white/20 text-white hover:bg-white/30'
				: 'bg-white/60 text-current hover:bg-white/80'
		}`}
		onclick={(e) => {
			e.stopPropagation();
			onRemove(item.id);
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				e.stopPropagation();
				onRemove(item.id);
			}
		}}
		aria-label="Remove item"
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
			class="opacity-90"
		>
			<path d="M3 6h18" />
			<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
			<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
			<line x1="10" x2="10" y1="11" y2="17" />
			<line x1="14" x2="14" y1="11" y2="17" />
		</svg>
	</div>
</button>
