import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-filter-box",
  templateUrl: "./filter-box.component.html",
  styleUrls: ["./filter-box.component.css"],
})
export class FilterBoxComponent {
  @Output() filterChanged = new EventEmitter<{
    searchType: string;
    filterValue: string;
  }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      searchType: ["nameSurname"],
      filterValue: [""],
    });

    this.form.valueChanges
      .pipe(
        debounceTime(300), // Espera 300 ms después de cada pulsación de tecla antes de considerar el término
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ) // Ignora el nuevo término si es igual al término anterior
      )
      .subscribe((values) => {
        this.filterChanged.emit(values);
      });
  }
}
