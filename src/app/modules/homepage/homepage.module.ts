import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomepageRoutingModule } from "./homepage-routing.module";
import { RouterModule } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { MatIconButton } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    MatIconModule,
    CommonModule,
    MatIconButton,
    HomepageRoutingModule,
    RouterModule,
  ],
})
export class HomepageModule {}
