import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-modification-box",
  templateUrl: "./modification-box.component.html",
  styleUrls: ["./modification-box.component.css"],
})
export class ModificationBoxComponent {
  @Input() id!: string;
  @Input() entityType!: string; // Tipo de entidad para determinar la ruta

  constructor(private _router: Router) {}

  navigateToModify(): void {
    const modifyRoute = this.getModifyRoute(this.entityType, this.id);
    if (modifyRoute) {
      this._router.navigate([modifyRoute]);
    }
  }

  private getModifyRoute(entityType: string, id: string): string {
    switch (entityType) {
      case "patient":
        return `/patients/modify/${id}`;
      case "nutritionist":
        return `/nutritionists/modify/${id}`;
      case "appointment":
        return `/appointments/modify/${id}`;
      case "registry":
        return `/patient-registry/modify/${id}`;
      default:
        return "";
    }
  }
}
