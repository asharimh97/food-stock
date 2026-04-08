<script lang="ts">
	import { stock } from '../stores/stock';
	import FoodCard from './FoodCard.svelte';
	import type { StorageLocation } from '../models/food';

	let { onAddClick }: { onAddClick?: (loc: StorageLocation) => void } = $props();

	let freezerItems = $derived(
		$stock
			.filter((i) => i.storageLocation === 'freezer')
			.sort((a, b) => new Date(a.bestBefore).getTime() - new Date(b.bestBefore).getTime())
	);
	let fridgeItems = $derived(
		$stock
			.filter(
				(i) =>
					i.storageLocation === 'chiller' ||
					i.storageLocation === 'shelf' ||
					i.storageLocation === 'door'
			)
			.sort((a, b) => new Date(a.bestBefore).getTime() - new Date(b.bestBefore).getTime())
	);
	let crisperItems = $derived(
		$stock
			.filter((i) => i.storageLocation === 'crisper')
			.sort((a, b) => new Date(a.bestBefore).getTime() - new Date(b.bestBefore).getTime())
	);

	function handleRemove(id: string) {
		stock.remove(id);
	}
</script>

<div
	class="relative mx-auto mb-8 flex w-full max-w-4xl flex-col overflow-hidden rounded-[2.5rem] border-4 border-slate-300 bg-slate-100 shadow-2xl ring-4 ring-white/50"
>
	<!-- Fridge Doors/Handle Visuals -->
	<div
		class="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-8 flex-col items-center gap-40 bg-gradient-to-l from-slate-200/80 to-transparent py-20"
	>
		<div class="block h-32 w-3 rounded-full bg-slate-300 shadow-inner shadow-slate-400"></div>
		<div class="block h-48 w-3 rounded-full bg-slate-300 shadow-inner shadow-slate-400"></div>
	</div>

	<!-- Freezer Compartment -->
	<div
		class="relative z-0 border-b-[12px] border-slate-300 bg-gradient-to-b from-slate-50 to-blue-50/50 p-6 pb-8"
	>
		<div
			class="absolute top-4 left-4 flex items-center gap-2 text-xs font-black tracking-widest text-blue-900/40 uppercase"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-snowflake"
				><path d="m10 20-1.25-2.5L6 18" /><path d="M10 4 8.75 6.5 6 6" /><path
					d="m14 20 1.25-2.5L18 18"
				/><path d="m14 4 1.25 2.5L18 6" /><path d="m17 21-3-6h-4" /><path d="m17 3-3 6h-4" /><path
					d="M2 12h20"
				/><path d="M20 10l-2.5 1.25L18 14" /><path d="M20 14l-2.5-1.25L18 10" /><path
					d="M4 10l2.5 1.25L6 14"
				/><path d="M4 14l2.5-1.25L6 10" /></svg
			>
			Freezer
		</div>

		<div class="mt-8">
			{#if freezerItems.length === 0}
				<button
					onclick={() => onAddClick?.('freezer')}
					class="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-200/50 bg-white/40 py-8 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/50"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-blue-300"><path d="M5 12h14" /><path d="M12 5v14" /></svg
					>
					<p class="text-sm font-bold text-blue-900/40">Add to Freezer</p>
				</button>
			{:else}
				<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
					{#each freezerItems as item (item.id)}
						<div class="origin-top scale-95"><FoodCard {item} onRemove={handleRemove} /></div>
					{/each}
					<button
						onclick={() => onAddClick?.('freezer')}
						class="flex min-h-[140px] origin-top scale-95 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-200/50 p-4 text-blue-900/40 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-900/60"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg
						>
						<span class="text-sm font-bold">Add Item</span>
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Fridge Compartment (Shelves) -->
	<div
		class="relative z-0 flex min-h-[300px] flex-col gap-6 bg-gradient-to-b from-white to-slate-50 p-6 pb-10"
	>
		<div class="absolute top-4 left-4 text-xs font-black tracking-widest text-slate-300 uppercase">
			Shelves & Door
		</div>

		<!-- We can simulate shelves by dividing fridge items into rows and rendering a strong divider below each full row, but a simple grid with nice bottoms works too. -->
		<div class="mt-4">
			{#if fridgeItems.length === 0}
				<button
					onclick={() => onAddClick?.('chiller')}
					class="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center transition-colors hover:border-slate-300 hover:bg-slate-100/50"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-slate-300"><path d="M5 12h14" /><path d="M12 5v14" /></svg
					>
					<p class="font-bold text-slate-400">Add to Shelves</p>
				</button>
			{:else}
				<div class="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
					{#each fridgeItems as item (item.id)}
						<div class="relative">
							<div class="scale-95 pb-2"><FoodCard {item} onRemove={handleRemove} /></div>
							<div
								class="absolute -right-4 -bottom-4 -left-4 h-3 rounded-sm border-t-2 border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm"
							></div>
						</div>
					{/each}
					<div class="relative">
						<button
							onclick={() => onAddClick?.('chiller')}
							class="mb-2 flex min-h-[140px] w-full scale-95 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-4 text-slate-400 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-500"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg
							>
							<span class="text-sm font-bold">Add Item</span>
						</button>
						<div
							class="absolute -right-4 -bottom-4 -left-4 h-3 rounded-sm border-t-2 border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm"
						></div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Crisper Drawer -->
	<div
		class="relative z-0 rounded-b-[2rem] border-t-[8px] border-slate-300 bg-emerald-50/50 p-6 shadow-inner"
	>
		<div
			class="absolute top-4 left-4 flex items-center gap-2 text-xs font-black tracking-widest text-emerald-900/40 uppercase"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-leaf"
				><path d="M11 20A7 7 0 0 1 14 6c-1-1-3-1-5-1a7 7 0 0 0-7 7c0 2 1 4 2 5Z" /><path
					d="M11 20a7 7 0 0 0 7-7c0-2-1-4-2-5"
				/><path d="M14 6c1 1 3 1 5 1a7 7 0 0 1 7 7c0 2-1 4-2 5Z" /><path d="M11 20v2" /></svg
			>
			Crisper Drawer
		</div>

		<div class="mt-8">
			{#if crisperItems.length === 0}
				<button
					onclick={() => onAddClick?.('crisper')}
					class="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-200/50 bg-white/40 py-8 text-center transition-colors hover:border-emerald-300 hover:bg-emerald-100/50"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-emerald-300"><path d="M5 12h14" /><path d="M12 5v14" /></svg
					>
					<p class="text-sm font-bold text-emerald-900/40">Add to Crisper</p>
				</button>
			{:else}
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					{#each crisperItems as item (item.id)}
						<div class="opacity-95 transition-opacity hover:opacity-100">
							<FoodCard {item} onRemove={handleRemove} />
						</div>
					{/each}
					<button
						onclick={() => onAddClick?.('crisper')}
						class="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-200/50 p-4 text-emerald-900/40 transition-colors hover:border-emerald-300 hover:bg-emerald-100/50 hover:text-emerald-900/60"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg
						>
						<span class="text-sm font-bold">Add Item</span>
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
