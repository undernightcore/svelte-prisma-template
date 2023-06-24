import vine from '@vinejs/vine';

export const loginValidator = {
	schema: vine.object({
		email: vine.string().email(),
		password: vine.string().minLength(8)
	}),
	messages: {
		'email.required': 'Email is required for registering',
		'email.email': 'You should provide a valid email',
		'password.required': 'Password is required for registering',
		'password.minLength': 'Password must be at least 8 characters'
	}
};
