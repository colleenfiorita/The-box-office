/*
 * The Box Office — Ticket & Test Tracker Dashboard
 * Design: Dark aerospace command center aesthetic
 * Typography: Outfit (headings) + JetBrains Mono (data)
 * Now powered by live API data from the database
 */

import { MetricCard } from "@/components/MetricCard";
import { TicketTable } from "@/components/TicketTable";
import { TestTracker } from "@/components/TestTracker";
import { TaskList } from "@/components/TaskList";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Beaker,
  CheckCircle2,
  ClipboardList,
  Clock,
  Inbox,
  Loader2,
  Radio,
  RefreshCw,
  Search,
  Ticket as TicketIcon,
} from "lucide-react";
import { useState, useMemo } from "react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663323892800/YAkPu6UgiYsd9GDQL38Xuz/hero-bg-AromJnbsnWj7U7CATfvCyu.webp";

// Map DB records to the shape our components expect
type TicketRow = {
  id: string;
  type: string;
  subject: string | null;
  issue: string | null;
  status: string;
  client: string | null;
  clientEmail: string | null;
  clientCompany: string | null;
  firstDate: string | null;
  lastActivity: string | null;
  messageCount: number | null;
  priority: string | null;
  snippet: string | null;
  gmailLink: string | null;
};

type TestRow = {
  id: string;
  subject: string | null;
  testType: string | null;
  status: string;
  brand: string | null;
  client: string | null;
  clientEmail: string | null;
  firstDate: string | null;
  lastActivity: string | null;
  messageCount: number | null;
  snippet: string | null;
  gmailLink: string | null;
};

type TaskRow = {
  id: number;
  taskNumber: string;
  title: string | null;
  owner: string | null;
  ownerEmail: string | null;
  progress: string | null;
  priority: string | null;
  creationDate: string | null;
  tags: string[];
  taskLink: string | null;
};

