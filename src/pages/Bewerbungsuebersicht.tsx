import { useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types/application";
import { BewerbungsCard } from "@/components/BewerbungsCard";
import { BewerbungsForm } from "@/components/BewerbungsForm";
import { FilterLeiste } from "@/components/FilterLeiste";
import { toast } from "sonner";
import { SearchBar } from "@/components/SearchBar";

const Index = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "Alle">("Alle");
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");

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

  const availableCities = Array.from(
    new Set(applications.map((app) => app.location).filter((city) => city))
  ).sort();

  const filteredApplications = applications.filter((app) => {
    const statusMatch = statusFilter === "Alle" || app.status === statusFilter;
    const searchMatch = searchTerm === "" || 
      app.companyName.toLowerCase().split(/\s+/).some(word => word.startsWith(searchTerm.toLowerCase()));
    const cityMatch = cityFilter === "" || app.location === cityFilter;
    return statusMatch && searchMatch && cityMatch;
  });

  const pendingCount = applications.filter(
    (app) => app.status === "Warten" || app.status === "Vorstellungsgespräch"
  ).length;

    const rejectedCount = applications.filter(
    (app) => app.status === "Abgelehnt"
  ).length;

  function handleSearch(term: string): void {
    setSearchTerm(term);
  }

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
          rejectedCount={rejectedCount}
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
          onAddNew={handleAddNew}
        />
        <br />
      <SearchBar onSearch={(term) => handleSearch(term)} />

        {filteredApplications.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-muted-foreground text-lg">
              {applications.length === 0
                ? "Noch keine Bewerbungen vorhanden. Füge deine erste Bewerbung hinzu!"
                : searchTerm
                ? `Keine Bewerbungen gefunden für "${searchTerm}"`
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
