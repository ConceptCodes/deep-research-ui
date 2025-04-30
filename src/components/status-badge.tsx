import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import type { Status } from "@/hooks/use-store";
import { Badge } from "./ui/badge";

const statusIcons: Record<Status, React.ReactElement> = {
  completed: <CheckCircle className="mr-1 h-4 w-4" />,
  "in-progress": <Clock className="mr-1 h-4 w-4" />,
  pending: <Clock className="mr-1 h-4 w-4" />,
  failed: <AlertCircle className="mr-1 h-4 w-4" />,
};

const statusText = {
  completed: "Completed",
  "in-progress": "In Progress",
  pending: "Pending",
  failed: "Failed",
};

export const statusColors = {
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "in-progress":
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <Badge variant="outline" className={statusColors[status]}>
      <span className="flex items-center gap-1">
        {statusIcons[status]}
        {statusText[status]}
      </span>
    </Badge>
  );
};
