import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceApiService } from '../invoice-api.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConsigneeService } from '../consignee.service';

interface LineItem {
  item_id?: number;
  description: string;
  hsn_code: string;
  quantity: number;
  unit_rate: number;
  discount_percentage: number;
  gst_rate: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  total_value?: number;
  discount_amount?: number;
  grand_total?: number;
  editMode?: boolean;
}

interface InvoiceData {
  id?: number;
  invoice_number?: number; // <-- Add this line
  vendor_name: string;
  pan: string; // <-- Add this line
  phone_number: string; // <-- Add this line
  address: string;
  state_code: string; // <-- Add this line
  vendor_code: any;
  gst_no: any;
  p_no: any;
  state: any;
  name: string;
  consignee_state_code: string;
  consignee_pan: any;
  consignee_state: string;
  consignee_p_no: any;

  consignee_address: string;
  remarks: string;
  challan_date: string;
  invoice_date: string;
  challan_number: string;
  order_date: string;
  order_number: string;
  veh_no: string;
  transport_mode: string;
  due_on: string;
  time_of_supply: string;
  payment_terms: string;
  document: string;
  delivery_terms: string;
  transport: string;
  place_of_supply: string;
  l_r_number: string;
  l_r_date: string;
  ref: string;
  total_amount: any;
  items: LineItem[];

  contact_no1?: string; // Assuming this is the first contact number for the consignee
  contact_no2?: string; // Assuming this is the second contact number for the consignee
  country?: string; // Assuming this is the country for the consignee
  city?: string; // Assuming this is the city for the consignee
  pan_no?: string; // Assuming this is the PAN number for the consignee
  gstin?: string; // Assuming this is the GST number for the consignee
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTooltipModule],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
})
export class BillingComponent implements OnInit {
  invoiceData: InvoiceData = {
    vendor_name: '',
    vendor_code: '',
    phone_number: '', // Assuming this is the phone number for the vendor
    gst_no: '',
    pan: '', // Assuming this is the PAN number for the vendor
    p_no: '',
    state_code: '', // Assuming this is the state code for the vendor
    address: '', // Assuming this is the address for the vendor
    state: '',
    name: '',
    consignee_state_code: '',
    consignee_state: '',
    consignee_p_no: '',
    consignee_pan: '',

    consignee_address: '',
    remarks: '',
    challan_date: '',
    invoice_date: '',
    challan_number: '',
    order_date: '',
    order_number: '',
    veh_no: '',
    transport_mode: 'road',
    due_on: '',
    time_of_supply: '',
    payment_terms: '',
    document: '',
    delivery_terms: '',
    transport: '',
    place_of_supply: '',
    l_r_number: '',
    l_r_date: '',
    ref: '',
    total_amount: '',
    items: [],

    // gstin: '', // Assuming this is the GST number for the consignee
    country: '', // Assuming this is the country for the consignee
    city: '', // Assuming this is the city for the consignee
    contact_no2: '', // Assuming this is the second contact number for the consignee
    pan_no: '', // Assuming this is the PAN number for the consignee
    // consignee_address: '', // Assuming this is the address for the consignee
    gstin: '', // Assuming this is the GST number for the consignee

  };

  vendorsArray: any[] = [];
  descriptionsArray: any[] = []; // Assuming this is for descriptions
  selectedVendor: any = null;
  consigneeArray: any[] = []; // Assuming this is for consignees
  selectedConsignee: any = null;

  constructor(
    private invoiceService: InvoiceApiService,
    private route: ActivatedRoute,
    private router: Router,
    private consigneeService: ConsigneeService
  ) { }

