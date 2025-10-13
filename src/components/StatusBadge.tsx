import { ApplicationStatus } from "@/types/application";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusStyles: Record<ApplicationStatus, string> = {
  "Gesendet": "bg-status-sent text-status-sent-foreground",
  "Warten": "bg-status-waiting text-status-waiting-foreground",
  "Vorstellungsgespräch": "bg-status-interview text-status-interview-foreground",
  "Abgelehnt": "bg-status-rejected text-status-rejected-foreground",
  "Angenommen": "bg-status-accepted text-status-accepted-foreground",
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
};
