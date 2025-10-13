import { useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types/application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApplicationFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (application: Application) => void;
  editingApplication?: Application | null;
}

const statusOptions: ApplicationStatus[] = [
  "Gesendet",
  "Warten",
  "Vorstellungsgespräch",
  "Abgelehnt",
  "Angenommen",
];

export const ApplicationForm = ({
  open,
  onClose,
  onSave,
  editingApplication,
}: ApplicationFormProps) => {
  const [formData, setFormData] = useState<Omit<Application, "id">>({
    companyName: "",
    location: "",
    role: "",
    applicationDate: new Date().toISOString().split("T")[0],
    status: "Gesendet",
    notes: "",
  });

  useEffect(() => {
    if (editingApplication) {
      setFormData({
        companyName: editingApplication.companyName,
        location: editingApplication.location,
        role: editingApplication.role,
        applicationDate: editingApplication.applicationDate,
        status: editingApplication.status,
        notes: editingApplication.notes,
      });
    } else {
      setFormData({
        companyName: "",
        location: "",
        role: "",
        applicationDate: new Date().toISOString().split("T")[0],
        status: "Gesendet",
        notes: "",
      });
    }
  }, [editingApplication, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const application: Application = {
      id: editingApplication?.id || crypto.randomUUID(),
      ...formData,
    };
    onSave(application);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingApplication ? "Bewerbung bearbeiten" : "Neue Bewerbung"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="companyName">Unternehmen *</Label>
            <Input
              id="companyName"
              required
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              placeholder="z.B. Deutsche Telekom"
            />
          </div>
          <div>
            <Label htmlFor="location">Standort *</Label>
            <Input
              id="location"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="z.B. Berlin"
            />
          </div>
          <div>
            <Label htmlFor="role">Ausbildung *</Label>
            <Input
              id="role"
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              placeholder="z.B. Fachinformatiker Anwendungsentwicklung"
            />
          </div>
          <div>
            <Label htmlFor="applicationDate">Bewerbungsdatum *</Label>
            <Input
              id="applicationDate"
              type="date"
              required
              value={formData.applicationDate}
              onChange={(e) =>
                setFormData({ ...formData, applicationDate: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: ApplicationStatus) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status auswählen" />
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
          <div>
            <Label htmlFor="notes">Notizen</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Zusätzliche Informationen..."
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Abbrechen
            </Button>
            <Button type="submit" className="flex-1">
              Eintrag speichern
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
