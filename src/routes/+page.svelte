<script lang="ts">
  import AddFoodForm from '$lib/components/AddFoodForm.svelte';
  import FoodList from '$lib/components/FoodList.svelte';
  
  let activeTab = $state<'all' | 'freezer' | 'chiller' | 'shelf' | 'door' | 'crisper'>('all');
  const tabs: ('all' | 'freezer' | 'chiller' | 'shelf' | 'door' | 'crisper')[] = ['all', 'chiller', 'freezer', 'crisper', 'door', 'shelf'];
  
  function setTab(tab: 'all' | 'freezer' | 'chiller' | 'shelf' | 'door' | 'crisper') {
    activeTab = tab;
  }
</script>

<svelte:head>
  <title>Fridge Stock Manager</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 pb-20 font-sans">
  <header class="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 text-white p-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg sticky top-0 z-10 w-full overflow-hidden">
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
    <div class="max-w-4xl mx-auto relative z-10 flex gap-4 items-center">
      <div class="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-box"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
      </div>
      <div>
        <h1 class="text-4xl font-black tracking-tighter">Fridge<span class="text-indigo-200">Stock</span></h1>
        <p class="text-indigo-100 font-bold tracking-wide text-sm opacity-90 mt-0.5">Keep your groceries fresh.</p>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 -mt-14 relative z-20 space-y-8">
    <AddFoodForm />
    
    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <!-- Tabs -->
      <div class="flex flex-nowrap overflow-x-auto gap-2 pb-4 mb-2 no-scrollbar">
        {#each tabs as tab}
          <button 
            onclick={() => setTab(tab)}
            class="px-5 py-2.5 rounded-xl font-bold text-[13px] uppercase tracking-wider transition-all whitespace-nowrap border-2 {activeTab === tab ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-300'}">
            {tab}
          </button>
        {/each}
      </div>
      
      <div class="mt-4">
        <FoodList filter={activeTab} title={activeTab === 'all' ? 'All Groceries' : `${tab} Contents`} />
      </div>
    </div>
  </main>
</div>

<style>
  /* Hide scrollbar */
  .no-scrollbar::-webkit-scrollbar {
      display: none;
  }
  .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }
</style>
