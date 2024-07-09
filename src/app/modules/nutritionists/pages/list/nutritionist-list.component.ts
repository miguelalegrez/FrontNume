import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Nutritionist } from "../../models/nutritionist.model";
import { NutritionistService } from "../../services/nutritionist.service";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-nutritionist-list",
  templateUrl: "./nutritionist-list.component.html",
  styleUrls: ["./nutritionist-list.component.css"],
})
export class NutritionistListComponent implements OnInit, AfterViewInit {
  public dataSource = new MatTableDataSource<Nutritionist>();
  public displayedColumns: string[] = [
    "persoInfo.document",
    "persoInfo.name",
    "persoInfo.surname",
  ];
  public searchType: string = "nameSurname";
  public filterValue: string = "";
  private searchTerms = new Subject<{
    searchType: string;
    filterValue: string;
  }>();
  public pageSize = 20;
  public totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _router: Router,
    private _nutritionistService: NutritionistService
  ) {}

  ngOnInit(): void {
    this.getNutritionists(0, this.pageSize);
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getNutritionists(page: number, size: number): void {
    this._nutritionistService.getNutritionists(page, size).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.dataSource.data = response.content;
          this.totalElements = response.totalElements;
          this.updatePaginator();
        } else {
          console.error("Invalid response structure", response);
        }
      },
      error: (err) => {
        console.error("Error fetching nutritionists", err);
      },
    });
  }

  updatePaginator() {
    if (this.paginator) {
      this.paginator.length = this.totalElements;
    } else {
      setTimeout(() => this.updatePaginator(), 100);
    }
  }

  onFilterChanged(event: { searchType: string; filterValue: string }): void {
    this.searchType = event.searchType;
    this.filterValue = event.filterValue.trim().toLowerCase();
    this.searchTerms.next(event);
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  private setupSearch(): void {
    this.searchTerms
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(({ searchType, filterValue }) => {
        const [name, surname] = filterValue.split(" ");
        if (searchType === "nameSurname") {
          this.getNutritionistsByNameAndSurname(
            name,
            surname || "",
            0,
            this.pageSize
          );
        } else if (searchType === "document") {
          this.getNutritionistsByDocument(filterValue, 0, this.pageSize);
        }
      });
  }

  getNutritionistsByNameAndSurname(
    name: string,
    surname: string,
    page: number,
    size: number
  ): void {
    this._nutritionistService
      .searchNutritionistByNameAndSurname(name, surname, page, size)
      .subscribe((data) => {
        this.handleResponse(data);
      });
  }

  getNutritionistsByDocument(
    document: string,
    page: number,
    size: number
  ): void {
    this._nutritionistService
      .getNutritionistByDocument(document)
      .subscribe((data) => {
        this.handleResponse(data);
      });
  }

  handleResponse(data: any) {
    if (data && data.content) {
      this.dataSource.data = data.content;
      this.totalElements = data.totalElements;
      this.updatePaginator();
    } else {
      console.error("Invalid response structure", data);
    }
  }

  public onClickElement(id: string): void {
    this._router.navigateByUrl("nutritionists/detail/" + id);
  }

  public onPageChange(event: any): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    const [name, surname] = this.filterValue.split(" ");
    if (this.searchType === "nameSurname" && this.filterValue) {
      this.getNutritionistsByNameAndSurname(name, surname, pageIndex, pageSize);
    } else if (this.searchType === "document" && this.filterValue) {
      this.getNutritionistsByDocument(this.filterValue, pageIndex, pageSize);
    } else {
      this.getNutritionists(pageIndex, pageSize);
    }
  }
}
