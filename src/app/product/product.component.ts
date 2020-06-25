import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../domain/product';
import { Lightbox } from 'ngx-lightbox';
import { Image } from '../domain/image';

// import { Array } from '';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: Product;
  private images: Array<any> = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private _lightbox: Lightbox
  ) { }

  ngOnInit() {
    this.getProduct();
  }

  getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(id).subscribe(product => {
        this.product = product;
        this.pushImage(product.coverImage);
        product.images.forEach(image => this.pushImage(image));         
    });
  }

  pushImage(image: Image) {
      const album = {
        src: image.hugeLink,
        thumb: image.mediumLink
     };          
     this.images.push(album)
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this.images, index);
  }
 
  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }  

}
