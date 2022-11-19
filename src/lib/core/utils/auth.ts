// import { writable, derived, get } from 'svelte/store';
// import { page } from '$app/stores';
// import {
// 	CognitoIdentityProviderClient,
// 	SignUpCommand,
// 	InitiateAuthCommand,
// 	UsernameExistsException,
// 	RespondToAuthChallengeCommand,
// 	GetUserCommand,
// 	NotAuthorizedException,
// 	UserNotFoundException,
// 	UpdateUserAttributesCommand,
// 	type AttributeType,
// 	VerifyUserAttributeCommand
// } from '@aws-sdk/client-cognito-identity-provider';
// import config from '$lib/config/infra.json';
// import { persisted } from './localStorage';
// import { browser } from '$app/environment';
// import { tick } from 'svelte';

// const cognitoClient = new CognitoIdentityProviderClient({
// 	region: config.Cognito.CognitoRegion
// });

// const protectectRoutes = ['/profile', '/community'];

// export const openSignInModal = writable(false);
// export const accessToken = persisted('access_token');
// export const refreshToken = persisted('refresh_token');
// export const user = writable({
// 	id: '',
// 	email: '',
// 	firstName: '',
// 	lastName: '',
// 	username: ''
// });

// const userAttributeGetter = (userAttributes: AttributeType[]) => (attribute: string) => {
// 	return userAttributes.find((a) => a.Name === attribute)?.Value;
// };

// // isAuthenticated will be null when it is in an indeterminate state, i.e. when the page is loading
// // and the network call to verify a valid auth session is being made.
// export const isAuthenticated = derived<typeof accessToken, boolean | null>(
// 	accessToken,
// 	($accessToken, set) => {
// 		// Currently we rely on the JWT being in local storage.
// 		if (!browser) {
// 			set(null);
// 			return;
// 		}

// 		if ($accessToken === null) {
// 			set(false);
// 			return;
// 		}

// 		const getUserCommand = new GetUserCommand({
// 			AccessToken: $accessToken
// 		});

// 		cognitoClient
// 			.send(getUserCommand)
// 			// Set email from user
// 			.then(({ UserAttributes }) => {
// 				if (!UserAttributes) {
// 					throw new Error('Successful authentication but missing UserAttributes');
// 				} else {
// 					const getUserAttribute = userAttributeGetter(UserAttributes);
// 					const email = getUserAttribute('email');
// 					const id = getUserAttribute('sub');
// 					const firstName = getUserAttribute('given_name');
// 					const lastName = getUserAttribute('family_name');
// 					const username = getUserAttribute('preferred_username');

// 					if (!email || !id) {
// 						// This is theoretically impossible.
// 						if (!email) {
// 							throw new Error('Somehow user signed up without an email');
// 						} else {
// 							throw new Error('Somehow user signed up without an id');
// 						}
// 					} else {
// 						user.update((attrs) => ({
// 							...attrs,
// 							id,
// 							email,
// 							...(firstName && { firstName }),
// 							...(lastName && { lastName }),
// 							...(username && { username })
// 						}));
						
// 						set(true);
// 					}
// 				}
// 			})
// 			.catch(async (e) => {
// 				if (e instanceof NotAuthorizedException) {
// 					console.error('Access token expired');
// 					try {
// 						await refreshSignIn();
// 					} catch (e) {
// 						set(false);
// 						accessToken.remove();
// 					}
// 				} else if (e instanceof UserNotFoundException) {
// 					signOut();
// 				} else {
// 					console.error(e);
// 				}
// 			});
// 	},
// 	null
// );

// export const upvotyJwt = derived(
// 	isAuthenticated,
// 	($isAuthenticated, set) => {
// 		if ($isAuthenticated) {
// 			fetch(`/api/upvoty-sso-token?user=${JSON.stringify(get(user))}`)
// 				.then((res) => res.json())
// 				.then(({ token }) => {
// 					set(token);
// 				})
// 				.catch((err) => {
// 					console.error(err);
// 				});
// 		}
// 	},
// 	null
// );

// export const shouldAuthenticate = derived(
// 	[page, isAuthenticated],
// 	([$page, $isAuthenticated]) => !$isAuthenticated && protectectRoutes.includes($page.url.pathname)
// );

// // This is used to track the session id of the various auth calls. It needs to be grabbed
// // from each response and provided to the next request for the lambda triggers to collate them.
// let cognitoSessionId: string | undefined;

// async function refreshSignIn() {
// 	const signInCommand = new InitiateAuthCommand({
// 		AuthFlow: 'REFRESH_TOKEN',
// 		ClientId: config.Cognito.WebClientId,
// 		AuthParameters: {
// 			REFRESH_TOKEN: get(refreshToken) || ''
// 		}
// 	});

