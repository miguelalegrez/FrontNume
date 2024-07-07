// patients-routing.module.ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppointmentCreateComponent } from "./pages/create/appointment-create.component";
import { AppointmentsDetailComponent } from "./pages/detail/appointments-detail.component";
import { AppointmentsListComponent } from "./pages/list/appointments-list.component";
import { AppointmentModificationComponent } from "./pages/modification/appointment-modification.component";

const routes: Routes = [
  { path: "list", component: AppointmentsListComponent },
  { path: "detail/:id", component: AppointmentsDetailComponent },
  { path: "create-appointment", component: AppointmentCreateComponent },
  { path: "modify/:id", component: AppointmentModificationComponent },

  { path: "", redirectTo: "list", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsRoutingModule {}
