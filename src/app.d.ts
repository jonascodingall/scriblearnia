// See https://svelte.dev/docs/kit/types#app.d.ts

import type Pocketbase, { AuthModel } from 'pocketbase';
import type { TypedPocketBase } from '$lib/pocketbase-types';

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
		}
		interface Locals {
			pb: TypedPocketBase;
			user: AuthModel;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
