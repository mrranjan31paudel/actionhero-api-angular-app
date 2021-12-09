import { Component, OnInit } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
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

  constructor(private productService: ProductsService) {

  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.isLoading = true;
    this.fallBack = 'Loading...';

    return this.productService.getProducts()
      .pipe(catchError((err, caught) => {
        this.failedToFetch = true;
        this.isLoading = false;
        this.fallBack = 'Failed to load data!';

        return throwError(() => new Error(err.message));
      }))
      .subscribe((res: { data: any[] }) => {
        this.isLoading = false;
        this.products = res.data;

        if (res.data && res.data.length !== undefined && res.data.length > 0) {
          this.fallBack = null;
        }
        else {
          this.fallBack = 'No records!';
        }
      });
  }
}
