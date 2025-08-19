import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product, ProductsService } from '../services/products.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-stock-alert',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatInputModule,
    MatIcon
  ],
  templateUrl: './stock-alert.component.html',
  styleUrls: ['./stock-alert.component.css'],
  standalone: true
})
export class StockAlertComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'description',
    'hsn_code',
    'stock_type',
    'quantity',
    'price',
    'supplier'
  ];
  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  lowStockCount: number = 0;
  totalStockValue: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productsService: ProductsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadAlertStock();
    // Refresh data every 5 minutes
    setInterval(() => {
      this.loadAlertStock();
    }, 300000);
  }

  loadAlertStock() {
    this.isLoading = true;
    this.productsService.getAlertStock().subscribe({
      next: (response: any) => {
        console.log('API Response:', response); // Debug log

        // Handle different response formats
        const data = Array.isArray(response) ? response :
          response?.data ||
          response?.low_stock_items ||
          [];

        this.dataSource.data = data;
        this.lowStockCount = data.length;

        // Fix total value calculation
        this.totalStockValue = data
          .filter((item: any) => Number(item.quantity) > 0) // Only include items with stock
          .reduce((total: number, item: any) => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);
            return total + ((isNaN(price) ? 0 : price) * (isNaN(quantity) ? 0 : quantity));
          }, 0);




        console.log('Total Value Calculation:', {
          data: data,
          totalValue: this.totalStockValue
        }); // Debug log

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading alert stock:', error);
        this.toastr.error('Failed to load low stock items');
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Optional: Add custom filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
