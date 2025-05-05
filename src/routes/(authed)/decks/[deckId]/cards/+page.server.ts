import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { CardsRecord } from '$lib/pocketbase-types';

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		const cards = await locals.pb
			.collection('cards')
			.getFullList({ filter: `deckId = "${params.deckId}"` });

		const tags = await locals.pb.collection('tags').getFullList();
		return { cards, tags };
	} catch (e: any) {
		error(500, { message: e.message });
	}
};

export const actions = {
	createCard: async ({ locals, request, params }) => {
		const formData = await request.formData();

		const tags: string[] = formData.getAll('tags').map((v) => v.toString());

		const data: Partial<CardsRecord> = {
			question: formData.get('question')?.toString(),
			answer: formData.get('answer')?.toString(),
			tags: tags,
			deckId: params.deckId
		};

		const newCard = await locals.pb.collection('cards').create(data);

		redirect(303, `/decks/${newCard.deckId}/cards/${newCard.id}`);
	}
} satisfies Actions;
