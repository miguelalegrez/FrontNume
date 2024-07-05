import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserCreateComponent } from "./pages/user-create-form/user-create.component";

const routes: Routes = [
  { path: "create-user", component: UserCreateComponent },
  { path: "", redirectTo: "create-user", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserCreationRoutingModule {}
