import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientService } from "../../services/patient.service";

@Component({
  selector: "app-patient-modification",
  templateUrl: "./patient-modification.component.html",
  styleUrls: ["./patient-modification.component.css"],
})
export class PatientModificationComponent implements OnInit {
  public modifyForm: FormGroup;
  public id: string = "";

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _patientService: PatientService
  ) {
    this.modifyForm = this._fb.group({
      name: ["", Validators.required],
      surname: ["", Validators.required],
      document: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get("id")!;
    this.getPatientById(this.id);
  }

  public getPatientById(id: string): void {
    this._patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.modifyForm.patchValue({
          name: patient.persoInfo.name,
          surname: patient.persoInfo.surname,
          document: patient.persoInfo.document,
        });
      },
      error: (err) => {
        console.error("Error fetching patient", err);
      },
    });
  }

  public submitForm(): void {
    if (this.modifyForm.valid) {
      const updatedPatient = {
        persoInfo: {
          ...this.modifyForm.value,
        },
      };

      this._patientService.updatePatient(this.id, updatedPatient).subscribe({
        next: () => {
          this._router.navigate(["/patients/detail", this.id]);
        },
        error: (err) => {
          console.error("Error updating patient", err);
        },
      });
    } else {
      console.error("Formulario inválido");
    }
  }
}
