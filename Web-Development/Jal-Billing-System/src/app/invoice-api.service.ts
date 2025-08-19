import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from 'environment'; // Update path if necessary

export interface LineItem {
  description: string;
  hsn_code: string;
  quantity: number;
  unit_rate: number;
  discount_percentage: number;
  gst_rate: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
}

export interface InvoiceData {
  id?: number;
  vendor_name: string; // companyName
  gst_no: string; // gstNo
  name: string; // consignee
  consignee_state_code: string;
  vendor_address: string;
  remarks: string;
  // bank_name: string; // bankName
  // bank_branch: string; // bankBranch
  // account_number: string;
  // ifsc_code: string; // ifscCode
  challan_date: string; // invoiceNo
  invoice_date: string; // date
  challan_number: string; // challanNo
  order_date: string; // orderDate
  order_number: string; // orderNo
  veh_no: string; // vehNo
  transport_mode: string; // transportMode
  due_on: string; // dueDate
  time_of_supply: string; // timeOfSupply
  payment_terms: string; // paymentTerms
  document: string;
  delivery_terms: string; // deliveryTerms
  transport: string;
  place_of_supply: string; // placeOfSupply
  l_r_number: string; // lrNo
  l_r_date: string; // lrDate
  ref: string;
  lineItems: LineItem[]; // For line items (updated to match component)
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceApiService {
  // private url = 'http://192.168.0.210:8000/api/';
  private baseApiUrl = 'https://jal.beatsacademy.in/api/bill';
  private getApiUrl = `${this.baseApiUrl}/allBillInvoices/`;
  private postApiUrl = `${this.baseApiUrl}/addBillInvoices/create/`;
  // Assuming that for update and delete, the vendor id is appended to the URL
  private putApiUrl = `${this.baseApiUrl}/updateBillInvoices`;
  private deleteApiUrl = `${this.baseApiUrl}/deleteBillInvoices`;

  private baseVendorApi = 'https://jal.beatsacademy.in/api/vendor/';
  private vendorApiUrl = `${this.baseVendorApi}/allvendor/`;
  private baseStockApi = 'https://jal.beatsacademy.in/api/stock';
  private descApiUrl = `${this.baseStockApi}/allstock/`;

  private stockReportApiUrl = 'https://jal.beatsacademy.in/api/stock/excel-report/';

  constructor(private http: HttpClient) { }

  getStockReport(): Observable<Blob> {
    return this.http.get(this.stockReportApiUrl, {
      responseType: 'blob'
    }) as Observable<Blob>;
  }

  getBillVendors(): Observable<any> {
    return this.http.get(this.vendorApiUrl);
  }

  // getBillDescriptions(): Observable<any> {
  //   return this.http.get(this.descApiUrl);
  // }
  getBillDescriptions(): Observable<any[]> {
    return this.http.get<any[]>(this.descApiUrl);
  }


  postInvoice(invoiceData: InvoiceData): Observable<any> {
    return this.http.post<InvoiceData>(this.postApiUrl, invoiceData);
  }

  getAllInvoices(): Observable<any> {
    return this.http.get(this.getApiUrl);
  }

  getInvoiceByNumber(invNo: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/BillInvoices/${invNo}/`);
  }
  // getInvoiceById(id: any): Observable<any> {
  //   return this.http.get(`${this.baseApiUrl}/BillInvoices/${id}/`);
  // }

  updateInvoice(invoiceNumber: number, invoiceData: any): Observable<any> {
    return this.http.put<any>(
      `${this.putApiUrl}/${invoiceNumber}/`,
      invoiceData
    );
  }

  deleteInvoice(id: number): Observable<any> {
    return this.http.delete(`${this.deleteApiUrl}/${id}/`);
  }

  getLineItemById(itemId: number): Observable<any> {
    return this.http.get(`https://jal.beatsacademy.in/api/item/itemdetails/${itemId}/`);
  }

  deleteLineItem(itemId: number): Observable<any> {
    return this.http.delete(`https://jal.beatsacademy.in/api/item/deleteitem/${itemId}/`);
  }

  updateLineItem(itemId: number, itemData: any): Observable<any> {
    return this.http.put(`https://jal.beatsacademy.in/api/item/updateitem/${itemId}/`, itemData);
  }

  createLineItem(itemData: any): Observable<any> {
    return this.http.post(`https://jal.beatsacademy.in/api/item/additem/`, itemData);
  }

  // updateVendor(vendor: Vendor): Observable<Vendor> {
  //     // If your update API does not require the ID in the URL, remove it from the URL.
  //     const url = `${this.updateApiUrl}${vendor.id}/`;
  //     return this.http.put<Vendor>(url, vendor);
  //   }

  // DELETE: Remove a vendor by its id
  // deleteVendor(vendorId: number): Observable<any> {
  //   const url = `${this.deleteApiUrl}${vendorId}/`;
  //   return this.http.delete(url);
  // }
}
