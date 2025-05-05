import type { TagsRecord } from '$lib/pocketbase-types';
import type { Actions } from './$types';

export const actions = {
	createTag: async ({ locals, request }) => {
		const formData = await request.formData();

		const data: Partial<TagsRecord> = {
			name: formData.get('name')?.toString()
		};

		await locals.pb.collection('cards').create(data);
	}
} satisfies Actions;
