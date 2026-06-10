import { useState, useEffect } from "react";

interface FloatingDropdownProps {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  children: React.ReactNode;
  width?: number;
}

export function FloatingDropdown({ triggerRef, open, children, width = 192 }: FloatingDropdownProps) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropHeight = 160;
    const top = spaceBelow < dropHeight + 8 ? rect.top - dropHeight - 4 : rect.bottom + 4;
    setPos({ top, left: rect.right - width });
  }, [open, triggerRef, width]);

  if (!open) return null;

  return (
    <div
      className="fixed z-[9999] bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden text-sm"
      style={{ top: pos.top, left: pos.left, width }}
    >
      {children}
    </div>
  );
}
