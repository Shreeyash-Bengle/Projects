import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Vendor {
  id?: number;
  vendor_name: string;
  vendor_code: string;
  pan: string;
  p_no: string;
  address: string;
  gst_number: string;
  state: string;
  state_code: string;
  phone_number: string;
}

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private baseApiUrl = 'https://jal.beatsacademy.in/api/vendor/';
  private getApiUrl = `${this.baseApiUrl}allvendor/`;
  private postApiUrl = `${this.baseApiUrl}addvendor/`;
  // Assuming that for update and delete, the vendor id is appended to the URL
  private updateApiUrl = `${this.baseApiUrl}updatevendor/`;
  private deleteApiUrl = `${this.baseApiUrl}deletevendor/`;

  constructor(private http: HttpClient) { }

  // GET all vendors
  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.getApiUrl);
  }

  // POST: Add a new vendor
  addVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(this.postApiUrl, vendor);
  }

  // PUT: Update an existing vendor (assuming the API expects id appended)
  updateVendor(vendor: Vendor): Observable<Vendor> {
    // If your update API does not require the ID in the URL, remove it from the URL.
    const url = `${this.updateApiUrl}${vendor.id}/`;
    return this.http.put<Vendor>(url, vendor);
  }

  // DELETE: Remove a vendor by its id
  deleteVendor(vendorId: number): Observable<any> {
    const url = `${this.deleteApiUrl}${vendorId}/`;
    return this.http.delete(url);
  }
}
