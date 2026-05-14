import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useEffect, useRef } from "react";
import { iconsManifest } from "@repo/icons";

type StoryArgs = {
  iconName: string;
  size: number;
  className?: string;
  title: string;
};

type IconElementInstance = HTMLElement & {
  title: string;
};

type RenderedIconProps = {
  tagName: string;
  size: number;
  className?: string;
  title: string;
};

function RenderedIcon({ tagName, size, className, title }: RenderedIconProps) {
  const ref = useRef<IconElementInstance | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.title = title;
    }
  }, [tagName, title]);

  return React.createElement(tagName, {
    ref,
    size,
    className
  });
}

function IconPreview({ iconName, size, className, title }: StoryArgs) {
  const icon = iconsManifest.find((item) => item.elementName === iconName);

  if (!icon) {
    return <div>Icon not found: {iconName}</div>;
  }

  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <RenderedIcon tagName={icon.tagName} size={size} className={className} title={title} />
      <code>{iconName}</code>
    </div>
  );
}

const iconOptions = iconsManifest.map((item) => item.elementName);

const meta: Meta<typeof IconPreview> = {
  title: "Icons/Icon",
  component: IconPreview,
  args: {
    iconName: iconOptions[0],
    size: 64,
    className: "",
    title: "icon"
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
    title: {
      control: "text"
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          "Per-icon template with controls for custom element selection, size, className, and SVG title."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
