import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type {
	CardsRecord,
	CardsResponse,
	GuessesRecord,
	GuessesResponse
} from '$lib/pocketbase-types';

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		const deck = await locals.pb.collection('decks').getOne(params.deckId);

		type Expand = {
			guesses_via_cardId: GuessesResponse[];
		};
		const filterExpr = `deckId = '${params.deckId}'`;
		const cards = await locals.pb.collection('cards').getFullList<CardsResponse<Expand>>({
			filter: filterExpr,
			expand: 'guesses_via_cardId'
		});

		cards.map((card) => {
			if (!card.expand.guesses_via_cardId) {
				card.expand.guesses_via_cardId = [];
			}
		});

		return { deck, cards };
	} catch (e: any) {
		throw error(404, { message: e.message });
	}
};

export const actions = {
	guess: async ({ locals, request }) => {
		const formData = await request.formData();
		const guessId = formData.get('guessId')?.toString();
		const cardId = formData.get('cardId')?.toString();
		const isCorrect = formData.get('isCorrect') === 'true';

		const data: Partial<GuessesRecord> = {
			userId: locals.user?.id,
			cardId: cardId,
			isCorrect: isCorrect
		};

		if (guessId) {
			await locals.pb.collection('guesses').update(guessId, data);
		} else {
			await locals.pb.collection('guesses').create(data);
		}
	}
} satisfies Actions;
