import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiResultFormat } from './model/model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PricingService {

  baseUrl1 = environment.apiUrl1;

  constructor(private http: HttpClient) { }

  public getPricing() {
    return this.http.get<apiResultFormat>('assets/json/pages/pricing.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getPricingById(data: any) {
    return this.http.get<apiResultFormat>('assets/json/pages/pricing.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getSubscriptionHistory() {
    return this.http.get<apiResultFormat>('assets/json/pages/user-subscription-history.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }


  // Master -> GetMasterPackageType
  public getMasterPackageType(dataParams: any) {
    const params = new HttpParams()
      .set('code', dataParams.code)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/GetMasterPackageType', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> GetPackageDetails
  public getPackageDetails(dataParams: any) {
    const params = new HttpParams()
      .set('roleName', dataParams.roleName)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/GetPackageDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  public getCurrentPackageDetails(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/GetCurrentPackageDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getSubcriptionHistory
  public getSubcriptionHistory(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/GetSubcriptionHistory', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> InsertAndUpdatePackage
  public InsertAndUpdatePackage(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/Master/InsertAndUpdatePackage`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

}
