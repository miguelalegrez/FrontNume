import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppointmentService } from "../../../services/appointment.service";
import { AppointmentsListComponent } from "./appointments-list.component";
import { of, throwError } from "rxjs";
import { Appointment } from "../../../models/appointment.model";
import { Page } from "../../../../../core/models/pageable.model";

describe("AppointmentsListComponent", () => {
  let component: AppointmentsListComponent;
  let fixture: ComponentFixture<AppointmentsListComponent>;
  let appointmentService: jasmine.SpyObj<AppointmentService>;
  let router: Router;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj("AppointmentService", ["getAppointments"]);

    await TestBed.configureTestingModule({
      declarations: [AppointmentsListComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatPaginatorModule,
        MatTableModule,
        BrowserAnimationsModule,
      ],
      providers: [{ provide: AppointmentService, useValue: spy }, DatePipe],
    }).compileComponents();

    appointmentService = TestBed.inject(
      AppointmentService
    ) as jasmine.SpyObj<AppointmentService>;
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppointmentsListComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch appointments on init", () => {
    const mockAppointments: Appointment[] = [
      {
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
      },
    ];
    const mockPage: Page<Appointment> = {
      content: mockAppointments,
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

    appointmentService.getAppointments.and.returnValue(of(mockPage));
    fixture.detectChanges();

    expect(appointmentService.getAppointments.calls.count()).toBe(1);
    expect(component.dataSource.data).toEqual(mockAppointments);
  });

  it("should apply filter to the data source", () => {
    const mockEvent = { target: { value: "Carlos" } } as unknown as Event;
    component.applyFilter(mockEvent);

    expect(component.dataSource.filter).toBe("carlos");
  });

  it("should navigate to appointment detail on element click", () => {
    const navigateSpy = spyOn(router, "navigateByUrl");
    component.onClickElement("1");

    expect(navigateSpy).toHaveBeenCalledWith("appointments/detail/1");
  });

  it("should handle invalid response structure in getAppointments", () => {
    const consoleSpy = spyOn(console, "error");
    appointmentService.getAppointments.and.returnValue(
      of({} as Page<Appointment>)
    );
    component.getAppointments(0, 20);

    expect(consoleSpy).toHaveBeenCalledWith("Invalid response structure", {});
  });

  it("should handle error in getAppointments", () => {
    const consoleSpy = spyOn(console, "error");
    appointmentService.getAppointments.and.returnValue(
      throwError(() => new Error("Error fetching appointments"))
    );
    component.getAppointments(0, 20);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching appointments",
      jasmine.any(Error)
    );
  });

  it("should handle paginator length assignment correctly", () => {
    const mockAppointments: Appointment[] = [
      {
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
      },
    ];
    const mockPage: Page<Appointment> = {
      content: mockAppointments,
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

    appointmentService.getAppointments.and.returnValue(of(mockPage));
    component.getAppointments(0, 20);

    expect(component.page).toEqual(mockPage);
    expect(component.dataSource.data).toEqual(mockAppointments);
    expect(component.paginator.length).toBe(1);
  });
});
