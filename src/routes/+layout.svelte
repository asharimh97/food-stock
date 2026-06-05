<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { requestNotificationPermission, checkExpiringItems } from '$lib/services/notifications';
	import { stock } from '$lib/stores/stock';
	import FoodDetailDialog from '$lib/components/FoodDetailDialog.svelte';

	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();

	// Inject the Web Manifest link into the <head> dynamically
	let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	onMount(() => {
		// Register PWA service worker using virtual:pwa-register
		if (pwaInfo) {
			import('virtual:pwa-register').then(({ registerSW }) => {
				registerSW({
					immediate: true,
					onRegistered(r: ServiceWorkerRegistration | undefined) {
						console.log('SW Registered:', r);
					},
					onRegisterError(error: unknown) {
						console.error('SW registration error:', error);
					}
				});
			});
		}

		// Check notifications on load
		requestNotificationPermission().then((granted) => {
			if (granted) {
				// Check if stock has loaded
				setTimeout(() => {
					const unsubscribe = stock.subscribe((items) => {
						checkExpiringItems(items);
					});
					unsubscribe();
				}, 1500);
			}
		});
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html webManifestLink}
	<link rel="apple-touch-icon" href="/pwa-192.png" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="apple-mobile-web-app-title" content="FridgeStock" />
	<meta name="theme-color" content="#ffffff" />
</svelte:head>

{@render children()}
<FoodDetailDialog />
