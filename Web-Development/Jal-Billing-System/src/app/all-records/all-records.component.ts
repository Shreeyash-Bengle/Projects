import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { InvoiceApiService } from '../invoice-api.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConsigneeService } from '../consignee.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-all-records',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterLink,
    MatMenuModule,
    MatSortModule
  ],

  templateUrl: './all-records.component.html',
  styleUrl: './all-records.component.css',
})
export class AllRecordsComponent implements OnInit {
  invoices: any[] = [];
  consignors: any[] = [];
  vendors: any[] = [];

  displayedColumns: string[] = [
    'invoice_number',
    'invoice_date',
    'vendor_name',
    'consignee_name',
    'due_on',
    'transport_mode',
    // 'gst_no',
    // 'payment_terms',
    'action'
  ];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  deletingInvoiceId: number | null = null;
  toastr: ToastrService = inject(ToastrService);

  // Add these properties
  searchTerm: string = '';
  filteredInvoices: any[] = [];

  constructor(private invoiceService: InvoiceApiService, private router: Router, private consigneeService: ConsigneeService) { }

  ngOnInit() {
    this.getAllInvoices();
    this.getAllVendors();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  convertNumberToWords(amount: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convertHundreds = (num: number): string => {
      let result = '';

      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }

      if (num >= 20) {
        result += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
      } else if (num >= 10) {
        result += teens[num - 10] + ' ';
        return result;
      }

      if (num > 0) {
        result += ones[num] + ' ';
      }

      return result;
    };

    if (amount === 0) return 'Zero';

    let wholePart = Math.floor(amount);
    const decimalPart = Math.round((amount - Math.floor(amount)) * 100);

    let result = '';

    if (wholePart >= 10000000) {
      result += convertHundreds(Math.floor(wholePart / 10000000)) + 'Crore ';
      wholePart %= 10000000;
    }

    if (wholePart >= 100000) {
      result += convertHundreds(Math.floor(wholePart / 100000)) + 'Lakh ';
      wholePart %= 100000;
    }

    if (wholePart >= 1000) {
      result += convertHundreds(Math.floor(wholePart / 1000)) + 'Thousand ';
      wholePart %= 1000;
    }

    if (wholePart > 0) {
      result += convertHundreds(wholePart);
    }

    result += 'Rupees';

    if (decimalPart > 0) {
      result += ' and ' + convertHundreds(decimalPart) + 'Paise';
    }

    return result.trim();
  }

  getAllInvoices() {
    this.invoiceService.getAllInvoices().subscribe({
      next: (response: any) => {
        if (response && response.all_info) {
          this.invoices = response.all_info;
          this.dataSource = new MatTableDataSource(this.invoices);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        this.toastr.error('Failed to load records');
      }
    });
  }


  getAllVendors() {
    this.invoiceService.getBillVendors().subscribe(
      (response: any) => {
        this.vendors = response.all_info;
        // this.toastr.success('Vendors loaded successfully', 'Success');
      },
      (error) => {
        console.error('Error fetching Vendors:', error);
        // this.toastr.error('Failed to load Vendors', 'Error');
      }
    );
  }

  getAllConsignors() {
    this.consigneeService.getConsignee().subscribe(
      (response: any) => {
        this.consignors = response.all_consignee;
        // this.toastr.success('Consignors loaded successfully', 'Success');
      },
      (error) => {
        console.error('Error fetching Consignors:', error);
        // this.toastr.error('Failed to load Consignors', 'Error');
      }
    );
  }

  deleteInvoice(invoiceNumber: number) {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.deletingInvoiceId = invoiceNumber;
      this.invoiceService.deleteInvoice(invoiceNumber).subscribe(
        () => {
          this.toastr.success('Invoice deleted successfully', 'Success');
          this.getAllInvoices();
          this.deletingInvoiceId = null;
        },
        (error) => {
          console.error('Error deleting invoice:', error);
          this.toastr.error('Failed to delete invoice', 'Error');
          this.deletingInvoiceId = null;
        }
      );
    }
  }

