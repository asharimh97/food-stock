<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import { stock } from '../stores/stock';
	import { selectedFoodItem } from '../stores/dialog';

	let item = $derived($selectedFoodItem);

	const categoryIcon: Record<string, string> = {
		vegie: '🥦',
		fruit: '🍎',
		red_meat: '🥩',
		fish: '🐟',
		packaged: '🥫',
		other: '🍽️'
	};

	let daysLeft = $derived.by(() => {
		if (!item) return 0;
		const end = new SvelteDate(item.bestBefore);
		const start = new SvelteDate();
		start.setHours(0, 0, 0, 0);
		return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
	});

	function closeDialog() {
		$selectedFoodItem = null;
	}

	function handleRemove() {
		if (item) {
			stock.remove(item.id);
			closeDialog();
		}
	}
</script>

{#if item}
	<div
		class="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm duration-200"
		onclick={closeDialog}
	>
		<div
			class="animate-in zoom-in-95 relative flex w-full max-w-xs flex-col items-center rounded-[32px] bg-white p-6 shadow-2xl duration-200"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<button
				class="absolute top-4 right-4 rounded-full p-2 text-slate-400 transition-colors outline-none hover:bg-slate-100 hover:text-slate-600"
				onclick={closeDialog}
				aria-label="Close dialog"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
				>
			</button>

			<div class="mt-4 mb-3 text-[64px] leading-none drop-shadow-md">
				{categoryIcon[item.category] || '🥑'}
			</div>

			<h2 class="text-center text-2xl leading-tight font-black text-slate-800 capitalize">
				{item.name}
			</h2>
			<p class="mt-1.5 mb-6 text-xs font-bold tracking-widest text-slate-400 uppercase">
				{item.category.replace('_', ' ')}
			</p>

			<div
				class="mb-6 flex w-full flex-col gap-3.5 rounded-[20px] border border-slate-100 bg-slate-50 p-4"
			>
				<div class="flex items-center justify-between text-sm">
					<span class="font-medium text-slate-500">Status</span>
					<span
						class={`rounded-full px-2.5 py-0.5 font-bold ${daysLeft <= 1 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}
					>
						{#if daysLeft < 0}
							Expired
						{:else}
							Good
						{/if}
					</span>
				</div>
				<div class="h-px w-full bg-slate-100"></div>
				<div class="flex items-center justify-between text-sm">
					<span class="font-medium text-slate-500">Shelf Life</span>
					<span class="font-bold text-slate-700">
						{daysLeft < 0 ? Math.abs(daysLeft) + ' days over' : daysLeft + ' days left'}
					</span>
				</div>
				<div class="h-px w-full bg-slate-100"></div>
				<div class="flex items-center justify-between text-sm">
					<span class="font-medium text-slate-500">Location</span>
					<span class="font-bold text-slate-700 capitalize">{item.storageLocation}</span>
				</div>
				<div class="h-px w-full bg-slate-100"></div>
				<div class="flex items-center justify-between text-sm">
					<span class="font-medium text-slate-500">State</span>
					<span class="font-bold text-slate-700 capitalize">{item.state}</span>
				</div>
				{#if item.amount}
					<div class="h-px w-full bg-slate-100"></div>
					<div class="flex items-center justify-between text-sm">
						<span class="font-medium text-slate-500">Amount</span>
						<span class="font-mono font-bold tracking-tight text-slate-700">{item.amount}</span>
					</div>
				{/if}
			</div>

			<div class="w-full">
				<button
					class="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 py-3.5 text-[15px] font-bold text-red-600 transition-all hover:border-red-200 hover:bg-red-100 active:scale-[0.98]"
					onclick={handleRemove}
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
						/></svg
					>
					Toss Item
				</button>
			</div>
		</div>
	</div>
{/if}
