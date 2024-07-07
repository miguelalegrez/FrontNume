import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { DatePipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppointmentModificationComponent } from "./appointment-modification.component";
import { AppointmentService } from "../../services/appointment.service";
import { NutritionistService } from "../../../nutritionists/services/nutritionist.service";
import { Page } from "../../../../core/models/pageable.model";
import { Nutritionist } from "../../../nutritionists/models/nutritionist.model";

describe("AppointmentModificationComponent", () => {
  let component: AppointmentModificationComponent;
  let fixture: ComponentFixture<AppointmentModificationComponent>;
  let appointmentService: jasmine.SpyObj<AppointmentService>;
  let nutritionistService: jasmine.SpyObj<NutritionistService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const appointmentSpy = jasmine.createSpyObj("AppointmentService", [
      "getAppointmentById",
      "updateAppointment",
    ]);
    const nutritionistSpy = jasmine.createSpyObj("NutritionistService", [
      "getNutritionists",
    ]);

    await TestBed.configureTestingModule({
      declarations: [AppointmentModificationComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        FormBuilder,
        DatePipe,
        { provide: AppointmentService, useValue: appointmentSpy },
        { provide: NutritionistService, useValue: nutritionistSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => "1",
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentModificationComponent);
    component = fixture.componentInstance;
    appointmentService = TestBed.inject(
      AppointmentService
    ) as jasmine.SpyObj<AppointmentService>;
    nutritionistService = TestBed.inject(
      NutritionistService
    ) as jasmine.SpyObj<NutritionistService>;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load appointment details on init", () => {
    const mockAppointment = {
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
    appointmentService.getAppointmentById.and.returnValue(of(mockAppointment));

    component.ngOnInit();

    expect(appointmentService.getAppointmentById.calls.count()).toBe(1);
    expect(component.appointmentForm.value.date).toBe("2024-06-27");
    expect(component.appointmentForm.value.time).toBe("12:00");
    expect(component.appointmentForm.value.patientName).toBe("Ana");
  });

  it("should handle error when loading appointment details", () => {
    const consoleSpy = spyOn(console, "error");
    appointmentService.getAppointmentById.and.returnValue(
      throwError(() => new Error("Error fetching appointment details"))
    );

    component.ngOnInit();

    expect(appointmentService.getAppointmentById.calls.count()).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching appointment details",
      jasmine.any(Error)
    );
  });

  it("should load nutritionists on init", () => {
    const mockNutritionists: Page<Nutritionist> = {
      content: [
        {
          id: "2",
          persoInfo: {
            name: "Carlos",
            surname: "Martínez",
            document: "87654321B",
            documentType: "",
          },
          personType: "",
          appointmentId: [],
          medicalRecordId: [],
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
    nutritionistService.getNutritionists.and.returnValue(of(mockNutritionists));

    component.ngOnInit();

    expect(nutritionistService.getNutritionists.calls.count()).toBe(1);
    expect(component.nutritionists).toEqual(mockNutritionists.content);
  });

  it("should handle error when loading nutritionists", () => {
    const consoleSpy = spyOn(console, "error");
    nutritionistService.getNutritionists.and.returnValue(
      throwError(() => new Error("Error fetching nutritionists"))
    );

    component.ngOnInit();

    expect(nutritionistService.getNutritionists.calls.count()).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching nutritionists",
      jasmine.any(Error)
    );
  });

  it("should update appointment on valid form submission", () => {
    const routerSpy = spyOn(router, "navigate");
    const mockAppointment = {
      date: "2024-06-27T12:00:00",
      nutritionistId: "2",
    };
    appointmentService.updateAppointment.and.returnValue(of(mockAppointment));

    component.appointmentForm.setValue({
      date: "2024-06-27",
      time: "12:00",
      nutritionistId: "2",
      patientId: "1",
      patientName: "Ana",
      patientSurname: "López",
      patientDocument: "12345678A",
      nutritionistName: "Carlos",
      nutritionistSurname: "Martínez",
      nutritionistDocument: "87654321B",
    });

    component.submitForm();

    expect(appointmentService.updateAppointment.calls.count()).toBe(1);
    expect(routerSpy).toHaveBeenCalledWith(["/appointments/detail", "1"]);
  });

  it("should handle error when updating appointment", () => {
    const consoleSpy = spyOn(console, "error");
    appointmentService.updateAppointment.and.returnValue(
      throwError(() => new Error("Error updating appointment"))
    );

    component.appointmentForm.setValue({
      date: "2024-06-27",
      time: "12:00",
      nutritionistId: "2",
      patientId: "1",
      patientName: "Ana",
      patientSurname: "López",
      patientDocument: "12345678A",
      nutritionistName: "Carlos",
      nutritionistSurname: "Martínez",
      nutritionistDocument: "87654321B",
    });

    component.submitForm();

    expect(appointmentService.updateAppointment.calls.count()).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error updating appointment",
      jasmine.any(Error)
    );
  });
});
