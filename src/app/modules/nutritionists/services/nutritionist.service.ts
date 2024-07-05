import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Page } from "../../../core/models/pageable.model";
import { apiUrl } from "../../../environment";
import { Appointment } from "../../appointments/models/appointment.model";
import { Nutritionist } from "../models/nutritionist.model";

@Injectable({
  providedIn: "root",
})
export class NutritionistService {
  private _apiUrl = apiUrl;

  constructor(private _http: HttpClient) {}

  getNutritionists(page: number, size: number): Observable<Page<Nutritionist>> {
    const url = `${this._apiUrl + `/nutritionists`}?page=${page}&size=${size}`;
    return this._http.get<Page<Nutritionist>>(url);
  }

  createNutritionist(nutritionist: any): Observable<any> {
    return this._http.post<any>(`${this._apiUrl}/nutritionists`, nutritionist);
  }

  getNutritionistById(id: string): Observable<any> {
    return this._http.get<any>(`${this._apiUrl}/nutritionists/${id}`);
  }

  getNutritionistByDocument(document: string): Observable<Nutritionist> {
    const url = `${this._apiUrl}/nutritionists/searchByNutritionistDocument?document=${document}`;
    return this._http.get<Nutritionist>(url);
  }

  searchNutritionistByNameAndSurname(
    name: string,
    surname: string,
    page: number,
    size: number
  ): Observable<Page<Nutritionist>> {
    const url = `${this._apiUrl}/nutritionists/searchNutritionists?name=${name}&surname=${surname}&page=${page}&size=${size}`;
    return this._http.get<Page<Nutritionist>>(url);
  }

  getAppointmentsByPersonId(personId: string): Observable<Page<Appointment>> {
    return this._http.get<Page<Appointment>>(
      `${this._apiUrl}/appointments/person/${personId}`
    );
  }
  updateNutritionist(
    id: string,
    patient: Partial<Nutritionist>
  ): Observable<Nutritionist> {
    return this._http.patch<Nutritionist>(
      `${this._apiUrl}/nutritionists/${id}`,
      patient
    );
  }
  deleteNutritionist(id: string): Observable<any> {
    return this._http.delete<any>(`${this._apiUrl}/nutritionists/${id}`);
  }
}
