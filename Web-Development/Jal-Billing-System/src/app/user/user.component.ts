import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInput, MatInputModule } from '@angular/material/input';
// import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Admin {
  id: number;
  username: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatInput,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  adminForm!: FormGroup;
  showForm = false;
  isEditing = false;
  editIndex: number | null = null;
  admins: Admin[] = [];
  displayedColumns: string[] = ['username', 'role', 'actions'];
  dataSource!: MatTableDataSource<any>;
  isLoading = false;

  editingAdminId: number | null = null;
  hidePassword = true;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  initForm() {
    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['ADMIN', Validators.required],
    });
  }

  ngOnInit() {
    this.loadAdmins();
  }

  loadAdmins() {
    this.isLoading = true;
    this.userService.getAllAdmins().subscribe({
      next: (response) => {
        this.admins = response.data || [];
        this.dataSource = new MatTableDataSource(this.admins);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching admins:', error);
        this.toastr.error('Failed to load admins');
        this.isLoading = false;
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.adminForm.reset({ role: 'ADMIN' });
    this.isEditing = false;
    this.editIndex = null;
    this.editingAdminId = null;
  }

  addAdmin() {
    if (this.adminForm.invalid) return;

    const adminData = this.adminForm.value;
    this.isLoading = true;

    if (this.isEditing && this.editingAdminId !== null) {
      // Include the ID in the adminData object
      const adminToUpdate = {
        ...adminData,
        id: this.editingAdminId
      };

      // Pass the complete object with ID
      this.userService.updateAdminData(adminToUpdate).subscribe({
        next: (response) => {
          this.admins[this.editIndex!] = response;
          this.dataSource.data = [...this.admins]; // Create new reference
          this.toggleForm();
          this.toastr.success('Admin updated successfully');
          this.loadAdmins(); // Refresh the list
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating admin:', error);
          this.toastr.error('Failed to update admin');
          this.isLoading = false;
        }
      });
    } else {
      this.userService.postAdminData(adminData).subscribe({
        next: (response) => {
          this.admins.push(response); // If API returns the created object
          this.toggleForm();
        },
        error: (err) => {
          console.error('Failed to create admin', err);
        }
      });
    }
  }

  editAdmin(index: number) {
    const admin = this.admins[index];

    this.adminForm.patchValue({
      username: admin.username,
      role: admin.role
    });

    this.editingAdminId = admin.id; // ← Save ID
    this.isEditing = true;
    this.editIndex = index;
    this.showForm = true;
  }

  deleteAdmin(index: number) {
    const adminId = this.admins[index].id;

    if (!confirm('Are you sure you want to delete this admin?')) {
      return;
    }

    this.isLoading = true;

    this.userService.deleteAdminData(adminId).subscribe({
      next: () => {
        this.admins.splice(index, 1);
        this.dataSource.data = this.admins; // Update table
        this.toastr.success('Admin deleted successfully');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting admin:', error);
        this.toastr.error('Failed to delete admin');
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }
}
