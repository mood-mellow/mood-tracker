// Name: Card.tsx
// Description: For wrapping mood entries, summaries, insights, etc.
// Author: Giovanni Felix
// Date: 8-4-25

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900",
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export { Card };
