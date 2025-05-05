<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	let decks = $state(data.decks);

	$effect(() => {
		decks = data.decks;
	});
</script>

<div class="flex flex-col">
	{#each decks as deck}
		<div>
			<form method="POST" action="decks/{deck.id}?/deleteDeck" use:enhance>
				<a href="/decks/{deck.id}">{deck.title}</a>
				<button>delete</button>
			</form>
		</div>
	{/each}
</div>
<br />
<span>CREATE NEW</span>
<form method="POST" action="?/createDeck" use:enhance>
	<input placeholder="Title" name="title" />
	<input placeholder="Description" name="description" />
	<input value={false} name="public" type="checkbox" />
	<button type="submit">Create</button>
</form>
