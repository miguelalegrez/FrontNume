import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { PatientRegistryDetailComponent } from "./patient-registry-detail.component";
import { PatientRegistryService } from "../../services/patient-registry.service";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { DatePipe } from "@angular/common";
import { PatientRegistry } from "../../models/patientregistry";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("PatientRegistryDetailComponent", () => {
  let component: PatientRegistryDetailComponent;
  let fixture: ComponentFixture<PatientRegistryDetailComponent>;
  let mockPatientRegistryService: jasmine.SpyObj<PatientRegistryService>;
  let mockRouterNav: jasmine.SpyObj<Router>;

  const mockRegistry: PatientRegistry = {
    id: "1",
    date: "2024-06-27T12:50:26.516",
    registryType: "FIRSTDATE",
    observations: "Observación de prueba",
    patientId: "1",
  };

  beforeEach(async () => {
    const patientRegistryServiceSpy = jasmine.createSpyObj(
      "PatientRegistryService",
      ["getRecordById", "deleteRecordsById"]
    );
    const routerNavSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [PatientRegistryDetailComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        DatePipe,
        {
          provide: PatientRegistryService,
          useValue: patientRegistryServiceSpy,
        },
        { provide: Router, useValue: routerNavSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: "1" }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientRegistryDetailComponent);
    component = fixture.componentInstance;
    mockPatientRegistryService = TestBed.inject(
      PatientRegistryService
    ) as jasmine.SpyObj<PatientRegistryService>;
    mockRouterNav = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    spyOn(console, "error"); // Spy on console.error to check for errors

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch registry details on init", () => {
    mockPatientRegistryService.getRecordById.and.returnValue(of(mockRegistry));
    component.ngOnInit();
    expect(mockPatientRegistryService.getRecordById).toHaveBeenCalledWith("1");
    expect(component.registry).toEqual({
      ...mockRegistry,
      date: "Jun 27, 2024, 12:50:26 PM", // Formato esperado por DatePipe
    });
  });

  it("should handle error when fetching registry details", () => {
    const errorResponse = new Error("Error fetching registry");
    mockPatientRegistryService.getRecordById.and.returnValue(
      throwError(() => errorResponse)
    );
    component.ngOnInit();
    expect(mockPatientRegistryService.getRecordById).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching registry",
      errorResponse
    );
  });

  it("should delete the registry", () => {
    mockPatientRegistryService.deleteRecordsById.and.returnValue(of(null));
    component.registry = mockRegistry;
    component.deleteRegistry();
    expect(mockPatientRegistryService.deleteRecordsById).toHaveBeenCalledWith(
      "1"
    );
    expect(mockRouterNav.navigate).toHaveBeenCalledWith([
      "/patients/detail",
      "1",
    ]);
  });

  it("should handle error when deleting registry", () => {
    const errorResponse = new Error("Error eliminating registry");
    mockPatientRegistryService.deleteRecordsById.and.returnValue(
      throwError(() => errorResponse)
    );
    component.registry = mockRegistry;
    component.deleteRegistry();
    expect(mockPatientRegistryService.deleteRecordsById).toHaveBeenCalledWith(
      "1"
    );
    expect(console.error).toHaveBeenCalledWith(
      "Error eliminating registry",
      errorResponse
    );
  });

  it("should translate registry types correctly", () => {
    expect(component.translateRegistryType("FIRSTDATE")).toBe("Primera Cita");
    expect(component.translateRegistryType("REVISION")).toBe("Revisión");
    expect(component.translateRegistryType("OTHER")).toBe("OTHER");
  });
});
