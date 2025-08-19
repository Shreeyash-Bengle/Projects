import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvoiceApiService } from '../invoice-api.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-report',
  imports: [MatTableModule, CommonModule, MatProgressSpinnerModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  stockReport: any[] = [];
  loading = {
    invoice: false,
  };

  stockData: any[] = [];

  displayedColumns: string[] = ['description', 'hsn_code', 'stock_type'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private toastr = inject(ToastrService);


  constructor(private invoiceApiService: InvoiceApiService) { }

  ngOnInit(): void {
    this.invoiceApiService.getBillDescriptions().subscribe({
      next: (response: any) => {
        this.dataSource.data = response.all_info;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.toastr.success('Stock data loaded successfully', 'Success');
      },
      error: (err: any) => {
        console.error('Failed to load stock data:', err);
        // this.toastr.error('Failed to load stock data', 'Error');
      }
    });
  }

  fetchStockReport(): void {
    this.loading.invoice = true;

    this.invoiceApiService.getStockReport().subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        const date = new Date();
        const dateStr = `${date.getFullYear()}${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

        link.href = url;
        link.download = `comprehensive_report_${dateStr}.xlsx`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.loading.invoice = false;
        this.toastr.success('Report downloaded successfully', 'Success');
      },
      error: (error: any) => {
        console.error('Error downloading report:', error);
        this.loading.invoice = false;
        this.toastr.error('Failed to download report', 'Error');
      },
    });
  }

  downloadExcelReport(): void {
    this.loading.invoice = true;

    this.invoiceApiService.getStockReport().subscribe({
      next: (response) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const date = new Date();
        const dateStr = `${date.getFullYear()}${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
        link.href = url;
        link.download = `comprehensive_report_${dateStr}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.loading.invoice = false;
        this.toastr.success('Excel report downloaded successfully', 'Success');
      },
      error: (error) => {
        console.error('Error downloading report:', error);
        this.loading.invoice = false;
        this.toastr.error('Failed to download Excel report', 'Error');
      },
    });
  }
}
