import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DefStockService } from '../def-stock.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

interface StockItem {
  id: number;
  stock: string;
  stock_type: 'Child Product' | 'Parent Product';
  defective_quantity: number;
  reusable_quantity: number;
  price: number; // Added price property
  reason: string;
  isEditing?: boolean;
}

@Component({
  selector: 'app-def-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './def-stock.component.html',
  styleUrls: ['./def-stock.component.css']
})
export class DefStockComponent implements OnInit {
  constructor(private defStockService: DefStockService) { }
  stockItems: StockItem[] = [];
  newItem: StockItem = { id: 0, stock: '', stock_type: 'Child Product', defective_quantity: 0, reusable_quantity: 0, price: 0, reason: '' };
  nextId: number = 1;
  stockTypes: ('Child Product' | 'Parent Product')[] = ['Child Product', 'Parent Product'];
  stockOptions: any[] = []; // Array to hold stock options

  ngOnInit(): void {
    this.loadServerData();
    this.loadStockOptions();
  }

  toastr: ToastrService = inject(ToastrService);


  loadStockOptions(): void {
    this.defStockService.getDefectiveStock().subscribe(
      (response: any) => {
        this.stockOptions = response.all_info;
        // this.toastr.success('Stock options loaded successfully', 'Success');
      },
      (error: any) => {
        console.error('Error fetching descriptions:', error);
        // this.toastr.error('Failed to load stock options', 'Error');
      }
    );
  }

  onDescriptionChange(description: string): void {
    const selectedProduct = this.stockOptions.find(p => p.description === description);
    if (selectedProduct) {
      this.newItem.price = selectedProduct.price;
      this.toastr.info(`Price updated to ${selectedProduct.price}`, 'Info');
    } else {
      this.toastr.warning('Selected product not found', 'Warning');
    }
  }

  loadServerData(): void {
    this.defStockService.showDefStock().subscribe({
      next: (response: any) => {
        this.stockItems = response.all_info.map((item: any) => ({
          ...item,
          isEditing: false,
          stock_type: item.stock_type || 'Child Product',
          price: item.price !== undefined ? item.price : 0
        }));
        this.nextId = this.stockItems.length > 0 ?
          Math.max(...this.stockItems.map(item => item.id)) + 1 : 1;
        // this.toastr.success('Defective stock data loaded successfully', 'Success');
      },
      error: (error: any) => {
        console.error('Error fetching defective stock from server:', error);
        // this.toastr.error('Failed to load defective stock data', 'Error');
      }
    });
  }


  saveData(): void {
    localStorage.setItem('stockItems', JSON.stringify(this.stockItems));
  }

  addItem(): void {
    if (this.newItem.stock && this.newItem.stock_type &&
      this.newItem.defective_quantity >= 0 && this.newItem.reusable_quantity >= 0 &&
      this.newItem.price >= 0 && this.newItem.reason) {

      this.defStockService.addDefStock(this.newItem).subscribe(
        (response) => {
          this.loadServerData();
          this.newItem = {
            id: 0,
            stock: '',
            stock_type: 'Child Product',
            defective_quantity: 0,
            reusable_quantity: 0,
            price: 0,
            reason: ''
          };
          // this.toastr.success('New defective stock item added successfully', 'Success');
        },
        (error) => {
          console.error('Error adding item', error);
          // this.toastr.error('Failed to add defective stock item', 'Error');
        }
      );
    } else {
      this.toastr.warning('Please fill all required fields correctly', 'Warning');
    }
  }


  editItem(index: number): void {
    this.stockItems = this.stockItems.map((item, i) => (i === index ? { ...item, isEditing: true } : item));

  }

  saveItem(index: number): void {
    const itemToUpdate = this.stockItems[index];

    this.defStockService.updateDefStock(itemToUpdate).subscribe(
      (response) => {
        this.stockItems[index] = { ...response, isEditing: false };
        this.loadServerData();
        this.toastr.success('Stock item updated successfully', 'Success');
      },
      (error) => {
        console.error('Error updating item', error);
        this.toastr.error('Failed to update stock item', 'Error');
      }
    );
  }



  cancelEdit(index: number): void {
    this.stockItems = this.stockItems.map((item, i) => (i === index ? { ...item, isEditing: false } : item));
  }

  deleteItem(index: number): void {
    const itemToDelete = this.stockItems[index];
    if (!itemToDelete || !itemToDelete.id) {
      this.toastr.error('Invalid item ID', 'Error');
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete stock: "${itemToDelete.stock}"?`);
    if (!confirmDelete) return;

    this.defStockService.deleteDefStock(itemToDelete.id).subscribe({
      next: () => {
        this.loadServerData();
        this.toastr.success('Stock item deleted successfully', 'Success');
      },
      error: (error) => {
        console.error('Error deleting item:', error);
        if (error.status === 400) {
          this.toastr.error('Item not found in the database', 'Error');
        } else {
          this.toastr.error('Failed to delete stock item', 'Error');
        }
      }
    });
  }

}