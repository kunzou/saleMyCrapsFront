import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../domain/product';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  products: Product[];
  
  constructor(
    private productService: ProductService,
    private router: Router,
    public auth: AuthService
  ) {
  }

  ngOnInit() {
    this.getProducts();
  }

  gotoLink(blog: Product) {
    this.router.navigate(['/editProduct', blog.id]);    
  }

  add(): void {
    this.productService.saveProduct({} as Product).subscribe(blog => {
        this.router.navigate(['/editProduct', blog.id]);
      })
  }

  getProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }  

}
