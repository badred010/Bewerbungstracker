import { ApplicationStatus } from "@/types/application";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock, X } from "lucide-react";

interface FilterLeisteProps {
  totalCount: number;
  pendingCount: number;
  rejectedCount: number;
  selectedStatus: ApplicationStatus | "Alle";
  onStatusChange: (status: ApplicationStatus | "Alle") => void;
  onAddNew: () => void;
}

const statusOptions: (ApplicationStatus | "Alle")[] = [
  "Alle",
  "Gesendet",
  "Warten",
  "Vorstellungsgespräch",
  "Abgelehnt",
  "Angenommen",
];

export const FilterLeiste = ({
  totalCount,
  pendingCount,
  rejectedCount,
  selectedStatus,
  onStatusChange,
  onAddNew,
}: FilterLeisteProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 bg-card px-4 py-3 rounded-lg border">
          <FileText className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Gesamt</p>
            <p className="text-xl font-semibold text-foreground">{totalCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-card px-4 py-3 rounded-lg border">
          <Clock className="w-5 h-5 text-status-waiting" />
          <div>
            <p className="text-xs text-muted-foreground">Offen</p>
            <p className="text-xl font-semibold text-foreground">{pendingCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-card px-4 py-3 rounded-lg border">
          <X  className="w-5 h-5 text-status-rejected" />
          <div>
            <p className="text-xs text-muted-foreground">Absage</p>
            <p className="text-xl font-semibold text-foreground">{rejectedCount}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status filtern" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onAddNew} className="sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Neue Bewerbung
        </Button>
      </div>
    </div>
  );
};
