<script lang="ts">
	import * as Card from '$lib/components/ui/card';
</script>

<Card.Root class="h-full w-full rounded-xl border">
	<Card.Content class="flex h-full items-center justify-center p-6">
		<Card.Title class="m-0 text-center text-2xl">
			<slot />
		</Card.Title>
	</Card.Content>
</Card.Root>
