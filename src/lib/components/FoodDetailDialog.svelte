<script lang="ts">
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
    const end = new Date(item.bestBefore);
    const start = new Date();
    start.setHours(0,0,0,0);
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
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" 
    role="dialog"
    aria-modal="true"
    onclick={closeDialog}
    onkeydown={(e) => e.key === 'Escape' && closeDialog()}
    tabindex="-1"
  >
    <div 
      class="bg-white rounded-[32px] p-6 w-full max-w-xs shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200 relative" 
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <button 
        class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors outline-none"
        onclick={closeDialog}
        aria-label="Close dialog"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>

      <div class="text-[64px] mb-3 mt-4 drop-shadow-md leading-none">
        {categoryIcon[item.category] || '🥑'}
      </div>
      
      <h2 class="text-2xl font-black capitalize text-slate-800 text-center leading-tight">
        {item.name}
      </h2>
      <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5 mb-6">
        {item.category.replace('_', ' ')}
      </p>
      
      <div class="w-full bg-slate-50 border border-slate-100 rounded-[20px] p-4 flex flex-col gap-3.5 mb-6">
        <div class="flex justify-between items-center text-sm">
          <span class="text-slate-500 font-medium">Status</span>
          <span class={`font-bold px-2.5 py-0.5 rounded-full ${daysLeft <= 1 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {#if daysLeft < 0} Expired {:else} Good {/if}
          </span>
        </div>
        <div class="h-px bg-slate-100 w-full"></div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-slate-500 font-medium">Shelf Life</span>
          <span class="font-bold text-slate-700">
            {daysLeft < 0 ? Math.abs(daysLeft) + ' days over' : daysLeft + ' days left'}
          </span>
        </div>
        <div class="h-px bg-slate-100 w-full"></div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-slate-500 font-medium">Location</span>
          <span class="font-bold text-slate-700 capitalize">{item.storageLocation}</span>
        </div>
        <div class="h-px bg-slate-100 w-full"></div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-slate-500 font-medium">State</span>
          <span class="font-bold text-slate-700 capitalize">{item.state}</span>
        </div>
        {#if item.amount}
          <div class="h-px bg-slate-100 w-full"></div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-slate-500 font-medium">Amount</span>
            <span class="font-bold text-slate-700 font-mono tracking-tight">{item.amount}</span>
          </div>
        {/if}
      </div>

      <div class="w-full">
        <button 
          class="w-full bg-red-50 text-red-600 font-bold py-3.5 border border-red-100 hover:bg-red-100 hover:border-red-200 active:scale-[0.98] rounded-2xl transition-all text-[15px] flex justify-center items-center gap-2"
          onclick={handleRemove}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          Toss Item
        </button>
      </div>
    </div>
  </div>
{/if}
