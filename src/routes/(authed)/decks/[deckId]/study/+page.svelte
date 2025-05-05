<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { CardsRecord, GuessesRecord, GuessesResponse } from '$lib/pocketbase-types';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let deck = $state(data.deck);
	let cards = $state(data.cards);
	$effect(() => {
		deck = data.deck;
		cards = data.cards;
	});

	const getSortetCards = () => {
		const noGuess = cards
			.filter((c) => c.expand.guesses_via_cardId.length === 0)
			.sort((a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime());

		const withGuess = cards
			.filter((c) => c.expand.guesses_via_cardId.length > 0)
			.sort((a, b) => {
				// Hilfsfunktion: frühesten Guess-Zeitstempel einer Karte
				const firstTs = (c: typeof a) =>
					Math.min(
						...c.expand.guesses_via_cardId.map((g: GuessesResponse) =>
							new Date(g.created).getTime()
						)
					);

				// Hilfsfunktion: enthält falsche Guesses?
				const hasFalse = (c: typeof a) =>
					c.expand.guesses_via_cardId.some((g: GuessesResponse) => !g.isCorrect);

				// 1. Fehler zunächst
				if (hasFalse(a) && !hasFalse(b)) return -1;
				if (!hasFalse(a) && hasFalse(b)) return 1;

				// 2. Innerhalb beider Gruppen nach erstem Timestamp sortieren
				return firstTs(a) - firstTs(b);
			});

		return [...noGuess, ...withGuess];
	};

	let dueCards = $state(getSortetCards());
	let currentCard = $derived(dueCards[0]);
	let isQuestion = $state(true);

	const nextCard = () => {
		dueCards.shift();
		isQuestion = true;
	};

	const skipCard = () => {
		let firstCard = dueCards.shift();
		if (firstCard) {
			dueCards.push(firstCard);
		}
		isQuestion = true;
	};

	const turnAround = () => {
		isQuestion = !isQuestion;
	};
</script>

{#if currentCard}
	{#if isQuestion}
		{currentCard.question}
	{:else}
		{currentCard.answer}
		<form
			method="POST"
			use:enhance={async () => {
				return async ({ result }) => {
					nextCard();
					await applyAction(result);
				};
			}}
		>
			<input name="cardId" type="hidden" value={currentCard.id} />
			<input name="guessId" type="hidden" value={currentCard.expand.guesses_via_cardId[0]?.id} />
			<button formaction="?/guessRight" type="submit">RIGHT</button>
			<button formaction="?/guessWrong" type="submit">WRONG</button>
		</form>
	{/if}
	<button onclick={turnAround}>TURN AROUND</button>
	<button onclick={skipCard}>SKIP</button>
{:else}
	<p>All Cards Finished</p>
{/if}
