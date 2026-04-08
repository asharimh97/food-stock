<script lang="ts">
  import type { FoodItem } from '../models/food';

  let { item, onRemove }: { item: FoodItem, onRemove: (id: string) => void } = $props();

  let daysLeft = $derived.by(() => {
    const end = new Date(item.bestBefore);
    const start = new Date();
    start.setHours(0,0,0,0);
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

<div class={`p-4 rounded-2xl border-2 flex flex-col gap-3 ${statusColor} transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}>
  <div class="flex justify-between items-start gap-4">
    <div class="flex-1 min-w-0">
      <h3 class="font-black text-xl tracking-tight truncate capitalize">{item.name}</h3>
      <p class="text-sm font-medium opacity-80 mt-0.5 capitalize">{item.state} • {item.storageLocation}</p>
    </div>
    <div class={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm ${badgeColor}`}>
      {#if daysLeft < 0}
        Expired {Math.abs(daysLeft)}d ago
      {:else if daysLeft === 0}
        Expires Today!
      {:else if daysLeft === 1}
        Expires Tomorrow!
      {:else}
        {daysLeft} days left
      {/if}
    </div>
  </div>
  <div class="flex flex-wrap justify-between items-center mt-1 pt-3 border-t border-current/20 gap-3">
    <span class="text-[10px] bg-white/40 px-2 py-1 rounded-md opacity-80 uppercase tracking-widest font-bold whitespace-nowrap">
      {item.category.replace('_', ' ')}
    </span>
    <button aria-label="Remove item" class="ml-auto text-sm px-4 py-1.5 bg-white shadow-sm hover:scale-105 active:scale-95 rounded-lg font-bold text-current transition-transform" onclick={() => onRemove(item.id)}>
      Consume / Toss
    </button>
  </div>
</div>
