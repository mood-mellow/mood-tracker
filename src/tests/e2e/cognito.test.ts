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
  const formInput: z.infer<typeof formSchema> = {
    name: "joe",
    email: "joe@gmail.com",
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

// [UserLambdaValidationException] Errors were encountered during sign-up confirmation for user "71fb2580-d0f1-70f5-a6db-b853939ce9cd". Please review the errors and retry.
// requestId: 55cc3659-cc09-4877-8b32-2697902150ab
// time: Tue Mar 24 2026 18:15:41 GMT-0400 (Eastern Daylight Time)
// code: UserLambdaValidationException
// message: PostConfirmation failed with error SyntaxError: Cannot use import statement outside a module.
