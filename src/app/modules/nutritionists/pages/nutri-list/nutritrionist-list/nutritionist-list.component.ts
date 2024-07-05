import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Nutritionist } from "../../../models/nutritionist.model";
import { NutritionistService } from "../../../services/nutritionist.service";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-nutritionist-list",
  templateUrl: "./nutritionist-list.component.html",
  styleUrls: ["./nutritionist-list.component.css"],
})
export class NutritionistListComponent implements OnInit {
  public dataSource = new MatTableDataSource<Nutritionist>();
  public displayedColumns: string[] = [
    "persoInfo.document",
    "persoInfo.name",
    "persoInfo.surname",
  ];
  public searchType: string = "nameSurname"; // Default search type
  public filterValue: string = ""; // Define filterValue property
  private searchTerms = new Subject<{
    searchType: string;
    filterValue: string;
  }>(); // Subject to handle search terms

  @ViewChild(MatPaginator) public paginator!: MatPaginator;

  constructor(
    private _router: Router,
    private _nutritionistService: NutritionistService
  ) {}

  ngOnInit(): void {
    this.getNutritionists(0, 20);
    this.setupSearch();
    this.dataSource.paginator = this.paginator;
  }

  getNutritionists(page: number, size: number): void {
    this._nutritionistService.getNutritionists(page, size).subscribe({
      next: (value) => {
        if (value && value.content) {
          this.dataSource.data = value.content;
          if (this.paginator) {
            this.paginator.length = value.totalElements;
          }
        } else {
          console.error("Invalid response structure", value);
        }
      },
      error: (err) => {
        console.error("Error fetching nutritionists", err);
      },
    });
  }

  public onClickElement(id: string): void {
    this._router.navigateByUrl("nutritionists/detail/" + id);
  }

  public onPageChange(event: any): void {
    if (this.searchType === "nameSurname" && this.filterValue) {
      const [name, surname] = this.filterValue.split(" ");
      this.searchNutritionistsByNameAndSurname(
        name,
        surname,
        event.pageIndex,
        event.pageSize
      );
    } else if (this.searchType === "document" && this.filterValue) {
      this.searchNutritionistByDocument(
        this.filterValue,
        event.pageIndex,
        event.pageSize
      );
    } else {
      this.getNutritionists(event.pageIndex, event.pageSize);
    }
  }

  public onFilterChanged(event: {
    searchType: string;
    filterValue: string;
  }): void {
    this.searchType = event.searchType;
    this.filterValue = event.filterValue.trim().toLowerCase();
    this.searchTerms.next({
      searchType: this.searchType,
      filterValue: this.filterValue,
    });
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private setupSearch(): void {
    this.searchTerms
      .pipe(
        debounceTime(300), // Wait 300ms after each keystroke before considering the term
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ) // Ignore new term if same as previous term
      )
      .subscribe(({ searchType, filterValue }) => {
        if (filterValue) {
          if (searchType === "nameSurname") {
            const [name, surname] = filterValue.split(" ");
            this.searchNutritionistsByNameAndSurname(
              name,
              surname || "",
              0,
              20
            );
          } else if (searchType === "document") {
            this.searchNutritionistByDocument(filterValue, 0, 20);
          }
        } else {
          this.getNutritionists(0, 20);
        }
      });
  }

  private searchNutritionistsByNameAndSurname(
    name: string,
    surname: string,
    page: number,
    size: number
  ): void {
    this._nutritionistService
      .searchNutritionistByNameAndSurname(name, surname, page, size)
      .subscribe({
        next: (value) => {
          if (value && value.content) {
            this.dataSource.data = value.content;
            if (this.paginator) {
              this.paginator.length = value.totalElements;
            }
          } else {
            console.error("Invalid response structure", value);
          }
        },
        error: (err) => {
          console.error(
            "Error fetching nutritionists by name and surname",
            err
          );
        },
      });
  }

  private searchNutritionistByDocument(
    document: string,
    page: number,
    size: number
  ): void {
    this._nutritionistService.getNutritionistByDocument(document).subscribe({
      next: (nutritionist) => {
        if (nutritionist) {
          this.dataSource.data = [nutritionist];
          if (this.paginator) {
            this.paginator.length = 1;
          }
        } else {
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        console.error("Error fetching nutritionist by document", err);
        this.dataSource.data = [];
      },
    });
  }
}
