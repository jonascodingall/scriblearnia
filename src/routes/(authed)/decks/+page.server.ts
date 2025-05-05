import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { DecksRecord } from '$lib/pocketbase-types';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const decks = await locals.pb.collection('decks').getFullList();
		return { decks };
	} catch (e: any) {
		error(500, { message: e.message });
	}
};

export const actions = {
	createDeck: async ({ locals, request }) => {
		const formData = await request.formData();

		const isPublic = formData.get('public') === 'true';

		const data: Partial<DecksRecord> = {
			title: formData.get('title')?.toString(),
			userId: locals.user?.id,
			description: formData.get('description')?.toString(),
			public: isPublic
		};

		const newDeck = await locals.pb.collection('decks').create(data);

		redirect(303, `/decks/${newDeck.id}`);
	}
} satisfies Actions;
