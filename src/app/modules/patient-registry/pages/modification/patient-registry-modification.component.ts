import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PatientRegistry } from "../../models/patientregistry";
import { PatientRegistryService } from "../../services/patient-registry.service";
import { PatientService } from "../../../patients/services/patient.service";

@Component({
  selector: "app-patient-registry-modification",
  templateUrl: "./patient-registry-modification.component.html",
  styleUrl: "./patient-registry-modification.component.css",
})
export class PatientRegistryModificationComponent {
  modifyForm: FormGroup;
  id: string = "";
  patientId: string = ""; // Añadido para almacenar el patientId
  registry: PatientRegistry | null = null;

  constructor(
    private _registryService: PatientRegistryService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.modifyForm = this._fb.group({
      registryType: ["", Validators.required],
      observations: ["", Validators.required],
      patientId: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params["id"];
      this.getRegistryById(this.id);
    });
  }

  getRegistryById(id: string): void {
    this._registryService.getRecordById(id).subscribe({
      next: (value) => {
        this.registry = value;
        this.patientId = value.patientId; // Almacenar el patientId
        this.modifyForm.patchValue({
          registryType: this.translateRegistryType(value.registryType),
          observations: value.observations,
          patientId: value.patientId,
        });
      },
      error: (err) => {
        console.error("Error fetching registry", err);
      },
    });
  }

  submitForm(): void {
    if (this.modifyForm.valid) {
      const updatedRegistry: PatientRegistry = {
        ...this.registry,
        ...this.modifyForm.value,
        registryType:
          this.modifyForm.value.registryType === "Primera Cita"
            ? "FIRSTDATE"
            : "REVISION",
      };

      this._registryService.updateRegistry(this.id, updatedRegistry).subscribe({
        next: () => {
          console.log("Registry updated successfully");
          this._router.navigateByUrl(`/patients/detail/${this.patientId}`);
        },
        error: (err) => {
          console.error("Error updating registry", err);
        },
      });
    } else {
      console.error("Formulario inválido");
    }
  }

  translateRegistryType(registryType: string): string {
    switch (registryType) {
      case "FIRSTDATE":
        return "Primera Cita";
      case "REVISION":
        return "Revisión";
      default:
        return registryType;
    }
  }
}
