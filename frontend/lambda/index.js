// @ts-check
const { Client } = require("pg");

/** @typedef {import("aws-lambda").Context} Context */
/** @typedef {import("aws-lambda").PostConfirmationTriggerEvent} PostConfirmationTriggerEvent */

/**
 *
 * @param {PostConfirmationTriggerEvent} event
 * @param {Context} context
 * @returns {Promise<PostConfirmationTriggerEvent>}
 */
export const handler = async (event, context) => {
  const id = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;
  const username = event.request.userAttributes.preferred_username;

  console.log(`\n[CreateUserPostConfirm]
      id: ${id}
      email: ${email}
      username: ${username}
      \n
      `);

  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  try {
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

    console.log("client is connected");
    console.log(`All users: `, JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await client.end();
  }

  return event; // Must return event for Cognito to continue
};
