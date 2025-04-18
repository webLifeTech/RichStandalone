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

  // -> TLHUB/Wallet/GetWalletDetails?userId={userId}
  // -> TLHUB/Wallet/AddToWallet

  // -> TLHUB/Wallet/AddWalletFunds
  // -> TLHUB/Wallet/GetWalletDetails?userId={userId} 
  // -> TLHUB/Wallet/WithDrawWalletFunds

  // Wallet -> GetWalletDetails
  public getWalletDetails(dataParams: any) {
    const params = new HttpParams().set('userId', dataParams.userId)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Wallet/GetWalletDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Wallet -> AddWalletFunds
  public addWalletFunds(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB_API/TLHUB/Wallet/AddWalletFunds', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Wallet -> WithDrawWalletFunds
  public withDrawWalletFunds(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB_API/TLHUB/Wallet/WithDrawWalletFunds', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

}
