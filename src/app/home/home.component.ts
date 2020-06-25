import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../domain/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[];

  constructor(
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.getProducts()
  }

  getProducts(): void {
    this.productService.getForSaleProducts().subscribe(products => {
      this.products = products;
    });
  }  
}
