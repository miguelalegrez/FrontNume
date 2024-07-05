// patients-routing.module.ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PatientRegistryCreateComponent } from "../patient-registry/pages/patient-registry-create/patient-registry-create.component";
import { UserCreateComponent } from "../user-creation/pages/user-create-form/user-create.component";
import { PatientDetailComponent } from "./pages/patient-detail/patient-detail.component";
import { PatientListComponent } from "./pages/patient-list/patient-list.component";
import { PatientModificationComponent } from "./pages/patient-modification/patient-modification.component";

const routes: Routes = [
  { path: "list", component: PatientListComponent },
  { path: "detail/:id", component: PatientDetailComponent },
  {
    path: "detail/:id/create-registry",
    component: PatientRegistryCreateComponent,
  },
  { path: "patient-create", component: UserCreateComponent },
  { path: "modify/:id", component: PatientModificationComponent },
  { path: "", redirectTo: "list", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
