import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NutritionistService } from "../../../services/nutritionist.service";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Page } from "../../../../../core/models/pageable.model";
import { NutritionistDetailComponent } from "../../nutri-detail/nutritionist-detail/nutritionist-detail.component";

describe("NutritionistDetailComponent", () => {
  let component: NutritionistDetailComponent;
  let fixture: ComponentFixture<NutritionistDetailComponent>;
  let nutritionistService: NutritionistService;

  const mockNutritionist = {
    id: "1",
    persoInfo: {
      name: "Carlos",
      surname: "García",
      documentType: "DNI",
      document: "12345678A",
    },
    personType: "NUTRITIONIST",
    appointmentId: [],
    medicalRecordId: [],
  };

  const mockAppointments: Page<any> = {
    content: [
      {
        id: "1",
        date: "2024-06-27T12:00:00",
        patientName: "Ana",
        patientSurname: "López",
      },
    ],
    totalElements: 1,
    totalPages: 1,
    size: 1,
    number: 0,
    numberOfElements: 1,
    first: true,
    last: true,
    empty: false,
    sort: {
      sorted: false,
      unsorted: true,
      empty: true,
    },
    pageable: {
      pageNumber: 0,
      pageSize: 1,
      offset: 0,
      paged: true,
      unpaged: false,
      sort: {
        sorted: false,
        unsorted: true,
        empty: true,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NutritionistDetailComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
      ],
      providers: [
        NutritionistService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: "1" }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NutritionistDetailComponent);
    component = fixture.componentInstance;
    nutritionistService = TestBed.inject(NutritionistService);

    spyOn(nutritionistService, "getNutritionistById").and.returnValue(
      of(mockNutritionist)
    );
    spyOn(nutritionistService, "getAppointmentsByPersonId").and.returnValue(
      of(mockAppointments)
    );
    spyOn(nutritionistService, "deleteNutritionist").and.returnValue(of(null));

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch nutritionist details on init", () => {
    component.ngOnInit();
    expect(nutritionistService.getNutritionistById).toHaveBeenCalledWith("1");
    expect(component.nutritionist).toEqual(mockNutritionist);
  });

  it("should fetch appointments for the nutritionist", () => {
    component.ngOnInit();
    expect(nutritionistService.getAppointmentsByPersonId).toHaveBeenCalledWith(
      "1"
    );
    expect(component.appointmentsDataSource.data).toEqual(
      mockAppointments.content
    );
  });

  it("should delete the nutritionist", () => {
    component.deleteNutritionist();
    expect(nutritionistService.deleteNutritionist).toHaveBeenCalledWith("1");
  });
});
