import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { NutritionistService } from "./nutritionist.service";
import { Nutritionist } from "../models/nutritionist.model";
import { Appointment } from "../../appointments/models/appointment.model";
import { Page } from "../../../core/models/pageable.model";
import { apiUrl } from "../../../environment";

describe("NutritionistService", () => {
  let service: NutritionistService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NutritionistService],
    });
    service = TestBed.inject(NutritionistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  /**
   * Prueba para obtener una lista paginada de nutricionistas
   */
  it("should fetch a list of nutritionists", () => {
    const mockResponse: Page<Nutritionist> = {
      content: [
        {
          id: "1",
          persoInfo: {
            name: "Carlos",
            surname: "García",
            documentType: "DNI",
            document: "12345678A",
          },
          personType: "NUTRITIONIST",
          appointmentId: [],
          medicalRecordId: [],
        },
      ],
      totalElements: 1,
      totalPages: 1,
      size: 1,
      number: 0,
      numberOfElements: 1,
      first: true,
      last: true,
      empty: false,
      sort: {
        sorted: false,
        unsorted: true,
        empty: true,
      },
      pageable: {
        pageNumber: 0,
        pageSize: 1,
        offset: 0,
        paged: true,
        unpaged: false,
        sort: {
          sorted: false,
          unsorted: true,
          empty: true,
        },
      },
    };

    service.getNutritionists(0, 10).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/nutritionists?page=0&size=10`);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  /**
   * Prueba para crear un nutricionista
   */
  it("should create a nutritionist", () => {
    const newNutritionist: Nutritionist = {
      id: "2",
      persoInfo: {
        name: "Laura",
        surname: "Martínez",
        documentType: "DNI",
        document: "87654321B",
      },
      personType: "NUTRITIONIST",
      appointmentId: [],
      medicalRecordId: [],
    };

    service.createNutritionist(newNutritionist).subscribe((response) => {
      expect(response).toEqual(newNutritionist);
    });

    const req = httpMock.expectOne(`${apiUrl}/nutritionists`);
    expect(req.request.method).toBe("POST");
    req.flush(newNutritionist);
  });

  /**
   * Prueba para obtener un nutricionista por ID
   */
  it("should fetch a nutritionist by id", () => {
    const mockNutritionist: Nutritionist = {
      id: "1",
      persoInfo: {
        name: "Carlos",
        surname: "García",
        documentType: "DNI",
        document: "12345678A",
      },
      personType: "NUTRITIONIST",
      appointmentId: [],
      medicalRecordId: [],
    };

    service.getNutritionistById("1").subscribe((response) => {
      expect(response).toEqual(mockNutritionist);
    });

    const req = httpMock.expectOne(`${apiUrl}/nutritionists/1`);
    expect(req.request.method).toBe("GET");
    req.flush(mockNutritionist);
  });

  /**
   * Prueba para obtener las citas de un nutricionista por ID de persona
   */
  it("should fetch appointments by person id", () => {
    const mockResponse: Page<Appointment> = {
      content: [
        {
          id: "1",
          date: "2024-06-27T12:00:00",
          patientName: "Ana",
          patientSurname: "López",
          patientId: "3",
          patientDocument: "56789012D",
          nutritionistId: "1",
          nutritionistName: "Carlos",
          nutritionistSurname: "García",
          nutritionistDocument: "12345678A",
        },
      ],
      totalElements: 1,
      totalPages: 1,
      size: 1,
      number: 0,
      numberOfElements: 1,
      first: true,
      last: true,
      empty: false,
      sort: {
        sorted: false,
        unsorted: true,
        empty: true,
      },
      pageable: {
        pageNumber: 0,
        pageSize: 1,
        offset: 0,
        paged: true,
        unpaged: false,
        sort: {
          sorted: false,
          unsorted: true,
          empty: true,
        },
      },
    };

    service.getAppointmentsByPersonId("1").subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/appointments/person/1`);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  /**
   * Prueba para actualizar un nutricionista
   */
  it("should update a nutritionist", () => {
    const updatedNutritionist: Partial<Nutritionist> = {
      persoInfo: {
        name: "Carlos",
        surname: "García",
        documentType: "DNI",
        document: "12345678A",
      },
    };

    service
      .updateNutritionist("1", updatedNutritionist)
      .subscribe((response) => {
        expect(response.persoInfo.name).toBe("Carlos");
      });

    const req = httpMock.expectOne(`${apiUrl}/nutritionists/1`);
    expect(req.request.method).toBe("PATCH");
    req.flush({
      ...updatedNutritionist,
      id: "1",
      personType: "NUTRITIONIST",
      appointmentId: [],
      medicalRecordId: [],
    });
  });

  /**
   * Prueba para eliminar un nutricionista
   */
  it("should delete a nutritionist", () => {
    service.deleteNutritionist("1").subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/nutritionists/1`);
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });
});
