import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Page } from "../../../core/models/pageable.model";
import { apiUrl } from "../../../environment";
import { Appointment } from "../../appointments/models/appointment.model";
import { Patient } from "../models/patient.model";

@Injectable({
  providedIn: "root",
})
export class PatientService {
  private _apiUrl = apiUrl;

  constructor(private _http: HttpClient) {}

  getPatients(page: number, size: number): Observable<Page<Patient>> {
    const url = `${this._apiUrl + `/patients`}?page=${page}&size=${size}`;
    return this._http.get<Page<Patient>>(url);
  }

  // Método para crear un paciente
  createPatient(patient: Patient): Observable<Patient> {
    return this._http.post<Patient>(`${this._apiUrl}/patients`, patient);
  }

  getPatientById(patientId: string): Observable<Patient> {
    const url = `${this._apiUrl}/patients/${patientId}`;
    return this._http.get<Patient>(url);
  }

  getPatientByDocument(document: string): Observable<Patient> {
    const url = `${this._apiUrl}/patients/searchByPatientDocument?document=${document}`;
    return this._http.get<Patient>(url);
  }

  searchPatientsByNameAndSurname(
    name: string,
    surname: string,
    page: number,
    size: number
  ): Observable<Page<Patient>> {
    const url = `${this._apiUrl}/patients/searchPatients?name=${name}&surname=${surname}&page=${page}&size=${size}`;
    return this._http.get<Page<Patient>>(url);
  }

  // Método para obtener las citas del paciente
  getAppointmentsByPersonId(personId: string): Observable<Page<Appointment>> {
    return this._http.get<Page<Appointment>>(
      `${this._apiUrl}/appointments/person/${personId}`
    );
  }

  updatePatient(id: string, patient: Partial<Patient>): Observable<Patient> {
    return this._http.patch<Patient>(`${this._apiUrl}/patients/${id}`, patient);
  }

  deletePatient(id: string): Observable<any> {
    return this._http.delete<any>(`${this._apiUrl}/patients/${id}`);
  }
}
