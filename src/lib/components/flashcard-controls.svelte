<!-- flashcard-controls.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	interface IProp {
		cardId: string;
		guessId?: string;
		disabled: boolean;
		onAnswer: (action: 'right' | 'wrong' | 'skip') => void;
	}

	let { cardId, guessId, disabled, onAnswer }: IProp = $props();

	const handleAction = async (isCorrect: boolean) => {
		const formData = new FormData();
		formData.append('cardId', cardId);
		if (guessId) formData.append('guessId', guessId);
		formData.append('isCorrect', isCorrect.toString());

		await fetch('?/guess', {
			method: 'POST',
			body: formData
		});
		onAnswer(isCorrect ? 'right' : 'wrong');
	};
</script>

<div class="flex w-full max-w-md flex-col gap-2 sm:flex-row">
	<Button
		variant="destructive"
		size="lg"
		class="flex-1"
		{disabled}
		onclick={() => handleAction(false)}
	>
		❌ Wrong
	</Button>

	<Button size="lg" class="flex-1 bg-green-700" {disabled} onclick={() => handleAction(true)}
		>✅ Correct</Button
	>

	<Button variant="outline" size="lg" class="flex-1" onclick={() => onAnswer('skip')}>
		⏭️ Skip
	</Button>
</div>
