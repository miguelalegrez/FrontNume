import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientRegistry } from "../../models/patientregistry";
import { PatientRegistryService } from "../../services/patient-registry.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-patient-registry-detail",
  templateUrl: "./patient-registry-detail.component.html",
  styleUrls: ["./patient-registry-detail.component.css"],
})
export class PatientRegistryDetailComponent implements OnInit {
  id: string = "";
  registry: PatientRegistry | undefined;

  constructor(
    private _medicalRecordService: PatientRegistryService,
    private _router: ActivatedRoute,
    private _routerNav: Router,
    private _datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this._router.params.subscribe((params) => {
      this.id = params["id"];
      this.getRegistryById(this.id);
    });
  }

  getRegistryById(id: string): void {
    this._medicalRecordService.getRecordById(id).subscribe({
      next: (value) => {
        this.registry = {
          ...value,
          date: this._datePipe.transform(value.date, "medium") || "", // Asegura que date sea string
        };
        console.log("Registry fetched", this.registry);
      },
      error: (err) => {
        console.error("Error fetching registry", err);
      },
    });
  }

  deleteRegistry(): void {
    this._medicalRecordService.deleteRecordsById(this.id).subscribe({
      next: () => {
        console.log("Registry deleted successfully");
        this._routerNav.navigate([
          "/patients/detail",
          this.registry?.patientId,
        ]);
      },
      error: (err) => {
        console.error("Error eliminating registry", err);
      },
    });
  }

  translateRegistryType(registryType: string): string {
    switch (registryType) {
      case "FIRSTDATE":
        return "Primera Cita";
      case "REVISION":
        return "Revisión";
      default:
        return registryType;
    }
  }
}
