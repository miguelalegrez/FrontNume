import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Patient } from "../../models/patient.model";
import { PatientService } from "../../services/patient.service";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-patient-list",
  templateUrl: "./patient-list.component.html",
  styleUrls: ["./patient-list.component.css"],
})
export class PatientListComponent implements OnInit {
  public dataSource = new MatTableDataSource<Patient>();
  public displayedColumns: string[] = [
    "persoInfo.document",
    "persoInfo.name",
    "persoInfo.surname",
  ];
  public searchType: string = "nameSurname";
  public filterValue: string = ""; // Propiedad para almacenar el valor del filtro
  private searchTerms = new Subject<{
    searchType: string;
    filterValue: string;
  }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _router: Router,
    private _patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.getPatients(0, 20);
    this.setupSearch();
    this.dataSource.paginator = this.paginator;
  }

  getPatients(page: number, size: number): void {
    this._patientService.getPatients(page, size).subscribe({
      next: (value) => {
        if (value && value.content) {
          this.dataSource.data = value.content;
          if (this.paginator) {
            this.paginator.length = value.totalElements;
          }
        } else {
          console.error("Invalid response structure", value);
        }
      },
      error: (err) => {
        console.error("Error fetching patients", err);
      },
    });
  }

  onFilterChanged(event: { searchType: string; filterValue: string }): void {
    this.searchType = event.searchType;
    this.filterValue = event.filterValue.trim().toLowerCase();
    this.searchTerms.next({
      searchType: this.searchType,
      filterValue: this.filterValue,
    });
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private setupSearch(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe(({ searchType, filterValue }) => {
        if (filterValue) {
          if (searchType === "nameSurname") {
            const [name, surname] = filterValue.split(" ");
            this.searchPatientsByNameAndSurname(name, surname || "", 0, 20);
          } else if (searchType === "document") {
            this.searchPatientsByDocument(filterValue, 0, 20);
          }
        } else {
          this.getPatients(0, 20);
        }
      });
  }

  private searchPatientsByNameAndSurname(
    name: string,
    surname: string,
    page: number,
    size: number
  ): void {
    this._patientService
      .searchPatientsByNameAndSurname(name, surname, page, size)
      .subscribe({
        next: (value) => {
          if (value && value.content) {
            this.dataSource.data = value.content;
            if (this.paginator) {
              this.paginator.length = value.totalElements;
            }
          } else {
            console.error("Invalid response structure", value);
          }
        },
        error: (err) => {
          console.error("Error fetching patients by name and surname", err);
        },
      });
  }

  private searchPatientsByDocument(
    document: string,
    page: number,
    size: number
  ): void {
    this._patientService.getPatientByDocument(document).subscribe({
      next: (patient) => {
        if (patient) {
          this.dataSource.data = [patient];
          if (this.paginator) {
            this.paginator.length = 1;
          }
        } else {
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        console.error("Error fetching patient by document", err);
        this.dataSource.data = [];
      },
    });
  }

  public onClickElement(id: string): void {
    this._router.navigateByUrl("patients/detail/" + id);
  }

  public onPageChange(event: any): void {
    if (this.searchType === "nameSurname" && this.filterValue) {
      const [name, surname] = this.filterValue.split(" ");
      this.searchPatientsByNameAndSurname(
        name,
        surname,
        event.pageIndex,
        event.pageSize
      );
    } else if (this.searchType === "document" && this.filterValue) {
      this.searchPatientsByDocument(
        this.filterValue,
        event.pageIndex,
        event.pageSize
      );
    } else {
      this.getPatients(event.pageIndex, event.pageSize);
    }
  }
}