  printInvoice(invoiceNumber: number, copyType: string = 'ORIGINAL FOR RECIPIENT') {
    this.invoiceService.getInvoiceByNumber(invoiceNumber).subscribe(
      (res: any) => {
        const invoice = res.info_details;
        const vendor = res.vendors?.[0] || {};


        if (!invoice) {
          this.toastr.error('Invoice data not found', 'Error');
          return;
        }

        const items = invoice.items || [];

        // Watermark logic
        let watermark = '';
        const nonOriginalCopies = [
          'DUPLICATE FOR TRANSPORT',
          'TRIPLICATE FOR TRANSPORTER',
          'EXTRA COPY'
        ];
        if (nonOriginalCopies.includes(copyType)) {
          watermark = copyType;
        }

        // ✅ Calculate dynamic totals
        const getTaxableAmount = (item: any): number => {
          const gstRate = Number(item.cgst || 0) + Number(item.sgst || 0) + Number(item.igst || 0) || Number(item.gst_rate) || 0;
          const totalWithTax = Number(item.grand_total || item.total_value || 0);

          if (gstRate > 0) {
            return totalWithTax / (1 + gstRate / 100);
          } else {
            return totalWithTax;
          }
        };

        // Calculate GST total using gst_rate
        const gstTotal = items.reduce((sum: number, item: any) => {
          const rate = item.gst_rate || 0;
          const taxable = item.total_value || 0;
          return sum + (rate > 0 ? taxable * rate / 100 : 0);
        }, 0);

        // Calculate CGST, SGST, IGST totals using their rates
        const cgstTotal = items.reduce((sum: number, item: any) => {
          const rate = item.cgst || 0;
          const taxable = item.total_value || 0;
          return sum + (rate > 0 ? taxable * rate / 100 : 0);
        }, 0);

        const sgstTotal = items.reduce((sum: number, item: any) => {
          const rate = item.sgst || 0;
          const taxable = item.total_value || 0;
          return sum + (rate > 0 ? taxable * rate / 100 : 0);
        }, 0);

        const igstTotal = items.reduce((sum: number, item: any) => {
          const rate = item.igst || 0;
          const taxable = item.total_value || 0;
          return sum + (rate > 0 ? taxable * rate / 100 : 0);
        }, 0);

        // Calculate total taxable amount (just sum total_value)
        const taxableAmount = items.reduce((sum: number, item: any) => sum + getTaxableAmount(item), 0);

        // GST rates: collect all non-zero GST rates from items
        const gstRates = Array.from(new Set(items.map((item: any) => item.gst_rate)))
          .filter((r): r is number => typeof r === 'number' && r > 0);
        const gstRateDisplay = gstRates.length ? gstRates.join('%, ') + '%' : '';

        const itemRows = items.map((item: any, index: number) => `
  <tr>
    <td style="padding: 4px; font-size: 10px; text-align: center;">${index + 1}</td>
    <td style="padding: 4px; font-size: 10px;">${item.description}</td>
    <td style="padding: 4px; font-size: 10px;">${item.hsn_code}</td>
    <td style="padding: 4px; font-size: 10px; text-align: right;">${item.quantity}</td>
    <td style="padding: 4px; font-size: 10px; text-align: right;">₹${item.unit_rate}</td>
    <td style="padding: 4px; font-size: 10px; text-align: right;">₹${item.total_value}</td>
  </tr>
`).join('');


        // Calculate unique rates for display, filter out 0
        const cgstRates = Array.from(new Set(items.map((item: any) => item.cgst)))
          .filter((r): r is number => typeof r === 'number' && r > 0);

        const sgstRates = Array.from(new Set(items.map((item: any) => item.sgst)))
          .filter((r): r is number => typeof r === 'number' && r > 0);

        const igstRates = Array.from(new Set(items.map((item: any) => item.igst)))
          .filter((r): r is number => typeof r === 'number' && r > 0);

        const formatRates = (rates: number[]) => rates.length ? rates.join('%, ') + '%' : '';
        const cgstRateDisplay = formatRates(cgstRates);
        const sgstRateDisplay = formatRates(sgstRates);
        const igstRateDisplay = formatRates(igstRates);

        const printWindow = window.open('', '', 'width=750,height=900');
        if (!printWindow) {
          this.toastr.error('Unable to open print window. Check popup settings.', 'Error');
          return;
        }
        setTimeout(() => {
          const totalAmountNum = Number(invoice.total_amount) || 0;
          const totalAmountWords = numberToWords(Math.floor(totalAmountNum));

          printWindow.document.write(`
  <html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      * {
        box-sizing: border-box;
      }
      
      .watermark {
        position: fixed;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-30deg);
        font-size: 52px;
        color: rgba(0, 0, 0, 0.08);
        white-space: nowrap;
        pointer-events: none;
        z-index: 999;
        font-weight: 700;
      }
      
      .copy-type {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 15px;
        font-weight: 600;
        color: #000;
        text-transform: uppercase;
        border: 2px solid #000;
        padding: 6px 12px;
        border-radius: 3px;
        letter-spacing: 0.3px;
        background: white;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      @media print {
        body {
          margin: 0;
          padding: 0;
          font-size: 11px;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        
        .print-button {
          display: none;
        }
        
        .invoice-container {
          width: 100%;
          margin: 0;
          padding: 4px;
          box-sizing: border-box;
        }
        
        .header-section {
          border: 3px solid #000 !important;
          background: white !important;
          color: #000 !important;
          padding: 6px 10px !important;
          margin: 0 0 4px 0 !important;
        }
        
        .company-info-header h1 {
          color: #000 !important;
          font-size: 26px !important;
        }
        
        .invoice-title {
          color: #000 !important;
          font-size: 18px !important;
        }
        
        .invoice-number {
          font-size: 16px !important;
        }
        
        .company-logo-section img {
          max-height: 115px !important;
          max-width: 115px !important;
          min-height: 115px !important;
          min-width: 115px !important;
          width: 115px !important;
          height: 115px !important;
          object-fit: contain !important;
          border: 2px solid #000 !important;
          border-radius: 4px !important;
        }
        
        .copy-type {
          position: absolute !important;
          top: 8px !important;
          right: 12px !important;
          font-size: 12px !important;
          padding: 3px 6px !important;
          border: 2px solid #000 !important;
          background: white !important;
          color: #000 !important;
          z-index: 1000 !important;
          display: block !important;
        }
        
        .company-details {
          padding: 4px 7px !important;
          margin: 3px 0 !important;
        }
        
        .company-details p {
          font-size: 10px !important;
          margin: 0 !important;
        }
        
        h2, h3 {
          margin: 3px 0 2px 0 !important;
          font-size: 11px !important;
          padding-bottom: 2px !important;
          font-weight: 900 !important;
        }
        
        .table th, .table td,
        .item-table th, .item-table td,
        .total-table td {
          padding: 3px 5px !important;
          font-size: 9px !important;
        }
        
        .section-divider {
          margin: 3px 0 !important;
          height: 1px !important;
        }
        
        .bottom-section {
          margin-top: 4px !important;
        }
        
        .left-bottom-text, .right-bottom-signature {
          padding: 4px !important;
          font-size: 8px !important;
        }
        
        .signature-line {
          height: 22px !important;
          margin: 5px 0 !important;
        }
        
        .bank-total-section {
          margin-top: 4px !important;
          gap: 12px !important;
        }
        
        .bank-details-left {
          padding: 4px !important;
          margin: 3px 0 !important;
        }
        
        .amount-in-words {
          font-size: 9px !important;
          padding: 4px !important;
          margin-top: 4px !important;
        }
        
        .invoice-title-section {
          text-align: center !important;
        }
        
        .table, .item-table, .total-table {
          margin: 3px 0 !important;
        }
      }
      
      body {
        font-family: 'Inter', Arial, sans-serif;
        font-size: 13px;
        padding: 0;
        margin: 0;
        background: white;
        color: #000;
        line-height: 1.3;
        position: relative;
      }
      
      .invoice-container {
        width: 100%;
        max-width: 720px;
        margin: 0 auto;
        padding: 7px;
        box-sizing: border-box;
        background: white;
        position: relative;
        min-height: 100vh;
      }
      
      .header-section {
        border: 3px solid #000;
        color: #000;
        padding: 10px 14px;
        margin: 0 0 7px 0;
        background: white;
        position: relative;
      }
      
      .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }
      
      .company-logo-section {
        display: flex;
        align-items: center;
        gap: 14px;
        flex: 1;
      }
      
      .company-logo-section img {
        max-height: 130px;
        max-width: 130px;
        min-height: 130px;
        min-width: 130px;
        width: 130px;
        height: 130px;
        border: 2px solid #000;
        border-radius: 4px;
        object-fit: contain;
        display: block;
      }
      
      .company-info-header {
        color: #000;
      }
      
      .company-info-header h1 {
        margin: 0;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 1.5px;
        color: #000;
      }
      
      .company-info-header .tagline {
        font-size: 14px;
        margin: 3px 0;
        font-weight: 500;
        color: #333;
      }
      
      .invoice-title-section {
        text-align: center;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 15px;
      }
      
      .invoice-title {
        font-size: 25px;
        font-weight: 700;
        margin: 0 0 7px 0;
        letter-spacing: 1.5px;
        color: #000;
        text-transform: uppercase;
      }
      
      .invoice-meta {
        text-align: right;
        color: #000;
        flex: 1;
      }
      
      .invoice-number {
        font-size: 18px;
        font-weight: 700;
        color: #000;
        border: none;
        padding: 5px 0;
        background: transparent;
        letter-spacing: 0.5px;
        margin-bottom: 5px;
      }
      
      .invoice-date {
        font-size: 14px;
        color: #555;
        margin-top: 5px;
      }
      
      .company-details {
        border: 1px solid #000;
        padding: 7px 9px;
        margin: 5px 0;
        background: white;
      }
      
      .company-details p {
        margin: 0;
        font-size: 13px;
        color: #000;
        line-height: 1.3;
      }
      
      h2, h3 {
        margin: 5px 0 3px 0;
        font-weight: 900;
        color: #000;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #000;
        padding-bottom: 2px;
        background: white;
      }
      
      .section-divider {
        height: 2px;
        background: #000;
        margin: 4px 0;
        border: none;
      }
      
      .table, .item-table, .total-table {
        width: 100%;
        border-collapse: collapse;
        margin: 4px 0;
        background: white;
        border: 1px solid #000;
      }
      
      .table th, .table td,
      .item-table th, .item-table td,
      .total-table td {
        padding: 5px 7px;
        font-size: 12px;
        text-align: left;
        vertical-align: top;
        border: 1px solid #000;
        background: white;
        line-height: 1.3;
      }
      
      .table th,
      .item-table th {
        background: #f0f0f0;
        font-weight: 700;
        color: #000;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        font-size: 11px;
      }
      
      .item-table th {
        background: #e0e0e0;
        color: #000;
        font-size: 12px;
        font-weight: 700;
      }
      
      .total-table {
        background: white;
        border: 2px solid #000;
        width: 200px;
      }
      
      .total-table td {
        font-weight: 500;
        border: 1px solid #000;
        background: white;
        font-size: 12px;
      }
      
      .total-table tr:last-child td {
        background: #000;
        color: white;
        font-weight: 700;
        font-size: 13px;
        border: 2px solid #000;
      }
      
      .bank-total-section {
        display: flex;
        justify-content: space-between;
        margin-top: 7px;
        gap: 16px;
        align-items: flex-start;
      }
      
      .bank-details-left {
        border: 1px solid #000;
        padding: 7px;
        background: white;
        flex: 1;
        max-width: 420px;
      }
      
      .bank-details-left h3 {
        margin: 0 0 4px 0;
        font-size: 14px;
        font-weight: 900;
        border-bottom: 2px solid #000;
        padding-bottom: 2px;
      }
      
      .bank-details-left .table {
        margin: 0;
      }
      
      .bank-details-left .table th,
      .bank-details-left .table td {
        font-size: 12px;
      }
      
      .total-table-wrapper {
        display: flex;
        justify-content: flex-end;
        flex-shrink: 0;
      }
      
      .amount-in-words {
        margin-top: 7px;
        padding: 7px 11px;
        border: 2px solid #000;
        background: #f8f8f8;
        font-size: 12px;
        font-weight: 600;
        color: #000;
        border-radius: 4px;
      }
      
      .bold {
        font-weight: 700;
      }
      
      .right {
        text-align: right;
      }
      
      .bottom-section {
        display: flex;
        justify-content: space-between;
        margin-top: 9px;
        gap: 14px;
      }
      
      .left-bottom-text {
        font-size: 10px;
        line-height: 1.3;
        color: #000;
        border: 1px solid #000;
        padding: 7px;
        flex: 1;
        background: white;
      }
      
      .right-bottom-signature {
        font-size: 12px;
        text-align: center;
        border: 1px solid #000;
        padding: 7px;
        min-width: 130px;
        background: white;
      }
      
      .signature-line {
        height: 22px;
        border-bottom: 2px solid #000;
        margin: 7px 0;
      }
      
      .print-button {
        padding: 7px 14px;
        background: #000;
        color: white;
        border: 2px solid #000;
        border-radius: 4px;
        float: right;
        margin: 7px 0;
        font-size: 12px;
        cursor: pointer;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .print-button:hover {
        background: white;
        color: #000;
      }
      
      @media print {
        * {
          background: white !important;
          color: #000 !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
        
        .total-table tr:last-child td {
          background: #000 !important;
          color: white !important;
        }
        
        .item-table th {
          background: #e0e0e0 !important;
          color: #000 !important;
        }
        
        .table th {
          background: #f0f0f0 !important;
          color: #000 !important;
        }
        
        .bank-total-section {
          display: flex !important;
        }
        
        .amount-in-words {
          background: #f8f8f8 !important;
          color: #000 !important;
          border: 2px solid #000 !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="copy-type">${copyType}</div>
    
    <div class="invoice-container">
      <div class="header-section">
        <div class="header-content">
          <div class="company-logo-section">
            <img src="./assets/jal.jpg" alt="Company Logo">
            <div class="company-info-header">
              <h1>JAL</h1>
              <div class="tagline">Manufacturers: Air / Oil / Fuel Filters</div>
            </div>
          </div>
          
          <div class="invoice-title-section">
            <div class="invoice-title">TAX INVOICE</div>
          </div>
          
          <div class="invoice-meta">
            <div class="invoice-number">Invoice No: ${invoice.invoice_number}</div>
            <div class="invoice-date">Date: ${(() => {
              if (invoice.invoice_date) {
                const date = new Date(invoice.invoice_date);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              }
              return '';
            })()}</div>

          </div>
        </div>
      </div>
      
      <div class="company-details">
        <p><strong>Address:</strong> GAT No.663/1, A/p GOGALWADI, Tal: HAVELI, NEAR SEINUMERU NIRMAN GOGALWADI PLANT, PUNE- 412205.</p>
        <p><strong>Contact:</strong> (M) 9850410051 | <strong>Email:</strong> sandesh.tawade.jal@gmail.com</p>
      </div>
      
      <hr class="section-divider">
      
      <h3>Vendor Details</h3>
      <table class="table">
        <tr>
          <th style="width: 20%;">Vendor Name</th>
          <td style="width: 30%; font-weight: bold;">${invoice.vendor?.vendor_name || ''}</td>
          <th style="width: 20%;">Vendor Code</th>
          <td style="width: 30%;">${invoice.vendor?.vendor_code || invoice.vendor_code || ''}</td>
        </tr>
        <tr>
          <th>GSTIN</th>
          <td>${invoice.vendor?.gst_number || ''}</td>
          <th>Address</th>
          <td>${invoice.vendor?.address || ''}</td>
        </tr>
        <tr>
          <th>State</th>
          <td>${invoice.vendor?.state || ''}</td>
          <th>State Code</th>
          <td>${invoice.vendor?.state_code || ''}</td>
        </tr>
        <tr>
          <th>Contact No</th>
          <td>${invoice.vendor?.phone_number || ''}</td>
          <th>PO Number</th>
          <td>${invoice.vendor?.p_no || ''}</td>
        </tr>
        <tr>
          <th>PAN Number</th>
          <td>${invoice.vendor?.pan || ''}</td>
          <th>Order Date</th>
          <td>${(() => {
              if (invoice.order_date) {
                const date = new Date(invoice.order_date);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              }
              return '';
            })()}</td>
        </tr>
      </table>
      
      <hr class="section-divider">
      
      <h3>Consignee Details</h3>
      <table class="table">
        <tr>
          <th>Name</th>
          <td style="font-weight: bold;">${invoice.consignee?.name || ''}</td>
          <th>Address</th>
          <td>${invoice.consignee?.address || ''}</td>
        </tr>
        <tr>
          <th>GSTIN</th>
          <td>${invoice.consignee?.gstin || ''}</td>
          <th>PAN No</th>
          <td>${invoice.consignee?.pan_no || ''}</td>
        </tr>
        <tr>
          <th>Contact No</th>
          <td>${invoice.consignee?.contact_no1 || ''}</td>
          <th>Country</th>
          <td>${invoice.consignee?.country || ''}</td>
        </tr>
        <tr>
          <th>State</th>
          <td>${invoice.consignee?.state || ''}</td>
          <th>State Code</th>
          <td>${invoice.consignee?.state_code || ''}</td>
        </tr>
        <tr>
          <th>City</th>
          <td>${invoice.consignee?.city || ''}</td>
          <th>Vehicle No</th>
          <td>${invoice.veh_no}</td>
        </tr>
        <tr>
          <th>Transport Mode</th>
          <td>${invoice.transport_mode}</td>
          
        </tr>
      </table>
      
      <hr class="section-divider">
      
      <h3>Items</h3>
      <table class="item-table">
        <tr>
          <th style="width: 5%; text-align: center;">Sr. No.</th>
          <th style="width: 35%;">Description</th>
          <th style="width: 15%;">HSN Code</th>
          <th style="width: 10%; text-align: right;">Qty</th>
          <th style="width: 15%; text-align: right;">Rate</th>
          <th style="width: 20%; text-align: right;">Total</th>
        </tr>
        ${itemRows}
      </table>
      
      <div class="bank-total-section">
        <div class="bank-details-left">
          <h3>Bank Details</h3>
          <table class="table">
            <tr><th style="width: 30%;">Bank Name</th><td style="width: 70%;">MAHESH SAHAKARI BANK LTD.PUNE</td></tr>
            <tr><th>Branch</th><td>SINHAGAD ROAD</td></tr>
            <tr><th>Account No</th><td>011130100000143</td></tr>
            <tr><th>IFSC Code</th><td>MSBL0000011</td></tr>
          </table>
        </div>
        
        <div class="total-table-wrapper">
          <table class="total-table">
            <tr>
              <td colspan="3" class="right bold">Taxable Amount</td>
              <td class="right">₹${taxableAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="right">GST (${gstRateDisplay})</td>
              <td class="right">₹${gstTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="right">CGST (${cgstRateDisplay})</td>
              <td class="right">₹${cgstTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="right">SGST (${sgstRateDisplay})</td>
              <td class="right">₹${cgstTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="right">IGST (${igstRateDisplay})</td>
              <td class="right">₹${igstTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="right bold">Total Amount</td>
              <td class="right bold">₹${(invoice.total_amount)}</td>
            </tr>
          </table>
        </div>
      </div>
      
      <div class="amount-in-words">
        <strong>Total Amount (in words):</strong> ${this.convertNumberToWords(invoice.total_amount)} Only
      </div>
      
      <hr class="section-divider">
      
      <div class="bottom-section">
        <div class="left-bottom-text">
          <strong>Tax Information:</strong> Whether the Tax is payable on Reverse Charges basis (Yes / No)<br><br>
          <strong>Certification:</strong> Certified that the particulars given above are true and correct and the amount indicated represents the price actually charged and that there is no flow of additional consideration directly or indirectly from the buyer.<br><br>
          <strong>Terms & Conditions</strong><br>
          1) Subject to PUNE Jurisdiction only.<br>
          2) Interest @24% shall be charged if payment not made within due date.
        </div>
        <div class="right-bottom-signature">
          <p style="margin-bottom: 4px;"><strong>For JAL</strong></p>
          <div class="signature-line"></div>
          <p style="margin-top: 4px;"><strong>Authorised Signature</strong></p>
        </div>
      </div>
      
      <button class="print-button" onclick="window.print();">Print Invoice</button>
    </div>
  </body>
  </html>
`);



          printWindow.document.close();
          printWindow.focus();
        }, 100);
        this.toastr.info('Print window opened. Click Print Invoice to continue.', 'Info');

      },
      (error) => {
        console.error('Error fetching invoice details:', error);
        this.toastr.error('Failed to load invoice details', 'Error');
      }
    );
  }