// 	const { AuthenticationResult } = await cognitoClient.send(signInCommand);
// 	if (AuthenticationResult?.AccessToken) {
// 		accessToken.set(AuthenticationResult.AccessToken);
// 	}
// }

// export async function signIn(email: string) {
// 	const signUpCommand = new SignUpCommand({
// 		ClientId: config.Cognito.WebClientId,
// 		Username: email,
// 		Password: generatePassword()
// 	});

// 	const signInCommand = new InitiateAuthCommand({
// 		AuthFlow: 'CUSTOM_AUTH',
// 		ClientId: config.Cognito.WebClientId,
// 		AuthParameters: {
// 			USERNAME: email
// 		}
// 	});

// 	const doSignIn = async () => {
// 		const { Session } = await cognitoClient.send(signInCommand);
// 		user.update((attrs) => ({ ...attrs, email }));
// 		cognitoSessionId = Session;
// 	};

// 	try {
// 		await cognitoClient.send(signUpCommand);
// 		await doSignIn();
// 	} catch (e) {
// 		if (e instanceof UsernameExistsException) {
// 			await doSignIn();
// 		} else {
// 			throw e;
// 		}
// 	}
// }

// export function signOut() {
// 	accessToken.remove();
// 	refreshToken.remove();
// }

// export class InvalidVerificationCodeError extends Error {
// 	constructor() {
// 		super('Invalid Verification Code');
// 	}
// }

// export async function verifyAttributeUpdateCode(code: string) {
// 	const verifyAttributeCommand = new VerifyUserAttributeCommand({
// 		AccessToken: get(accessToken) || '',
// 		AttributeName: 'email',
// 		Code: code
// 	});
// 	const response = await cognitoClient.send(verifyAttributeCommand);
// 	if (response.$metadata.httpStatusCode === 200) {
// 		return;
// 	}else{
// 		throw new InvalidVerificationCodeError();
// 	}
// }

// export async function verifyCode(code: string) {
// 	const verifyCodeCommand = new RespondToAuthChallengeCommand({
// 		ChallengeName: 'CUSTOM_CHALLENGE',
// 		ClientId: config.Cognito.WebClientId,
// 		Session: cognitoSessionId,
// 		ChallengeResponses: {
// 			USERNAME: get(user).email,
// 			ANSWER: code
// 		}
// 	});

// 	// Don't catch this. Let the consumer handle the error.
// 	const { AuthenticationResult, Session } = await cognitoClient.send(verifyCodeCommand);
// 	if (AuthenticationResult) {
// 		const { AccessToken, RefreshToken } = AuthenticationResult;
// 		if (AccessToken) {
// 			accessToken.set(AccessToken);
// 		} else {
// 			throw new Error('AccessToken not present in AuthenticationResult');
// 		}

// 		if (RefreshToken) {
// 			refreshToken.set(RefreshToken);
// 		}
// 	} else {
// 		// Typo in verification code. Update the auth-flow session to allow the user to try again.
// 		cognitoSessionId = Session;
// 		throw new InvalidVerificationCodeError();
// 	}
// }

// // It doesn't really matter what this is. It is used once since Cognito needs a password,
// // but then control is handed over to the custom flow which logs in the user via emailed code.
// function generatePassword() {
// 	const randomValues = new Uint8Array(30);
// 	window.crypto.getRandomValues(randomValues);
// 	return (
// 		Array.from(randomValues)
// 			// Convert to hex code
// 			.map((val) => val.toString(16))
// 			.join('')
// 	);
// }

// export async function updateProfileAttributes({
// 	firstName,
// 	lastName,
// 	username,
// 	email
// }: {
// 	firstName: string;
// 	lastName: string;
// 	username: string;
// 	email?: string;
// }) {
// 	await updateUserAttributes({
// 		given_name: firstName,
// 		family_name: lastName,
// 		preferred_username: username,
// 		...(email && { email })
// 	});

// 	user.update((attrs) => ({
// 		...attrs,
// 		firstName,
// 		lastName,
// 		username,
// 		...(email && { email })
// 	}));
// }

// export async function updateUserAttributes(attrs: Record<string, string>) {
// 	const resolvedAccessToken = get(accessToken);

// 	if (!resolvedAccessToken) {
// 		throw new ReferenceError('User needs to be signed in before setting attributes');
// 	}

// 	const updateUserAttributesCommand = new UpdateUserAttributesCommand({
// 		AccessToken: resolvedAccessToken,
// 		UserAttributes: Object.entries(attrs).map(([Name, Value]) => ({ Name, Value }))
// 	});

// 	await cognitoClient.send(updateUserAttributesCommand);
// }
