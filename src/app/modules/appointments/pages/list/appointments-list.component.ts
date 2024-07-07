import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Page } from "../../../../core/models/pageable.model";
import { Appointment } from "../../models/appointment.model";
import { AppointmentService } from "../../services/appointment.service";

@Component({
  selector: "app-appointments-list",
  templateUrl: "./appointments-list.component.html",
  styleUrls: ["./appointments-list.component.css"],
})
export class AppointmentsListComponent implements OnInit {
  public dataSource = new MatTableDataSource<Appointment>();
  public page?: Page<Appointment>;
  public displayedColumns: string[] = [
    "date",
    "patientName",
    "patientSurname",
    "patientDocument",
    "nutritionistName",
    "nutritionistSurname",
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _appointmentService: AppointmentService,
    private _router: Router,
    private _datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getAppointments(0, 20);
    this.dataSource.paginator = this.paginator;
  }

  getAppointments(page: number, size: number): void {
    this._appointmentService.getAppointments(page, size).subscribe({
      next: (value) => {
        if (value && value.content) {
          this.page = value;
          const formattedAppointments = value.content.map((appointment) => ({
            ...appointment,
            date: appointment.date
              ? this._datePipe.transform(appointment.date, "medium")
              : null, // Manejo de fecha nula
          }));
          this.dataSource.data = formattedAppointments;
          if (this.paginator) {
            this.paginator.length = value.totalElements;
          }
        } else {
          console.error("Invalid response structure", value);
        }
      },
      error: (err) => {
        console.error("Error fetching appointments", err);
      },
    });
  }

  onPageChange(event: any): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    if (this.documentFilterValue) {
      this.searchAppointmentsByDocument(
        this.documentFilterValue,
        pageIndex,
        pageSize
      );
    } else {
      this.getAppointments(pageIndex, pageSize);
    }
  }

  documentFilterValue: string = "";

  applyDocumentFilter(event: Event): void {
    this.documentFilterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    if (this.documentFilterValue) {
      this.searchAppointmentsByDocument(
        this.documentFilterValue,
        0,
        this.paginator.pageSize
      );
    } else {
      this.getAppointments(0, this.paginator.pageSize);
    }
  }

  private searchAppointmentsByDocument(
    document: string,
    page: number,
    size: number
  ): void {
    this._appointmentService
      .getAppointmentsByPersonDocument(document, page, size)
      .subscribe({
        next: (value) => {
          if (value && value.content) {
            this.page = value;
            const formattedAppointments = value.content.map((appointment) => ({
              ...appointment,
              date: appointment.date
                ? this._datePipe.transform(appointment.date, "medium")
                : null, // Manejo de fecha nula
            }));
            this.dataSource.data = formattedAppointments;
            if (this.paginator) {
              this.paginator.length = value.totalElements;
            }
          } else {
            this.dataSource.data = [];
            console.error("Invalid response structure", value);
          }
        },
        error: (err) => {
          this.dataSource.data = [];
          console.error("Error fetching appointments by document", err);
        },
      });
  }

  onClickElement(id: string): void {
    this._router.navigateByUrl("appointments/detail/" + id);
  }
}
