<script lang="ts">
	import '../app.css';

	import { browser } from '$app/environment';
	import { applyAction, enhance } from '$app/forms';
	import { setUserContext } from '$lib/contexts/user';
	import { pb } from '$lib/pocketbase';
	import { onDestroy, type Snippet } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		data: PageData;
		children?: Snippet;
	}

	let { data, children }: Props = $props();

	// Initialize user store
	const user = writable(data.user);
	setUserContext(user);

	if (browser) {
		// Load user from cookie (client-side only)
		pb.authStore.loadFromCookie(document.cookie);

		// Update user store when auth store changes
		const unsubscribe = pb.authStore.onChange(() => {
			user.set(pb.authStore.record);
			document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
		}, true);
		onDestroy(unsubscribe);
	}
</script>

<div>
	<header class="m-5 flex justify-between">
		<h1>SCIBLEARNIA</h1>
		<nav class="flex items-center space-x-4 lg:space-x-6">
			<Button href="/examples/dashboard" class="">Decks</Button>
		</nav>
	</header>
	<main>
		{@render children?.()}
	</main>
</div>
