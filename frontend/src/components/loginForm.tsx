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
import { signIn } from "aws-amplify/auth";
import { loginFormSchema } from "~/lib/validation-schemas";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";

const formSchema = loginFormSchema;

async function loginUser(values: z.infer<typeof formSchema>) {
  const { isSignedIn, nextStep } = await signIn({
    username: values.email,
    password: values.password,
  });
  return { nextStep, values, isSignedIn };
}

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.isSignedIn) {
        toast.success("Login successful!");
        console.log("Next step:", data.nextStep);
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      toast.error("Failed to login.", {
        description: error.message,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("login form submit event triggered");
    loginMutation.mutate(values);
  }

  return (
    <div className="flex justify-center px-4 py-8">
      <Card className="flex h-full w-full max-w-4xl flex-col gap-6 overflow-hidden p-4 md:flex-row md:p-8">
        <div className="flex justify-center md:justify-start">
          <Image
            width={450}
            height={321}
            src={"/login_asset.svg"}
            alt="Register account images"
            className="hidden w-full max-w-sm object-contain md:block"
          />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-4 md:mt-24">
          <CardHeader className="px-0">
            <CardTitle className="text-center text-2xl md:text-left">
              Login
            </CardTitle>
            <CardDescription className="text-center md:text-left">
              Welcome back! Enter your details to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Form {...form}>
              <form
                id="login"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Link
                            href="#"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="current-password"
                            {...field}
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
          <div className="mt-4 flex w-full items-center justify-end gap-2 text-center text-sm md:mt-auto">
            <div className="mr-6">
              <span>Don&apos;t have an account? </span>
              <Link href="#" className="text-sky-500">
                Sign up
              </Link>
            </div>
            <Button
              form="login"
              type="submit"
              disabled={loginMutation.isPending}
              loading={loginMutation.isPending}
            >
              Login
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
