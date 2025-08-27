import type { Meta, StoryObj } from "@storybook/nextjs";
import { Toaster } from "sonner";
import LoginForm from "~/components/loginForm";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries in Storybook
      staleTime: 0,
    },
  },
});

const meta: Meta<typeof LoginForm> = {
  title: "Components/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/login",
        query: {},
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          "div",
          { style: { minHeight: "100vh", padding: "2rem" } },
          React.createElement(Story),
          React.createElement(Toaster, {
            position: "top-right",
            richColors: true,
          }),
        ),
      ),
  ],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
