import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { catchError, throwError } from 'rxjs';

import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productColumns: string[] = ['code', 'name', 'vendor', 'qty_in_store', 'rate', 'unit'];
  productColumnLabels: string[] = ['Code', 'Name', 'Vendor', 'Quantity', 'Rate', 'Unit'];
  products: any[] = [];
  isLoading: boolean = false;
  failedToFetch: boolean = false;
  fallBack: any = 'No records!';
  sort: Sort = { active: '', direction: '' };
  codeFormControl = new FormControl('');
  nameFormControl = new FormControl('');
  vendorFormControl = new FormControl('');
  qty_in_storeFormControl = new FormControl('');
  rateFormControl = new FormControl('');
  unitFormControl = new FormControl('');
  currentPage: number = 0;
  recordsPerPage: number = 25;
  totalRecords: number = 0;

  constructor(private productService: ProductsService) {

  }

  ngOnInit(): void {
    this.getProducts();
  }

  prepareFilters() {
    return {
      code: this.codeFormControl.value,
      name: this.nameFormControl.value,
      vendor: this.vendorFormControl.value,
      qty_in_store: this.qty_in_storeFormControl.value,
      rate: this.rateFormControl.value,
      unit: this.unitFormControl.value
    }
  }

  prepareSort(sort?: Sort) {
    return {
      sortBy: this.sort.active,
      sortDir: this.sort.direction
    };
  }

  preparePagination(currentPage: number = 0, recordsPerPage: number = 25) {
    this.currentPage = currentPage;
    this.recordsPerPage = recordsPerPage;
  }

  onSortChange(sortEvent: Sort) {
    this.sort = sortEvent;
    this.getProducts();
  }

  onFilterChange(e: Event) {
    this.preparePagination(0, this.recordsPerPage); // reset currentpage on filterchange
    this.getProducts();
  }

  onPageChange(pageEvent: PageEvent) {
    this.preparePagination(pageEvent.pageIndex, pageEvent.pageSize);
    this.getProducts();
  }

  getProducts() {
    let sort = this.prepareSort();
    let filters = this.prepareFilters();

    this.isLoading = true;
    this.fallBack = 'Loading...';

    return this.productService.getProducts(sort, filters, this.currentPage, this.recordsPerPage)
      .pipe(catchError((err, caught) => {
        this.failedToFetch = true;
        this.isLoading = false;
        this.fallBack = 'Failed to load data!';

        return throwError(() => new Error(err.message));
      }))
      .subscribe((res: { data: { records: any[], pagination: any } }) => {
        const { records, pagination } = res.data;

        this.isLoading = false;
        this.products = res.data.records;

        if (records && records.length !== undefined && records.length > 0) {
          this.fallBack = null;
          if (pagination) {
            this.currentPage = pagination.currentPageNum;
            this.totalRecords = pagination.totalRecords;
          }
        }
        else {
          this.fallBack = 'No records!';
        }
      });
  }
}
