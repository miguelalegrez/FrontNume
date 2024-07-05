import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NutritionistService } from "../../../nutritionists/services/nutritionist.service";
import { PatientService } from "../../../patients/services/patient.service";

@Component({
  selector: "app-user-create",
  templateUrl: "./user-create.component.html",
  styleUrls: ["./user-create.component.css"],
})
export class UserCreateComponent implements OnInit {
  userForm!: FormGroup;
  creationMessage: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private _nutritionistService: NutritionistService,
    private _patientService: PatientService,
    private _router: Router,
    private _snackBar: MatSnackBar // Inyecta MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      personType: ["", Validators.required],
      name: ["", Validators.required],
      surname: ["", Validators.required],
      documentType: ["", Validators.required],
      document: [
        "",
        [Validators.required, Validators.pattern(/^\d{8}[a-zA-Z]$/)], //Expresión regular para validar 8 numeros y 1 caracter al final.
      ],
    });
  }

  submitForm() {
    if (this.userForm.valid) {
      const formValues = this.userForm.value;
      const newUser = {
        personType: formValues.personType,
        persoInfo: {
          name: formValues.name,
          surname: formValues.surname,
          documentType: formValues.documentType,
          document: formValues.document,
        },
        appointmentId: [],
        medicalRecordId: [],
      };
      if (newUser.personType === "PATIENT") {
        this.createPatient(newUser);
      } else if (newUser.personType === "NUTRITIONIST") {
        this.createNutritionist(newUser);
      }
    }
  }

  private createPatient(newPatient: any) {
    this._patientService.createPatient(newPatient).subscribe({
      next: () => {
        this.showSnackBar("Paciente creado exitosamente", "Exito");
        this.resetForm();
        setTimeout(() => {
          this._router.navigate(["/patients/list"]);
        }, 2000);
      },
      error: (error) => {
        console.error("Error al crear paciente:", error);
        this.showSnackBar("Error al crear paciente", "Error");
      },
    });
  }

  private createNutritionist(newNutritionist: any) {
    this._nutritionistService.createNutritionist(newNutritionist).subscribe({
      next: () => {
        this.showSnackBar("Nutricionista creado exitosamente", "Exito");
        this.resetForm();
        setTimeout(() => {
          this._router.navigate(["/nutritionists/list"]);
        }, 2000);
      },
      error: (error) => {
        console.error("Error al crear nutricionista:", error);
        this.showSnackBar("Error al crear nutricionista", "Error");
      },
    });
  }

  private showSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
    });
  }

  private resetForm() {
    this.userForm.reset();
    Object.keys(this.userForm.controls).forEach((key) => {
      this.userForm.get(key)?.setErrors(null);
      this.userForm.get(key)?.markAsPristine();
      this.userForm.get(key)?.markAsUntouched();
    });
  }
}
