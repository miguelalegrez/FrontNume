import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { AppointmentService } from "../../../services/appointment.service";
import { AppointmentsDetailComponent } from "./appointments-detail.component";
import { Appointment } from "../../../models/appointment.model";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

describe("AppointmentsDetailComponent", () => {
  let component: AppointmentsDetailComponent;
  let fixture: ComponentFixture<AppointmentsDetailComponent>;
  let appointmentService: jasmine.SpyObj<AppointmentService>;
  let router: Router;
  const mockActivatedRoute = { params: of({ id: "1" }) };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj("AppointmentService", [
      "getAppointmentById",
      "deleteAppointment",
    ]);

    await TestBed.configureTestingModule({
      declarations: [AppointmentsDetailComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AppointmentService, useValue: spy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    appointmentService = TestBed.inject(
      AppointmentService
    ) as jasmine.SpyObj<AppointmentService>;
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppointmentsDetailComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  //Prueba de ngOnInit

  it("should fetch appointment on init", () => {
    const mockAppointment: Appointment = {
      id: "1",
      date: "2024-06-27T12:50:26.516",
      patientId: "1",
      patientName: "Carlos",
      patientSurname: "Pérez",
      patientDocument: "12345678A",
      nutritionistId: "10",
      nutritionistName: "Laura",
      nutritionistSurname: "Martínez",
      nutritionistDocument: "98765432X",
    };

    appointmentService.getAppointmentById.and.returnValue(of(mockAppointment));
    component.ngOnInit();

    expect(appointmentService.getAppointmentById.calls.count()).toBe(1);
    expect(component.appointment).toEqual(mockAppointment);
  });

  // Prueba de deleteAppointment

  it("should delete appointment and navigate to list on success", () => {
    spyOn(router, "navigate");
    appointmentService.deleteAppointment.and.returnValue(of(null));

    component.deleteAppointment();

    expect(appointmentService.deleteAppointment.calls.count()).toBe(1);
    expect(router.navigate).toHaveBeenCalledWith(["/appointments/list"]);
  });

  it("should log error when deleteAppointment fails", () => {
    const consoleSpy = spyOn(console, "error");
    appointmentService.deleteAppointment.and.returnValue(
      of({ error: "Error" })
    );

    component.deleteAppointment();

    expect(consoleSpy).toHaveBeenCalledWith("Error eliminating appointment", {
      error: "Error",
    });
  });
});
