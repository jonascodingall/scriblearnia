import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { CardsRecord, CardsResponse, TagsResponse } from '$lib/pocketbase-types';

export const load: PageServerLoad = async ({ locals, params }) => {
	type Expand = {
		tags: TagsResponse[];
	};

	try {
		const card = await locals.pb
			.collection('cards')
			.getOne<CardsResponse<Expand>>(params.cardId, { expand: 'tags' });

		const tags = await locals.pb.collection('tags').getFullList();
		if (!card.expand.tags) {
			card.expand.tags = [];
		}
		return { card, tags };
	} catch (e: any) {
		throw error(404, 'Deck nicht gefunden');
	}
};

export const actions: Actions = {
	updateCard: async ({ request, locals, params }) => {
		const formData = await request.formData();

		const tags: string[] = formData.getAll('tags').map((v) => v.toString());

		const data: Partial<CardsRecord> = {
			question: formData.get('question')?.toString(),
			answer: formData.get('answer')?.toString(),
			tags: tags
		};

		await locals.pb.collection('cards').update(params.cardId, data);
	},
	deleteCard: async ({ locals, params }) => {
		await locals.pb.collection('cards').delete(params.cardId);

		redirect(303, `/decks/${params.deckId}/cards`);
	}
} satisfies Actions;
