import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { iconsManifest } from "@repo/icons";

type StoryArgs = {
  tagName: string;
  size: number;
  className?: string;
  ariaLabel: string;
};

function IconPreview({ tagName, size, className, ariaLabel }: StoryArgs) {
  const icon = iconsManifest.find((item) => item.tagName === tagName);

  if (!icon) {
    return <div>Icon not found: {tagName}</div>;
  }

  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      {React.createElement(icon.tagName, {
        "aria-label": ariaLabel,
        className,
        height: size,
        role: "img",
        width: size
      })}
      <code>{icon.tagName}</code>
    </div>
  );
}

const iconOptions = iconsManifest.map((item) => item.tagName);

const meta: Meta<typeof IconPreview> = {
  title: "Icons/Icon",
  component: IconPreview,
  args: {
    tagName: iconOptions[0],
    size: 64,
    className: "",
    ariaLabel: "icon"
  },
  argTypes: {
    tagName: {
      control: { type: "select" },
      options: iconOptions
    },
    size: {
      control: { type: "range", min: 12, max: 240, step: 2 }
    },
    className: {
      control: "text"
    },
    ariaLabel: {
      control: "text"
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          "Per-icon template with controls for custom element selection, size, className, and aria-label."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
