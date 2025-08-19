import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Supplier {
  id?: number;
  supplier_name: string;
  address: string;
  gst_number: string;
  state: string;
  state_code: string;
  phone_number: string;
  p_no: string;
  supplier_code: string;
  pan: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private baseApiUrl = 'https://jal.beatsacademy.in/api/supplier/';
  private getApiUrl = `${this.baseApiUrl}allsupplier/`;
  private postApiUrl = `${this.baseApiUrl}addsupplier/`;
  // Assuming that for update and delete, the supplier id is appended to the URL
  private updateApiUrl = `${this.baseApiUrl}updatesupplier/`;
  private deleteApiUrl = `${this.baseApiUrl}deletesupplier/`;

  constructor(private http: HttpClient) { }

  // GET: Retrieve all suppliers
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.getApiUrl);
  }

  // POST: Add a new supplier
  addSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.postApiUrl, supplier);
  }

  // PUT: Update an existing supplier (supplier.id is appended to the URL)
  updateSupplier(supplier: Supplier): Observable<Supplier> {
    const url = `${this.updateApiUrl}${supplier.id}/`;
    return this.http.put<Supplier>(url, supplier);
  }

  // DELETE: Remove a supplier by its id
  deleteSupplier(supplierId: number): Observable<any> {
    const url = `${this.deleteApiUrl}${supplierId}/`;
    return this.http.delete(url);
  }
}
