// Name: Modal.tsx
// Description: For popups (e.g. "Edit Entry", “AI Suggestions”, confirmation dialogs)
// Author: Giovanni Felix
// Date: 8-4-25

import * as React from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  className,
}) => {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

/*
Instructions to use:
const [open, setOpen] = useState(false);

<Modal open={open} onClose={() => setOpen(false)}>
  <h2 className="text-xl font-bold mb-4">Title</h2>
  <p>Some content here.</p>
</Modal>
*/
