import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
} from "rxjs";
import { Patient } from "../../../patients/models/patient.model";
import { Nutritionist } from "../../../nutritionists/models/nutritionist.model";
import { NutritionistService } from "../../../nutritionists/services/nutritionist.service";
import { PatientService } from "../../../patients/services/patient.service";
import { AppointmentService } from "../../services/appointment.service";
import { MatSnackBar } from "@angular/material/snack-bar"; // Importa MatSnackBar
import moment from "moment";

@Component({
  selector: "app-appointment-create",
  templateUrl: "./appointment-create.component.html",
  styleUrls: ["./appointment-create.component.css"],
})
export class AppointmentCreateComponent implements OnInit {
  appointmentForm: FormGroup;
  creationMessage: string = "";
  nutritionists: Nutritionist[] = [];
  searchControl = new FormControl();
  filteredPatients!: Observable<Patient[]>; // Corrected to match the type of the stream

  constructor(
    private fb: FormBuilder,
    private _appointmentService: AppointmentService,
    private _nutritionistService: NutritionistService,
    private _patientService: PatientService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.appointmentForm = this.fb.group({
      date: ["", Validators.required],
      time: ["", Validators.required],
      patientId: ["", Validators.required], // Holds the patient's ID for internal use
      patientName: [{ value: "", disabled: true }, Validators.required], // Displays the patient's name
      nutritionistId: ["", Validators.required],
      nutritionistName: [{ value: "", disabled: true }, Validators.required],
      nutritionistSurname: [{ value: "", disabled: true }, Validators.required],
      nutritionistDocument: [
        { value: "", disabled: true },
        Validators.required,
      ],
    });
  }

  ngOnInit(): void {
    this.loadNutritionists();
    this.setupPatientSearch();
  }

  loadNutritionists() {
    this._nutritionistService.getNutritionists(0, 20).subscribe({
      next: (response) => {
        this.nutritionists = response.content;
      },
      error: (error) => console.error("Error fetching nutritionists:", error),
    });
  }

  setupPatientSearch() {
    this.filteredPatients = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((value) => (value ? value.split(" ") : ["", ""])), // Dividir el input por espacios
      switchMap(([name, surname]) => {
        name = name || ""; // Asigna el nombre o un string vacío si no está definido
        surname = surname || ""; // Asigna el apellido o un string vacío si no está definido
        return this._patientService
          .searchPatientsByNameAndSurname(name, surname, 0, 10)
          .pipe(map((page) => page.content));
      })
    );
  }

  onPatientSelected(patient: Patient) {
    this.appointmentForm.patchValue({
      patientId: patient.id,
      patientName: `${patient.persoInfo.name} ${patient.persoInfo.surname}`,
    });
    this.searchControl.setValue(
      `${patient.persoInfo.name} ${patient.persoInfo.surname}`
    );
  }

  onNutritionistSelected(event: any) {
    const selectedNutritionist = this.nutritionists.find(
      (n) => n.id === event.value
    );
    if (selectedNutritionist) {
      this.appointmentForm.patchValue({
        nutritionistId: selectedNutritionist.id,
        nutritionistName: selectedNutritionist.persoInfo.name,
        nutritionistSurname: selectedNutritionist.persoInfo.surname,
        nutritionistDocument: selectedNutritionist.persoInfo.document,
      });
    }
  }

  submitForm() {
    if (this.appointmentForm.valid) {
      const formValues = this.appointmentForm.value;
      const combinedDateTime = moment(formValues.date)
        .set({
          hour: moment(formValues.time, "HH:mm").hour(),
          minute: moment(formValues.time, "HH:mm").minute(),
        })
        .toISOString();

      const newAppointment = {
        date: combinedDateTime,
        patientId: formValues.patientId,
        nutritionistId: formValues.nutritionistId,
      };

      this._appointmentService.createAppointment(newAppointment).subscribe({
        next: () => {
          this.showSnackBar("Cita creada exitosamente", "Exito");
          this.resetForm();
          setTimeout(() => this._router.navigate(["/appointments/list"]), 2000);
        },
        error: (error) => {
          console.error("Error al crear la cita:", error);
          this.showSnackBar("Error al crear la cita", "Error"); // Mensaje de error con Snackbar
        },
      });
    } else {
      console.error("Error al crear la cita: Formulario inválido");
      this.showSnackBar(
        "Formulario inválido. Revise los datos ingresados.",
        "Error"
      ); // Mensaje de formulario inválido
    }
  }

  private showSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
    });
  }

  private resetForm() {
    this.appointmentForm.reset();
    Object.keys(this.appointmentForm.controls).forEach((key) => {
      this.appointmentForm.get(key)?.setErrors(null);
      this.appointmentForm.get(key)?.markAsPristine();
      this.appointmentForm.get(key)?.markAsUntouched();
    });
    this.searchControl.reset(); // Reset the search control for patients
  }
}
