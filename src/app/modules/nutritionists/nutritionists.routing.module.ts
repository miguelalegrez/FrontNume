// patients-routing.module.ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserCreateComponent } from "../user-creation/pages/user-create-form/user-create.component";
import { NutritionistDetailComponent } from "./pages/nutri-detail/nutritionist-detail/nutritionist-detail.component";
import { NutritionistListComponent } from "./pages/nutri-list/nutritrionist-list/nutritionist-list.component";
import { NutritionistModificationComponent } from "./pages/nutritionist-modification/nutritionist-modification.component";

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
