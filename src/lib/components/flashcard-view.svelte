<!-- flashcard-view.svelte -->
<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Progress } from '$lib/components/ui/progress';
	import FlashcardControls from './flashcard-controls.svelte';
	import type { CardsResponse, GuessesResponse } from '$lib/pocketbase-types';
	import Flascard from './flascard.svelte';

	interface IProp {
		card: CardsResponse<{ guesses_via_cardId: GuessesResponse[] }>;
		flipped: boolean;
		totalCards: number;
		remainingCards: number;
		onAnswer: (action: 'right' | 'wrong' | 'skip') => void;
	}

	let {
		card,
		flipped = $bindable<boolean>(),
		totalCards,
		remainingCards,
		onAnswer
	}: IProp = $props();
</script>

<div class="flex flex-col items-center gap-6">
	<Progress value={totalCards - remainingCards} max={totalCards} class="w-full" />

	<Flascard bind:flipped>
		{#snippet front()}
			<Card.Root
				class="flex h-64 w-full items-center justify-center border-border bg-background p-6"
			>
				<h2 class="text-center text-2xl font-medium text-foreground">
					{card.question}
				</h2>
			</Card.Root>
		{/snippet}
		{#snippet back()}
			<Card.Root class="flex h-64 w-full items-center justify-center border-accent bg-accent p-6">
				<h2 class="text-center text-2xl font-medium text-foreground">
					{card.answer}
				</h2>
			</Card.Root>
		{/snippet}
	</Flascard>

	<FlashcardControls
		cardId={card.id}
		guessId={card.expand?.guesses_via_cardId[0]?.id}
		disabled={!flipped}
		{onAnswer}
	/>
</div>
