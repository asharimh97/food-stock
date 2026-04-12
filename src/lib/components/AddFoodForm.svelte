<script lang="ts">
	import { stock } from '../stores/stock';
	import { calculateBestBefore } from '../services/shelfLife';
	import type { FoodCategory, FoodState, StorageLocation } from '../models/food';

	let {
		onclose,
		initialLocation = 'chiller'
	}: { onclose?: () => void; initialLocation?: StorageLocation } = $props();

	let name = $state('');
	let amount = $state('');
	let category = $state<FoodCategory>('vegie');
	let stateOption = $state<FoodState>('fresh');
	let storageLocation = $state<StorageLocation>(initialLocation);
	let enteredAt = $state('');
	let userExpiryDate = $state('');

	// Svelte 5 rune approach to init state depending on window
	$effect(() => {
		if (!enteredAt) {
			enteredAt = new Date().toISOString().split('T')[0];
		}
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name) return;

		const entryISO = new Date(enteredAt || new Date()).toISOString();
		let expiryISO: string | undefined = undefined;
		if (userExpiryDate) {
			expiryISO = new Date(userExpiryDate).toISOString();
		}

		const bestBefore = calculateBestBefore(
			entryISO,
			category,
			stateOption,
			storageLocation,
			expiryISO
		);

		const payload: any = {
			id: crypto.randomUUID(),
			name,
			category,
			state: stateOption,
			storageLocation,
			enteredAt: entryISO,
			bestBefore,
			notified: false
		};
		if (expiryISO) {
			payload.userExpiryDate = expiryISO;
		}
		if (amount) {
			payload.amount = amount;
		}

		stock.add(payload);

		name = '';
		amount = '';
		category = 'vegie';
		stateOption = 'fresh';
		storageLocation = 'chiller';
		enteredAt = new Date().toISOString().split('T')[0];
		userExpiryDate = '';

		if (onclose) onclose();
	}
</script>

<form
	onsubmit={handleSubmit}
	class="relative flex flex-col gap-5 overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm"
>
	<div
		class="absolute -top-10 -right-10 -z-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-70 blur-3xl"
	></div>
	<h2 class="text-2xl font-black tracking-tight text-slate-800">New Item</h2>

	<div class="grid grid-cols-[2fr_1fr] gap-4">
		<div class="flex flex-col gap-1.5">
			<label class="text-sm font-extrabold tracking-wide text-slate-500 uppercase" for="name"
				>Food Name</label
			>
			<input
				type="text"
				id="name"
				bind:value={name}
				placeholder="e.g. Tomatoes"
				required
				class="relative z-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-medium transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
			/>
		</div>
		<div class="flex flex-col gap-1.5">
			<label class="text-sm font-extrabold tracking-wide text-slate-500 uppercase" for="amount"
				>Amount</label
			>
			<input
				type="text"
				id="amount"
				bind:value={amount}
				placeholder="1 kg, 2 pcs"
				class="relative z-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-medium transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
			/>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="flex flex-col gap-1.5">
			<label class="text-xs font-extrabold tracking-wide text-slate-500 uppercase" for="category"
				>Category</label
			>
			<select
				id="category"
				bind:value={category}
				class="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-medium transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
			>
				<option value="vegie">Vegetables</option>
				<option value="fruit">Fruits</option>
				<option value="red_meat">Red Meat</option>
				<option value="fish">Fish</option>
				<option value="packaged">Packaged</option>
				<option value="other">Other</option>
			</select>
		</div>

		<div class="flex flex-col gap-1.5">
			<label class="text-xs font-extrabold tracking-wide text-slate-500 uppercase" for="state"
				>State</label
			>
			<select
				id="state"
				bind:value={stateOption}
				class="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-medium transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
			>
				{#if category === 'packaged'}
					<option value="sealed">Sealed</option>
					<option value="opened">Opened</option>
				{:else}
					<option value="fresh">Fresh</option>
					<option value="frozen">Frozen</option>
				{/if}
			</select>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="flex flex-col gap-1.5">
			<label class="text-xs font-extrabold tracking-wide text-slate-500 uppercase" for="location"
				>Stored In</label
			>
			<select
				id="location"
				bind:value={storageLocation}
				class="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-medium transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
			>
				<option value="chiller">Chiller</option>
				<option value="freezer">Freezer</option>
				<option value="shelf">Shelf</option>
				<option value="door">Door</option>
				<option value="crisper">Crisper</option>
			</select>
		</div>

		<div class="flex flex-col gap-1.5">
			<label class="text-xs font-extrabold tracking-wide text-slate-500 uppercase" for="enteredAt"
				>Stock Date</label
			>
			<input
				type="date"
				id="enteredAt"
				bind:value={enteredAt}
				class="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-medium transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
			/>
		</div>
	</div>

	{#if category === 'packaged'}
		<div
			class="mt-1 flex flex-col gap-2 rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-4"
		>
			<label
				class="text-[11px] font-extrabold tracking-wider text-indigo-600 uppercase"
				for="expiryDate">Expiration Date (Package)</label
			>
			<input
				type="date"
				id="expiryDate"
				bind:value={userExpiryDate}
				required
				class="cursor-pointer rounded-xl border border-indigo-200/60 bg-white px-4 py-2 text-sm font-medium transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
			/>
		</div>
	{/if}

	<button
		type="submit"
		class="relative z-10 mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-4 text-[15px] font-bold tracking-wide text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform hover:bg-slate-800 active:scale-95"
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
			stroke-linejoin="round"
			class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg
		>
		Add to Fridge
	</button>
</form>
