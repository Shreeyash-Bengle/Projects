import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Staff {
  [x: string]: any;
  id?: number;
  full_name: string;
  designation: string;
  email: string;
  phone_number: string;
  staff_address: string;
  date_of_birth?: Date | null;
  gender?: 'male' | 'female' | 'other' | null;
  department?: string;
  date_of_joining?: Date | null;
  aadhar_card?: any;
  pan_card?: any;
  address: string;
  photo?: any; // Depending on your API, this could be a File or a URL string.

}

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private baseApiUrl = 'https://jal.beatsacademy.in/api/staff';
  private getApiUrl = `${this.baseApiUrl}/allstaff/`;
  private postApiUrl = `${this.baseApiUrl}/addstaff/`;
  private updateApiUrl = `${this.baseApiUrl}/updatestaff`;
  private deleteApiUrl = `${this.baseApiUrl}/deletestaff/`;

  constructor(private http: HttpClient) { }

  // GET all staff members
  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.getApiUrl);
  }

  // POST: Add a new staff member
  addStaff(staff: FormData): Observable<any> {
    return this.http.post(this.postApiUrl, staff);
  }

  // PUT: Update an existing staff member (assumes ID is appended to the URL)
  updateStaff(staffData: FormData): Observable<Staff> {
    const staffId = staffData.get('id');
    const url = `${this.updateApiUrl}/${staffId}/`;
    return this.http.put<Staff>(url, staffData);
  }

  // DELETE: Delete a staff member by ID
  deleteStaff(staffId: number): Observable<any> {
    const url = `${this.deleteApiUrl}${staffId}/`;
    return this.http.delete(url);
  }
}
