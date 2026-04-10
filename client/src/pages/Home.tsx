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
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  Download,
  Inbox,
  Loader2,
  Radio,
  RefreshCw,
  Search,
  Ticket as TicketIcon,
  X,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";

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

// ---- CSV Export Utility ----
function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const escape = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };
  const csvContent = [
    headers.map(escape).join(","),
    ...rows.map(row => row.map(escape).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

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

  // ---- Brand filter state ----
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const brandDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(e.target as Node)) {
        setBrandDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Collect all unique brands/companies from both tickets and tests
  const allBrands = useMemo(() => {
    const brandSet = new Set<string>();
    tickets.forEach(t => {
      if (t.clientCompany) brandSet.add(t.clientCompany);
    });
    tests.forEach(t => {
      if (t.brand) brandSet.add(t.brand);
    });
    return Array.from(brandSet).sort((a, b) => a.localeCompare(b));
  }, [tickets, tests]);

  // Apply brand filter to tickets and tests
  const brandFilteredTickets = useMemo(() => {
    if (selectedBrand === "all") return tickets;
    return tickets.filter(t => (t.clientCompany ?? "").toLowerCase() === selectedBrand.toLowerCase());
  }, [tickets, selectedBrand]);

  const brandFilteredTests = useMemo(() => {
    if (selectedBrand === "all") return tests;
    return tests.filter(t => (t.brand ?? "").toLowerCase() === selectedBrand.toLowerCase());
  }, [tests, selectedBrand]);

  // Compute stats from brand-filtered data
  const stats = useMemo(() => {
    const openTickets = brandFilteredTickets.filter(t => t.status === "Open").length;
    const pendingTickets = brandFilteredTickets.filter(t => t.status === "Pending").length;
    const resolvedTickets = brandFilteredTickets.filter(t => t.status === "Resolved").length;
    const criticalTickets = brandFilteredTickets.filter(t => t.priority === "Critical" && t.status !== "Resolved").length;
    const activeTests = brandFilteredTests.filter(t => t.status === "Active").length;
    const completedTests = brandFilteredTests.filter(t => t.status === "Completed").length;
    const openTasks = tasks.filter(t => t.progress !== "Closed").length;

    return {
      tickets: { total: brandFilteredTickets.length, open: openTickets, pending: pendingTickets, resolved: resolvedTickets, critical: criticalTickets },
      tests: { total: brandFilteredTests.length, active: activeTests, completed: completedTests },
      tasks: { total: tasks.length, open: openTasks },
    };
  }, [brandFilteredTickets, brandFilteredTests, tasks]);

  const [ticketFilter, setTicketFilter] = useState("all");
  const [testFilter, setTestFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tickets" | "tests">("tickets");

  // Filter by search (applied on top of brand filter)
  const filteredTickets = useMemo(() => {
    let result = brandFilteredTickets;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        t =>
          (t.issue ?? "").toLowerCase().includes(q) ||
          (t.client ?? "").toLowerCase().includes(q) ||
          (t.clientCompany ?? "").toLowerCase().includes(q) ||
          t.id.includes(q)
      );
    }
    return result;
  }, [searchQuery, brandFilteredTickets]);

  const filteredTests = useMemo(() => {
    let result = brandFilteredTests;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        t =>
          (t.subject ?? "").toLowerCase().includes(q) ||
          (t.brand ?? "").toLowerCase().includes(q) ||
          (t.client ?? "").toLowerCase().includes(q) ||
          (t.testType ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, brandFilteredTests]);

  const ticketFilterOptions = [
    { key: "all", label: "All", count: brandFilteredTickets.length },
    { key: "open", label: "Open", count: stats.tickets.open },
    { key: "pending", label: "Pending", count: stats.tickets.pending },
    { key: "resolved", label: "Resolved", count: stats.tickets.resolved },
    { key: "critical", label: "Critical", count: stats.tickets.critical },
  ];

  const testFilterOptions = [
    { key: "all", label: "All", count: brandFilteredTests.length },
    { key: "active", label: "Active", count: stats.tests.active },
    { key: "completed", label: "Completed", count: stats.tests.completed },
    { key: "beta", label: "Beta", count: brandFilteredTests.filter(t => (t.testType ?? "").includes("Beta")).length },
    { key: "pltv", label: "pLTV", count: brandFilteredTests.filter(t => (t.testType ?? "").includes("pLTV")).length },
    { key: "ab", label: "A/B", count: brandFilteredTests.filter(t => (t.testType ?? "").includes("A/B")).length },
  ];

  // Sync date display
  const syncDate = lastSync?.syncedAt
    ? new Date(lastSync.syncedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // ---- CSV Export handlers ----
  const handleExportTickets = useCallback(() => {
    const headers = ["ID", "Type", "Issue", "Subject", "Status", "Client", "Email", "Brand", "Priority", "Messages", "First Date", "Last Activity", "Gmail Link"];
    const rows = filteredTickets.map(t => [
      t.id,
      t.type,
      t.issue ?? "",
      t.subject ?? "",
      t.status,
      t.client ?? "",
      t.clientEmail ?? "",
      t.clientCompany ?? "",
      t.priority ?? "",
      String(t.messageCount ?? 0),
      t.firstDate ?? "",
      t.lastActivity ?? "",
      t.gmailLink ?? "",
    ]);
    const brandSuffix = selectedBrand !== "all" ? `_${selectedBrand.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
    downloadCSV(`box-office-tickets${brandSuffix}_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  }, [filteredTickets, selectedBrand]);

  const handleExportTests = useCallback(() => {
    const headers = ["ID", "Subject", "Test Type", "Status", "Brand", "Client", "Email", "Messages", "First Date", "Last Activity", "Gmail Link"];
    const rows = filteredTests.map(t => [
      t.id,
      t.subject ?? "",
      t.testType ?? "",
      t.status,
      t.brand ?? "",
      t.client ?? "",
      t.clientEmail ?? "",
      String(t.messageCount ?? 0),
      t.firstDate ?? "",
      t.lastActivity ?? "",
      t.gmailLink ?? "",
    ]);
    const brandSuffix = selectedBrand !== "all" ? `_${selectedBrand.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
    downloadCSV(`box-office-tests${brandSuffix}_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  }, [filteredTests, selectedBrand]);

  const handleExportAll = useCallback(() => {
    handleExportTickets();
    setTimeout(() => handleExportTests(), 200);
  }, [handleExportTickets, handleExportTests]);

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
            <div className="flex items-center gap-2">
              {/* Brand Filter Dropdown */}
              <div className="relative" ref={brandDropdownRef}>
                <button
                  onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                  className={cn(
                    "flex items-center gap-1.5 h-9 rounded-lg border px-3 text-xs transition-all backdrop-blur-sm",
                    selectedBrand !== "all"
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                      : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="max-w-[120px] truncate">
                    {selectedBrand === "all" ? "All Brands" : selectedBrand}
                  </span>
                  {selectedBrand !== "all" ? (
                    <X
                      className="h-3 w-3 ml-0.5 hover:text-white cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBrand("all");
                        setBrandDropdownOpen(false);
                      }}
                    />
                  ) : (
                    <ChevronDown className={cn("h-3 w-3 transition-transform", brandDropdownOpen && "rotate-180")} />
                  )}
                </button>

                {brandDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 z-50 w-56 max-h-72 overflow-y-auto rounded-lg border border-border/60 bg-card shadow-xl backdrop-blur-md"
                  >
                    <div className="p-1">
                      <button
                        onClick={() => { setSelectedBrand("all"); setBrandDropdownOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors",
                          selectedBrand === "all"
                            ? "bg-blue-500/15 text-blue-300"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <span className="h-2 w-2 rounded-full bg-blue-400" />
                        All Brands
                        <span className="ml-auto font-mono text-[10px] opacity-60">
                          {tickets.length + tests.length}
                        </span>
                      </button>
                      <div className="my-1 h-px bg-border/30" />
                      {allBrands.map(brand => {
                        const ticketCount = tickets.filter(t => (t.clientCompany ?? "").toLowerCase() === brand.toLowerCase()).length;
                        const testCount = tests.filter(t => (t.brand ?? "").toLowerCase() === brand.toLowerCase()).length;
                        return (
                          <button
                            key={brand}
                            onClick={() => { setSelectedBrand(brand); setBrandDropdownOpen(false); }}
                            className={cn(
                              "w-full flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors",
                              selectedBrand === brand
                                ? "bg-cyan-500/15 text-cyan-300"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                          >
                            <span className="h-2 w-2 rounded-full bg-cyan-400/60" />
                            <span className="truncate">{brand}</span>
                            <span className="ml-auto font-mono text-[10px] opacity-60">
                              {ticketCount + testCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tickets, tests, clients..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-9 w-56 rounded-lg border border-border/50 bg-card/50 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 backdrop-blur-sm"
                />
              </div>

              {/* CSV Export Button */}
              <div className="relative group">
                <button
                  onClick={activeTab === "tickets" ? handleExportTickets : handleExportTests}
                  className="flex items-center gap-1.5 h-9 rounded-lg border border-border/50 bg-card/50 px-3 text-xs text-muted-foreground hover:text-foreground hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all backdrop-blur-sm"
                  title={`Export ${activeTab} as CSV`}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>

              {/* Sync indicator */}
              <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-xs text-muted-foreground backdrop-blur-sm">
                <RefreshCw className="h-3 w-3" />
                <span className="font-mono">
                  Synced {syncDate}
                </span>
              </div>
            </div>
          </div>

          {/* Active brand filter indicator */}
          {selectedBrand !== "all" && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2"
            >
              <span className="text-[11px] text-muted-foreground">Filtered by:</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[11px] font-medium text-cyan-300">
                <Building2 className="h-3 w-3" />
                {selectedBrand}
                <button
                  onClick={() => setSelectedBrand("all")}
                  className="ml-0.5 hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {stats.tickets.total} tickets, {stats.tests.total} tests
              </span>
            </motion.div>
          )}
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
            {/* Tab switcher + Export */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-card/30 p-1 backdrop-blur-sm w-fit">
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

              {/* Export All button (secondary, inline with tabs) */}
              <button
                onClick={handleExportAll}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] text-muted-foreground hover:text-emerald-300 transition-colors"
                title="Export both tickets and tests as CSV"
              >
                <Download className="h-3 w-3" />
                Export All
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
                {getCompanyBreakdown(brandFilteredTickets).map(({ company, count, percentage }) => (
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
                {getRecentActivity(brandFilteredTickets, brandFilteredTests).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className={cn("h-2 w-2 rounded-full mt-1.5", item.dotColor)} />
                      {i < getRecentActivity(brandFilteredTickets, brandFilteredTests).length - 1 && (
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
