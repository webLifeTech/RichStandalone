import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WalletService {

  baseUrl1 = environment.apiUrl1;

  constructor(private http: HttpClient) { }

  // Wallet -> GetWalletDetails
  public getWalletDetails(dataParams: any) {
    const params = new HttpParams().set('userId', dataParams.userId)
    return this.http.get(this.baseUrl1 + 'TLHUB/Paymentgateway/GetWalletDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Wallet -> AddWalletFunds
  public addWalletFunds(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Paymentgateway/AddWalletFunds', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Wallet -> WithDrawWalletFunds
  public withDrawWalletFunds(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Paymentgateway/WithDrawWalletFunds', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Paymentgateway -> GetPaymentEncryptvalue
  public GetPaymentEncryptvalue(dataParams: any) {
    const params = new HttpParams().set('inputValue', dataParams.inputValue);
    // return this.http.get(this.baseUrl1 + 'TLHUB/Paymentgateway/GetPaymentEncryptvalue', { params }).pipe(
    //   map((res: any) => {
    //     return res;
    //   })
    // );

    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB/Paymentgateway/GetPaymentEncryptvalue', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }

  // Wallet -> GetAllWalletPayments
  public GetAllWalletPayments(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Paymentgateway/GetAllWalletPayments', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

}
