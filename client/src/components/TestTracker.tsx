import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpDown, Beaker, Building2, ChevronDown, ChevronUp, ExternalLink, Mail, Users } from "lucide-react";
import { useState } from "react";
import type { Test } from "@/data/dashboardData";

interface TestTrackerProps {
  tests: Test[];
  filter: string;
}

type SortField = "subject" | "brand" | "testType" | "status" | "client" | "lastActivity";

const testTypeColors: Record<string, string> = {
  "A/B Test": "border-l-blue-400",
  "Beta Test": "border-l-purple-400",
  "pLTV Test": "border-l-emerald-400",
  "Upper Funnel Test": "border-l-cyan-400",
  "Lift Study": "border-l-amber-400",
  "Brand Lift": "border-l-amber-400",
  "Conversion Lift": "border-l-orange-400",
  "Test": "border-l-slate-400",
  "Experiment": "border-l-pink-400"
};

/** Extract a readable brand/company name from brand field or email domain */
function getBrandFromTest(test: Test): string {
  if (test.brand && test.brand !== test.testType) {
    return test.brand;
  }
  if (test.clientEmail) {
    const domain = test.clientEmail.split("@")[1];
    if (domain && !domain.includes("meta.com") && !domain.includes("gmail.com")) {
      const name = domain.split(".")[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }
  return "—";
}

export function TestTracker({ tests, filter }: TestTrackerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("lastActivity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const statusOrder: Record<string, number> = { Active: 0, Pending: 1, Completed: 2 };

  const filtered = tests.filter(t => {
    if (filter === "all") return true;
    if (filter === "active") return t.status === "Active";
    if (filter === "completed") return t.status === "Completed";
    if (filter === "ab") return t.testType === "A/B Test";
    if (filter === "beta") return t.testType === "Beta Test";
    if (filter === "pltv") return t.testType === "pLTV Test";
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case "subject":
        cmp = (a.subject ?? "").localeCompare(b.subject ?? "");
        break;
      case "brand":
        cmp = getBrandFromTest(a).localeCompare(getBrandFromTest(b));
        break;
      case "testType":
        cmp = (a.testType ?? "").localeCompare(b.testType ?? "");
        break;
      case "status":
        cmp = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
        break;
      case "client":
        cmp = (a.client ?? "").localeCompare(b.client ?? "");
        break;
      case "lastActivity":
        cmp = new Date(a.lastActivity ?? 0).getTime() - new Date(b.lastActivity ?? 0).getTime();
        break;
    }
    return sortDir === "desc" ? -cmp : cmp;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-0.5 inline h-3 w-3 opacity-30" />;
    }
    return sortDir === "desc" ? (
      <ChevronDown className="ml-0.5 inline h-3 w-3 text-purple-400" />
    ) : (
      <ChevronUp className="ml-0.5 inline h-3 w-3 text-purple-400" />
    );
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_110px_110px_80px_110px_80px] gap-2 border-b border-border/50 px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        <button onClick={() => handleSort("subject")} className="text-left hover:text-foreground transition-colors flex items-center">
          Subject <SortIcon field="subject" />
        </button>
        <button onClick={() => handleSort("brand")} className="text-left hover:text-foreground transition-colors flex items-center">
          Brand <SortIcon field="brand" />
        </button>
        <button onClick={() => handleSort("testType")} className="text-left hover:text-foreground transition-colors flex items-center">
          Type <SortIcon field="testType" />
        </button>
        <button onClick={() => handleSort("status")} className="text-left hover:text-foreground transition-colors flex items-center">
          Status <SortIcon field="status" />
        </button>
        <button onClick={() => handleSort("client")} className="text-left hover:text-foreground transition-colors flex items-center">
          Client <SortIcon field="client" />
        </button>
        <button onClick={() => handleSort("lastActivity")} className="text-left hover:text-foreground transition-colors flex items-center">
          Updated <SortIcon field="lastActivity" />
        </button>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-border/30">
        {sorted.map((test, i) => {
          const brand = getBrandFromTest(test);
          const borderColor = testTypeColors[test.testType ?? ""] || "border-l-slate-400";
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className={cn("border-l-[3px]", borderColor)}
            >
              <button
                onClick={() => setExpandedId(expandedId === test.id ? null : test.id)}
                className={cn(
                  "w-full grid grid-cols-[1fr_110px_110px_80px_110px_80px] gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-accent/30",
                  expandedId === test.id && "bg-accent/20"
                )}
              >
                <div className="truncate">
                  <span className="font-mono text-[11px] text-muted-foreground mr-2">
                    {test.id}
                  </span>
                  <span className="text-foreground">{test.subject}</span>
                </div>
                <div className="truncate">
                  {brand !== "—" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-cyan-300/80">
                      <Building2 className="h-3 w-3 shrink-0 text-cyan-400/60" />
                      <span className="truncate">{brand}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 rounded bg-accent/50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Beaker className="h-3 w-3" />
                    {test.testType}
                  </span>
                </div>
                <div>
                  <StatusBadge status={test.status} size="sm" />
                </div>
                <span className="truncate text-muted-foreground text-xs flex items-center gap-1">
                  {test.client && <Users className="h-3 w-3 shrink-0" />}
                  {test.client ?? "—"}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {test.lastActivity ? new Date(test.lastActivity).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                </span>
              </button>

              {/* Expanded detail */}
              {expandedId === test.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border/20 bg-accent/10 px-4 py-3"
                >
                  <div className="space-y-2 text-xs">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Subject</p>
                        <p className="text-foreground mt-0.5">{test.subject}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Brand / Company</p>
                        <p className="text-cyan-300 mt-0.5 inline-flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-cyan-400/70" />
                          {brand}
                        </p>
                      </div>
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
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">No tests match this filter</p>
        </div>
      )}
    </div>
  );
}
