import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { PatientService } from "./patient.service";
import { Patient } from "../models/patient.model";
import { Page } from "../../../core/models/pageable.model";
import { Appointment } from "../../appointments/models/appointment.model";
import { HttpClient } from "@angular/common/http";
import { apiUrl } from "../../../environment";

describe("PatientService", () => {
  let service: PatientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService],
    });

    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Pruebas para createPatient

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  it("should retrieve patients from the API via GET", () => {
    const dummyPatients: Page<Patient> = {
      content: [
        {
          id: "1",
          persoInfo: {
            name: "Carlos",
            surname: "Pérez",
            documentType: "DNI",
            document: "12345678A",
          },
          personType: "PATIENT",
          appointmentId: [],
          medicalRecordId: [],
        },
        {
          id: "2",
          persoInfo: {
            name: "Ana",
            surname: "García",
            documentType: "DNI",
            document: "87654321B",
          },
          personType: "PATIENT",
          appointmentId: [],
          medicalRecordId: [],
        },
      ],
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true,
      size: 20,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      pageable: {
        pageNumber: 0,
        pageSize: 20,
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      numberOfElements: 2,
      empty: false,
    };

    service.getPatients(0, 20).subscribe((patients) => {
      expect(patients.content.length).toBe(2);
      expect(patients.content).toEqual(dummyPatients.content);
    });

    const request = httpMock.expectOne(`${apiUrl}/patients?page=0&size=20`);

    expect(request.request.method).toBe("GET");
    request.flush(dummyPatients);
  });

  // Pruebas para getPatientById

  it("should retrieve a patient by ID from the API via GET", () => {
    const dummyPatient: Patient = {
      id: "1",
      persoInfo: {
        name: "Carlos",
        surname: "Pérez",
        documentType: "DNI",
        document: "12345678A",
      },
      personType: "PATIENT",
      appointmentId: [],
      medicalRecordId: [],
    };

    service.getPatientById("1").subscribe((patient) => {
      expect(patient).toEqual(dummyPatient);
    });

    const request = httpMock.expectOne(`${apiUrl}/patients/1`);
    expect(request.request.method).toBe("GET");
    request.flush(dummyPatient);
  });

  //Prueba para get Appointments By Id

  it("should retrieve appointments by person ID from the API via GET", () => {
    const dummyAppointments: Page<Appointment> = {
      content: [
        {
          id: "1",
          date: "2024-06-27T12:50:26.516",
          patientId: "1",
          patientName: "Carlos",
          patientSurname: "Pérez",
          patientDocument: "12345678A",
          nutritionistId: "10",
          nutritionistName: "Laura",
          nutritionistSurname: "Martínez",
          nutritionistDocument: "98765432X",
        },
        {
          id: "2",
          date: "2024-06-28T10:30:00.000",
          patientId: "1",
          patientName: "Carlos",
          patientSurname: "Pérez",
          patientDocument: "12345678A",
          nutritionistId: "11",
          nutritionistName: "José",
          nutritionistSurname: "Fernández",
          nutritionistDocument: "87654321Z",
        },
      ],
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true,
      size: 20,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      pageable: {
        pageNumber: 0,
        pageSize: 20,
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      numberOfElements: 2,
      empty: false,
    };

    service.getAppointmentsByPersonId("1").subscribe((appointments) => {
      expect(appointments.content.length).toBe(2);
      expect(appointments.content).toEqual(dummyAppointments.content);
    });

    const request = httpMock.expectOne(`${apiUrl}/appointments/person/1`);
    expect(request.request.method).toBe("GET");
    request.flush(dummyAppointments);
  });

  // Pruebas para updatePatientService

  it("should update a patient via PATCH", () => {
    const updatedPatient: Patient = {
      id: "1",
      persoInfo: {
        name: "Carlos",
        surname: "Pérez",
        documentType: "DNI",
        document: "12345678A",
      },
      personType: "PATIENT",
      appointmentId: [],
      medicalRecordId: [],
    };

    service.updatePatient("1", updatedPatient).subscribe((patient) => {
      expect(patient).toEqual(updatedPatient);
    });

    const request = httpMock.expectOne(`${apiUrl}/patients/1`);
    expect(request.request.method).toBe("PATCH");
    request.flush(updatedPatient);
  });

  // Pruebas para delete Patient
  it("should delete a patient via DELETE", () => {
    service.deletePatient("1").subscribe((response) => {
      expect(response).toBeNull();
    });

    const request = httpMock.expectOne(`${apiUrl}/patients/1`);
    expect(request.request.method).toBe("DELETE");
    request.flush(null);
  });
});
