import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { ReactiveFormsModule } from "@angular/forms";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { SharedRoutingModule } from "../../shared/shared-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { AuthModule } from "../auth/auth.module";
import { PatientDetailComponent } from "./pages/patient-detail/patient-detail.component";
import { PatientListComponent } from "./pages/patient-list/patient-list.component";
import { PatientsRoutingModule } from "./patients.routing.module";
import { PatientModificationComponent } from "./pages/patient-modification/patient-modification.component";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
  providers: [DatePipe],
  declarations: [
    PatientListComponent,
    PatientDetailComponent,
    PatientModificationComponent,
  ],
  imports: [
    MatTabsModule,
    PatientsRoutingModule,
    SharedModule,
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    SharedRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    AuthModule,
    MatBadgeModule,
    MatSelectModule,
  ],
})
export class PatientsModule {}
