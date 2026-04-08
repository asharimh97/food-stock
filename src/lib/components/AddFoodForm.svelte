<script lang="ts">
  import { stock } from '../stores/stock';
  import { calculateBestBefore } from '../services/shelfLife';
  import type { FoodCategory, FoodState, StorageLocation } from '../models/food';

  let name = $state('');
  let category = $state<FoodCategory>('vegie');
  let stateOption = $state<FoodState>('fresh');
  let storageLocation = $state<StorageLocation>('chiller');
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

    const bestBefore = calculateBestBefore(entryISO, category, stateOption, storageLocation, expiryISO);

    stock.add({
      id: crypto.randomUUID(),
      name,
      category,
      state: stateOption,
      storageLocation,
      enteredAt: entryISO,
      userExpiryDate: expiryISO,
      bestBefore,
      notified: false
    });

    name = '';
    category = 'vegie';
    stateOption = 'fresh';
    storageLocation = 'chiller';
    enteredAt = new Date().toISOString().split('T')[0];
    userExpiryDate = '';
  }
</script>

<form onsubmit={handleSubmit} class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-5 overflow-hidden relative">
  <div class="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl -z-10 opacity-70"></div>
  <h2 class="text-2xl font-black tracking-tight text-slate-800">New Item</h2>
  
  <div class="flex flex-col gap-1.5">
    <label class="text-sm font-extrabold text-slate-500 uppercase tracking-wide" for="name">Food Name</label>
    <input type="text" id="name" bind:value={name} placeholder="e.g. Tomatoes" required
      class="border border-slate-200 rounded-xl px-4 py-2.5 font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-slate-50 relative z-10" />
  </div>

  <div class="grid grid-cols-2 gap-4">
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-extrabold text-slate-500 uppercase tracking-wide" for="category">Category</label>
      <select id="category" bind:value={category} class="border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium bg-slate-50 transition-all cursor-pointer">
        <option value="vegie">Vegetables</option>
        <option value="fruit">Fruits</option>
        <option value="red_meat">Red Meat</option>
        <option value="fish">Fish</option>
        <option value="packaged">Packaged</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-extrabold text-slate-500 uppercase tracking-wide" for="state">State</label>
      <select id="state" bind:value={stateOption} class="border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium bg-slate-50 transition-all cursor-pointer">
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
      <label class="text-xs font-extrabold text-slate-500 uppercase tracking-wide" for="location">Stored In</label>
      <select id="location" bind:value={storageLocation} class="border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium bg-slate-50 transition-all cursor-pointer">
        <option value="chiller">Chiller</option>
        <option value="freezer">Freezer</option>
        <option value="shelf">Shelf</option>
        <option value="door">Door</option>
        <option value="crisper">Crisper</option>
      </select>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-extrabold text-slate-500 uppercase tracking-wide" for="enteredAt">Stock Date</label>
      <input type="date" id="enteredAt" bind:value={enteredAt} class="border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium bg-slate-50 transition-all cursor-pointer" />
    </div>
  </div>

  {#if category === 'packaged'}
    <div class="flex flex-col gap-2 bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10 mt-1">
      <label class="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider" for="expiryDate">Expiration Date (Package)</label>
      <input type="date" id="expiryDate" bind:value={userExpiryDate} required
        class="border border-indigo-200/60 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium bg-white transition-all cursor-pointer text-sm" />
    </div>
  {/if}

  <button type="submit" class="mt-2 bg-slate-900 text-white hover:bg-slate-800 font-bold py-4 px-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform active:scale-95 text-[15px] flex justify-center items-center gap-2 tracking-wide w-full relative z-10">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    Add to Fridge
  </button>
</form>
