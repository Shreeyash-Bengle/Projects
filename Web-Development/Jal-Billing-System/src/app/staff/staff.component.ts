import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,

} from '@angular/forms';
import { StaffService, Staff } from '../staff.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
})
export class StaffComponent implements OnInit {
  staffImage: File | null | undefined;
  aadharImage: File | null | undefined;
  punching_number: string = '';
  panImage: File | null | undefined;
  aadharCardFile: File | null | undefined;
  panCardFile: File | null | undefined;
  staffList: Staff[] = [];
  filteredStaffList: Staff[] = [];
  registrationForm: FormGroup;
  showForm = false;
  editingStaffIndex: number | null = null;
  photoURL: string | ArrayBuffer | null = null;
  aadharCardURL: string | ArrayBuffer | null = null;
  panCardURL: string | ArrayBuffer | null = null;
  searchTerm: string = '';
  showSearchInput: boolean = false;
  viewFormDetails: boolean = false;
  staffDetails: Staff | null = null;

  constructor(private staffService: StaffService) {
    this.registrationForm = new FormGroup({
      full_name: new FormControl(''),
      date_of_birth: new FormControl(null),
      gender: new FormControl(''), // not null
      phone_number: new FormControl(''), // Removed Validators.pattern
      email: new FormControl(''),
      punching_number: new FormControl(''),
      designation: new FormControl(''),
      department: new FormControl(''),
      date_of_joining: new FormControl(null),
      salary: new FormControl(''), // not null
      address: new FormControl(''),
      aadhar_card: new FormControl(null),
      pan_card: new FormControl(null),
      photo: new FormControl(null),
    });
  }

