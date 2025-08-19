import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EInvoiceService } from '../e-invoice.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

interface EInvoice {
  id?: number;
  sellergstin: string;
  sellerlegalname: string;
  sellertradename: string;
  selleraddr1: string;
  selleraddr2: string;
  sellerlocation: string;
  sellerstate: string;
  sellerpincode: string;
  sellerphonenumber: string;
  selleremailid: string;
  supplytypecode: string;
  documenttype: string;
  documentnumber: string;
  documentdate: string;
  buyersgstin: string;
  buyerlegalname: string;
  buyerpos: string;
  buyeraddr1: string;
  buyerlocation: string;
  buyerpincode: string;
  buyerstate: string;
  sino: string;
  hsncode: string;
  slno: string;
  quantity: number;
  unit: string;
  unitprice: number;
  grossamount: number;
  taxablevalue: number;
  gstrate: number;
  itemtotal: number;
  totaltaxablevalue: number;
  totalinvoicevalue: number;
}

@Component({
  selector: 'app-e-invoice-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, CommonModule, MatIconModule, MatDialogModule, ToastrModule, MatTooltipModule],
  templateUrl: './e-invoice.component.html',
  styleUrls: ['./e-invoice.component.css']
})


export class EInvoiceCreateComponent implements OnInit {
  // eInvoice: EInvoice = {
  //   sellergstin: '',
  //   sellerlegalname: '',
  //   sellertradename: '',
  //   selleraddr1: '',
  //   selleraddr2: '',
  //   sellerlocation: '',
  //   sellerstate: '',
  //   sellerpincode: '',
  //   sellerphonenumber: '',
  //   selleremailid: '',
  //   supplytypecode: '',
  //   documenttype: '',
  //   documentnumber: '',
  //   documentdate: '',
  //   buyersgstin: '',
  //   buyerlegalname: '',
  //   buyerpos: '',
  //   buyeraddr1: '',
  //   buyerlocation: '',
  //   buyerpincode: '',
  //   buyerstate: '',
  //   sino: '',
  //   hsncode: '',
  //   slno: '',
  //   quantity: 0,
  //   unit: '',
  //   unitprice: 0,
  //   grossamount: 0,
  //   taxablevalue: 0,
  //   gstrate: 0,
  //   itemtotal: 0,
  //   totaltaxablevalue: 0,
  //   totalinvoicevalue: 0
  // };
  eInvoiceForm!: FormGroup;
  isSubmitting = false;

  invoices: any[] = [];

  constructor(
    private fb: FormBuilder,
    private eInvoiceService: EInvoiceService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.eInvoiceForm = this.fb.group({
      sellergstin: ['', Validators.required],
      sellerlegalname: ['', Validators.required],
      sellertradename: [''],
      selleraddr1: ['', Validators.required],
      selleraddr2: [''],
      sellerlocation: ['', Validators.required],
      sellerstate: ['', Validators.required],
      sellerpincode: ['', Validators.required],
      sellerphonenumber: [''],
      selleremailid: [''],
      supplytypecode: ['', Validators.required],
      documenttype: ['', Validators.required],
      documentnumber: ['', Validators.required],
      documentdate: ['', Validators.required],
      buyersgstin: ['', Validators.required],
      buyerlegalname: ['', Validators.required],
      buyerpos: ['', Validators.required],
      buyeraddr1: ['', Validators.required],
      buyerlocation: ['', Validators.required],
      buyerpincode: ['', Validators.required],
      buyerstate: ['', Validators.required],
      sino: ['', Validators.required],
      hsncode: ['', Validators.required],
      slno: ['', Validators.required],
      quantity: [0, Validators.required],
      unit: ['', Validators.required],
      unitprice: [0, Validators.required],
      grossamount: [0, Validators.required],
      taxablevalue: [0, Validators.required],
      gstrate: [0, Validators.required],
      itemtotal: [0, Validators.required],
      totaltaxablevalue: [0, Validators.required],
      totalinvoicevalue: [0, Validators.required]
    });

    this.getAllInvoices(); // Get list on load
  }

