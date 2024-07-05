import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientRegistryService } from "../../services/patient-registry.service";

@Component({
  selector: "app-patient-registry-create",
  templateUrl: "./patient-registry-create.component.html",
  styleUrls: ["./patient-registry-create.component.css"],
})
export class PatientRegistryCreateComponent implements OnInit {
  patientRegistryForm: FormGroup;
  creationMessage: string = "";
  protected id: string = "";

  // Opciones para el desplegable
  registroTipos = [
    { value: "FIRSTDATE", label: "Primera Cita" },
    { value: "REVISION", label: "Revisión" },
  ];

  constructor(
    private _registryService: PatientRegistryService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.patientRegistryForm = this._fb.group({
      registryType: [this.registroTipos[0].value, Validators.required], // Valor por defecto
      observations: ["", Validators.required],
      patientId: [{ value: "", disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get("id")!;
    this.patientRegistryForm.patchValue({ patientId: this.id });
  }

  submitForm(): void {
    if (this.patientRegistryForm.valid) {
      const newRegistry = {
        id: "fake-id", // Valor simulado
        date: new Date().toISOString(), // Valor simulado
        ...this.patientRegistryForm.value,
        patientId: this.id,
      };

      this._registryService.createRegistry(newRegistry).subscribe({
        next: () => {
          this.creationMessage = "Registro creado exitosamente";
          this.patientRegistryForm.reset();
          this._router.navigateByUrl(
            `/patients/detail/${newRegistry.patientId}`
          );
        },
        error: (error) => {
          console.error("Error al crear el registro:", error);
        },
      });
    } else {
      console.error("Formulario inválido");
    }
  }
}