  // Add this method to filter invoices
  // filterInvoices() {
  //   console.log('Filtering with term:', this.searchTerm); // Debug log

  //   if (!this.searchTerm?.trim()) {
  //     this.filteredInvoices = [...this.invoices];
  //     return;
  //   }

  //   const searchTermLower = this.searchTerm.toLowerCase().trim();
  //   this.filteredInvoices = this.invoices.filter(invoice => {
  //     const invoiceNumber = invoice.invoice_number?.toString().toLowerCase() || '';
  //     const consigneeName = invoice.consignee_name?.toLowerCase() || '';

  //     return invoiceNumber.includes(searchTermLower) ||
  //       consigneeName.includes(searchTermLower);
  //   });

  //   console.log('Filtered results:', this.filteredInvoices); // Debug log
  // }

  filterInvoices() {
    if (!this.searchTerm?.trim()) {
      this.dataSource.data = this.invoices;
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      this.dataSource.data = this.invoices.filter(invoice => {
        const invoiceNumber = invoice.invoice_number?.toString().toLowerCase() || '';
        const consigneeName = invoice.consignee_name?.toLowerCase() || '';
        return invoiceNumber.includes(searchTermLower) ||
          consigneeName.includes(searchTermLower);
      });
    }
    this.dataSource.sort = this.sort; // <-- Add this line
  }

  editInvoice(invoiceNumber: number) {
    this.router.navigate(['/billing', invoiceNumber]);
  }
}

// Utility function to convert number to words (simple version)
function numberToWords(num: number): string {
  // You can use a library for more complex numbers, but here's a simple implementation:
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if ((num = num || 0) === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToWords(Math.abs(num));
  let words = '';

  if ((num / 10000000) >= 1) {
    words += numberToWords(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  if ((num / 100000) >= 1) {
    words += numberToWords(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  if ((num / 1000) >= 1) {
    words += numberToWords(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  if ((num / 100) >= 1) {
    words += numberToWords(Math.floor(num / 100)) + ' Hundred ';
    num %= 100;
  }
  if (num > 0) {
    if (num < 20) {
      words += a[num];
    } else {
      words += b[Math.floor(num / 10)];
      if ((num % 10) > 0) words += ' ' + a[num % 10];
    }
  }
  return words.trim();
}