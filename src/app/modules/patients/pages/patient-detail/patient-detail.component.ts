// patient-detail.component.ts

import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common"; // Importa DatePipe
import { Page } from "../../../../core/models/pageable.model";
import { PatientRegistry } from "../../../patient-registry/models/patientregistry";
import { PatientRegistryService } from "../../../patient-registry/services/patient-registry.service";
import { Patient } from "../../models/patient.model";
import { PatientService } from "../../services/patient.service";

@Component({
  selector: "app-patient-detail",
  templateUrl: "./patient-detail.component.html",
  styleUrls: ["./patient-detail.component.css"],
  providers: [DatePipe],
})
export class PatientDetailComponent implements OnInit {
  public patient: Patient = {
    id: "",
    persoInfo: { name: "", surname: "", documentType: "", document: "" },
    personType: "",
    appointmentId: [],
    medicalRecordId: [],
  };

  public id: string = "";
  public dataSource = new MatTableDataSource<Patient>();
  public appointmentsDataSource = new MatTableDataSource<any>(); // DataSource para las citas
  public registryDataSource = new MatTableDataSource<any>(); // DataSource para los registros de pacientes
  public page?: { content: Patient[]; totalElements: number };
  public displayedColumns: string[] = ["id", "name", "surname", "document"];
  public appointmentDisplayedColumns: string[] = [
    "id",
    "date",
    "nutritionistName",
    "nutritionistSurname",
    "actions",
  ];
  public registryDisplayedColumns: string[] = [
    "id",
    "date",
    "registryType",
    "observations",
    "actions",
  ];
  public activeAppointmentsCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _patientService: PatientService,
    private _registryService: PatientRegistryService,
    private _router: ActivatedRoute,
    private _routerNav: Router,
    private _datePipe: DatePipe // Inyecta DatePipe
  ) {}

  ngOnInit(): void {
    this._router.params.subscribe((params) => {
      this.id = params["id"];
      this.getPatientById(this.id);
      this.getAppointmentsByPersonId(this.id);
      this.getPatientRegistries(this.id); // Obtener registros del paciente
      this.dataSource.paginator = this.paginator;
    });
  }

  getPatients(page: number, size: number): void {
    this._patientService.getPatients(page, size).subscribe({
      next: (value) => {
        this.page = value;
        this.dataSource.data = value.content;
        this.paginator.length = value.totalElements;
      },
      error: (err) => {
        console.error("Error fetching patients", err);
      },
    });
  }

  getPatientById(id: string): void {
    this._patientService.getPatientById(id).subscribe({
      next: (value) => {
        this.patient = value;
        console.log("Patient fetched", value);
      },
      error: (err) => {
        console.error("Error fetching patient", err);
      },
    });
  }

  getAppointmentsByPersonId(personId: string): void {
    this._patientService.getAppointmentsByPersonId(personId).subscribe({
      next: (response) => {
        const appointments = response.content.map((appointment: any) => ({
          ...appointment,
          date: this._datePipe.transform(appointment.date, "medium") || "",
        })); // Formatear fecha de la cita
        this.appointmentsDataSource.data = appointments;
        this.activeAppointmentsCount = appointments.length;

        console.log("Appointments fetched", appointments);
      },
      error: (err) => {
        console.error("Error fetching appointments", err);
      },
    });
  }

  getPatientRegistries(patientId: string): void {
    this._registryService.getRecordsByPersonId(patientId).subscribe({
      next: (response: Page<PatientRegistry>) => {
        const registries = response.content.map((registry: any) => ({
          ...registry,
          date: this._datePipe.transform(registry.date, "medium") || "",
        })); // Formatear fecha del registro
        this.registryDataSource.data = registries;

        console.log("Registries fetched", registries);
      },
      error: (err: any) => {
        console.error("Error fetching patient registries", err);
      },
    });
  }

  deletePatient(): void {
    this._patientService.deletePatient(this.id).subscribe({
      next: () => {
        console.log("Patient deleted successfully");
        this._routerNav.navigate(["/patients/list"]);
      },
      error: (error) => {
        console.error("Error eliminating patient", error);
      },
    });
  }

  onPageChange(event: any): void {
    this.getPatients(event.pageIndex, event.pageSize);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
