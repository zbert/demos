import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useMemo, useState } from "react";
import { iconsManifest } from "@repo/icons";

function AllIconsGallery() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return iconsManifest;
    return iconsManifest.filter((item) => {
      return (
        item.name.toLowerCase().includes(normalized) ||
        item.className.toLowerCase().includes(normalized) ||
        item.tagName.toLowerCase().includes(normalized)
      );
    });
  }, [query]);

  return (
    <div style={{ width: "min(1100px, 95vw)", padding: 24 }}>
      <label style={{ display: "block", marginBottom: 12, fontWeight: 600 }}>Search icons</label>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter by file, class, or tag name"
        style={{
          width: "100%",
          marginBottom: 20,
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #c7c7c7"
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 14
        }}
      >
        {filtered.map((item) => {
          return (
            <div
              key={item.tagName}
              style={{
                border: "1px solid #ececec",
                borderRadius: 8,
                padding: 14,
                background: "#fff"
              }}
            >
              <div
                style={{
                  height: 64,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                  background: "linear-gradient(180deg, #f9f9f9 0%, #f4f4f4 100%)",
                  borderRadius: 8
                }}
              >
                {React.createElement(item.tagName, {
                  "aria-hidden": "true",
                  height: 36,
                  width: 36
                })}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{item.className}</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{item.name}.svg</div>
              <code style={{ display: "block", fontSize: 11, marginTop: 4 }}>{item.tagName}</code>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const meta: Meta<typeof AllIconsGallery> = {
  title: "Icons/All Icons",
  component: AllIconsGallery,
  parameters: {
    docs: {
      description: {
        component:
          "Icon gallery powered by `iconsManifest` from `@repo/icons`. Add files to `packages/icons/src/raw` and rerun `pnpm generate:icons`."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
