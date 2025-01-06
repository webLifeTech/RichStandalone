import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { cabClassic } from '../interface/cab-classic';
import { cabMap } from '../interface/cab-map';
import { cabDetails, cabs, cab, blog, testimonials, services } from '../interface/cab';
import { driverDetails, drivers, driver } from '../interface/driver';
import { apiResultFormat } from './model/model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getUserPayment() {
    // src\assets\json\pages\user-payment.json
    return this.http.get<apiResultFormat>('assets/json/pages/user-payment.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getuserWallet() {
    return this.http.get<apiResultFormat>('assets/json/pages/user-wallet.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getSupportedCoins() {
    return this.http.get(this.baseUrl + 'getSupportedCoins').pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  public createTransaction(data: any) {
    return this.http.post(this.baseUrl + 'createTransaction', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }




}
