import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: "blue" | "green" | "amber" | "red" | "purple";
  subtitle?: string;
  delay?: number;
}

const colorMap = {
  blue: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    valueColor: "text-amber-300",
    border: "border-amber-500/20",
    glow: "shadow-[0_0_30px_oklch(0.80_0.16_85/0.08)]"
  },
  green: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    valueColor: "text-emerald-300",
    border: "border-emerald-500/20",
    glow: "shadow-[0_0_30px_oklch(0.72_0.18_155/0.08)]"
  },
  amber: {
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-400",
    valueColor: "text-yellow-300",
    border: "border-yellow-500/20",
    glow: "shadow-[0_0_30px_oklch(0.78_0.16_75/0.08)]"
  },
  red: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    valueColor: "text-red-300",
    border: "border-red-500/20",
    glow: "shadow-[0_0_30px_oklch(0.55_0.22_25/0.08)]"
  },
  purple: {
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    valueColor: "text-rose-300",
    border: "border-rose-500/20",
    glow: "shadow-[0_0_30px_oklch(0.60_0.15_350/0.08)]"
  }
};

export function MetricCard({ label, value, icon: Icon, color, subtitle, delay = 0 }: MetricCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card p-4",
        c.border,
        c.glow
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className={cn("mt-1 font-mono text-3xl font-bold tabular-nums", c.valueColor)}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("rounded-lg p-2", c.iconBg)}>
          <Icon className={cn("h-5 w-5", c.iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}
