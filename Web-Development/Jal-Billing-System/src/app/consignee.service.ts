import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConsigneeService {

  private baseApiUrl = 'https://jal.beatsacademy.in/api/consignee/';
  private getApiUrl = `${this.baseApiUrl}allconsignee/`;
  private postApiUrl = `${this.baseApiUrl}addconsignee/`;
  // Assuming that for update and delete, the consignee id is appended to the URL
  private updateApiUrl = `${this.baseApiUrl}updateconsignee/`;
  private deleteApiUrl = `${this.baseApiUrl}deleteconsignee/`;

  constructor(private http: HttpClient) { }

  // GET: Retrieve all consignees
  getConsignee(): Observable<any[]> {
    return this.http.get<any[]>(this.getApiUrl);
  }

  // POST: Add a new consignee
  addConsignee(Consignee: any): Observable<any> {
    return this.http.post<any>(this.postApiUrl, Consignee);
  }

  // PUT: Update an existing consignee (consignee.id is appended to the URL)
  updateConsignee(Consignee: any): Observable<any> {
    const url = `${this.updateApiUrl}${Consignee.id}/`;
    return this.http.put<any>(url, Consignee);
  }

  // DELETE: Remove a consignee by its id
  deleteConsignee(ConsigneeId: number): Observable<any> {
    const url = `${this.deleteApiUrl}${ConsigneeId}/`;
    return this.http.delete(url);
  }
}
