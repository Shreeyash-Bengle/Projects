import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorService, Vendor } from '../vendor.service';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-vendor',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.css'],
})
export class AddVendorComponent implements OnInit {
  vendor: Vendor = {
    vendor_name: '',
    vendor_code: '',
    p_no: '',
    pan: '',
    address: '',
    gst_number: '',
    state: '',
    state_code: '',
    phone_number: '',
  };

  vendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  editingIndex: number | null = null;

  constructor(private vendorService: VendorService) { }

  ngOnInit(): void {
    this.loadVendors();
  }

  toastr: ToastrService = inject(ToastrService);


  // Load the vendor list from the backend
  loadVendors(): void {
    this.vendorService.getVendors().subscribe({
      next: (data: any) => {
        this.vendors = data.all_info;
        this.filteredVendors = [...this.vendors];
        // this.toastr.success('Vendors loaded successfully', 'Success');
      },
      error: (err) => {
        console.error('Error fetching vendors:', err);
        // this.toastr.error('Failed to load vendors', 'Error');
      },
    });
  }

  addVendor(): void {
    if (this.vendor.vendor_name && this.vendor.gst_number) {
      if (this.editingIndex !== null && this.vendor.id) {
        // Update existing vendor
        this.vendorService.updateVendor(this.vendor).subscribe({
          next: (updatedVendor: Vendor) => {
            this.vendors[this.editingIndex!] = updatedVendor;
            this.editingIndex = null;
            this.resetForm();
            this.loadVendors();
            this.toastr.success('Vendor updated successfully', 'Success');
          },
          error: (err) => {
            console.error('Error updating vendor:', err);
            this.toastr.error('Failed to update vendor', 'Error');
          },
        });
      } else {
        // Add new vendor
        this.vendorService.addVendor(this.vendor).subscribe({
          next: (newVendor: Vendor) => {
            this.vendors.push(newVendor);
            this.resetForm();
            this.loadVendors();
            this.toastr.success('New vendor added successfully', 'Success');
          },
          error: (err) => {
            console.error('Error adding vendor:', err);
            this.toastr.error('Failed to add vendor', 'Error');
          },
        });
      }
    } else {
      this.toastr.warning('Vendor Name and GST Number are required!', 'Warning');
    }
  }

  editVendor(index: number): void {
    this.vendor = { ...this.vendors[index] };
    this.editingIndex = index;
    // this.toastr.info('Editing vendor details', 'Info');
  }

  deleteVendor(index: number): void {
    if (confirm('Are you sure to delete?')) {
      const vendorToDelete = this.vendors[index];
      if (vendorToDelete.id) {
        this.vendorService.deleteVendor(vendorToDelete.id).subscribe({
          next: () => {
            this.vendors.splice(index, 1);
            this.toastr.success('Vendor deleted successfully', 'Success');
          },
          error: (err) => {
            console.error('Error deleting vendor:', err);
            this.toastr.error('Failed to delete vendor', 'Error');
          },
        });
      } else {
        this.vendors.splice(index, 1);
        this.toastr.warning('Removed untracked vendor', 'Warning');
      }
    }
  }

  resetForm(): void {
    this.vendor = {
      vendor_name: '',
      vendor_code: '',
      p_no: '',
      pan: '',
      address: '',
      gst_number: '',
      state: '',
      state_code: '',
      phone_number: '',
    };
    this.editingIndex = null;
    // this.toastr.info('Form reset', 'Info');
  }

  // Add these properties
  searchTerm: string = '';

  filterVendors() {
    if (!this.searchTerm?.trim()) {
      this.filteredVendors = [...this.vendors];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredVendors = this.vendors.filter(vendor => 
      vendor.vendor_name?.toLowerCase().includes(searchTermLower)
    );
  }
}
