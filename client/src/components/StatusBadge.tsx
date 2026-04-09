import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { color: string; bg: string; glow: string; dot: string }> = {
  Open: {
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    glow: "shadow-[0_0_8px_oklch(0.65_0.2_260/0.3)]",
    dot: "bg-blue-400"
  },
  Pending: {
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    glow: "shadow-[0_0_8px_oklch(0.78_0.18_75/0.3)]",
    dot: "bg-amber-400"
  },
  Resolved: {
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_8px_oklch(0.72_0.2_155/0.3)]",
    dot: "bg-emerald-400"
  },
  Escalated: {
    color: "text-red-300",
    bg: "bg-red-500/10",
    glow: "shadow-[0_0_8px_oklch(0.65_0.22_25/0.3)]",
    dot: "bg-red-400"
  },
  Active: {
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    glow: "shadow-[0_0_8px_oklch(0.65_0.2_260/0.3)]",
    dot: "bg-blue-400"
  },
  Completed: {
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    glow: "shadow-[0_0_8px_oklch(0.72_0.2_155/0.3)]",
    dot: "bg-emerald-400"
  },
  "Pending Setup": {
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    glow: "shadow-[0_0_8px_oklch(0.78_0.18_75/0.3)]",
    dot: "bg-amber-400"
  },
  "In Review": {
    color: "text-purple-300",
    bg: "bg-purple-500/10",
    glow: "shadow-[0_0_8px_oklch(0.7_0.15_300/0.3)]",
    dot: "bg-purple-400"
  },
  "In Progress": {
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    glow: "shadow-[0_0_8px_oklch(0.65_0.2_260/0.3)]",
    dot: "bg-blue-400"
  },
  "No Progress": {
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    glow: "shadow-[0_0_8px_oklch(0.78_0.18_75/0.3)]",
    dot: "bg-amber-400"
  }
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig["Open"];
  const isActive = status === "Open" || status === "Active" || status === "In Progress";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-mono uppercase tracking-wider",
        config.color,
        config.bg,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      )}
    >
      <span
        className={cn(
          "rounded-full",
          config.dot,
          isActive && "animate-pulse-glow",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
        )}
      />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, string> = {
    Critical: "text-red-400 bg-red-500/10",
    High: "text-amber-400 bg-amber-500/10",
    Medium: "text-blue-300 bg-blue-500/10",
    Low: "text-slate-400 bg-slate-500/10"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        config[priority] || config["Medium"]
      )}
    >
      {priority}
    </span>
  );
}
