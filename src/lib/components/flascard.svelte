<!-- flashcard.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface IProp {
		front: Snippet;
		back: Snippet;
		flipped: boolean;
	}

	let { front, back, flipped = $bindable<boolean>() }: IProp = $props();
</script>

<button class="perspective-1000 aspect-[3/2] w-full max-w-md" onclick={() => (flipped = !flipped)}>
	<div
		class="transform-style-preserve-3d relative h-full w-full transition-transform duration-700"
		class:rotate-y-180={flipped}
	>
		<div class="backface-hidden absolute inset-0">
			{@render front()}
		</div>
		<div class="backface-hidden rotate-y-180 absolute inset-0">
			{@render back()}
		</div>
	</div>
</button>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}
	.transform-style-preserve-3d {
		transform-style: preserve-3d;
	}
	.backface-hidden {
		backface-visibility: hidden;
	}
	.rotate-y-180 {
		transform: rotateY(180deg);
	}
</style>
