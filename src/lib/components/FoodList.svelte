<script lang="ts">
  import { stock } from '../stores/stock';
  import FoodCard from './FoodCard.svelte';
  
  let { title = "My Fridge", filter = "all" }: { title?: string, filter?: "all" | "freezer" | "chiller" | "shelf" | "door" | "crisper" } = $props();

  let filteredStocks = $derived.by(() => {
    let items = [...$stock];
    if (filter !== "all") {
      items = items.filter(i => i.storageLocation === filter);
    }
    // Sort by bestBefore (closest to expire first)
    return items.sort((a, b) => new Date(a.bestBefore).getTime() - new Date(b.bestBefore).getTime());
  });

  function handleRemove(id: string) {
    stock.remove(id);
  }
</script>

<div class="flex flex-col gap-4 w-full">
  <div class="flex justify-between items-end">
    <h2 class="text-2xl font-black tracking-tight text-slate-800">{title}</h2>
    <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">{filteredStocks.length} Items</span>
  </div>
  
  {#if filteredStocks.length === 0}
    <div class="p-8 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 mt-2">
      <p class="text-slate-500 font-bold">No groceries found here.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-2">
      {#each filteredStocks as item (item.id)}
        <div class="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <FoodCard {item} onRemove={handleRemove} />
        </div>
      {/each}
    </div>
  {/if}
</div>
