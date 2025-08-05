"use client";

import Link from "next/link";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { PasswordInput } from "~/components/ui/password-input";
import { AuthError, signUp } from "aws-amplify/auth";
import { useMutation } from "@tanstack/react-query";

import { registerFormSchema } from "~/lib/validation-schemas";

const formSchema = registerFormSchema;

async function signUpUser(values: z.infer<typeof formSchema>) {
  const { nextStep } = await signUp({
    username: values.email,
    password: values.password,
    options: {
      userAttributes: {
        email: values.email,
        preferred_username: values.name,
      },
    },
  });
  return { nextStep, values };
}

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      toast.success(
        "Registration successful! Please check your email for verification.",
      );
      console.log("Next step:", data.nextStep);
      // Handle next step (e.g., redirect to verification page)
    },
    onError: (error) => {
      if (error instanceof AuthError) {
        switch (error.name) {
          case "UsernameExistsException":
            toast.error("An account with this email already exists.");
            break;
          case "InvalidPasswordException":
            toast.error("Password requirements not met", {
              description:
                "Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters.",
            });
            break;
          case "InvalidParameterException":
            toast.error("Invalid email format", {
              description: "Please enter a valid email address.",
            });
            break;
          default:
            toast.error("Registration failed", {
              description: error.message,
            });
        }
      } else {
        toast.error("Failed to register. Please try again.");
      }
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submit event triggered");
    signUpMutation.mutate(values);
  }

  return (
    <div className="flex h-full min-h-[60vh] w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Create a new account by filling out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                console.log("Form submit event triggered"); // Add this
                void form.handleSubmit(onSubmit)(e);
              }}
              className="space-y-8"
            >
              <div className="grid gap-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="name">Full Name</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
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

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirmPassword"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={signUpMutation.isPending}
                  loading={signUpMutation.isPending}
                >
                  Register
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="#" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
