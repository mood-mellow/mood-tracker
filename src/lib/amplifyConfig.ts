import type { ResourcesConfig } from "aws-amplify";

const cognitoIds = {
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
  userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID!,
  identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID!,
};

const cognitoBehavior = {
  loginWith: {
    email: true,
  },
  passwordFormat: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialCharacters: true,
  },
};

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      ...cognitoIds,
      ...cognitoBehavior,
    },
  },
};
