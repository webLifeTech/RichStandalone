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
    // this.baseUrl + 'getSupportedCoins'
    return this.http.get('https://crypto-taxibooking-20030426091.asia-south1.run.app/api/getSupportedCoins').pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  public createTransaction(data: any) {
    // this.baseUrl + 'createTransaction'
    return this.http.post('https://crypto-taxibooking-20030426091.asia-south1.run.app/api/createTransaction', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Crypto Coin
  public getCryptoPaymentTxn() {
    return this.http.get(this.baseUrl + 'getTxnList').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Crypto Coin
  public getCryptoPaymentTxnByIds(data: any) {
    return this.http.post(this.baseUrl + 'getTransactionByIds', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
