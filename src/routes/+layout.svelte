<script lang="ts">
	import '../app.css';

	import { browser } from '$app/environment';
	import { setUserContext } from '$lib/contexts/user';
	import { pb } from '$lib/pocketbase';
	import { onDestroy, type Snippet } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { page } from '$app/state';

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
	// https://github.com/huntabyte/shadcn-svelte/blob/next/sites/docs/src/lib/registry/new-york/block/sidebar-10/components/nav-main.svelte
</script>

<div>
	<header class="flex justify-between">
		<div class="flex gap-2">
			<span>SCIBLEARNIA</span>
		</div>
		<div>
			<h1>SCIBLEARNIA</h1>
		</div>
	</header>
	<Separator />
	<main>
		{@render children?.()}
	</main>
</div>
