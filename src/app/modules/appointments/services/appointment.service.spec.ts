import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AppointmentService } from "./appointment.service";
import { Page } from "../../../core/models/pageable.model";
import { Appointment } from "../models/appointment.model";
import { apiUrl } from "../../../environment";

describe("AppointmentService", () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;
  const baseUrl = apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppointmentService],
    });
    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  // Test for getAppointments method
  it("should fetch appointments", () => {
    const dummyAppointmentsPage: Page<Appointment> = {
      content: [
        {
          id: "1",
          date: "2024-06-27T12:00:00",
          patientId: "1",
          patientName: "Ana",
          patientSurname: "López",
          patientDocument: "12345678A",
          nutritionistId: "2",
          nutritionistName: "Carlos",
          nutritionistSurname: "Martínez",
          nutritionistDocument: "87654321B",
        },
      ],
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
      size: 1,
      number: 0,
      sort: {
        empty: false,
        sorted: true,
        unsorted: false,
      },
      pageable: {
        pageNumber: 0,
        pageSize: 1,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      numberOfElements: 1,
      empty: false,
    };

    service.getAppointments(0, 1).subscribe((appointments) => {
      expect(appointments).toEqual(dummyAppointmentsPage);
    });

    const req = httpMock.expectOne(`${baseUrl}/appointments?page=0&size=1`);
    expect(req.request.method).toBe("GET");
    req.flush(dummyAppointmentsPage);
  });

  // Test for getAppointmentById method
  it("should fetch an appointment by ID", () => {
    const dummyAppointment = {
      id: "1",
      date: "2024-06-27T12:00:00",
      patientId: "1",
      patientName: "Ana",
      patientSurname: "López",
      patientDocument: "12345678A",
      nutritionistId: "2",
      nutritionistName: "Carlos",
      nutritionistSurname: "Martínez",
      nutritionistDocument: "87654321B",
    };

    service.getAppointmentById("1").subscribe((appointment) => {
      expect(appointment).toEqual(dummyAppointment);
    });

    const req = httpMock.expectOne(`${baseUrl}/appointments/1`);
    expect(req.request.method).toBe("GET");
    req.flush(dummyAppointment);
  });

  // Test for createAppointment method
  it("should create an appointment", () => {
    const newAppointment = {
      id: "1",
      date: "2024-06-27T12:00:00",
      patientId: "1",
      patientName: "Ana",
      patientSurname: "López",
      patientDocument: "12345678A",
      nutritionistId: "2",
      nutritionistName: "Carlos",
      nutritionistSurname: "Martínez",
      nutritionistDocument: "87654321B",
    };

    service.createAppointment(newAppointment).subscribe((appointment) => {
      expect(appointment).toEqual(newAppointment);
    });

    const req = httpMock.expectOne(`${baseUrl}/appointments`);
    expect(req.request.method).toBe("POST");
    req.flush(newAppointment);
  });

  // Test for updateAppointment method
  it("should update an appointment", () => {
    const updatedAppointment = {
      date: "2024-06-28T12:00:00",
      nutritionistId: "3",
    };

    service
      .updateAppointment("1", updatedAppointment)
      .subscribe((appointment) => {
        expect(appointment).toEqual(updatedAppointment);
      });

    const req = httpMock.expectOne(`${baseUrl}/appointments/1`);
    expect(req.request.method).toBe("PATCH");
    req.flush(updatedAppointment);
  });

  // Test for deleteAppointment method
  it("should delete an appointment", () => {
    service.deleteAppointment("1").subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/appointments/1`);
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });
});
