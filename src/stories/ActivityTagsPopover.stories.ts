import type { Meta, StoryObj } from "@storybook/nextjs";
import { ActivityTagsPopover } from "~/components/activityTags/activityTagsPopover";
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

const meta: Meta<typeof ActivityTagsPopover> = {
  title: "Components/ActivityTagsPopover",
  component: ActivityTagsPopover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
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
        ),
      ),
  ],
} satisfies Meta<typeof ActivityTagsPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
