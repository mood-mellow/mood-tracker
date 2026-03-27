// @ts-check
import { Client } from "pg";
import {
	GetSecretValueCommand,
	SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

/** @typedef {import("aws-lambda").Context} Context */
/** @typedef {import("aws-lambda").PostConfirmationTriggerEvent} PostConfirmationTriggerEvent */

const secretsManagerClient = new SecretsManagerClient({
	region: "us-east-2",
});
let client;
let parsedDbSecretsPromise = secretsManagerClient
	.send(new GetSecretValueCommand({ SecretId: "rds-db-credentials" }))
	.then((dbSecrets) => JSON.parse(dbSecrets.SecretString));

/**
 *
 * @param {PostConfirmationTriggerEvent} event
 * @param {Context} context
 * @returns {Promise<PostConfirmationTriggerEvent>}
 */
export const handler = async (event, context) => {
	console.log("before GetSecretValue");
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 5000);

	try {
		const dbSecrets = await secretsManagerClient.send(
			new GetSecretValueCommand({ SecretId: "rds-db-credentials" }),
			{ abortSignal: controller.signal },
		);
		clearTimeout(timer);
		let parsedDbSecrets = JSON.parse(dbSecrets.SecretString);
		console.log("after GetSecretValue");
	} catch (e) {
		clearTimeout(timer);
		console.error("GetSecretValue failed:", e);
		// Decide whether to rethrow or just return event
		return event;
	}

	const id = event.request.userAttributes.sub;
	const email = event.request.userAttributes.email;
	const username = event.request.userAttributes.preferred_username;

	console.log(`\n[CreateUserPostConfirm]
      id: ${id}
      email: ${email}
      username: ${username}
      \n
      `);

	return event; // Must return event for Cognito to continue
};
