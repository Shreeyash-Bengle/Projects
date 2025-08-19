import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private BaseApiUrl = 'https://jal.beatsacademy.in/api/user/';
  private postApiUrl = `${this.BaseApiUrl}register/`;
  private getApiUrl = `${this.BaseApiUrl}all-users/`;
  private putApiUrl = `${this.BaseApiUrl}updateuser/`;
  private deleteApiUrl = `${this.BaseApiUrl}deleteuser/`;

  postAdminData(adminData: any): Observable<any> {
    return this.http.post<any>(this.postApiUrl, adminData);
  }
  getAllAdmins(): Observable<any> {
    return this.http.get<any>(this.getApiUrl);
  }
  updateAdminData(adminData: any): Observable<any> {
    return this.http.put<any>(`${this.putApiUrl}${adminData.id}/`, adminData);
  }

  deleteAdminData(id: number): Observable<any> {
    return this.http.delete<any>(`${this.deleteApiUrl}${id}/`);
  }

  // getAdminPassword(id: number): Observable<any> {
  //   return this.http.get<any>(`${this.BaseApiUrl}/getpassword/${id}/`);
  // }
}
