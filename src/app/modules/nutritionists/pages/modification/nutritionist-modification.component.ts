import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Nutritionist } from "../../models/nutritionist.model";
import { NutritionistService } from "../../services/nutritionist.service";

@Component({
  selector: "app-nutritionist-modification",
  templateUrl: "./nutritionist-modification.component.html",
  styleUrl: "./nutritionist-modification.component.css",
})
export class NutritionistModificationComponent {
  modifyForm: FormGroup;
  id: string = "";

  constructor(
    private _nutritionistService: NutritionistService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.modifyForm = this._fb.group({
      name: ["", Validators.required],
      surname: ["", Validators.required],
      document: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get("id")!;
    this.loadNutritionistData(this.id);
  }

  loadNutritionistData(id: string): void {
    this._nutritionistService.getNutritionistById(id).subscribe({
      next: (nutritionist: Nutritionist) => {
        this.modifyForm.patchValue({
          name: nutritionist.persoInfo.name,
          surname: nutritionist.persoInfo.surname,
          document: nutritionist.persoInfo.document,
        });
      },
      error: (err) => {
        console.error("Error fetching nutritionist:", err);
      },
    });
  }

  submitForm(): void {
    if (this.modifyForm.valid) {
      const updatedNutritionist = {
        ...this.modifyForm.value,
        id: this.id,
      };

      this._nutritionistService
        .updateNutritionist(this.id, updatedNutritionist)
        .subscribe({
          next: () => {
            console.log("Nutritionist updated successfully");
            this._router.navigate(["/nutritionists/detail/" + this.id]);
          },
          error: (err) => {
            console.error("Error updating nutritionist:", err);
          },
        });
    } else {
      console.error("Formulario inválido");
    }
  }
}
