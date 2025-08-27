import type { Meta, StoryObj } from "@storybook/nextjs";
import { ActivityTagsPopover } from "~/components/activityTagsPopover";

const meta: Meta<typeof ActivityTagsPopover> = {
  title: "Components/ActivityTagsPopover",
  component: ActivityTagsPopover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ActivityTagsPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
