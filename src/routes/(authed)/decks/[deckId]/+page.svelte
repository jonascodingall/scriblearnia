<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let deck = $state(data.deck);

	$effect(() => {
		deck = data.deck;
	});
</script>

<p>{deck.title}</p>
<p>{deck.description}</p>
<br />
<span>UPDATE:</span>
<form method="POST" action="?/updateDeck" use:enhance>
	<input name="title" bind:value={deck.title} />
	<input name="description" bind:value={deck.description} />
	<input value={deck.public} name="public" type="checkbox" bind:checked={deck.public} />
	<button type="submit">update</button>
</form>
<br />
<form method="POST" action="?/deleteDeck">
	<button type="submit">delete</button>
</form>
