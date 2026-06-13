import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={4} className="px-6 py-16 text-center">
        <div
          className="flex flex-col items-center gap-3"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          <div style={{ opacity: 0.4 }}>{icon}</div>
          <p style={{ fontSize: "var(--text-body)" }}>{message}</p>
        </div>
      </td>
    </tr>
  );
}
