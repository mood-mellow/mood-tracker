import type { Meta, StoryObj } from "@storybook/nextjs";
import { Toaster } from "sonner";
import Register from "~/components/registerForm";
import React from "react";

const meta: Meta<typeof Register> = {
  title: "Components/RegisterPreview",
  component: Register,
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
} satisfies Meta<typeof Register>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
