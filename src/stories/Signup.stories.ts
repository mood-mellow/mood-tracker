import type { Meta, StoryObj } from "@storybook/nextjs";
import { Toaster } from "sonner";
import RegisterPreview from "~/components/signup";
import React from "react";

const meta: Meta<typeof RegisterPreview> = {
  title: "Components/RegisterPreview",
  component: RegisterPreview,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story: React.ComponentType) =>
      React.createElement(
        "div",
        { style: { minHeight: "100vh", padding: "2rem" } },
        React.createElement(Story),
        React.createElement(Toaster, {
          position: "top-right",
          richColors: true,
        }),
      ),
  ],
} satisfies Meta<typeof RegisterPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithToaster: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Register form with toast notifications for form submission feedback.",
      },
    },
  },
};
