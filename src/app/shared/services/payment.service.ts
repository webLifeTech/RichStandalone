import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  baseUrl1 = environment.apiUrl1;

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
    // https://crypto-taxibooking-20030426091.asia-south1.run.app/api/getSupportedCoins
    return this.http.get(this.baseUrl + 'getSupportedCoins').pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  public createTransaction(data: any) {
    // https://crypto-taxibooking-20030426091.asia-south1.run.app/api/createTransaction
    return this.http.post(this.baseUrl + 'createTransaction', data).pipe(
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

  // Booking -> GetAllBookingPayments
  public GetAllBookingPayments(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Booking/GetAllBookingPayments', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Booking -> GetBookingByBookingRefNo
  public GetBookingByBookingRefNo(dataParams: any) {
    const params = new HttpParams()
      .set('bookingRefNo', dataParams.bookingRefNo)
      .set('loginUserId', dataParams.loginUserId);
    return this.http.get(this.baseUrl1 + 'TLHUB/Booking/GetBookingByBookingRefNo', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Paymentgateway -> GetCryptoPaymentOrderId
  public GetCryptoPaymentOrderId() {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB/Paymentgateway/GetCryptoPaymentOrderId', {}).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }

  // Paymentgateway -> CryptoPaymentRequestResponse
  public CryptoPaymentRequestResponse(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Paymentgateway/CryptoPaymentRequestResponse', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
