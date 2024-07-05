import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { AppointmentCreationBoxComponent } from "./components/buttons/appointment-creation-box/appointment-creation-box.component";
import { BackButtonPageContainerComponent } from "./components/buttons/back-button-page-container/back-button-page-container.component";
import { DeleteBoxComponent } from "./components/buttons/delete-box/delete-box.component";
import { ModificationBoxComponent } from "./components/buttons/modification-box/modification-box.component";
import { UserCreationBoxComponent } from "./components/buttons/user-creation-box/user-creation-box.component";
import { FilterBoxComponent } from "./components/filter-box/filter-box.component";
import { TableComponent } from "./components/table/table.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";

@NgModule({
  declarations: [
    UserCreationBoxComponent,
    AppointmentCreationBoxComponent,
    DeleteBoxComponent,
    ModificationBoxComponent,
    FilterBoxComponent,
    TableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatCardModule,
    BackButtonPageContainerComponent,
    MatPaginator,
    MatTableModule,
  ],
  exports: [
    BackButtonPageContainerComponent,
    AppointmentCreationBoxComponent,
    UserCreationBoxComponent,
    ModificationBoxComponent,
    DeleteBoxComponent,
    FilterBoxComponent,
    TableComponent,
  ],
})
export class SharedModule {}