  ngOnInit(): void {
    this.getVendors();
    this.getDescriptions();
    this.getConsignees(); // <-- Add this line

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.invoiceService.getInvoiceByNumber(+id).subscribe(
        (res: any) => {
          // this.invoiceData = res.info_details;
          // this.invoiceData.id = +id; // <-- Set the ID for update
          const data = res.info_details;
          this.invoiceData = {
            ...data,
            ...data.vendor,
            ...data.consignee,
            items: data.items || []
          };

          this.selectedVendor = this.vendorsArray.find(
            v => v.vendor_code === data.vendor.vendor_code
          );

          this.selectedConsignee = this.consigneeArray.find(
            c => c.pan_no === data.consignee.pan_no
          );
          this.onVendorChange(this.selectedVendor);
          this.onConsigneeChange(this.selectedConsignee);
        },
        (error) => {
          this.toastr.error('Failed to load invoice for editing', 'Error');
        }
      );
    }
  }

  // Add this helper method:
  setSelectedVendor() {
    if (this.invoiceData && this.invoiceData.vendor_code && this.vendorsArray.length) {
      this.selectedVendor = this.vendorsArray.find(
        v => v.vendor_code === this.invoiceData.vendor_code
      );
    }
  }

  setSelectedConsignee() {
    if (this.invoiceData && this.invoiceData.name && this.consigneeArray.length) {
      this.selectedConsignee = this.consigneeArray.find(
        c => c.name === this.invoiceData.name
      );
    }
  }

  toastr: ToastrService = inject(ToastrService);

  onVendorChange(vendor: any) {
    if (vendor) {
      this.invoiceData.vendor_code = vendor.vendor_code;
      this.invoiceData.gst_no = vendor.gst_number;
      this.invoiceData.pan = vendor.pan;
      this.invoiceData.state = vendor.state;
      this.invoiceData.state_code = vendor.state_code;
      this.invoiceData.phone_number = vendor.phone_number;
      this.invoiceData.p_no = vendor.p_no;
      this.invoiceData.address = vendor.address;
      this.invoiceData.vendor_name = vendor.vendor_name; // ✅ Add this if you're binding vendor name
    }
  }


  onConsigneeChange(consignee: any) {
    if (consignee) {
      this.invoiceData.consignee_address = consignee.address;
      this.invoiceData.gstin = consignee.gstin;
      this.invoiceData.pan_no = consignee.pan_no;
      this.invoiceData.contact_no1 = consignee.contact_no1;
      this.invoiceData.city = consignee.city;
      this.invoiceData.consignee_state = consignee.state;
      this.invoiceData.consignee_state_code = consignee.state_code;
      this.invoiceData.country = consignee.country;
      this.invoiceData.name = consignee.name; // ✅ Add name if needed
    }
  }


  onDescriptionChange(item: any): void {
    const selectedProduct = this.descriptionsArray.find(
      (p) => p.description === item.description
    );
    if (selectedProduct) {
      item.hsn_code = selectedProduct.hsn_code;
      item.quantity = selectedProduct.quantity;
      item.unit_rate = selectedProduct.price;
      // this.toastr.info('Product details updated', 'Info');
    } else {
      // this.toastr.warning('Product not found', 'Warning');
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  addLineItem(): void {
    this.invoiceData.items.push({
      description: '',
      hsn_code: '0',
      quantity: 0,
      unit_rate: 0.0,
      discount_percentage: 0.0,
      gst_rate: 0.0,
      cgst: 0.0,
      sgst: 0.0,
      igst: 0.0,
      discount_amount: 0.0,
      total_value: 0.0,
      grand_total: 0.0,
      editMode: false
    });
    // this.toastr.success('New line item added', 'Success');
  }

  removeLineItem(index: number): void {
    const item = this.invoiceData.items[index];
    if (confirm('Are you sure you want to remove this product?')) {
      // If item has an item_id, delete from backend first
      if (item.item_id) {
        this.invoiceService.deleteLineItem(item.item_id).subscribe(
          () => {
            this.invoiceData.items.splice(index, 1);
            this.invoiceData.items = [...this.invoiceData.items];
            this.toastr.success('Product removed', 'Success');
            this.calculateInvoiceTotal();
          },
          (error) => {
            this.toastr.error('Failed to delete item from server', 'Error');
          }
        );
      } else {
        // If item is not saved yet (no item_id), just remove from UI
        this.invoiceData.items.splice(index, 1);
        this.invoiceData.items = [...this.invoiceData.items];
        this.toastr.success('Product removed', 'Success');
        this.calculateInvoiceTotal();
      }
    }
  }

  calculateNetAmount(item: LineItem): number {
    const base = item.quantity * item.unit_rate;
    const discountAmount = (base * item.discount_percentage) / 100;
    item.discount_amount = discountAmount;
    return base - discountAmount;
  }

  calculateGSTAmount(item: LineItem, rate: number): number {
    const netAmount = this.calculateNetAmount(item);
    return (netAmount * rate) / 100;
  }

  calculateLineItemTotal(item: LineItem): number {
    const net = this.calculateNetAmount(item);
    let totalGST = 0;

    if (item.igst && item.igst > 0) {
      totalGST = this.calculateGSTAmount(item, item.igst);
    } else if ((item.cgst && item.cgst > 0) || (item.sgst && item.sgst > 0)) {
      totalGST =
        this.calculateGSTAmount(item, item.cgst || 0) +
        this.calculateGSTAmount(item, item.sgst || 0);
    } else if (item.gst_rate && item.gst_rate > 0) {
      totalGST = this.calculateGSTAmount(item, item.gst_rate);
    }

    item.total_value = net;
    item.grand_total = net + totalGST;
    return item.grand_total;
  }

  // calculateInvoiceTotal(): number {
  //   const total = this.invoiceData.items.reduce(
  //     (sum, item) => sum + this.calculateLineItemTotal(item),
  //     0
  //   );
  //   this.invoiceData.total_amount = total;
  //   return total;
  // }

  calculateInvoiceTotal(): number {
    const total = this.invoiceData.items.reduce(
      (sum, item) => sum + this.calculateLineItemTotal(item),
      0
    );
    return Number(total.toFixed(2));
  }


  // calculateInvoiceTotal(): number {
  //   return this.invoiceData.items.reduce(
  //     (sum, item) => sum + this.calculateLineItemTotal(item),
  //     0
  //   );
  // }

  getTotalByType(type: 'gst' | 'cgst' | 'sgst' | 'igst'): number {
    let total = 0;
    for (const item of this.invoiceData.items) {
      const net = this.calculateNetAmount(item);
      switch (type) {
        case 'gst':
          total += this.calculateGSTAmount(item, item.gst_rate || 0);
          break;
        case 'cgst':
          total += this.calculateGSTAmount(item, item.cgst || 0);
          break;
        case 'sgst':
          total += this.calculateGSTAmount(item, item.sgst || 0);
          break;
        case 'igst':
          total += this.calculateGSTAmount(item, item.igst || 0);
          break;
      }
    }
    return total;
  }

  getTotalGST(): number {
    let total = 0;
    for (const item of this.invoiceData.items) {
      if (item.igst && item.igst > 0) {
        total += this.calculateGSTAmount(item, item.igst);
      } else if ((item.cgst && item.cgst > 0) || (item.sgst && item.sgst > 0)) {
        total +=
          this.calculateGSTAmount(item, item.cgst || 0) +
          this.calculateGSTAmount(item, item.sgst || 0);
      } else if (item.gst_rate && item.gst_rate > 0) {
        total += this.calculateGSTAmount(item, item.gst_rate);
      }
    }
    return total;
  }

  // submitInvoice(): void {
  //   if (
  //     !this.invoiceData.items ||
  //     this.invoiceData.items.length === 0
  //   ) {
  //     alert('Please enter records!');
  //     return;
  //   }

  //   const firstLineItem = this.invoiceData.items[0];
  //   const formattedPayload: any = { ...this.invoiceData, ...firstLineItem };
  //   delete formattedPayload.lineItems;

  //   this.invoiceService.postInvoice(formattedPayload).subscribe(
  //     (response: any) => {
  //       console.log('Invoice submitted successfully:', response);
  //       alert('Invoice submitted successfully!');
  //     },
  //     (error: any) => {
  //       console.error('Error submitting invoice:', error);
  //       alert('Failed to submit invoice.');
  //     }
  //   );
  // }

  async submitInvoice() {
    if (!this.invoiceData.items || this.invoiceData.items.length === 0) {
      this.toastr.error('Please add at least one item to the invoice', 'Error');
      return;
    }

    if (!this.invoiceData.vendor_name || !this.invoiceData.gst_no) {
      this.toastr.warning('Please select a vendor', 'Warning');
      return;
    }

    this.invoiceData.total_amount = this.calculateInvoiceTotal();

    // The logic to pre-create or pre-update items was flawed.
    // The backend's main create/update endpoints will handle all item operations.

    const normalizedItems = this.invoiceData.items.map(item => this.normalizeLineItemNumbers(item));

    const formattedPayload: any = {
      ...this.invoiceData,
      items: normalizedItems, // Send all items with the invoice
      consignee: {
        name: this.invoiceData.name,
        address: this.invoiceData.consignee_address,
        gstin: this.invoiceData.gstin,
        pan_no: this.invoiceData.pan_no,
        contact_no1: this.invoiceData.contact_no1,
        city: this.invoiceData.city,
        state: this.invoiceData.consignee_state,
        state_code: this.invoiceData.consignee_state_code,
        country: this.invoiceData.country,
      }
    };

    // Clean up payload for the backend
    delete formattedPayload.lineItems;
    delete formattedPayload.vendor;
    if (!this.invoiceData.invoice_number) {
      delete formattedPayload.id;
    }


    if (this.invoiceData.invoice_number) {
      // This is an UPDATE operation.
      this.invoiceService.updateInvoice(this.invoiceData.invoice_number, formattedPayload).subscribe(
        (response: any) => {
          this.toastr.success('Invoice updated successfully', 'Success');
          this.router.navigate(['/all-records']);
          this.resetForm();
        },
        (error: any) => {
          this.toastr.error('Failed to update invoice', 'Error');
        }
      );
    } else {
      // This is a CREATE operation.
      this.invoiceService.postInvoice(formattedPayload).subscribe(
        (response: any) => {
          this.toastr.success('Invoice submitted successfully', 'Success');
          this.router.navigate(['/all-records']);
          this.resetForm();
        },
        (error: any) => {
          this.toastr.error('Failed to submit invoice', 'Error');
        }
      );
    }
  }

  // Add new helper method to reset form
  private resetForm(): void {
    this.invoiceData = {
      vendor_name: '',
      vendor_code: '',
      phone_number: '',
      gst_no: '',
      state_code: '',
      pan: '',
      p_no: '',
      address: '',
      state: '',
      name: '',
      consignee_state_code: '',
      consignee_state: '',
      consignee_p_no: '',
      consignee_pan: '',
      consignee_address: '',
      remarks: '',
      challan_date: '',
      invoice_date: '',
      challan_number: '',
      order_date: '',
      order_number: '',
      veh_no: '',
      transport_mode: 'road',
      due_on: '',
      time_of_supply: '',
      payment_terms: '',
      document: '',
      delivery_terms: '',
      transport: '',
      place_of_supply: '',
      l_r_number: '',
      l_r_date: '',
      ref: '',
      total_amount: '',
      items: [],
      city: '',
      country: '',
      contact_no1: '',
      contact_no2: '',
      pan_no: '',
      gstin: ''
    };
    this.selectedVendor = null;
    this.selectedConsignee = null;
  }


  getVendors(): void {
    this.invoiceService.getBillVendors().subscribe(
      (response: any) => {
        this.vendorsArray = response.all_info;
        this.setSelectedVendor(); // <-- Set selectedVendor after loading vendors
      },
      (error) => {
        this.toastr.error('Failed to load vendors', 'Error');
      }
    );
  }

  getConsignees(): void {
    this.consigneeService.getConsignee().subscribe(
      (response: any) => {
        this.consigneeArray = response.all_consignee;
        this.setSelectedConsignee();
      },
      (error) => {
        this.toastr.error('Failed to load consignees', 'Error');
      }
    );
  }

  getDescriptions(): void {
    this.invoiceService.getBillDescriptions().subscribe(
      (response: any) => {
        console.log(response);
        this.descriptionsArray = response.all_info;
        // this.toastr.success('Product descriptions loaded successfully', 'Success');
      },
      (error: any) => {
        console.error('Error fetching descriptions:', error);
        // this.toastr.error('Failed to load product descriptions', 'Error');
      }
    );
  }

  downloadJSON(): void {
    try {
      // Prepare the data
      const jsonData = {
        invoiceDetails: this.invoiceData,
        calculations: {
          totalGST: this.getTotalByType('gst'),
          totalCGST: this.getTotalByType('cgst'),
          totalSGST: this.getTotalByType('sgst'),
          totalIGST: this.getTotalByType('igst'),
          invoiceTotal: this.calculateInvoiceTotal()
        }
      };

      // Convert to JSON string with proper formatting
      const jsonString = JSON.stringify(jsonData, null, 2);

      // Create blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Set download attributes
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `invoice-data-${timestamp}.json`;
      link.href = url;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      this.toastr.success('JSON file downloaded successfully', 'Success');
    } catch (error) {
      console.error('Error downloading JSON:', error);
      this.toastr.error('Failed to download JSON file', 'Error');
    }
  }

  showAllInvoices() {
    this.router.navigate(['/all-invoices']);
  }

  editLineItem(item: LineItem): void {
    if (!item.item_id) {
      // this.toastr.warning('No item ID found for this line item', 'Warning');
      return;
    }
    this.invoiceService.getLineItemById(item.item_id).subscribe(
      (response: any) => {
        // Open a prompt or modal for editing (for simplicity, using prompt here)
        const updatedDescription = prompt('Edit Description:', response.description);
        const updatedQuantity = prompt('Edit Quantity:', response.quantity);
        // ...add more fields as needed

        if (updatedDescription !== null && updatedQuantity !== null) {
          const updatedItem = {
            ...response,
            description: updatedDescription,
            quantity: Number(updatedQuantity),
            // ...add more fields as needed
          };
          this.invoiceService.updateLineItem(item.item_id!, updatedItem).subscribe(
            (updateRes: any) => {
              this.toastr.success('Items updated successfully', 'Success');
              // Optionally update the UI with new values
              Object.assign(item, updatedItem);
            },
            (error: any) => {
              this.toastr.error('Failed to update item', 'Error');
            }
          );
        }
      },
      (error: any) => {
        this.toastr.error('Failed to fetch  item details', 'Error');
      }
    );
  }

  saveLineItem(item: LineItem): void {
    if (!item.item_id) {
      // this.toastr.warning('No item ID found for this  item', 'Warning');
      item.editMode = false;
      return;
    }

    // Add invoice_number to the payload
    const payload = {
      ...this.normalizeLineItemNumbers(item),
      invoice_number: this.invoiceData.invoice_number
    };

    this.invoiceService.updateLineItem(item.item_id, payload).subscribe(
      (response: any) => {
        this.toastr.success('Item updated successfully', 'Success');
        item.editMode = false;
        Object.assign(item, response);
        this.calculateInvoiceTotal();
      },
      (error: any) => {
        this.toastr.error('Failed to update  item', 'Error');
      }
    );
  }

  // Helper to get GST breakdown for a line item
  getGSTBreakdown(item: LineItem) {
    if (item.igst && item.igst > 0) {
      return {
        cgst: 0,
        sgst: 0,
        igst: this.calculateGSTAmount(item, item.igst),
        gst: this.calculateGSTAmount(item, item.igst)
      };
    } else if ((item.cgst && item.cgst > 0) || (item.sgst && item.sgst > 0)) {
      return {
        cgst: this.calculateGSTAmount(item, item.cgst || 0),
        sgst: this.calculateGSTAmount(item, item.sgst || 0),
        igst: 0,
        gst: this.calculateGSTAmount(item, item.cgst || 0) + this.calculateGSTAmount(item, item.sgst || 0)
      };
    } else if (item.gst_rate && item.gst_rate > 0) {
      const gst = this.calculateGSTAmount(item, item.gst_rate);
      return { cgst: 0, sgst: 0, igst: 0, gst };
    } else {
      return { cgst: 0, sgst: 0, igst: 0, gst: 0 };
    }
  }

  private normalizeLineItemNumbers(item: LineItem): LineItem {
    return {
      ...item,
      gst_rate: Number(item.gst_rate) || 0,
      cgst: Number(item.cgst) || 0,
      sgst: Number(item.sgst) || 0,
      igst: Number(item.igst) || 0,
      quantity: Number(item.quantity) || 0,
      unit_rate: Number(item.unit_rate) || 0,
      discount_percentage: Number(item.discount_percentage) || 0,
      discount_amount: Number(item.discount_amount) || 0,
      total_value: Number(Number(item.total_value).toFixed(2)) || 0,
      grand_total: Number(Number(item.grand_total).toFixed(2)) || 0,
    };
  }
}