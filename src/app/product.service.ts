import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './domain/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.baseUrl;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };  

  constructor(
    private http: HttpClient
  ) { }

  getProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}/products`;
    return this.http.get<Product[]>(url);
  }

  getForSaleProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}/forSaleProducts`;
    return this.http.get<Product[]>(url);
  }  

  saveProduct(product: Product): Observable<any> {
    const url = `${this.baseUrl}/product`;
    return this.http.put(url, product, this.httpOptions);
  }  

  addProduct(product: Product): Observable<Product> {
    const url = `${this.baseUrl}/product`;
    return this.http.post<Product>(url, product, this.httpOptions);
  }  
  
  getProduct(id: string): Observable<Product> {
    const url = `${this.baseUrl}/product/${id}`;
    return this.http.get<Product>(url);
  }

  delete (product: Product | number): Observable<Product> {
    const id = typeof product === 'number' ? product : product.id;
    const url = `${this.baseUrl}/product/${id}`;
  
    return this.http.delete<Product>(url, this.httpOptions);
  }  

}
