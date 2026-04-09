import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Beaker, ChevronRight, ExternalLink, Mail, Users } from "lucide-react";
import { useState } from "react";
import type { Test } from "@/data/dashboardData";

interface TestTrackerProps {
  tests: Test[];
  filter: string;
}

const testTypeColors: Record<string, string> = {
  "A/B Test": "border-l-blue-400",
  "Beta Test": "border-l-purple-400",
  "pLTV Test": "border-l-emerald-400",
  "Upper Funnel Test": "border-l-cyan-400",
  "Lift Study": "border-l-amber-400",
  "Test": "border-l-slate-400",
  "Experiment": "border-l-pink-400"
};

export function TestTracker({ tests, filter }: TestTrackerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = tests.filter(t => {
    if (filter === "all") return true;
    if (filter === "active") return t.status === "Active";
    if (filter === "completed") return t.status === "Completed";
    if (filter === "ab") return t.testType === "A/B Test";
    if (filter === "beta") return t.testType === "Beta Test";
    if (filter === "pltv") return t.testType === "pLTV Test";
    return true;
  });

  return (
    <div className="space-y-2">
      {filtered.map((test, i) => (
        <motion.div
          key={test.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          className={cn(
            "group overflow-hidden rounded-lg border border-border/40 bg-card/40 backdrop-blur-sm transition-all hover:bg-card/60 hover:border-border/60",
            "border-l-[3px]",
            testTypeColors[test.testType] || "border-l-slate-400"
          )}
        >
          <button
            onClick={() => setExpandedId(expandedId === test.id ? null : test.id)}
            className="w-full px-4 py-3 text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 rounded bg-accent/50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Beaker className="h-3 w-3" />
                    {test.testType}
                  </span>
                  <StatusBadge status={test.status} size="sm" />
                </div>
                <p className="text-sm font-medium text-foreground truncate">
                  {test.brand || test.subject}
                </p>
                {test.client && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {test.client}
                  </p>
                )}
              </div>
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  expandedId === test.id && "rotate-90"
                )}
              />
            </div>
          </button>

          {expandedId === test.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border/20 bg-accent/10 px-4 py-3"
            >
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Subject</p>
                  <p className="text-foreground mt-0.5">{test.subject}</p>
                </div>
                {test.clientEmail && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Contact</p>
                    <a
                      href={`mailto:${test.clientEmail}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Mail className="h-3 w-3" />
                      {test.clientEmail}
                    </a>
                  </div>
                )}
                <div className="flex gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Started</p>
                    <p className="font-mono text-foreground mt-0.5">{test.firstDate}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Messages</p>
                    <p className="font-mono text-foreground mt-0.5">{test.messageCount}</p>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Summary</p>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">{test.snippet}</p>
                </div>
                {/* Open in Gmail link */}
                <div className="pt-2 border-t border-border/20">
                  <a
                    href={test.gmailLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 rounded-md bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-[11px] font-medium text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 transition-all"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open in Gmail
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <p className="text-sm">No tests match this filter</p>
        </div>
      )}
    </div>
  );
}
