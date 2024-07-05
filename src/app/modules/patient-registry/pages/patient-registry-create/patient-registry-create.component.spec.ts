import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { PatientRegistryService } from "../../services/patient-registry.service";
import { PatientRegistryCreateComponent } from "./patient-registry-create.component";
import { PatientRegistry } from "../../models/patientregistry";

describe("PatientRegistryCreateComponent", () => {
  let component: PatientRegistryCreateComponent;
  let fixture: ComponentFixture<PatientRegistryCreateComponent>;
  let mockPatientRegistryService: jasmine.SpyObj<PatientRegistryService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const patientRegistryServiceSpy = jasmine.createSpyObj(
      "PatientRegistryService",
      ["createRegistry"]
    );
    const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    await TestBed.configureTestingModule({
      declarations: [PatientRegistryCreateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: PatientRegistryService,
          useValue: patientRegistryServiceSpy,
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => "1" } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientRegistryCreateComponent);
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

  it("should initialize form with patientId from route params", () => {
    component.ngOnInit();
    expect(component.patientRegistryForm.get("patientId")?.value).toBe("1");
  });

  it("should display an error if form is invalid", () => {
    component.submitForm();
    expect(component.patientRegistryForm.valid).toBeFalse();
    expect(console.error).toHaveBeenCalledWith("Formulario inválido");
  });

  it("should create a new registry when form is valid", () => {
    component.patientRegistryForm.setValue({
      registryType: "FIRSTDATE",
      observations: "Observación de prueba",
      patientId: "1",
    });

    const mockRegistry: PatientRegistry = {
      id: "fake-id",
      date: new Date().toISOString(),
      registryType: "FIRSTDATE",
      observations: "Observación de prueba",
      patientId: "1",
    };

    mockPatientRegistryService.createRegistry.and.returnValue(of(mockRegistry));

    component.submitForm();

    expect(mockPatientRegistryService.createRegistry).toHaveBeenCalledWith({
      id: "fake-id", // Valor simulado
      date: jasmine.any(String), // Fecha actual simulada
      registryType: "FIRSTDATE",
      observations: "Observación de prueba",
      patientId: "1",
    });
    expect(component.creationMessage).toBe("Registro creado exitosamente");
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith("/patients/detail/1");
  });

  it("should handle error when creating a registry fails", () => {
    component.patientRegistryForm.setValue({
      registryType: "FIRSTDATE",
      observations: "Observación de prueba",
      patientId: "1",
    });

    const errorResponse = new Error("Error al crear el registro");
    mockPatientRegistryService.createRegistry.and.returnValue(
      throwError(() => errorResponse)
    );

    component.submitForm();

    expect(mockPatientRegistryService.createRegistry).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "Error al crear el registro:",
      errorResponse
    );
  });
});
