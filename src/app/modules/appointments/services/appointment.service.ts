import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Page } from "../../../core/models/pageable.model";
import { apiUrl } from "../../../environment";
import { Appointment } from "../models/appointment.model";

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  private _apiUrl = apiUrl;

  constructor(private _http: HttpClient) {}

  getAppointments(page: number, size: number): Observable<Page<Appointment>> {
    const url = `${this._apiUrl + "/appointments"}?page=${page}&size=${size}`;
    return this._http.get<Page<Appointment>>(url);
  }

  getAppointmentById(id: string): Observable<any> {
    return this._http.get<any>(`${this._apiUrl}/appointments/${id}`);
  }

  getAppointmentsByPersonDocument(
    document: string,
    page: number,
    size: number
  ): Observable<Page<Appointment>> {
    const url = `${this._apiUrl}/appointments/person/searchByDocument`;
    let params = new HttpParams()
      .set("document", document)
      .set("page", page.toString())
      .set("size", size.toString());

    return this._http.get<Page<Appointment>>(url, { params });
  }

  createAppointment(appointment: any): Observable<any> {
    return this._http.post<any>(`${this._apiUrl}/appointments`, appointment);
  }

  updateAppointment(id: string, appointment: any): Observable<any> {
    return this._http.patch<any>(
      `${this._apiUrl}/appointments/${id}`,
      appointment
    );
  }

  deleteAppointment(id: string): Observable<any> {
    return this._http.delete<any>(`${this._apiUrl}/appointments/${id}`);
  }
}
