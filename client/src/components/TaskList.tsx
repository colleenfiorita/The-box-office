import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ClipboardList, Tag } from "lucide-react";
import type { Task } from "@/data/dashboardData";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task, i) => (
        <motion.div
          key={task.taskNumber}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="rounded-lg border border-border/40 bg-card/40 backdrop-blur-sm p-3"
        >
          <div className="flex items-start gap-2">
            <div className="mt-0.5 rounded bg-blue-500/10 p-1.5">
              <ClipboardList className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {task.taskNumber}
                </span>
                <StatusBadge status={task.progress} size="sm" />
              </div>
              <p className="text-xs font-medium text-foreground leading-snug">
                {task.title}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{task.owner}</span>
                <span>·</span>
                <span className={cn(
                  "font-mono uppercase",
                  task.priority === "High" ? "text-amber-400" : "text-muted-foreground"
                )}>
                  {task.priority}
                </span>
              </div>
              {task.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {task.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-0.5 rounded bg-accent/50 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                  {task.tags.length > 3 && (
                    <span className="text-[9px] text-muted-foreground">
                      +{task.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
