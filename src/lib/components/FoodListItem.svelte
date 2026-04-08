<script lang="ts">
	import type { FoodItem } from '../models/food';

	let { item, onRemove }: { item: FoodItem; onRemove: (id: string) => void } = $props();

	let daysLeft = $derived.by(() => {
		const end = new Date(item.bestBefore);
		const start = new Date();
		start.setHours(0, 0, 0, 0);
		return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
	});

	let statusColor = $derived.by(() => {
		if (daysLeft < 0) return 'bg-rose-50 border-rose-200 text-rose-900';
		if (daysLeft <= 1) return 'bg-orange-50 border-orange-300 text-orange-900';
		if (daysLeft <= 3) return 'bg-amber-50 border-amber-300 text-amber-900';
		return 'bg-emerald-50 border-emerald-200 text-emerald-900';
	});

	let badgeColor = $derived.by(() => {
		if (daysLeft < 0) return 'bg-rose-500 text-white';
		if (daysLeft <= 1) return 'bg-orange-500 text-white';
		if (daysLeft <= 3) return 'bg-amber-400 text-amber-900';
		return 'bg-emerald-500 text-white';
	});
</script>

<div
	class={`flex items-center justify-between gap-4 rounded-2xl border-2 p-3 ${statusColor} group transition-all duration-200 hover:-translate-x-1 hover:shadow-sm`}
>
	<div class="flex min-w-0 flex-1 items-center gap-4">
		<div class="flex min-w-0 flex-1 flex-col justify-center">
			<div class="flex items-center gap-2">
				<h3 class="truncate text-lg font-black tracking-tight capitalize">{item.name}</h3>
				<span
					class={`rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${badgeColor}`}
				>
					{#if daysLeft < 0}
						Expired {Math.abs(daysLeft)}d ago
					{:else if daysLeft === 0}
						Expires Today!
					{:else if daysLeft === 1}
						Expires Tomorrow!
					{:else}
						{daysLeft} days left
					{/if}
				</span>
			</div>
			<div class="mt-0.5 flex items-center gap-2 text-sm font-medium capitalize opacity-80">
				<span>{item.state}</span>
				<span class="h-1 w-1 rounded-full bg-current opacity-50"></span>
				<span>{item.storageLocation}</span>
				<span class="h-1 w-1 rounded-full bg-current opacity-50"></span>
				<span class="text-[10px] tracking-widest uppercase">{item.category.replace('_', ' ')}</span>
			</div>
		</div>
	</div>

	<button
		aria-label="Remove item"
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-2 text-sm font-bold text-slate-400 opacity-100 shadow-sm transition-all group-hover:opacity-100 hover:scale-110 hover:bg-rose-50 hover:text-rose-600 focus:opacity-100 active:scale-95 md:opacity-0"
		onclick={() => onRemove(item.id)}
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
			><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path
				d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
			/><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg
		>
	</button>
</div>
