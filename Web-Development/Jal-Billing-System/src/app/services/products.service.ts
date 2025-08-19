import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  description: string;
  price: number | null;
  supplier: string;
  hsn_code: string;
  stock_type: string;
  quantity?: number | null;
  total?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // Define the base URL and specific endpoints for GET and POST
  private baseApiUrl = 'https://jal.beatsacademy.in/api/stock';
  private getApiUrl = `${this.baseApiUrl}/allstock/`;
  private postApiUrl = `${this.baseApiUrl}/addstock/`;
  private putApiUrl = `${this.baseApiUrl}/updatestock`;
  private deleteApiUrl = `${this.baseApiUrl}/deletestock`;

  private childApiUrl = `${this.baseApiUrl}/childstock`;
  private parentApiUrl = `${this.baseApiUrl}/parentstock`;

  private alertAPI = 'https://jal.beatsacademy.in/api/stock/remainingstock/';

  // http://192.168.0.229:8000/api/stock/?stock_type=child

  constructor(private http: HttpClient) { }

  getAlertStock(): Observable<any[]> {
    return this.http.get<any[]>(this.alertAPI);
  }

  // GET all products from the allstock API
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.getApiUrl);
  }

  // POST: Add a new product using the addstock API
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.postApiUrl, product);
  }

  // PUT: Update an existing product (requires product.id)
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.putApiUrl}/${product.id}/`, product);
  }

  deleteProduct(product: Product): Observable<Product> {
    return this.http.delete<Product>(`${this.deleteApiUrl}/${product.id}/`);
  }
}
