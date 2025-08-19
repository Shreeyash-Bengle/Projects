import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ConsigneeService } from '../consignee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consignee',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule
  ],
  templateUrl: './consignee.component.html',
  styleUrls: ['./consignee.component.css'],
})
export class ConsigneeComponent implements OnInit, AfterViewInit {

  consignee: any = {
    name: '',
    address: '',
    gstin: '',
    pan_no: '',
    contact_no1: '',
    contact_no2: '',
    city: '',
    state: '',
    state_code: '',
    country: ''
  };
  consignees: any[] = [];
  editingIndex: number | null = null;

  displayedColumns: string[] = [
    'name',
    'address',
    'gstin',
    'pan_no',
    'contact_no1',
    'contact_no2',
    'country',
    'state',
    'state_code',
    'city',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private consigneeService: ConsigneeService) { }

  ngOnInit(): void {
    this.loadConsignees();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // --- CRUD API Integration Points ---

  loadConsignees() {
    this.consigneeService.getConsignee().subscribe({
      next: (data: any) => {
        this.dataSource.data = data.all_consignee;
        this.consignees = data;
      }
    });
  }

  addConsignee() {
    if (this.editingIndex !== null && this.consignee.id) {
      // Update mode: call PUT API
      this.consigneeService.updateConsignee(this.consignee).subscribe({
        next: (updatedConsignee: any) => {
          this.loadConsignees();
          this.resetForm();
        }
      });
    } else {
      // Add mode: call POST API
      this.consigneeService.addConsignee(this.consignee).subscribe({
        next: (newConsignee: any) => {
          this.loadConsignees();
          this.resetForm();
        }
      });
    }
  }

  editConsignee(element: any) {
    this.consignee = { ...element };
    this.editingIndex = element.id || null;
  }

  deleteConsignee(element: any) {
    // Call your ConsigneeService to delete by ID, then reload
    if (element.id) {
      this.consigneeService.deleteConsignee(element.id).subscribe(() => this.loadConsignees());
    }
  }

  resetForm() {
    this.consignee = {
      name: '',
      address: '',
      gstin: '',
      pan_no: '',
      contact_no1: '',
      contact_no2: '',
      city: '',
      state: '',
      state_code: '',
      country: ''
    };
    this.editingIndex = null;
  }
}

