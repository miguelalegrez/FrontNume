import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { SharedModule } from "../../shared/shared.module";

import { ReactiveFormsModule } from "@angular/forms";
import { MatBadgeModule } from "@angular/material/badge";
import { AuthModule } from "../auth/auth.module";
import { NutritionistsRoutingModule } from "./nutritionists.routing.module";
import { NutritionistListComponent } from "./pages/list/nutritionist-list.component";
import { NutritionistModificationComponent } from "./pages/modification/nutritionist-modification.component";
import { MatSelectModule } from "@angular/material/select";
import { NutritionistDetailComponent } from "./pages/detail/nutritionist-detail.component";

@NgModule({
  declarations: [
    NutritionistDetailComponent,
    NutritionistListComponent,
    NutritionistModificationComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    SharedModule,
    MatIconModule,
    ReactiveFormsModule,
    AuthModule,
    NutritionistsRoutingModule,
    MatBadgeModule,
    MatSelectModule,
  ],
})
export class NutritionistsModule {}
