// patients-routing.module.ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserCreateComponent } from "../user-creation/pages/form/user-create.component";
import { NutritionistListComponent } from "./pages/list/nutritionist-list.component";
import { NutritionistModificationComponent } from "./pages/modification/nutritionist-modification.component";
import { NutritionistDetailComponent } from "./pages/detail/nutritionist-detail.component";

const routes: Routes = [
  { path: "list", component: NutritionistListComponent },
  { path: "detail/:id", component: NutritionistDetailComponent },
  { path: "nutri-create", component: UserCreateComponent },
  { path: "modify/:id", component: NutritionistModificationComponent },
  { path: "", redirectTo: "list", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NutritionistsRoutingModule {}
