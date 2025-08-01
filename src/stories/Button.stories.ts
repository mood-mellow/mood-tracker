import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button, buttonVariantConfig } from "~/components/ui/button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: Object.keys(buttonVariantConfig.variant),
    },
    size: {
      control: { type: "select" },
      options: Object.keys(buttonVariantConfig.size),
    },
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    children: "Click Me",
    variant: "default",
    size: "default",
    loading: false,
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Click me",
  },
};

export const Small: Story = {
  args: {
    children: "Small button",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large button",
    size: "lg",
  },
};

export const LoadingState: Story = {
  args: {
    loading: true,
    children: "Loading...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};
