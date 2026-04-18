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

/**
 *
 * @param {PostConfirmationTriggerEvent} event
 * @param {Context} context
 * @returns {Promise<PostConfirmationTriggerEvent>}
 */
export const handler = async (event, context) => {
	console.log("before GetSecretValue");

	try {
		const dbSecrets = await secretsManagerClient.send(
			new GetSecretValueCommand({ SecretId: "rds-db-credentials" }),
		);
		let parsedDbSecrets = JSON.parse(dbSecrets.SecretString);
		console.log("after GetSecretValue");

		client = new Client({
			host: parsedDbSecrets.db_host,
			user: parsedDbSecrets.db_username,
			password: parsedDbSecrets.db_password,
			database: parsedDbSecrets.db_name,
			port: 5432,
			ssl: {
				rejectUnauthorized: false,
			},
		});
	} catch (e) {
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

	await client.connect();

	// Insert the new user
	await client.query(
		`INSERT INTO "users" (id, email, username)
           VALUES ($1, $2, $3)
           ON CONFLICT (id) DO NOTHING`,
		[id, email, username],
	);
	console.log("User inserted into database");
	const result = await client.query(`SELECT * FROM users`);
	console.log("User selected query: " + result);

	return event;
};
