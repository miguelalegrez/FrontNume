import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { DatePipe } from "@angular/common";
import { Page } from "../../../../core/models/pageable.model";
import { PatientRegistry } from "../../../patient-registry/models/patientregistry";
import { PatientRegistryService } from "../../../patient-registry/services/patient-registry.service";
import { Patient } from "../../models/patient.model";
import { PatientService } from "../../services/patient.service";
import { PatientDetailComponent } from "./patient-detail.component";

describe("PatientDetailComponent", () => {
  let component: PatientDetailComponent;
  let fixture: ComponentFixture<PatientDetailComponent>;
  let patientService: jasmine.SpyObj<PatientService>;
  let registryService: jasmine.SpyObj<PatientRegistryService>;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    const patientSpy = jasmine.createSpyObj("PatientService", [
      "getPatients",
      "getPatientById",
      "getAppointmentsByPersonId",
      "deletePatient",
    ]);
    const registrySpy = jasmine.createSpyObj("PatientRegistryService", [
      "getRecordsByPersonId",
    ]);

    await TestBed.configureTestingModule({
      declarations: [PatientDetailComponent],
      providers: [
        DatePipe,
        { provide: PatientService, useValue: patientSpy },
        { provide: PatientRegistryService, useValue: registrySpy },
        { provide: ActivatedRoute, useValue: { params: of({ id: "123" }) } },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy("navigate") },
        },
      ],
      imports: [MatTableModule, MatPaginatorModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDetailComponent);
    component = fixture.componentInstance;
    patientService = TestBed.inject(
      PatientService
    ) as jasmine.SpyObj<PatientService>;
    registryService = TestBed.inject(
      PatientRegistryService
    ) as jasmine.SpyObj<PatientRegistryService>;
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize and load patient details", () => {
    const patient: Patient = {
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
    expect(component.patient).toEqual(patient);
  });

  it("should load patient appointments", () => {
    const appointments = [
      {
        id: "1",
        date: "2024-06-25T10:00:00",
        nutritionistName: "María",
        nutritionistSurname: "González",
      },
    ];

    patientService.getAppointmentsByPersonId.and.returnValue(
      of({ content: appointments, totalElements: 1 } as Page<any>)
    );

    component.getAppointmentsByPersonId("123");

    expect(patientService.getAppointmentsByPersonId).toHaveBeenCalledWith(
      "123"
    );
    expect(component.appointmentsDataSource.data).toEqual(appointments);
  });

  it("should load patient registries", () => {
    const registries = [
      {
        id: "1",
        date: "2024-06-25T10:00:00",
        registryType: "FIRSTDATE",
        observations: "Healthy",
        patientId: "123",
      },
    ];

    registryService.getRecordsByPersonId.and.returnValue(
      of({ content: registries, totalElements: 1 } as Page<PatientRegistry>)
    );

    component.getPatientRegistries("123");

    expect(registryService.getRecordsByPersonId).toHaveBeenCalledWith("123");
    expect(component.registryDataSource.data).toEqual(registries);
  });

  it("should delete patient and navigate to patient list", () => {
    patientService.deletePatient.and.returnValue(of({}));

    component.deletePatient();

    expect(patientService.deletePatient).toHaveBeenCalledWith("123");
    expect(router.navigate).toHaveBeenCalledWith(["/patients/list"]);
  });

  it("should apply filter to the data source", () => {
    const event = { target: { value: "Carlos" } } as any;

    component.applyFilter(event);

    expect(component.dataSource.filter).toBe("carlos");
  });

  it("should translate registry type", () => {
    expect(component.translateRegistryType("FIRSTDATE")).toBe("Primera Cita");
    expect(component.translateRegistryType("REVISION")).toBe("Revisión");
    expect(component.translateRegistryType("OTHER")).toBe("OTHER");
  });
});
