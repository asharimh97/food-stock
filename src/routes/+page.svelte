<script lang="ts">
	import AddFoodForm from '$lib/components/AddFoodForm.svelte';
	import FoodList from '$lib/components/FoodList.svelte';
	import ViewToggle from '$lib/components/ViewToggle.svelte';
	import FridgeLayout from '$lib/components/FridgeLayout.svelte';
	import type { StorageLocation } from '$lib/models/food';

	let viewMode = $state<'fridge' | 'cards' | 'list'>('fridge');
	let isAddFoodOpen = $state(false);
	let addTargetLocation = $state<StorageLocation>('chiller');

	let activeTab = $state<'all' | 'freezer' | 'chiller' | 'shelf' | 'door' | 'crisper'>('all');
	const tabs: ('all' | 'freezer' | 'chiller' | 'shelf' | 'door' | 'crisper')[] = [
		'all',
		'chiller',
		'freezer',
		'crisper',
		'door',
		'shelf'
	];

	function setTab(tab: 'all' | 'freezer' | 'chiller' | 'shelf' | 'door' | 'crisper') {
		activeTab = tab;
	}
</script>

<svelte:head>
	<title>Fridge Stock Manager</title>
</svelte:head>

<div class="relative min-h-screen bg-slate-50 pb-24 font-sans">
	<header
		class="sticky top-0 z-10 w-full overflow-hidden rounded-b-[3rem] bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 p-6 pt-12 pb-24 text-white shadow-lg"
	>
		<div
			class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"
		></div>
		<div
			class="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"
		></div>
		<div class="relative z-10 mx-auto flex max-w-4xl items-center gap-4">
			<div class="rounded-2xl bg-white/20 p-3 shadow-inner backdrop-blur-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path
						d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
					/><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg
				>
			</div>
			<div>
				<h1 class="text-4xl font-black tracking-tighter">
					Fridge<span class="text-indigo-200">Stock</span>
				</h1>
				<p class="mt-0.5 text-sm font-bold tracking-wide text-indigo-100 opacity-90">
					Keep your groceries fresh.
				</p>
			</div>
		</div>
	</header>

	<main class="relative z-20 mx-auto -mt-14 max-w-4xl space-y-6 px-4">
		<div class="flex justify-center md:justify-end">
			<ViewToggle {viewMode} onChange={(m) => (viewMode = m)} />
		</div>

		{#if viewMode === 'fridge'}
			<div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
				<FridgeLayout
					onAddClick={(loc) => {
						addTargetLocation = loc;
						isAddFoodOpen = true;
					}}
				/>
			</div>
		{:else}
			<div
				class="animate-in fade-in slide-in-from-bottom-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm duration-500"
			>
				<!-- Tabs -->
				<div class="no-scrollbar mb-2 flex flex-nowrap gap-2 overflow-x-auto pb-4">
					{#each tabs as tab (tab)}
						<button
							onclick={() => setTab(tab)}
							class="rounded-xl border-2 px-5 py-2.5 text-[13px] font-bold tracking-wider whitespace-nowrap uppercase transition-all {activeTab ===
							tab
								? 'border-slate-900 bg-slate-900 text-white shadow-md'
								: 'border-slate-200 bg-transparent text-slate-500 hover:border-slate-300'}"
						>
							{tab}
						</button>
					{/each}
				</div>

				<div class="mt-4">
					<FoodList
						filter={activeTab}
						title={activeTab === 'all' ? 'All Groceries' : `${activeTab} Contents`}
						layout={viewMode === 'list' ? 'list' : 'grid'}
					/>
				</div>
			</div>
		{/if}
	</main>

	<!-- Floating Action Button for Add Food -->
	<button
		aria-label="Add Item"
		onclick={() => {
			addTargetLocation = 'chiller';
			isAddFoodOpen = true;
		}}
		class="group fixed right-6 bottom-6 z-40 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95 md:right-8 md:bottom-8"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="28"
			height="28"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="transition-transform duration-300 group-hover:rotate-90"
			><path d="M5 12h14" /><path d="M12 5v14" /></svg
		>
	</button>
</div>

<!-- Add Food Modal Dialog -->
{#if isAddFoodOpen}
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-md transition-opacity sm:items-center sm:p-4"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="absolute inset-0"
			aria-label="Close background"
			aria-hidden="true"
			onclick={() => {
				isAddFoodOpen = false;
			}}
		></div>

		<div
			class="animate-in slide-in-from-bottom-full sm:zoom-in-95 relative w-full max-w-lg bg-transparent pt-16 duration-300 sm:pt-0"
		>
			<button
				aria-label="Close Modal"
				class="absolute top-[84px] right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-colors hover:bg-slate-200 sm:top-4 sm:right-4"
				onclick={() => (isAddFoodOpen = false)}
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

			<div
				class="no-scrollbar pb-safe flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-[2rem] bg-white sm:max-h-[90vh] sm:rounded-[2rem]"
			>
				<AddFoodForm onclose={() => (isAddFoodOpen = false)} initialLocation={addTargetLocation} />
			</div>
		</div>
	</div>
{/if}

<style>
	/* Hide scrollbar */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.pb-safe {
		padding-bottom: env(safe-area-inset-bottom, 20px);
	}
</style>
