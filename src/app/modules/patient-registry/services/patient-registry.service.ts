import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Page } from "../../../core/models/pageable.model";
import { apiUrl } from "../../../environment";
import { PatientRegistry } from "../models/patientregistry";
import { Patient } from "../../patients/models/patient.model";

@Injectable({
  providedIn: "root",
})
export class PatientRegistryService {
  private _apiUrl = apiUrl;

  constructor(private _http: HttpClient) {}

  getRecordById(id: string): Observable<PatientRegistry> {
    return this._http.get<PatientRegistry>(
      `${this._apiUrl}/medicalrecords/${id}`
    );
  }
  getRecordsByPersonId(personId: string): Observable<Page<PatientRegistry>> {
    return this._http.get<Page<PatientRegistry>>(
      `${this._apiUrl}/medicalrecords/person/${personId}`
    );
  }

  createRegistry(registry: PatientRegistry): Observable<PatientRegistry> {
    return this._http.post<PatientRegistry>(
      `${this._apiUrl}/medicalrecords`,
      registry
    );
  }

  updateRegistry(
    id: string,
    registry: PatientRegistry
  ): Observable<PatientRegistry> {
    return this._http.patch<PatientRegistry>(
      `${this._apiUrl}/medicalrecords/${registry.id}`,
      registry
    );
  }

  deleteRecordsById(id: string): Observable<any> {
    return this._http.delete<any>(`${this._apiUrl}/medicalrecords/${id}`);
  }
}
