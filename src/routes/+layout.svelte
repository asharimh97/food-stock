<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { requestNotificationPermission, checkExpiringItems } from '$lib/services/notifications';
  import { stock } from '$lib/stores/stock';

  let { children } = $props();

  onMount(() => {
    // Check notifications on load
    requestNotificationPermission().then((granted) => {
        if (granted) {
          // Check if stock has loaded (might take a tiny moment to pull off LocalStorage if hydrating slowly)
          setTimeout(() => {
              const unsubscribe = stock.subscribe((items) => {
                checkExpiringItems(items);
              });
              // We just run this check once at startup
              unsubscribe();
          }, 1500);
        }
    });
  });
</script>

<svelte:head>
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="theme-color" content="#ffffff" />
</svelte:head>

{@render children()}
