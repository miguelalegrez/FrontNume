// patients-routing.module.ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppointmentsDetailComponent } from "./pages/appoint-detail/appointments-detail/appointments-detail.component";
import { AppointmentsListComponent } from "./pages/appoint-list/appointments-list/appointments-list.component";
import { AppointmentCreateComponent } from "./pages/appointment-create/appointment-create.component";
import { AppointmentModificationComponent } from "./pages/appointment-modification/appointment-modification.component";

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
