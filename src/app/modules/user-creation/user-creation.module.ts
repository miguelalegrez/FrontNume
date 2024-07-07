import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { BackButtonPageContainerComponent } from "../../shared/components/buttons/back-button-page-container/back-button-page-container.component";
import { UserCreateComponent } from "./pages/form/user-create.component";
import { UserCreationRoutingModule } from "./user-creation-routing.module";

@NgModule({
  declarations: [UserCreateComponent],
  imports: [
    CommonModule,
    UserCreationRoutingModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatCardModule,
    BackButtonPageContainerComponent,
  ],
  exports: [UserCreateComponent],
})
export class UserCreationModule {}
