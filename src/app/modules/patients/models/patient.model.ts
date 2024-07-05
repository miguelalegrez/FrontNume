export interface Patient {
  id: string;
  personType: string;
  persoInfo: {
    name: string;
    surname: string;
    documentType: string;
    document: string;
  };
  appointmentId: string[];
  medicalRecordId: string[];
}
