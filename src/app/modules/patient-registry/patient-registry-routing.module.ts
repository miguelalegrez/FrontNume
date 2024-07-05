import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PatientRegistryCreateComponent } from "./pages/patient-registry-create/patient-registry-create.component";
import { PatientRegistryDetailComponent } from "./pages/patient-registry-detail/patient-registry-detail.component";
import { PatientRegistryModificationComponent } from "./pages/patient-registry-modification/patient-registry-modification.component";

const routes: Routes = [
  {
    path: "detail/:id",
    component: PatientRegistryDetailComponent,
  },
  {
    path: "create-registry",
    component: PatientRegistryCreateComponent,
  },
  {
    path: "modify/:id",
    component: PatientRegistryModificationComponent,
  },
  {
    path: "detail/:id/create-registry",
    component: PatientRegistryCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRegistryRoutingModule {}
