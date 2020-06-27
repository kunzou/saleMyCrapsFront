import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { EmailDetail } from './domain/emailDetail';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  SERVER_URL: string = environment.baseUrl + '/sendEmail';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  sendEmail(emailDetail): Observable<any> {
    return this.http.post<EmailDetail>(this.SERVER_URL, emailDetail, {observe: 'response'});
  }
}
