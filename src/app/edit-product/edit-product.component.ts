import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Subject, of } from 'rxjs';
import { Product } from '../domain/product';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { UploadService } from '../upload.service';

import { debounceTime, map, catchError } from 'rxjs/operators';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Image } from '../domain/image'
import { ProductStatus } from '../domain/product-status';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: Product;
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  statuses = Object.values(ProductStatus)

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private uploadService: UploadService,
    // public auth: AuthService
  ) { 
    this.getProduct();
  }

  ngOnInit() {
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    // this.language = 'zh';
  }



  getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(id)
      .subscribe(product => {
        this.product = product;
      });
  }

  goBack(): void {
    this.location.back();
  }

  delete(): void {
    this.productService.delete(this.product).subscribe();
    this.goBack();
  }
  
  save(): void {
    this.productService.saveProduct(this.product).subscribe(() => this.showMessage());
  }  

  showMessage() {
    this._success.next(`${new Date()} - 存好了！`);
  }

  uploadFile(file, isPrimary): void {
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    this.uploadService.upload(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.address} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          console.log(event.body);
          if(isPrimary) {
            this.product.coverImage = event.body;
          } else {
            this.product.images.push(event.body);
          }
          
        }
      });
  }

  private uploadFiles(isPrimary): void {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.uploadFile(file, isPrimary);
    });
  }

  uploadPrimary(): void {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
        Array.from(fileUpload.files).forEach(element => {
        this.files.push({ data: element, inProgress: false, progress: 0 });
      });  
        
      this.uploadFiles(true);
    };
    fileUpload.click();
  }  

  uploadAdditional(): void {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
        Array.from(fileUpload.files).forEach(element => {
        this.files.push({ data: element, inProgress: false, progress: 0 });
      });  
        
      this.uploadFiles(false);
    };
    fileUpload.click();
  }  
  
  deleteImage(image: Image): void {
    this.product.images = this.product.images.filter(item => item !== image)
  }  

}
