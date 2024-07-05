import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { AuthService } from "./core/services/auth.service";
import { HeaderComponent } from "./shared/components/header/header.component";
import { SubHeaderComponent } from "./shared/components/sub-header/sub-header.component";
import { SharedModule } from "./shared/shared.module";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  imports: [
    RouterOutlet,
    HeaderComponent,
    CommonModule,
    SubHeaderComponent,
    SharedModule,
  ],
})
export class AppComponent implements OnInit {
  title = "NuMeApp";
  isHomePage: boolean = false;

  constructor(private _authService: AuthService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = this.router.url === "/home";
      }
    });
  }

  ngOnInit(): void {
    this._checkAndSetUser();
  }

  private _checkAndSetUser() {
    const user = localStorage.getItem("user");
    if (user) {
      this._authService.setUser(JSON.parse(user));
    }
  }
}
