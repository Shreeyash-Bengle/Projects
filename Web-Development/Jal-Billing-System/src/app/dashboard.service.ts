import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  // id?: number;
  Parent_Product: number;
  Child_Product: number;
  Defective_Stock: number;
  Vendor: number;
  Supplier: number;
  Total_Invoice: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  private baseApiUrl = 'https://jal.beatsacademy.in/api/dashboard/';
  private getApiUrl = `${this.baseApiUrl}count/`;

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.getApiUrl);
  }



}
