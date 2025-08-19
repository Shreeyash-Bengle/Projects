import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EInvoice {
  id?: number;
  sellergstin: string;
  sellerlegalname: string;
  sellertradename: string;
  selleraddr1: string;
  selleraddr2: string;
  sellerlocation: string;
  sellerstate: string;
  sellerpincode: string;
  sellerphonenumber: string;
  selleremailid: string;
  supplytypecode: string;
  documenttype: string;
  documentnumber: string;
  documentdate: string;
  buyersgstin: string;
  buyerlegalname: string;
  buyerpos: string;
  buyeraddr1: string;
  buyerlocation: string;
  buyerpincode: string;
  buyerstate: string;

  sino: string;
  hsncode: string;
  slno: string;
  quantity: number;
  unit: string;
  unitprice: number;
  grossamount: number;
  taxablevalue: number;
  gstrate: number;
  itemtotal: number;

  totaltaxablevalue: number;
  totalinvoicevalue: number;
}



@Injectable({
  providedIn: 'root',
})
export class EInvoiceService {
  private baseApiUrl = 'https://jal.beatsacademy.in/api/e-invoice/';
  private postUrl = `${this.baseApiUrl}addEinvoice/`;
  private getUrl = `${this.baseApiUrl}allEinvoices/`;
  // private putUrl = `${this.baseApiUrl}updateEinvoice/`;
  private deleteUrl = `${this.baseApiUrl}deleteEinvoice/`;

  constructor(private http: HttpClient) { }

  createEInvoice(data: EInvoice): Observable<any> {
    return this.http.post<any>(this.postUrl, data);
  }

  getAllEInvoices(): Observable<any> {
    return this.http.get<any>(this.getUrl);
  }

  deleteEInvoice(id: number): Observable<any> {
    // Add trailing slash to the URL
    return this.http.delete<any>(`${this.deleteUrl}${id}/`);
  }
}
