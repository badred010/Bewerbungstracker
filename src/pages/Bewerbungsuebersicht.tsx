import { useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types/application";
import { BewerbungsCard } from "@/components/BewerbungsCard";
import { BewerbungsForm } from "@/components/BewerbungsForm";
import { FilterLeiste } from "@/components/FilterLeiste";
import { toast } from "sonner";

const Index = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "Alle">("Alle");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("applications");
    if (saved) {
      try {
        setApplications(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load applications:", error);
      }
    }
  }, []);

  // Save to localStorage whenever applications change
  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  const handleSave = (application: Application) => {
    setApplications((prev) => {
      const existing = prev.find((app) => app.id === application.id);
      if (existing) {
        toast.success("Bewerbung aktualisiert");
        return prev.map((app) => (app.id === application.id ? application : app));
      } else {
        toast.success("Bewerbung hinzugefügt");
        return [...prev, application];
      }
    });
    setEditingApplication(null);
  };

  const handleEdit = (application: Application) => {
    setEditingApplication(application);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    toast.success("Bewerbung gelöscht");
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingApplication(null);
  };

  const handleAddNew = () => {
    setEditingApplication(null);
    setIsFormOpen(true);
  };

  const filteredApplications =
    statusFilter === "Alle"
      ? applications
      : applications.filter((app) => app.status === statusFilter);

  const pendingCount = applications.filter(
    (app) => app.status === "Warten" || app.status === "Vorstellungsgespräch"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bewerbungstracker
          </h1>
          <p className="text-muted-foreground">
            Verwalte deine Ausbildungsbewerbungen an einem Ort
          </p>
        </div>

        <FilterLeiste
          totalCount={applications.length}
          pendingCount={pendingCount}
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
          onAddNew={handleAddNew}
        />

        {filteredApplications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {statusFilter === "Alle"
                ? "Noch keine Bewerbungen vorhanden. Füge deine erste Bewerbung hinzu!"
                : `Keine Bewerbungen mit Status "${statusFilter}"`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredApplications.map((application) => (
              <BewerbungsCard
                key={application.id}
                application={application}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <BewerbungsForm
          open={isFormOpen}
          onClose={handleFormClose}
          onSave={handleSave}
          editingApplication={editingApplication}
        />
      </div>
    </div>
  );
};

export default Index;
