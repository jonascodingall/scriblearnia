import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { DecksRecord } from '$lib/pocketbase-types';

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		const deck = await locals.pb.collection('decks').getOne(params.deckId);
		return { deck };
	} catch (e: any) {
		throw error(404, 'Deck nicht gefunden');
	}
};

export const actions: Actions = {
	updateDeck: async ({ request, locals, params }) => {
		const formData = await request.formData();

		const isPublic = formData.get('public') === 'true';

		const data: Partial<DecksRecord> = {
			title: formData.get('title')?.toString(),
			description: formData.get('description')?.toString(),
			public: isPublic
		};

		await locals.pb.collection('decks').update(params.deckId, data);
	},
	deleteDeck: async ({ locals, params }) => {
		await locals.pb.collection('decks').delete(params.deckId);

		redirect(303, '/decks');
	}
} satisfies Actions;
