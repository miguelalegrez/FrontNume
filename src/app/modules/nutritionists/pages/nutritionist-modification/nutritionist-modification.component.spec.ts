import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { of, throwError } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

import { NutritionistModificationComponent } from "./nutritionist-modification.component";
import { NutritionistService } from "../../services/nutritionist.service";
import { Nutritionist } from "../../models/nutritionist.model";

describe("NutritionistModificationComponent", () => {
  let component: NutritionistModificationComponent;
  let fixture: ComponentFixture<NutritionistModificationComponent>;
  let nutritionistService: NutritionistService;
  let router: Router;

  const mockNutritionist: Nutritionist = {
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NutritionistModificationComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        NutritionistService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => "1" } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NutritionistModificationComponent);
    component = fixture.componentInstance;
    nutritionistService = TestBed.inject(NutritionistService);
    router = TestBed.inject(Router);

    spyOn(nutritionistService, "getNutritionistById").and.returnValue(
      of(mockNutritionist)
    );
    spyOn(nutritionistService, "updateNutritionist").and.returnValue(
      of(mockNutritionist)
    );
    spyOn(router, "navigate").and.stub();

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load nutritionist data on init", () => {
    component.ngOnInit();
    expect(nutritionistService.getNutritionistById).toHaveBeenCalledWith("1");
    expect(component.modifyForm.value).toEqual({
      name: mockNutritionist.persoInfo.name,
      surname: mockNutritionist.persoInfo.surname,
      document: mockNutritionist.persoInfo.document,
    });
  });

  it("should submit valid form", () => {
    component.modifyForm.setValue({
      name: "Carlos",
      surname: "García",
      document: "12345678A",
    });

    component.submitForm();

    expect(nutritionistService.updateNutritionist).toHaveBeenCalledWith("1", {
      persoInfo: {
        name: "Carlos",
        surname: "García",
        document: "12345678A",
        documentType: "DNI", // This should be dynamically set based on your requirements
      },
    });
    expect(router.navigate).toHaveBeenCalledWith(["/nutritionists/detail/1"]);
  });

  it("should not submit invalid form", () => {
    component.modifyForm.setValue({
      name: "",
      surname: "García",
      document: "12345678A",
    });

    component.submitForm();

    expect(nutritionistService.updateNutritionist).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("should handle error when fetching nutritionist data", () => {
    spyOn(console, "error");
    (nutritionistService.getNutritionistById as jasmine.Spy).and.returnValue(
      throwError(() => new Error("Error fetching nutritionist"))
    );
    component.loadNutritionistData("1");
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching nutritionist:",
      jasmine.any(Error)
    );
  });

  it("should handle error when updating nutritionist data", () => {
    spyOn(console, "error");
    (nutritionistService.updateNutritionist as jasmine.Spy).and.returnValue(
      throwError(() => new Error("Error updating nutritionist"))
    );
    component.modifyForm.setValue({
      name: "Carlos",
      surname: "García",
      document: "12345678A",
    });
    component.submitForm();
    expect(console.error).toHaveBeenCalledWith(
      "Error updating nutritionist:",
      jasmine.any(Error)
    );
  });
});
