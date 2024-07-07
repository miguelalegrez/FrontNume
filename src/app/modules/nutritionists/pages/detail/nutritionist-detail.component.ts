import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Nutritionist } from "../../models/nutritionist.model";
import { NutritionistService } from "../../services/nutritionist.service";

@Component({
  selector: "app-nutritionist-detail",
  templateUrl: "./nutritionist-detail.component.html",
  styleUrl: "./nutritionist-detail.component.css",
})
export class NutritionistDetailComponent implements OnInit {
  id: string = "";
  nutritionist: Nutritionist = {
    id: "",
    persoInfo: { name: "", surname: "", documentType: "", document: "" },
    personType: "",
    appointmentId: [],
    medicalRecordId: [],
  };
  dataSource = new MatTableDataSource<Nutritionist>();
  appointmentsDataSource = new MatTableDataSource<any>(); // DataSource para las citas
  page?: { content: Nutritionist[]; totalElements: number };
  displayedColumns: string[] = ["id", "name", "surname", "document"];
  appointmentDisplayedColumns: string[] = [
    "id",
    "date",
    "patientName",
    "patientSurname",
    "actions",
  ];
  activeAppointmentsCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _nutritionistService: NutritionistService,
    private _route: ActivatedRoute,
    private _routerNav: Router
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params["id"]; // Obtén el ID del nutricionista de los parámetros de la URL
      this.getNutritionistById(this.id);
      this.getAppointmentsByPersonId(this.id);
      this.dataSource.paginator = this.paginator;

      // Llama al método para obtener los detalles del nutricionista por ID
    });
  }
  getNutritionistById(id: string): void {
    this._nutritionistService.getNutritionistById(id).subscribe({
      next: (value) => {
        this.nutritionist = value;
        console.log("Nutritionist fetched", value);
      },
      error: (err) => {
        console.error("Error fetching nutritionist", err);
      },
    });
  }

  getAppointmentsByPersonId(personId: string): void {
    this._nutritionistService.getAppointmentsByPersonId(personId).subscribe({
      next: (response) => {
        const appointments = response.content; // Extrae el array de citas del objeto de paginación
        this.appointmentsDataSource.data = appointments;
        this.activeAppointmentsCount = appointments.length;

        console.log("Appointments fetched", appointments);
      },
      error: (err) => {
        console.error("Error fetching appointments", err);
      },
    });
  }

  deleteNutritionist(): void {
    this._nutritionistService.deleteNutritionist(this.id).subscribe({
      next: () => {
        console.log("Nutritionist deleted successfully");
        this._routerNav.navigate(["/nutritionists/list"]);
      },
      error: (error) => {
        console.error("Error eliminating Nutritionist", error);
      },
    });
  }
}
