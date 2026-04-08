<script lang="ts">
	import { stock } from '../stores/stock';
	import FoodCard from './FoodCard.svelte';
	import FoodListItem from './FoodListItem.svelte';

	let {
		title = 'My Fridge',
		filter = 'all',
		layout = 'grid'
	}: {
		title?: string;
		filter?: 'all' | 'freezer' | 'chiller' | 'shelf' | 'door' | 'crisper';
		layout?: 'grid' | 'list';
	} = $props();

	let filteredStocks = $derived.by(() => {
		let items = [...$stock];
		if (filter !== 'all') {
			items = items.filter((i) => i.storageLocation === filter);
		}
		// Sort by bestBefore (closest to expire first)
		return items.sort(
			(a, b) => new Date(a.bestBefore).getTime() - new Date(b.bestBefore).getTime()
		);
	});

	function handleRemove(id: string) {
		stock.remove(id);
	}
</script>

<div class="flex w-full flex-col gap-4">
	<div class="flex items-end justify-between">
		<h2 class="text-2xl font-black tracking-tight text-slate-800">{title}</h2>
		<span class="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 shadow-sm"
			>{filteredStocks.length} Items</span
		>
	</div>

	{#if filteredStocks.length === 0}
		<div
			class="mt-2 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center"
		>
			<p class="font-bold text-slate-500">No groceries found here.</p>
		</div>
	{:else}
		<div
			class={`mt-2 ${layout === 'grid' ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2' : 'flex flex-col gap-3'}`}
		>
			{#each filteredStocks as item (item.id)}
				<div class="animate-in fade-in slide-in-from-bottom-2 duration-300">
					{#if layout === 'grid'}
						<FoodCard {item} onRemove={handleRemove} />
					{:else}
						<FoodListItem {item} onRemove={handleRemove} />
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
