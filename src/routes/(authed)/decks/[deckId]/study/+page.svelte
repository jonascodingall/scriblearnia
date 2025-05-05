<!-- +page.svelte -->
<script lang="ts">
	import FlashcardView from '$lib/components/flashcard-view.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import type { CardsResponse, GuessesResponse } from '$lib/pocketbase-types';

	type Expand = {
		guesses_via_cardId: GuessesResponse[];
	};

	type CardWithGuesses = CardsResponse<Expand>;

	type CardAction = (action: 'right' | 'wrong' | 'skip') => void;

	const { data }: PageProps = $props();
	let deck = $state(data.deck);
	let cards = $state(data.cards);
	let dueCards = $state<CardWithGuesses[]>([]);
	let currentCard = $derived(dueCards[0]);
	let flipped = $state(false);

	const partitionCards = (cards: CardWithGuesses[]) => {
		const unguessed: CardWithGuesses[] = [];
		const guessed: CardWithGuesses[] = [];

		cards.forEach((card) => {
			card.expand.guesses_via_cardId.length > 0 ? guessed.push(card) : unguessed.push(card);
		});

		return [unguessed, guessed] as const;
	};

	const sortUnguessed = (cards: CardWithGuesses[]) =>
		[...cards].sort((a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime());

	const hasIncorrectGuesses = (card: CardWithGuesses) =>
		card.expand.guesses_via_cardId.some((guess) => !guess.isCorrect);

	const earliestGuessTime = (card: CardWithGuesses) =>
		Math.min(...card.expand.guesses_via_cardId.map((g) => new Date(g.created).getTime()));

	const sortGuessed = (cards: CardWithGuesses[]) =>
		[...cards].sort((a, b) => {
			const aHasErrors = hasIncorrectGuesses(a);
			const bHasErrors = hasIncorrectGuesses(b);

			if (aHasErrors !== bHasErrors) return aHasErrors ? -1 : 1;
			return earliestGuessTime(a) - earliestGuessTime(b);
		});

	$effect(() => {
		deck = data.deck;
		cards = data.cards;
		const [unguessed, guessed] = partitionCards(data.cards);
		dueCards = [...sortUnguessed(unguessed), ...sortGuessed(guessed)];
	});

	const handleCardAction: CardAction = (action) => {
		const card = dueCards.shift();
		if (!card) return;

		if (action === 'wrong' || action === 'skip') dueCards.push(card);
		const safedAnswer = currentCard.answer;
		currentCard.answer = '';
		setTimeout(() => (currentCard.answer = safedAnswer), 500);
		flipped = false;
	};
</script>

<div class="mt-40 flex justify-center">
	{#if currentCard}
		<FlashcardView
			card={currentCard}
			bind:flipped
			totalCards={data.cards.length}
			remainingCards={dueCards.length}
			onAnswer={handleCardAction}
		/>
	{:else}
		<div class="flex flex-col items-center gap-4 rounded-lg bg-card p-6 shadow-sm">
			<h2 class="text-2xl font-semibold text-foreground">All Cards Completed! 🎉</h2>
			<Button variant="outline" onclick={() => location.reload()}>Restart Session</Button>
		</div>
	{/if}
</div>
