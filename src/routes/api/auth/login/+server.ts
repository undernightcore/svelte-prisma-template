import { prisma } from '$lib/server/services/prisma.service';
import { isValidPassword } from '$lib/server/utils/bcrypt.utils';
import { generateUserJwt } from '$lib/server/utils/jwt.utils';
import { loginValidator } from '$lib/server/validators/auth/login.validator';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';

export const POST = (async ({ request }) => {
	const rawBody = await request.json().catch(() => ({}));
	const { email, password } = await vine
		.compile(loginValidator.schema)
		.validate(rawBody, {
			messagesProvider: new SimpleMessagesProvider(loginValidator.messages, {})
		})
		.catch((e) => {
			throw error(400, e.messages[0]);
		});

	const foundUser = await prisma.user.findUnique({ where: { email } });
	if (!foundUser) throw error(401, 'Wrong user credentials!');

	const passwordMatches = await isValidPassword(password, foundUser.password);
	if (!passwordMatches) throw error(401, 'Wrong user credentials!');

	const token = generateUserJwt(foundUser);

	return json({ token });
}) satisfies RequestHandler;
