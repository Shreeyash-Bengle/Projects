import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductsService, Product } from '../services/products.service';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
})
export class StockComponent implements OnInit {
  showAddStockForm = false;
  productList: Product[] = [];
  filteredProductList: Product[] = [];
  editingIndex: number | null = null;

  newStock: Product = {
    description: '',
    supplier: '',
    price: null,
    hsn_code: '',
    quantity: null,
    total: 0,
    stock_type: 'Parent',
  };

  // Replace nameFilter and hsnFilter with a single searchFilter
  searchFilter: string = '';

  private originalList: Product[] = [];
  currentFilter: string = 'All';

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  toastr: ToastrService = inject(ToastrService);

  // Load products from the API
  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (response: any) => {
        if (response && response.all_info) {
          this.originalList = response.all_info;
          this.productList = [...this.originalList];
          this.filterProductList('All');
        } else {
          this.toastr.error('Invalid response from server', 'Error');
          console.error('Invalid API response:', response);
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load stock items', 'Error');
        console.error('Error loading products:', err);
      },
    });
  }

  // Add a new stock item via the API
  addNewStock(form: NgForm): void {
    if (
      this.newStock.description &&
      this.newStock.price && this.newStock.price > 0 &&  // Check for truthy and > 0
      this.newStock.hsn_code
    ) {
      const newProduct: Product = {
        ...this.newStock,
        quantity: this.newStock.quantity || 1,  // Default to 1 if null
        total: (this.newStock.price || 0) * (this.newStock.quantity || 1),
      };

      this.productsService.addProduct(newProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.showAddStockForm = false;
          this.newStock = {
            description: '',
            supplier: '',
            price: 0,
            hsn_code: '',
            quantity: 0,
            total: 0,
            stock_type: 'Parent',
          };
          form.resetForm({
            stock_type: 'Parent',
          });
          this.toastr.success('New stock item added successfully', 'Success');
        },
        error: (err) => {
          this.toastr.error('Failed to add new stock item', 'Error');
          console.error('Error adding product:', err);
        },
      });
    } else {
      this.toastr.warning('Please fill all required fields correctly', 'Warning');
    }
  }

  // Update filterProductList method
  filterProductList(type: string): void {
    this.currentFilter = type;
    this.filteredProductList =
      type === 'All'
        ? [...this.productList]
        : this.productList.filter((product) => product.stock_type === type);
  }

  // Add filter method
  applyFilters(): void {
    let filtered = [...this.originalList];

    if (this.searchFilter) {
      const searchTerm = this.searchFilter.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.description.toLowerCase().includes(searchTerm) ||
          product.hsn_code.toLowerCase().includes(searchTerm)
      );
    }

    this.productList = filtered;
    this.filterProductList(this.currentFilter || 'All');
  }

  // Update quantity and recalculate total locally
  updateQuantity(): void {
    this.filteredProductList.forEach((item) => {
      if (item.quantity && item.price) {
        item.total = Number(item.quantity) * Number(item.price);
      } else {
        item.total = 0;
      }
    });
  }

  // Enable editing mode
  editProduct(index: number): void {
    this.editingIndex = index;
  }

  // Save the edited product by calling the API update method
  saveEdit(): void {
    if (this.editingIndex !== null) {
      const product = this.filteredProductList[this.editingIndex];
      if (product.id) {
        // Calculate total before sending update
        product.total = Number(product.quantity || 0) * Number(product.price || 0);

        this.productsService.updateProduct(product).subscribe({
          next: (updatedProduct: Product) => {
            const index = this.productList.findIndex(
              (p) => p.id === updatedProduct.id
            );
            if (index !== -1) {
              this.productList[index] = {
                ...updatedProduct,
                quantity: Number(updatedProduct.quantity) || 0,
                price: Number(updatedProduct.price) || 0,
                total: Number(updatedProduct.quantity || 0) * Number(updatedProduct.price || 0)
              };
            }
            this.editingIndex = null;
            this.filterProductList(this.currentFilter);
            this.toastr.success('Stock item updated successfully', 'Success');
          },
          error: (err) => {
            this.toastr.error('Failed to update stock item', 'Error');
            console.error('Error updating product:', err);
          },
        });
      } else {
        this.editingIndex = null;
        this.updateQuantity();
        this.toastr.warning('Cannot update: Invalid product ID', 'Warning');
      }
    }
  }

  // Remove product via API call
  removeProduct(index: number): void {
    const product = this.filteredProductList[index];
    if (confirm('Are you sure you want to delete this item?')) {
      if (product.id) {
        this.productsService.deleteProduct(product).subscribe({
          next: () => {
            this.productList = this.productList.filter(
              (p) => p.id !== product.id
            );
            this.filterProductList('All');
            this.toastr.success('Stock item deleted successfully', 'Success');
          },
          error: (err) => {
            this.toastr.error('Failed to delete stock item', 'Error');
            console.error('Error deleting product:', err);
          },
        });
      } else {
        this.productList.splice(index, 1);
        this.filterProductList('All');
        this.toastr.warning('Removed untracked item', 'Warning');
      }
    }
  }
}