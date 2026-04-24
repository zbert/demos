import type { Meta, StoryObj } from "@storybook/react-vite";
import type React from "react";
import * as Icons from "@repo/icons";
import { iconsManifest } from "@repo/icons";

type StoryArgs = {
  iconName: string;
  size: number;
  className?: string;
  ariaLabel: string;
};

function IconPreview({ iconName, size, className, ariaLabel }: StoryArgs) {
  const iconRecord = Icons as unknown as Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  >;
  const Icon = iconRecord[iconName];

  if (!Icon) {
    return <div>Icon not found: {iconName}</div>;
  }

  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <Icon width={size} height={size} className={className} aria-label={ariaLabel} role="img" />
      <code>{iconName}</code>
    </div>
  );
}

const iconOptions = iconsManifest.map((item) => item.componentName);

const meta: Meta<typeof IconPreview> = {
  title: "Icons/Icon",
  component: IconPreview,
  args: {
    iconName: iconOptions[0],
    size: 64,
    className: "",
    ariaLabel: "icon"
  },
  argTypes: {
    iconName: {
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
          "Per-icon template with controls for icon selection, size, className, and aria-label."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
