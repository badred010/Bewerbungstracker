export type ApplicationStatus = 
  | "Gesendet" 
  | "Warten" 
  | "Vorstellungsgespräch" 
  | "Abgelehnt" 
  | "Angenommen";

export interface Application {
  id: string;
  companyName: string;
  location: string;
  role: string;
  applicationDate: string;
  status: ApplicationStatus;
  notes: string;
}