  getAllInvoices() {
    this.eInvoiceService.getAllEInvoices().subscribe({
      next: (data) => {
        // Make sure we're getting the correct array property
        this.invoices = data.all_invoices || [];
        console.log('Fetched invoices:', this.invoices); // Debug log
      },
      error: (err) => {
        console.error('Error fetching invoices:', err);
        this.toastr.error('Failed to fetch invoices');
      }
    });
  }

  get f() {
    return this.eInvoiceForm.controls;
  }

  // onSubmit() {
  //   if (this.eInvoiceForm.valid) {
  //     this.isSubmitting = true;

  //     const invoiceData: EInvoice = this.eInvoiceForm.value;

  //     this.eInvoiceService.createEInvoice(invoiceData).subscribe({
  //       next: (res) => {
  //         console.log('Invoice created:', res);
  //         this.eInvoiceForm.reset();
  //         this.isSubmitting = false;
  //       },
  //       error: (err) => {
  //         console.error('Error creating invoice:', err);
  //         this.isSubmitting = false;
  //       }
  //     });
  //   } else {
  //     Object.values(this.eInvoiceForm.controls).forEach(control => {
  //       control.markAsTouched();
  //     });
  //   }
  // }

  onSubmit() {
    if (this.eInvoiceForm.valid) {
      this.isSubmitting = true;

      const invoiceData: EInvoice = this.eInvoiceForm.value;

      this.eInvoiceService.createEInvoice(invoiceData).subscribe({
        next: (response) => {
          // Update the local array with the new data from API
          this.getAllInvoices(); // Refresh the list from server

          // Show success message and reset form
          this.toastr.success('Invoice created successfully');
          this.eInvoiceForm.reset();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error creating invoice:', err);
          this.toastr.error('Failed to create invoice');
          this.isSubmitting = false;
        }
      });
    } else {
      Object.values(this.eInvoiceForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.toastr.warning('Please fill all required fields');
    }
  }


  downloadInvoiceJson(): void {
    if (this.eInvoiceForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const invoiceData = {
      ...this.eInvoiceForm.value,
      downloadedAt: new Date().toISOString(),
      status: 'DRAFT'
    };

    // Validate if we have actual data
    const hasValues = Object.values(invoiceData).some(value =>
      value !== '' && value !== null && value !== 0
    );

    if (!hasValues) {
      console.error('No data to download');
      return;
    }

    // Generate a meaningful filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const documentNumber = invoiceData.documentnumber || 'draft';
    const filename = `e-invoice-${documentNumber}-${timestamp}.json`;

    // Format the JSON (pretty-print with 2-space indentation)
    const jsonStr = JSON.stringify(invoiceData, null, 2);

    // Create a Blob and trigger download
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    window.URL.revokeObjectURL(url);
  }

  // Add this new method
  downloadExistingInvoice(invoice: any): void {
    if (!invoice) {
      console.error('No invoice data to download');
      return;
    }

    // Format the invoice data
    const invoiceData = {
      ...invoice,
      downloadedAt: new Date().toISOString()
    };

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `e-invoice-${invoice.documentnumber}-${timestamp}.json`;

    // Create and download JSON file
    const jsonStr = JSON.stringify(invoiceData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  deleteInvoice(invoice: any): void {
    if (!invoice.id) {
      this.toastr.error('Invalid invoice ID');
      return;
    }

    if (confirm('Are you sure you want to delete this invoice?')) {
      this.isSubmitting = true;
      this.eInvoiceService.deleteEInvoice(invoice.id).subscribe({
        next: () => {
          this.toastr.success('Invoice deleted successfully');
          this.invoices = this.invoices.filter(i => i.id !== invoice.id);
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error deleting invoice:', error);
          this.toastr.error('Failed to delete invoice. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }

}