export default function Home() {
  // Fetch data from API with auto-refresh every 5 minutes
  const { data: ticketsRaw, isLoading: ticketsLoading } = trpc.dashboard.tickets.useQuery(undefined, {
    refetchInterval: 5 * 60 * 1000,
  });
  const { data: testsRaw, isLoading: testsLoading } = trpc.dashboard.tests.useQuery(undefined, {
    refetchInterval: 5 * 60 * 1000,
  });
  const { data: tasksRaw, isLoading: tasksLoading } = trpc.dashboard.tasks.useQuery(undefined, {
    refetchInterval: 5 * 60 * 1000,
  });
  const { data: lastSync } = trpc.dashboard.lastSync.useQuery(undefined, {
    refetchInterval: 5 * 60 * 1000,
  });

  const isLoading = ticketsLoading || testsLoading || tasksLoading;

  // Map DB rows to component-compatible shapes
  const tickets: TicketRow[] = useMemo(() => {
    if (!ticketsRaw) return [];
    return ticketsRaw.map(t => ({
      id: t.externalId,
      type: t.type,
      subject: t.subject,
      issue: t.issue,
      status: t.status,
      client: t.client,
      clientEmail: t.clientEmail,
      clientCompany: t.clientCompany,
      firstDate: t.firstDate,
      lastActivity: t.lastActivity,
      messageCount: t.messageCount,
      priority: t.priority,
      snippet: t.snippet,
      gmailLink: t.gmailLink,
    }));
  }, [ticketsRaw]);

  const tests: TestRow[] = useMemo(() => {
    if (!testsRaw) return [];
    return testsRaw.map(t => ({
      id: t.externalId,
      subject: t.subject,
      testType: t.testType,
      status: t.status,
      brand: t.brand,
      client: t.client,
      clientEmail: t.clientEmail,
      firstDate: t.firstDate,
      lastActivity: t.lastActivity,
      messageCount: t.messageCount,
      snippet: t.snippet,
      gmailLink: t.gmailLink,
    }));
  }, [testsRaw]);

  const tasks: TaskRow[] = useMemo(() => {
    if (!tasksRaw) return [];
    return tasksRaw.map(t => ({
      id: t.id,
      taskNumber: t.taskNumber,
      title: t.title,
      owner: t.owner,
      ownerEmail: t.ownerEmail,
      progress: t.progress,
      priority: t.priority,
      creationDate: t.creationDate,
      tags: Array.isArray(t.tags) ? t.tags : [],
      taskLink: t.taskLink,
    }));
  }, [tasksRaw]);

  // Compute stats from live data
  const stats = useMemo(() => {
    const openTickets = tickets.filter(t => t.status === "Open").length;
    const pendingTickets = tickets.filter(t => t.status === "Pending").length;
    const resolvedTickets = tickets.filter(t => t.status === "Resolved").length;
    const criticalTickets = tickets.filter(t => t.priority === "Critical" && t.status !== "Resolved").length;
    const activeTests = tests.filter(t => t.status === "Active").length;
    const completedTests = tests.filter(t => t.status === "Completed").length;
    const openTasks = tasks.filter(t => t.progress !== "Closed").length;

    return {
      tickets: { total: tickets.length, open: openTickets, pending: pendingTickets, resolved: resolvedTickets, critical: criticalTickets },
      tests: { total: tests.length, active: activeTests, completed: completedTests },
      tasks: { total: tasks.length, open: openTasks },
    };
  }, [tickets, tests, tasks]);

  const [ticketFilter, setTicketFilter] = useState("all");
  const [testFilter, setTestFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tickets" | "tests">("tickets");

  // Filter by search
  const filteredTickets = useMemo(() => {
    if (!searchQuery) return tickets;
    const q = searchQuery.toLowerCase();
    return tickets.filter(
      t =>
        (t.issue ?? "").toLowerCase().includes(q) ||
        (t.client ?? "").toLowerCase().includes(q) ||
        (t.clientCompany ?? "").toLowerCase().includes(q) ||
        t.id.includes(q)
    );
  }, [searchQuery, tickets]);

  const filteredTests = useMemo(() => {
    if (!searchQuery) return tests;
    const q = searchQuery.toLowerCase();
    return tests.filter(
      t =>
        (t.subject ?? "").toLowerCase().includes(q) ||
        (t.brand ?? "").toLowerCase().includes(q) ||
        (t.client ?? "").toLowerCase().includes(q) ||
        (t.testType ?? "").toLowerCase().includes(q)
    );
  }, [searchQuery, tests]);

  const ticketFilterOptions = [
    { key: "all", label: "All", count: tickets.length },
    { key: "open", label: "Open", count: stats.tickets.open },
    { key: "pending", label: "Pending", count: stats.tickets.pending },
    { key: "resolved", label: "Resolved", count: stats.tickets.resolved },
    { key: "critical", label: "Critical", count: stats.tickets.critical },
  ];

  const testFilterOptions = [
    { key: "all", label: "All", count: tests.length },
    { key: "active", label: "Active", count: stats.tests.active },
    { key: "completed", label: "Completed", count: stats.tests.completed },
    { key: "beta", label: "Beta", count: tests.filter(t => (t.testType ?? "").includes("Beta")).length },
    { key: "pltv", label: "pLTV", count: tests.filter(t => (t.testType ?? "").includes("pLTV")).length },
    { key: "ab", label: "A/B", count: tests.filter(t => (t.testType ?? "").includes("A/B")).length },
  ];

  // Sync date display
  const syncDate = lastSync?.syncedAt
    ? new Date(lastSync.syncedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-sm text-muted-foreground font-mono">Loading The Box Office...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="relative border-b border-border/50 overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        <div className="relative container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 border border-blue-500/20">
                <Radio className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground font-sans">
                  The Box Office
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                  colleenfiorita@meta.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tickets, tests, clients..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-9 w-64 rounded-lg border border-border/50 bg-card/50 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 backdrop-blur-sm"
                />
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-xs text-muted-foreground backdrop-blur-sm">
                <RefreshCw className="h-3 w-3" />
                <span className="font-mono">
                  Synced {syncDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metric Cards */}
      <section className="container py-5">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total Tickets" value={stats.tickets.total} icon={TicketIcon} color="blue" delay={0} />
          <MetricCard label="Open" value={stats.tickets.open} icon={Inbox} color="blue" subtitle="Needs attention" delay={0.05} />
          <MetricCard label="Pending" value={stats.tickets.pending} icon={Clock} color="amber" subtitle="Awaiting response" delay={0.1} />
          <MetricCard label="Critical" value={stats.tickets.critical} icon={AlertTriangle} color="red" subtitle="Urgent" delay={0.15} />
          <MetricCard label="Active Tests" value={stats.tests.active} icon={Beaker} color="purple" delay={0.2} />
          <MetricCard label="Resolved" value={stats.tickets.resolved} icon={CheckCircle2} color="green" delay={0.25} />
        </div>
      </section>

      {/* Main Content */}
      <section className="container pb-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left: Main panel */}
          <div>
            {/* Tab switcher */}
            <div className="mb-4 flex items-center gap-1 rounded-lg border border-border/40 bg-card/30 p-1 backdrop-blur-sm w-fit">
              <button
                onClick={() => setActiveTab("tickets")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  activeTab === "tickets"
                    ? "bg-blue-500/15 text-blue-300 shadow-[0_0_12px_oklch(0.65_0.2_260/0.15)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <TicketIcon className="h-3.5 w-3.5" />
                Support Tickets
                <span className="ml-1 rounded bg-blue-500/10 px-1.5 py-0.5 font-mono text-[10px]">
                  {stats.tickets.total}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  activeTab === "tests"
                    ? "bg-purple-500/15 text-purple-300 shadow-[0_0_12px_oklch(0.7_0.15_300/0.15)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Beaker className="h-3.5 w-3.5" />
                Tests & Experiments
                <span className="ml-1 rounded bg-purple-500/10 px-1.5 py-0.5 font-mono text-[10px]">
                  {stats.tests.total}
                </span>
              </button>
            </div>

            {/* Filter pills */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {(activeTab === "tickets" ? ticketFilterOptions : testFilterOptions).map(opt => (
                <button
                  key={opt.key}
                  onClick={() =>
                    activeTab === "tickets"
                      ? setTicketFilter(opt.key)
                      : setTestFilter(opt.key)
                  }
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium transition-all",
                    (activeTab === "tickets" ? ticketFilter : testFilter) === opt.key
                      ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                      : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50"
                  )}
                >
                  {opt.label}
                  <span className="font-mono text-[10px] opacity-60">{opt.count}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "tickets" ? (
                <TicketTable tickets={filteredTickets as any} filter={ticketFilter} />
              ) : (
                <TestTracker tests={filteredTests as any} filter={testFilter} />
              )}
            </motion.div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-5">
            {/* Open Tasks */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-foreground">Open Tasks</h2>
                <span className="rounded bg-blue-500/10 px-1.5 py-0.5 font-mono text-[10px] text-blue-300">
                  {stats.tasks.open}
                </span>
              </div>
              <TaskList tasks={tasks as any} />
            </div>

            {/* Quick Stats */}
            <div className="rounded-lg border border-border/40 bg-card/40 backdrop-blur-sm p-4">
              <h3 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Ticket Breakdown by Company
              </h3>
              <div className="space-y-2">
                {getCompanyBreakdown(tickets).map(({ company, count, percentage }) => (
                  <div key={company}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-foreground">{company}</span>
                      <span className="font-mono text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-accent/50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="h-full rounded-full bg-blue-500/60"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="rounded-lg border border-border/40 bg-card/40 backdrop-blur-sm p-4">
              <h3 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {getRecentActivity(tickets, tests).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className={cn("h-2 w-2 rounded-full mt-1.5", item.dotColor)} />
                      {i < getRecentActivity(tickets, tests).length - 1 && (
                        <div className="w-px flex-1 bg-border/30 mt-1" />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="text-xs text-foreground leading-snug">{item.text}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function getCompanyBreakdown(tickets: TicketRow[]) {
  const companies: Record<string, number> = {};
  tickets.forEach(t => {
    const company = t.clientCompany || "Internal";
    companies[company] = (companies[company] || 0) + 1;
  });
  const sorted = Object.entries(companies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const max = sorted[0]?.[1] || 1;
  return sorted.map(([company, count]) => ({
    company,
    count,
    percentage: (count / max) * 100,
  }));
}

function getRecentActivity(tickets: TicketRow[], tests: TestRow[]) {
  // Build activity from the most recent tickets and tests
  const items: { text: string; date: string; dotColor: string; sortDate: string }[] = [];

  tickets.slice(0, 5).forEach(t => {
    const prefix = t.type === "Case" ? "Case" : "Ticket";
    const shortId = t.id.length > 8 ? t.id.slice(0, 8) : t.id;
    items.push({
      text: `${prefix} #${shortId} — ${t.issue || t.subject || "Update"} (${t.clientCompany || "Internal"})`,
      date: t.lastActivity ? new Date(t.lastActivity).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      dotColor: t.status === "Resolved" ? "bg-emerald-400" : "bg-blue-400",
      sortDate: t.lastActivity || "",
    });
  });

  tests.slice(0, 3).forEach(t => {
    items.push({
      text: `${t.testType || "Test"} — ${t.subject || "Update"} (${t.brand || "Unknown"})`,
      date: t.lastActivity ? new Date(t.lastActivity).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      dotColor: "bg-purple-400",
      sortDate: t.lastActivity || "",
    });
  });

  return items.sort((a, b) => b.sortDate.localeCompare(a.sortDate)).slice(0, 8);
}
