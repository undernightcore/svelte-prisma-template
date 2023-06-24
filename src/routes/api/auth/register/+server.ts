import { prisma } from '$lib/server/services/prisma.service';
import { hashPassword } from '$lib/server/utils/bcrypt.utils';
import { registerValidator } from '$lib/server/validators/auth/register.validator';
import { json, type RequestHandler, error } from '@sveltejs/kit';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';

export const POST = (async ({ request }) => {
	const rawBody = await request.json();
	const { email, password } = await vine
		.compile(registerValidator.schema)
		.validate(rawBody, {
			messagesProvider: new SimpleMessagesProvider(registerValidator.messages, {})
		})
		.catch((e) => {
			throw error(400, e.messages[0]);
		});

	await prisma.user.create({ data: { email, password: await hashPassword(password) } });

	return json('Thank you for registering!');
}) satisfies RequestHandler;
