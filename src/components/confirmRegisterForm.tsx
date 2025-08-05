"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { emailSchema } from "~/lib/validation-schemas";
import { Input } from "~/components/ui/input";
import { AuthError, confirmSignUp } from "aws-amplify/auth";
import { useMutation } from "@tanstack/react-query";

const confirmRegisterFormSchema = z.object({
  email: emailSchema,
  code: z.string().min(6, {
    message: "Your confirmation code must be 6 characters.",
  }),
});

async function confirmRegistration(
  values: z.infer<typeof confirmRegisterFormSchema>,
) {
  const { nextStep } = await confirmSignUp({
    username: values.email,
    confirmationCode: values.code,
  });
  return { nextStep, values };
}

export function ConfirmRegisterForm() {
  const form = useForm<z.infer<typeof confirmRegisterFormSchema>>({
    resolver: zodResolver(confirmRegisterFormSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  function onSubmit(values: z.infer<typeof confirmRegisterFormSchema>) {
    console.log("Confirm Registration Form submit event triggered");
    confirmRegisterMutation.mutate(values);
  }

  const confirmRegisterMutation = useMutation({
    mutationFn: confirmRegistration,
    onSuccess: (data) => {
      toast.success("Account Verrified!");
      console.log("Next step:", data.nextStep);
      // Handle next step (e.g., redirect to verification page)
    },
    onError: (error) => {
      if (error instanceof AuthError) {
        switch (error.name) {
          case "InvalidParameterException":
            toast.error("Invalid email format", {
              description: "Please enter a valid email address.",
            });
            break;
          default:
            toast.error("Confirmation failed", {
              description: error.message,
            });
        }
      } else {
        toast.error("Failed to confirm account. Please try again.");
      }
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="johndoe@mail.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Submit your Confirmation Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the confirmation code sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={confirmRegisterMutation.isPending}
            loading={confirmRegisterMutation.isPending}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
