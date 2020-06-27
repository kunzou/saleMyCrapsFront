import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../domain/product';
import { Lightbox } from 'ngx-lightbox';
import { Image } from '../domain/image';
import { EmailDetail } from '../domain/emailDetail';
import { Subject } from 'rxjs';
import { EmailService } from '../email.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: Product;
  private images: Array<any> = [];
  emailDetail = new EmailDetail();
  emailResponse: string;
  emailResponseAlertType: any;
  private _success = new Subject<string>(); 
  model: NgbDateStruct; 

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private _lightbox: Lightbox,
    private emailService: EmailService,
  ) { }

  ngOnInit() {
    this.getProduct();
    this._success.subscribe((message) => this.emailResponse = message);
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

  sendEmail(): void {
    this.emailDetail.product = this.product.name;
    this.emailService.sendEmail(this.emailDetail).subscribe(
      (response) => {
        this.emailResponseAlertType = "success";
        this.emailResponse = response.body.english;
        this.showMessage();
      },
      (error) => {
        this.emailResponseAlertType = "danger";
        this.emailResponse = "Failed to send message. Please contact me directly";
        this.showMessage();
      }
    );
  }  

  showMessage() {
    this._success.next(this.emailResponse);
  }    

}
