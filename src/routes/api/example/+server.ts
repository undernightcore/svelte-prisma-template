import { getAuthenticatedUser } from '$lib/server/utils/auth.utils';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET = (async ({ request }) => {
	const user = await getAuthenticatedUser(request);
	return json({ message: `Welcome ${user.email}!` });
}) satisfies RequestHandler;
