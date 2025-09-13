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
import Image from "next/image";

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
    <div className="flex justify-center px-4 py-8">
      <Card className="flex h-full w-full max-w-4xl flex-col gap-6 overflow-hidden p-4 md:flex-row md:p-8">
        {/* hide image on smaller screens */}
        <div className="flex justify-center md:justify-start">
          <Image
            width={450}
            height={321}
            src={"/register_asset.svg"}
            alt="Register account images"
            className="hidden w-full max-w-sm object-contain md:block"
          />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-2 md:mt-8">
          <CardHeader className="px-0">
            <CardTitle className="text-center text-2xl md:text-left">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center md:text-left">
              Welcome to Mellow, where you can access AI-powered insights and
              challenge friends to stay on top of healthy habits.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  console.log("Form submit event triggered");
                  void form.handleSubmit(onSubmit)(e);
                }}
                className="space-y-6"
              >
                <div className="grid gap-4">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Username</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="John"
                            {...field}
                            className="w-full"
                          />
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
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="example@mellow.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                            className="w-full"
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
                      <FormItem>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="new-password"
                            {...field}
                            className="w-full"
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
                      <FormItem>
                        <FormLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="confirmPassword"
                            placeholder="******"
                            autoComplete="new-password"
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
          <div className="mt-4 flex items-center justify-end gap-2 text-center text-sm md:mt-auto">
            <span>Already have an account? </span>
            <Link href="#" className="underline">
              Login
            </Link>
            <Button
              type="submit"
              disabled={signUpMutation.isPending}
              loading={signUpMutation.isPending}
            >
              Sign up
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
