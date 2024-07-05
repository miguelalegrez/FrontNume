import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
})
export class TableComponent<T> {
  @Input() dataSource = new MatTableDataSource<T>();
  @Input() displayedColumns: string[] = [];
  @Input() pageLength = 0;
  @Input() pageSize = 20;
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() filterValue = "";
  @Output() pageChange = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<T>();

  headerMapping: { [key: string]: string } = {
    "persoInfo.document": "Documento",
    "persoInfo.name": "Nombre",
    "persoInfo.surname": "Apellido",
    date: "Fecha",
    time: "Hora",
    patientName: "Nombre Paciente",
    patientSurname: "Apellido Paciente",
    patientDocument: "Documento Paciente",
    nutritionistName: "Nombre Nutricionista",
    nutritionistSurname: "Apellido Nutricionista",
  };

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onPageChange(event: any): void {
    this.pageChange.emit(event);
  }

  getNestedValue(element: any, column: string): any {
    const keys = column.split(".");
    let value = element;
    for (const key of keys) {
      if (value) {
        value = value[key];
      } else {
        return null;
      }
    }
    return value;
  }
}
