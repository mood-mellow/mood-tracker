import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { amplifyConfig } from "~/lib/amplifyConfig";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});
