import { Routes } from "@angular/router";
import { AppointmentCreateComponent } from "./modules/appointments/pages/appointment-create/appointment-create.component";
import { PatientListComponent } from "./modules/patients/pages/patient-list/patient-list.component";
import { HomePageComponent } from "./modules/homepage/pages/home-page/home-page.component";
export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./modules/homepage/homepage.module").then(
        (m) => m.HomepageModule
      ),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "patients",
    loadChildren: () =>
      import("./modules/patients/patients.module").then(
        (m) => m.PatientsModule
      ),
  },
  {
    path: "nutritionists",
    loadChildren: () =>
      import("./modules/nutritionists/nutritionists.module").then(
        (m) => m.NutritionistsModule
      ),
  },
  {
    path: "appointments",
    loadChildren: () =>
      import("./modules/appointments/appointments.module").then(
        (m) => m.AppointmentsModule
      ),
  },
  {
    path: "create-user",
    loadChildren: () =>
      import("./modules/user-creation/user-creation.module").then(
        (m) => m.UserCreationModule
      ),
  },
  {
    path: "create-appointment", // Ruta para el formulario de creación de usuarios
    component: AppointmentCreateComponent,
  },

  {
    path: "patient-registry",
    loadChildren: () =>
      import("./modules/patient-registry/patient-registry.module").then(
        (m) => m.PatientRegistryModule
      ),
  },
];
