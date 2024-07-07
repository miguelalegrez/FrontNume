import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { SharedModule } from "../../shared/shared.module";
import { AuthModule } from "../auth/auth.module";
import { BackButtonPageContainerComponent } from "../../shared/components/buttons/back-button-page-container/back-button-page-container.component";

import { AppointmentsRoutingModule } from "./appointments.routing.module";
import { AppointmentCreateComponent } from "./pages/create/appointment-create.component";
import { AppointmentModificationComponent } from "./pages/modification/appointment-modification.component";
import { AppointmentsDetailComponent } from "./pages/detail/appointments-detail.component";
import { AppointmentsListComponent } from "./pages/list/appointments-list.component";

@NgModule({
  declarations: [
    AppointmentsDetailComponent,
    AppointmentsListComponent,
    AppointmentCreateComponent,
    AppointmentModificationComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    HttpClientModule,
    MatDatepickerModule,
    MatTableModule,
    MatInputModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    SharedModule,
    MatIconModule,
    ReactiveFormsModule,
    AuthModule,
    AppointmentsRoutingModule,
    BackButtonPageContainerComponent,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
})
export class AppointmentsModule {}