  toastr: ToastrService = inject(ToastrService);


  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.staffService.getStaff().subscribe(
      (data: any) => {
        this.staffList = data.all_info;
        this.filteredStaffList = [...this.staffList];
      },
      (error) => {
        this.toastr.error('Failed to load staff list', 'Error');
        console.error('Load error:', error);
      }
    );
  }

  // onFileSelected(event: any): void {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (file) {
  //     this.registrationForm.patchValue({ photo: file });
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.photoURL = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     this.registrationForm.patchValue({ photo: null });
  //     this.photoURL = null;
  //   }
  // }

  // Update the onFileSelected method
  onFileSelected(event: any, type: 'staff' | 'aadhar' | 'pan'): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];

      switch (type) {
        case 'staff':
          this.staffImage = file;
          this.createImagePreview(file, 'photo');
          break;
        case 'aadhar':
          this.aadharImage = file;
          this.createImagePreview(file, 'aadhar');
          break;
        case 'pan':
          this.panImage = file;
          this.createImagePreview(file, 'pan');
          break;
      }
    }
  }

  // Add helper method for image preview
  private createImagePreview(file: File, type: 'photo' | 'aadhar' | 'pan'): void {
    const reader = new FileReader();
    reader.onload = () => {
      switch (type) {
        case 'photo':
          this.photoURL = reader.result;
          break;
        case 'aadhar':
          this.aadharCardURL = reader.result;
          break;
        case 'pan':
          this.panCardURL = reader.result;
          break;
      }
    };
    reader.readAsDataURL(file);
  }

  addStaff(): void {
    if (this.registrationForm.valid) {
      const formData: FormData = new FormData();
      Object.keys(this.registrationForm.value).forEach((key) => {
        if (key !== 'photo' && key !== 'aadhar_card' && key !== 'pan_card') {
          formData.append(key, this.registrationForm.get(key)?.value);
        }
      });

      if (this.staffImage) {
        formData.append('photo', this.staffImage);
      }
      if (this.aadharImage) {
        formData.append('aadhar_card', this.aadharImage);
      }
      if (this.panImage) {
        formData.append('pan_card', this.panImage);
      }

      const genderValue = this.registrationForm.get('gender')?.value || '';
      formData.append('gender', genderValue);

      const salaryValue = this.registrationForm.get('salary')?.value;
      formData.append('salary', salaryValue ? salaryValue.toString() : '0');

      // Only append files if present
      if (this.aadharImage) {
        formData.append('aadhar_card', this.aadharImage);
      }
      if (this.panImage) {
        formData.append('pan_card', this.panImage);
      }

      // If updating an existing staff record, include the id.
      if (this.editingStaffIndex !== null) {
        const id = this.staffList[this.editingStaffIndex].id;
        formData.append('id', id?.toString() || '');
        this.staffService.updateStaff(formData).subscribe(
          (updatedStaff) => {
            this.staffList[this.editingStaffIndex!] = updatedStaff;
            this.filteredStaffList = [...this.staffList];
            this.registrationForm.reset();
            this.loadStaff();
            this.photoURL = null;
            this.aadharCardURL = null;
            this.panCardURL = null;
            this.showForm = false;
            this.editingStaffIndex = null;
            this.viewFormDetails = false;
            this.toastr.success('Staff member updated successfully!', 'Success');
          },
          (error) => {
            this.toastr.error('Failed to update staff member', 'Error');
            console.error('Update error:', error);
          }
        );
      } else {
        // For a new record
        this.staffService.addStaff(formData).subscribe(
          (newStaff) => {
            this.staffList.push(newStaff);
            this.filteredStaffList = [...this.staffList];
            this.registrationForm.reset();
            this.loadStaff();
            this.photoURL = null;
            this.aadharCardURL = null;
            this.panCardURL = null;
            this.showForm = false;
            this.viewFormDetails = false;
            this.toastr.success('New staff member added successfully!', 'Success');
          },
          (error) => {
            this.toastr.error('Failed to add staff member', 'Error');
            console.error('Add error:', error);
          }
        );
      }
    } else {
      this.toastr.warning('Please fill all required fields correctly', 'Form Invalid');
      console.log('Form is invalid');
    }
  }

  editStaff(index: number): void {
    this.editingStaffIndex = index;
    const staffToEdit = this.staffList[index];
    this.registrationForm.patchValue(staffToEdit);
    this.photoURL = null;
    this.aadharCardURL = null;
    this.panCardURL = null;
    this.showForm = true;
    this.showSearchInput = false;
    this.viewFormDetails = false;
  }

  deleteStaff(index: number): void {
    const staffToDelete = this.staffList[index];
    if (staffToDelete.id && confirm('Are you sure to delete?')) {
      this.staffService.deleteStaff(staffToDelete.id).subscribe(
        () => {
          this.staffList.splice(index, 1);
          this.filteredStaffList = [...this.staffList];
          this.toastr.success('Staff member deleted successfully!', 'Success');
        },
        (error) => {
          this.toastr.error('Failed to delete staff member', 'Error');
          console.error('Delete error:', error);
        }
      );
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.editingStaffIndex = null;
    this.registrationForm.reset();
    this.photoURL = null;
    this.showSearchInput = false;
    this.aadharCardURL = null;
    this.panCardURL = null;
    this.showSearchInput = false;
    this.viewFormDetails = false;
  }

  searchStaff(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredStaffList = this.staffList.filter(
      (staff) =>
        staff.full_name.toLowerCase().includes(term) ||
        staff.phone_number.includes(term)
    );
  }

  toggleSearchInput(): void {
    this.showSearchInput = !this.showSearchInput;
    if (!this.showSearchInput) {
      this.searchTerm = '';
      this.filteredStaffList = [...this.staffList];
    }
  }

  viewStaffDetails(staff: Staff): void {
    this.staffDetails = staff;
    this.registrationForm.patchValue(staff);
    this.photoURL = staff?.photo || null;
    this.aadharCardURL = staff?.aadhar_card || null;
    this.panCardURL = staff?.pan_card || null;
    this.viewFormDetails = true;
    this.showForm = true;
    this.showSearchInput = false;
    this.editingStaffIndex = null;
  }
}