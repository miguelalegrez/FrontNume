import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { PatientService } from "../../services/patient.service";
import { PatientModificationComponent } from "./patient-modification.component";

describe("PatientModificationComponent", () => {
  let component: PatientModificationComponent;
  let fixture: ComponentFixture<PatientModificationComponent>;
  let patientService: jasmine.SpyObj<PatientService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const patientSpy = jasmine.createSpyObj("PatientService", [
      "getPatientById",
      "updatePatient",
    ]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    const activatedRouteStub = { snapshot: { paramMap: { get: () => "123" } } };

    await TestBed.configureTestingModule({
      declarations: [PatientModificationComponent],
      providers: [
        { provide: PatientService, useValue: patientSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientModificationComponent);
    component = fixture.componentInstance;
    patientService = TestBed.inject(
      PatientService
    ) as jasmine.SpyObj<PatientService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize and load patient data", () => {
    const patient = {
      id: "123",
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

    patientService.getPatientById.and.returnValue(of(patient));
    component.ngOnInit();

    expect(patientService.getPatientById).toHaveBeenCalledWith("123");
    expect(component.modifyForm.value).toEqual({
      name: patient.persoInfo.name,
      surname: patient.persoInfo.surname,
      documentType: patient.persoInfo.documentType,
      document: patient.persoInfo.document,
    });
  });

  it("should submit form and navigate on successful update", () => {
    const updatedPatient = {
      id: "123",
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

    patientService.updatePatient.and.returnValue(of(updatedPatient));
    component.modifyForm.setValue(updatedPatient.persoInfo);
    component.submitForm();

    expect(patientService.updatePatient).toHaveBeenCalledWith(
      "123",
      updatedPatient
    );
    expect(router.navigate).toHaveBeenCalledWith(["/patients/detail", "123"]);
  });

  it("should not submit form if invalid", () => {
    component.modifyForm.setValue({
      name: "",
      surname: "Pérez",
      documentType: "DNI",
      document: "12345678A",
    });
    component.submitForm();

    expect(patientService.updatePatient).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
