"use client";

import { useState } from "react";
import { ColorPicker } from "~/components/ui/color-picker";
import { Button } from "~/components/ui/button";

export const ColorPickerDemo = () => {
  const [color, setColor] = useState("#0f0f0f");

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center space-y-4"
      style={{
        backgroundColor: color,
      }}
    >
      <h1 className="text-xl font-semibold text-white">shadcn-color-picker</h1>
      <div className="flex flex-col items-center gap-4 rounded-sm bg-white px-12 py-6">
        <h2>Color picker</h2>
        <ColorPicker
          onChange={(v) => {
            setColor(v);
          }}
          value={color}
        />

        <h2>Disabled</h2>
        <ColorPicker
          disabled
          onChange={(v) => {
            setColor(v);
          }}
          value={color}
        />

        <a
          href="https://github.com/nightspite/shadcn-color-picker/blob/master/src/components/ui/color-picker.tsx"
          className="block"
        >
          <Button>View code</Button>
        </a>
      </div>
    </div>
  );
};
