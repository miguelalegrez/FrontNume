import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of, throwError } from "rxjs";
import { AppointmentCreateComponent } from "./appointment-create.component";
import { NutritionistService } from "../../../nutritionists/services/nutritionist.service";
import { PatientService } from "../../../patients/services/patient.service";
import { AppointmentService } from "../../services/appointment.service";
import { Page } from "../../../../core/models/pageable.model";
import { Nutritionist } from "../../../nutritionists/models/nutritionist.model";
import { Patient } from "../../../patients/models/patient.model";

describe("AppointmentCreateComponent", () => {
  let component: AppointmentCreateComponent;
  let fixture: ComponentFixture<AppointmentCreateComponent>;
  let nutritionistService: jasmine.SpyObj<NutritionistService>;
  let patientService: jasmine.SpyObj<PatientService>;
  let appointmentService: jasmine.SpyObj<AppointmentService>;
  let router: Router;

  beforeEach(async () => {
    const nutritionistSpy = jasmine.createSpyObj("NutritionistService", [
      "getNutritionists",
    ]);
    const patientSpy = jasmine.createSpyObj("PatientService", [
      "getPatientById",
    ]);
    const appointmentSpy = jasmine.createSpyObj("AppointmentService", [
      "createAppointment",
    ]);

    await TestBed.configureTestingModule({
      declarations: [AppointmentCreateComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        { provide: NutritionistService, useValue: nutritionistSpy },
        { provide: PatientService, useValue: patientSpy },
        { provide: AppointmentService, useValue: appointmentSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentCreateComponent);
    component = fixture.componentInstance;
    nutritionistService = TestBed.inject(
      NutritionistService
    ) as jasmine.SpyObj<NutritionistService>;
    patientService = TestBed.inject(
      PatientService
    ) as jasmine.SpyObj<PatientService>;
    appointmentService = TestBed.inject(
      AppointmentService
    ) as jasmine.SpyObj<AppointmentService>;
    router = TestBed.inject(Router);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load nutritionists on init", () => {
    const mockNutritionists: Nutritionist[] = [
      {
        id: "1",
        persoInfo: {
          name: "Carlos",
          surname: "Martínez",
          document: "",
          documentType: "",
        },
        personType: "NUTRITIONIST",
        appointmentId: [],
        medicalRecordId: [],
      },
    ];
    const mockPage: Page<Nutritionist> = {
      content: mockNutritionists,
      totalElements: 1,
      totalPages: 1,
      size: 10,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      first: true,
      last: true,
      numberOfElements: 1,
      empty: false,
    };

    nutritionistService.getNutritionists.and.returnValue(of(mockPage));
    fixture.detectChanges();

    expect(nutritionistService.getNutritionists.calls.count()).toBe(1);
    expect(component.nutritionists).toEqual(mockNutritionists);
  });

  it("should search patient by ID", () => {
    const mockPatient: Patient = {
      id: "1",
      persoInfo: {
        name: "Ana",
        surname: "López",
        document: "12345678A",
        documentType: "DNI",
      },
      personType: "PATIENT",
      appointmentId: [],
      medicalRecordId: [],
    };
    component.appointmentForm.get("patientIdInput")?.setValue("1");
    patientService.getPatientById.and.returnValue(of(mockPatient));

    component.searchPatientById();

    expect(patientService.getPatientById.calls.count()).toBe(1);
    expect(component.patient).toEqual(mockPatient);
    expect(component.appointmentForm.get("patientName")?.value).toBe("Ana");
  });

  it("should handle patient search error", () => {
    const consoleSpy = spyOn(console, "error");
    component.appointmentForm.get("patientIdInput")?.setValue("1");
    patientService.getPatientById.and.returnValue(
      throwError(() => new Error("Error al obtener el paciente"))
    );

    component.searchPatientById();

    expect(patientService.getPatientById.calls.count()).toBe(1);
    expect(component.patient).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error al obtener el paciente:",
      jasmine.any(Error)
    );
  });

  it("should set nutritionist details when selected", () => {
    const mockNutritionist: Nutritionist = {
      id: "1",
      persoInfo: {
        name: "Carlos",
        surname: "Martínez",
        document: "87654321B",
        documentType: "",
      },
      personType: "NUTRITIONIST",
      appointmentId: [],
      medicalRecordId: [],
    };
    component.nutritionists = [mockNutritionist];

    component.onNutritionistSelected({ value: "1" });

    expect(component.appointmentForm.get("nutritionistName")?.value).toBe(
      "Carlos"
    );
    expect(component.appointmentForm.get("nutritionistSurname")?.value).toBe(
      "Martínez"
    );
  });

  it("should create appointment on valid form submission", () => {
    spyOn(router, "navigate");
    component.appointmentForm.setValue({
      date: "2024-06-27",
      time: "12:00",
      patientIdInput: "1",
      patientId: "1",
      patientName: "Ana",
      patientSurname: "López",
      patientDocument: "12345678A",
      nutritionistId: "1",
      nutritionistName: "Carlos",
      nutritionistSurname: "Martínez",
      nutritionistDocument: "87654321B",
    });

    appointmentService.createAppointment.and.returnValue(of({}));

    component.submitForm();

    expect(appointmentService.createAppointment.calls.count()).toBe(1);
    expect(router.navigate).toHaveBeenCalledWith(["/appointments/list"]);
  });

  it("should handle appointment creation error", () => {
    const consoleSpy = spyOn(console, "error");
    component.appointmentForm.setValue({
      date: "2024-06-27",
      time: "12:00",
      patientIdInput: "1",
      patientId: "1",
      patientName: "Ana",
      patientSurname: "López",
      patientDocument: "12345678A",
      nutritionistId: "1",
      nutritionistName: "Carlos",
      nutritionistSurname: "Martínez",
      nutritionistDocument: "87654321B",
    });

    appointmentService.createAppointment.and.returnValue(
      throwError(() => new Error("Error al crear la cita"))
    );

    component.submitForm();

    expect(appointmentService.createAppointment.calls.count()).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error al crear la cita:",
      jasmine.any(Error)
    );
  });
});
