import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { UserCreateComponent } from "./user-create.component";
import { NutritionistService } from "../../../nutritionists/services/nutritionist.service";
import { PatientService } from "../../../patients/services/patient.service";

describe("UserCreateComponent", () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;
  let nutritionistService: jasmine.SpyObj<NutritionistService>;
  let patientService: jasmine.SpyObj<PatientService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const nutritionistSpy = jasmine.createSpyObj("NutritionistService", [
      "createNutritionist",
    ]);
    const patientSpy = jasmine.createSpyObj("PatientService", [
      "createPatient",
    ]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [UserCreateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: NutritionistService, useValue: nutritionistSpy },
        { provide: PatientService, useValue: patientSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateComponent);
    component = fixture.componentInstance;
    nutritionistService = TestBed.inject(
      NutritionistService
    ) as jasmine.SpyObj<NutritionistService>;
    patientService = TestBed.inject(
      PatientService
    ) as jasmine.SpyObj<PatientService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form", () => {
    expect(component.userForm).toBeDefined();
    expect(component.userForm.controls["personType"]).toBeDefined();
    expect(component.userForm.controls["name"]).toBeDefined();
    expect(component.userForm.controls["surname"]).toBeDefined();
    expect(component.userForm.controls["documentType"]).toBeDefined();
    expect(component.userForm.controls["document"]).toBeDefined();
  });

  it("should submit the form and create a patient", () => {
    component.userForm.setValue({
      personType: "PATIENT",
      name: "Carlos",
      surname: "Pérez",
      documentType: "DNI",
      document: "12345678A",
    });

    const newPatient = {
      id: "1", // Simulate backend response with an id
      personType: "PATIENT",
      persoInfo: {
        name: "Carlos",
        surname: "Pérez",
        documentType: "DNI",
        document: "12345678A",
      },
      appointmentId: [],
      medicalRecordId: [],
    };

    patientService.createPatient.and.returnValue(of(newPatient));

    component.submitForm();

    expect(patientService.createPatient).toHaveBeenCalledWith(
      jasmine.objectContaining({
        personType: "PATIENT",
        persoInfo: {
          name: "Carlos",
          surname: "Pérez",
          documentType: "DNI",
          document: "12345678A",
        },
        appointmentId: [],
        medicalRecordId: [],
      })
    );
    expect(component.creationMessage).toBe("Paciente creado exitosamente");
    expect(router.navigate).toHaveBeenCalledWith(["/patients/list"]);
  });

  it("should submit the form and create a nutritionist", () => {
    component.userForm.setValue({
      personType: "NUTRITIONIST",
      name: "María",
      surname: "González",
      documentType: "DNI",
      document: "87654321B",
    });

    const newNutritionist = {
      id: "1", // Simulate backend response with an id
      personType: "NUTRITIONIST",
      persoInfo: {
        name: "María",
        surname: "González",
        documentType: "DNI",
        document: "87654321B",
      },
      appointmentId: [],
      medicalRecordId: [],
    };

    nutritionistService.createNutritionist.and.returnValue(of(newNutritionist));

    component.submitForm();

    expect(nutritionistService.createNutritionist).toHaveBeenCalledWith(
      jasmine.objectContaining({
        personType: "NUTRITIONIST",
        persoInfo: {
          name: "María",
          surname: "González",
          documentType: "DNI",
          document: "87654321B",
        },
        appointmentId: [],
        medicalRecordId: [],
      })
    );
    expect(component.creationMessage).toBe("Nutricionista creado exitosamente");
    expect(router.navigate).toHaveBeenCalledWith(["/nutritionists/list"]);
  });

  it("should handle errors when creating a patient", () => {
    component.userForm.setValue({
      personType: "PATIENT",
      name: "Carlos",
      surname: "Pérez",
      documentType: "DNI",
      document: "12345678A",
    });

    patientService.createPatient.and.returnValue(
      throwError("Error al crear paciente")
    );

    component.submitForm();

    expect(patientService.createPatient).toHaveBeenCalled();
    expect(component.creationMessage).toBe("");
  });

  it("should handle errors when creating a nutritionist", () => {
    component.userForm.setValue({
      personType: "NUTRITIONIST",
      name: "María",
      surname: "González",
      documentType: "DNI",
      document: "87654321B",
    });

    nutritionistService.createNutritionist.and.returnValue(
      throwError("Error al crear nutricionista")
    );

    component.submitForm();

    expect(nutritionistService.createNutritionist).toHaveBeenCalled();
    expect(component.creationMessage).toBe("");
  });
});
