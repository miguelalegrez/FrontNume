export interface Appointment {
  id: string;
  date: string | null;
  patientId: string;
  patientName: string;
  patientSurname: string;
  patientDocument: string;
  nutritionistId: string;
  nutritionistName: string;
  nutritionistSurname: string;
  nutritionistDocument: string;
}
