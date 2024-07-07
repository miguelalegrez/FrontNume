import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { Page } from "../../../../core/models/pageable.model";
import { Patient } from "../../models/patient.model";
import { PatientService } from "../../services/patient.service";
import { PatientListComponent } from "./patient-list.component";

describe("PatientListComponent", () => {
  let component: PatientListComponent;
  let fixture: ComponentFixture<PatientListComponent>;
  let patientService: jasmine.SpyObj<PatientService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const patientSpy = jasmine.createSpyObj("PatientService", ["getPatients"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    await TestBed.configureTestingModule({
      declarations: [PatientListComponent],
      providers: [
        { provide: PatientService, useValue: patientSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [MatTableModule, MatPaginatorModule, MatSortModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientListComponent);
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

  it("should initialize and load patients", () => {
    const patients: Patient[] = [
      {
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
      },
      {
        id: "124",
        persoInfo: {
          name: "Ana",
          surname: "García",
          documentType: "DNI",
          document: "87654321B",
        },
        personType: "PATIENT",
        appointmentId: [],
        medicalRecordId: [],
      },
    ];

    const page: Page<Patient> = {
      content: patients,
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true,
      size: 2,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      pageable: {
        pageNumber: 0,
        pageSize: 2,
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 0,
        unpaged: false,
        paged: true,
      },
      numberOfElements: 2,
      empty: false,
    };

    patientService.getPatients.and.returnValue(of(page));
    component.ngOnInit();

    expect(patientService.getPatients).toHaveBeenCalledWith(0, 20);
    expect(component.dataSource.data).toEqual(patients);
    expect(component.page).toEqual(page);
  });

  it("should navigate to patient detail on row click", () => {
    const id = "123";
    component.onClickElement(id);
    expect(router.navigateByUrl).toHaveBeenCalledWith("patients/detail/" + id);
  });

  it("should apply filter to table data", () => {
    const patients: Patient[] = [
      {
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
      },
      {
        id: "124",
        persoInfo: {
          name: "Ana",
          surname: "García",
          documentType: "DNI",
          document: "87654321B",
        },
        personType: "PATIENT",
        appointmentId: [],
        medicalRecordId: [],
      },
    ];

    component.dataSource = new MatTableDataSource(patients);
    fixture.detectChanges();

    component.applyFilter({ target: { value: "Carlos" } } as unknown as Event);

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].persoInfo.name).toBe("Carlos");
  });
});
