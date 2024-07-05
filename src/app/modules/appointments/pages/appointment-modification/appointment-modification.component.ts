import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NutritionistService } from "../../../nutritionists/services/nutritionist.service";
import { DatePipe } from "@angular/common";
import { AppointmentService } from "../../services/appointment.service";

@Component({
  selector: "app-appointment-modification",
  templateUrl: "./appointment-modification.component.html",
  styleUrls: ["./appointment-modification.component.css"],
})
export class AppointmentModificationComponent implements OnInit {
  appointmentForm: FormGroup;
  appointmentId: string = "";
  nutritionists: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private nutritionistService: NutritionistService,
    private datePipe: DatePipe
  ) {
    this.appointmentForm = this.fb.group({
      date: ["", Validators.required],
      time: ["", Validators.required],
      nutritionistId: ["", Validators.required],
      patientId: [{ value: "", disabled: true }],
      patientName: [{ value: "", disabled: true }],
      patientSurname: [{ value: "", disabled: true }],
      patientDocument: [{ value: "", disabled: true }],
      nutritionistName: [{ value: "", disabled: true }],
      nutritionistSurname: [{ value: "", disabled: true }],
      nutritionistDocument: [{ value: "", disabled: true }],
    });
  }

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get("id") || "";
    this.loadAppointmentDetails();
    this.loadNutritionists();
  }

  loadAppointmentDetails(): void {
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (appointment) => {
        this.appointmentForm.patchValue({
          date: this.datePipe.transform(appointment.date, "yyyy-MM-dd"),
          time: this.datePipe.transform(appointment.date, "HH:mm"),
          nutritionistId: appointment.nutritionistId,
          patientId: appointment.patientId,
          patientName: appointment.patientName,
          patientSurname: appointment.patientSurname,
          patientDocument: appointment.patientDocument,
          nutritionistName: appointment.nutritionistName,
          nutritionistSurname: appointment.nutritionistSurname,
          nutritionistDocument: appointment.nutritionistDocument,
        });
      },
      error: (err) => {
        console.error("Error fetching appointment details", err);
      },
    });
  }

  loadNutritionists(): void {
    this.nutritionistService.getNutritionists(0, 100).subscribe({
      next: (response) => {
        this.nutritionists = response.content;
      },
      error: (err) => {
        console.error("Error fetching nutritionists", err);
      },
    });
  }

  submitForm(): void {
    if (this.appointmentForm.valid) {
      const formValues = this.appointmentForm.value;
      const updatedAppointment = {
        date: formValues.date + "T" + formValues.time,
        nutritionistId: formValues.nutritionistId,
      };

      this.appointmentService
        .updateAppointment(this.appointmentId, updatedAppointment)
        .subscribe({
          next: () => {
            console.log("Appointment updated successfully");
            this.router.navigate(["/appointments/detail", this.appointmentId]);
          },
          error: (err) => {
            console.error("Error updating appointment", err);
          },
        });
    }
  }
}
