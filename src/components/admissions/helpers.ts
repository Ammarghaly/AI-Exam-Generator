export const AVATAR_COLORS = [
  { bg: "bg-[var(--color-primary-container)]",   text: "text-[var(--color-on-primary-container)]"   },
  { bg: "bg-[var(--color-secondary-container)]", text: "text-[var(--color-on-secondary-container)]" },
  { bg: "bg-[var(--color-tertiary-container)]",  text: "text-[var(--color-on-tertiary-container)]"  },
  { bg: "bg-[var(--color-muted)]",               text: "text-[var(--color-muted-foreground)]"        },
];

export function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs  = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (hrs < 1)   return "Just now";
  if (hrs < 24)  return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}
