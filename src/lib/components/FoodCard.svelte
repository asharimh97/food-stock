<script lang="ts">
  import type { FoodItem } from '../models/food';
  import { selectedFoodItem } from '../stores/dialog';

  let { item, onRemove }: { item: FoodItem, onRemove: (id: string) => void } = $props();

  let daysLeft = $derived.by(() => {
    const end = new Date(item.bestBefore);
    const start = new Date();
    start.setHours(0,0,0,0);
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
  class={`p-4 rounded-[20px] text-left border relative flex flex-col items-start min-h-[160px] ${statusColor} transition-all duration-200 hover:-translate-y-1 hover:shadow-md w-full focus:outline-none focus:ring-2 focus:ring-slate-400`}
  onclick={handleCardClick}
>
  <div class="text-[40px] mb-auto leading-none drop-shadow-sm">
    {categoryIcon[item.category] || '🥑'}
  </div>

  <div class="mt-4 w-full pr-8">
    <h3 class="font-bold text-[16px] leading-tight opacity-95 capitalize truncate mb-1">
      {item.name}
    </h3>
    <p class="font-black text-[20px] tracking-tight leading-none mb-1 text-current gap-2 flex items-center">
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
    <p class="text-[11px] font-semibold opacity-75 capitalize tracking-wide flex flex-wrap items-center gap-1">
      {item.storageLocation} • {item.state}
      {#if item.amount}
        • {item.amount}
      {/if}
    </p>
  </div>
  
  <div 
    role="button"
    tabindex="0"
    class={`absolute bottom-4 right-4 p-2.5 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all outline-none z-10 ${
      daysLeft > 3 ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/60 hover:bg-white/80 text-current'
    }`}
    onclick={(e) => { e.stopPropagation(); onRemove(item.id); }}
    onkeydown={(e) => { if(e.key === 'Enter') { e.stopPropagation(); onRemove(item.id); } }}
    aria-label="Remove item"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-90">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      <line x1="10" x2="10" y1="11" y2="17"/>
      <line x1="14" x2="14" y1="11" y2="17"/>
    </svg>
  </div>
</button>
