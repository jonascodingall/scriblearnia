<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let card = $state(data.card);
	let tags = $state(data.tags);
	$effect(() => {
		card = data.card;
		tags = data.tags;
	});
</script>

<p>{card.question}</p>
<p>{card.answer}</p>
{#each card.expand.tags as tag}
	<span>{tag.name}</span>
{/each}
<br />
<span>UPDATE:</span>
<form method="POST" action="?/updateCard" use:enhance>
	<input name="question" bind:value={card.question} />
	<input name="answer" bind:value={card.answer} />
	<select multiple name="tags">
		{#each tags as tag}
			<option selected={card.expand.tags.some((t) => t.id === tag.id)} value={tag.id}
				>{tag.name}</option
			>
		{/each}
	</select>
	<button type="submit">update</button>
</form>
<br />
<form method="POST" action="?/deleteCard">
	<button type="submit">delete</button>
</form>
<!--TODO CREATE NEW TAGS FORM-->
