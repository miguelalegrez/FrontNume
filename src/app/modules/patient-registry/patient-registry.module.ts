import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { BackButtonPageContainerComponent } from "../../shared/components/buttons/back-button-page-container/back-button-page-container.component";
import { SharedModule } from "../../shared/shared.module";
import { AppointmentsRoutingModule } from "../appointments/appointments.routing.module";
import { AuthModule } from "../auth/auth.module";
import { PatientRegistryCreateComponent } from "./pages/create/patient-registry-create.component";
import { PatientRegistryDetailComponent } from "./pages/detail/patient-registry-detail.component";
import { PatientRegistryRoutingModule } from "./patient-registry-routing.module";
import { PatientRegistryModificationComponent } from "./pages/modification/patient-registry-modification.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  providers: [DatePipe],
  declarations: [
    PatientRegistryCreateComponent,
    PatientRegistryDetailComponent,
    PatientRegistryModificationComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatDatepickerModule,
    MatTableModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    SharedModule,
    MatIconModule,
    ReactiveFormsModule,
    AuthModule,
    PatientRegistryRoutingModule,
    AppointmentsRoutingModule,
    BackButtonPageContainerComponent,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  exports: [PatientRegistryCreateComponent],
})
export class PatientRegistryModule {}
