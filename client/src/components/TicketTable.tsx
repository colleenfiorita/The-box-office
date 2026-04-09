import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import type { Ticket } from "@/data/dashboardData";

interface TicketTableProps {
  tickets: Ticket[];
  filter: string;
}

export function TicketTable({ tickets, filter }: TicketTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"lastActivity" | "priority" | "status">("lastActivity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  const statusOrder = { Open: 0, Pending: 1, Escalated: 2, Resolved: 3 };

  const filtered = tickets.filter(t => {
    if (filter === "all") return true;
    if (filter === "open") return t.status === "Open";
    if (filter === "pending") return t.status === "Pending";
    if (filter === "resolved") return t.status === "Resolved";
    if (filter === "critical") return t.priority === "Critical" && t.status !== "Resolved";
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === "lastActivity") {
      cmp = new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
    } else if (sortField === "priority") {
      cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortField === "status") {
      cmp = statusOrder[a.status] - statusOrder[b.status];
    }
    return sortDir === "desc" ? -cmp : cmp;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null;
    return sortDir === "desc" ? (
      <ChevronDown className="ml-0.5 inline h-3 w-3" />
    ) : (
      <ChevronUp className="ml-0.5 inline h-3 w-3" />
    );
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_140px_100px_90px_80px_90px] gap-2 border-b border-border/50 px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        <span>Issue</span>
        <span>Client</span>
        <button onClick={() => handleSort("status")} className="text-left hover:text-foreground transition-colors">
          Status <SortIcon field="status" />
        </button>
        <button onClick={() => handleSort("priority")} className="text-left hover:text-foreground transition-colors">
          Priority <SortIcon field="priority" />
        </button>
        <span className="text-center">Msgs</span>
        <button onClick={() => handleSort("lastActivity")} className="text-left hover:text-foreground transition-colors">
          Updated <SortIcon field="lastActivity" />
        </button>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-border/30">
        {sorted.map((ticket, i) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <button
              onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
              className={cn(
                "w-full grid grid-cols-[1fr_140px_100px_90px_80px_90px] gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-accent/30",
                expandedId === ticket.id && "bg-accent/20"
              )}
            >
              <div className="truncate">
                <span className="font-mono text-[11px] text-muted-foreground mr-2">
                  {ticket.type === "Case" ? "C" : "T"}-{ticket.id.slice(-6)}
                </span>
                <span className="text-foreground">{ticket.issue}</span>
              </div>
              <span className="truncate text-muted-foreground text-xs">
                {ticket.client}
              </span>
              <div>
                <StatusBadge status={ticket.status} size="sm" />
              </div>
              <div>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  {ticket.messageCount}
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {new Date(ticket.lastActivity).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </button>

            {/* Expanded detail */}
            {expandedId === ticket.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border/20 bg-accent/10 px-4 py-3"
              >
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Full Subject</p>
                    <p className="text-foreground">{ticket.subject}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Client Details</p>
                    <p className="text-foreground">{ticket.client}</p>
                    {ticket.clientEmail && (
                      <a
                        href={`mailto:${ticket.clientEmail}`}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-0.5 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Mail className="h-3 w-3" />
                        {ticket.clientEmail}
                      </a>
                    )}
                    <p className="text-muted-foreground mt-0.5">{ticket.clientCompany}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Latest Update</p>
                    <p className="text-muted-foreground leading-relaxed">{ticket.snippet}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Case ID</p>
                    <p className="font-mono text-foreground">{ticket.id}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Opened</p>
                    <p className="font-mono text-foreground">{ticket.firstDate}</p>
                  </div>
                  {/* Open in Gmail link */}
                  <div className="col-span-2 pt-2 border-t border-border/20">
                    <a
                      href={ticket.gmailLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-[11px] font-medium text-blue-300 hover:bg-blue-500/20 hover:text-blue-200 transition-all"
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
      </div>

      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">No tickets match this filter</p>
        </div>
      )}
    </div>
  );
}
