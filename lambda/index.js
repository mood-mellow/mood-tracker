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
	const timer = setTimeout(() => controller.abort(), 5000); // 2s

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

	let secrets;
	try {
		console.log("test 0");
		secrets = await parsedDbSecretsPromise;

		console.log("test 0.5");
		client = new Client({
			host: process.env.DB_HOST,
			user: secrets.username,
			password: secrets.password,
			database: process.env.DB_NAME,
		});
		console.log("test 1");
		await client.connect();
		console.log("test 2");

		// Insert the new user
		await client.query(
			`INSERT INTO "users" (id, email, username)
           VALUES ($1, $2, $3)
           ON CONFLICT (id) DO NOTHING`,
			[id, email, username],
		);
		console.log("User inserted into database");
		const result = await client.query(`SELECT * FROM users`);

		console.log("client is connected");
		console.log(`All users: `, JSON.stringify(result.rows, null, 2));
	} catch (error) {
		console.error("Database error:", error);
	} finally {
		await client.end();
	}

	return event; // Must return event for Cognito to continue
};
