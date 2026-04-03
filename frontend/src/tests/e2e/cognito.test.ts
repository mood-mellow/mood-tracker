import { type z } from "zod";
// import { signUp, type SignUpOutput } from "aws-amplify/auth";
import { signUpUser, type formSchema } from "~/components/registerForm";
import { expect, test } from "vitest";
import { Amplify } from "aws-amplify";
import { amplifyConfig } from "~/lib/amplifyConfig";

import "dotenv/config";

// dotenv.config({ path: ".env" });

console.log(amplifyConfig);

test("signing users in cognito successfully", async () => {
  Amplify.configure(amplifyConfig);
  const email = `joe${Date.now()}@gmail.com`; // avoid duplicate user errors
  const formInput: z.infer<typeof formSchema> = {
    name: "joe",
    email: email,
    password: "Asdf123%",
    confirmPassword: "Asdf123%",
  };

  type SignUpUserResult = Awaited<ReturnType<typeof signUpUser>>;
  const afterSignUp: SignUpUserResult = await signUpUser(formInput);

  expect(afterSignUp.nextStep.signUpStep).toBe("CONFIRM_SIGN_UP");

  // const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
  // await client.send(new AdminDeleteUserCommand({
  //   UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
  //   Username: email,
  // }));
});
