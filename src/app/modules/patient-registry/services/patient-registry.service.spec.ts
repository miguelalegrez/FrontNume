import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { PatientRegistryService } from "./patient-registry.service";
import { apiUrl } from "../../../environment";
import { PatientRegistry } from "../models/patientregistry";
import { Page } from "../../../core/models/pageable.model";

describe("PatientRegistryService", () => {
  let service: PatientRegistryService;
  let httpMock: HttpTestingController;
  const mockApiUrl = apiUrl;

  const mockRegistry: PatientRegistry = {
    id: "1",
    date: "2024-06-27T12:50:26.516",
    registryType: "FIRSTDATE",
    observations: "Observación de prueba",
    patientId: "1",
  };

  const mockPage: Page<PatientRegistry> = {
    content: [mockRegistry],
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientRegistryService],
    });
    service = TestBed.inject(PatientRegistryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get record by ID", () => {
    service.getRecordById("1").subscribe((res) => {
      expect(res).toEqual(mockRegistry);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/medicalrecords/1`);
    expect(req.request.method).toBe("GET");
    req.flush(mockRegistry);
  });

  it("should get records by person ID", () => {
    service.getRecordsByPersonId("1").subscribe((res) => {
      expect(res).toEqual(mockPage);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/medicalrecords/person/1`);
    expect(req.request.method).toBe("GET");
    req.flush(mockPage);
  });

  it("should create a registry", () => {
    service.createRegistry(mockRegistry).subscribe((res) => {
      expect(res).toEqual(mockRegistry);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/medicalrecords`);
    expect(req.request.method).toBe("POST");
    req.flush(mockRegistry);
  });

  it("should update a registry", () => {
    service.updateRegistry("1", mockRegistry).subscribe((res) => {
      expect(res).toEqual(mockRegistry);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/medicalrecords/1`);
    expect(req.request.method).toBe("PATCH");
    req.flush(mockRegistry);
  });

  it("should delete a registry by ID", () => {
    service.deleteRecordsById("1").subscribe((res) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`${mockApiUrl}/medicalrecords/1`);
    expect(req.request.method).toBe("DELETE");
    req.flush({});
  });
});
