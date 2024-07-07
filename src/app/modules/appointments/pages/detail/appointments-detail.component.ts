import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Appointment } from "../../models/appointment.model";
import { AppointmentService } from "../../services/appointment.service";

@Component({
  selector: "app-appointments-detail",
  templateUrl: "./appointments-detail.component.html",
  styleUrls: ["./appointments-detail.component.css"],
})
export class AppointmentsDetailComponent implements OnInit {
  protected id: string = "";
  public appointment: Appointment = {
    id: "",
    date: "",
    patientId: "",
    patientName: "",
    patientSurname: "",
    patientDocument: "",
    nutritionistId: "",
    nutritionistName: "",
    nutritionistSurname: "",
    nutritionistDocument: "",
  };

  constructor(
    private _appointmentService: AppointmentService,
    private _router: ActivatedRoute,
    private _routerNav: Router
  ) {}

  ngOnInit(): void {
    this._router.params.subscribe((params) => {
      this.id = params["id"] ?? ""; // Aseguramos que id nunca sea undefined
      if (this.id) {
        this.getAppointmentById(this.id); // Llamada para obtener los detalles de la cita
      }
    });
  }

  getAppointmentById(id: string): void {
    this._appointmentService.getAppointmentById(id).subscribe({
      next: (value) => {
        this.appointment = value;
        console.log("Appointment fetched", value);
      },
      error: (err) => {
        console.error("Error fetching appointment", err);
      },
    });
  }

  deleteAppointment(): void {
    this._appointmentService.deleteAppointment(this.id).subscribe({
      next: () => {
        console.log("Appointment deleted successfully");
        this._routerNav.navigate(["/appointments/list"]);
      },
      error: (err) => {
        console.error("Error eliminating appointment", err);
      },
    });
  }
}
