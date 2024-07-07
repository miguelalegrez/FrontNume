import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { of, throwError } from "rxjs";
import { PatientRegistryModificationComponent } from "./patient-registry-modification.component";
import { PatientRegistryService } from "../../services/patient-registry.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientRegistry } from "../../models/patientregistry";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("PatientRegistryModificationComponent", () => {
  let component: PatientRegistryModificationComponent;
  let fixture: ComponentFixture<PatientRegistryModificationComponent>;
  let mockPatientRegistryService: jasmine.SpyObj<PatientRegistryService>;
  let mockRouter: jasmine.SpyObj<Router>;

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
      ["getRecordById", "updateRegistry"]
    );
    const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    await TestBed.configureTestingModule({
      declarations: [PatientRegistryModificationComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: PatientRegistryService,
          useValue: patientRegistryServiceSpy,
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: "1" }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientRegistryModificationComponent);
    component = fixture.componentInstance;
    mockPatientRegistryService = TestBed.inject(
      PatientRegistryService
    ) as jasmine.SpyObj<PatientRegistryService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

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
    expect(component.registry).toEqual(mockRegistry);
    expect(component.modifyForm.value.registryType).toBe("Primera Cita");
    expect(component.modifyForm.value.observations).toBe(
      mockRegistry.observations
    );
    expect(component.modifyForm.value.patientId).toBe(mockRegistry.patientId);
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

  it("should submit form and update registry", () => {
    mockPatientRegistryService.updateRegistry.and.returnValue(of(mockRegistry));
    component.registry = mockRegistry;
    component.modifyForm.patchValue({
      registryType: "Primera Cita",
      observations: "Nueva observación",
      patientId: "1",
    });

    component.submitForm();
    expect(mockPatientRegistryService.updateRegistry).toHaveBeenCalledWith(
      "1",
      {
        ...mockRegistry,
        registryType: "FIRSTDATE",
        observations: "Nueva observación",
        patientId: "1",
      }
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith("/patients/detail/1");
  });

  it("should handle error when updating registry", () => {
    const errorResponse = new Error("Error updating registry");
    mockPatientRegistryService.updateRegistry.and.returnValue(
      throwError(() => errorResponse)
    );
    component.registry = mockRegistry;
    component.modifyForm.patchValue({
      registryType: "Primera Cita",
      observations: "Nueva observación",
      patientId: "1",
    });

    component.submitForm();
    expect(mockPatientRegistryService.updateRegistry).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "Error updating registry",
      errorResponse
    );
  });

  it("should translate registry types correctly", () => {
    expect(component.translateRegistryType("FIRSTDATE")).toBe("Primera Cita");
    expect(component.translateRegistryType("REVISION")).toBe("Revisión");
    expect(component.translateRegistryType("OTHER")).toBe("OTHER");
  });
});
