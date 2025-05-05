<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let cards = $state(data.cards);
	let tags = $state(data.tags);
	$effect(() => {
		cards = data.cards;
		tags = data.tags;
	});
</script>

<div class="flex flex-col">
	{#each cards as card}
		<div>
			<form method="POST" action="/decks/{card.deckId}/cards/{card.id}?/deleteCard" use:enhance>
				<a href="/decks/{card.deckId}/cards/{card.id}">link</a>
				<span>answer: {card.answer}</span>
				<span>question: {card.question}</span>
				<button>delete</button>
			</form>
		</div>
	{/each}
</div>
<span>CREATE NEW</span>
<form method="POST" action="?/createCard" use:enhance>
	<input placeholder="Question" name="question" />
	<input placeholder="Answer" name="answer" />
	<select multiple name="tags">
		{#each tags as tag}
			<option value={tag.id}>{tag.name}</option>
		{/each}
	</select>
	<button type="submit">Create</button>
</form>

<!--TODO CREATE NEW TAGS FORM-->
