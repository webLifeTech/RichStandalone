import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VendorServService {

  baseUrl1 = environment.apiUrl1;

  constructor(private http: HttpClient) { }

  // Master -> GetMasterProviderCategories
  public getMasterProviderCategories() {
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterProviderCategories').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> GetMasterProviderCategories
  public getMasterProviderSubCategories(dataParams: any) {
    const params = new HttpParams()
      .set('categoryId', dataParams.categoryId)
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterProviderSubCategories', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // User -> RegisterVendor
  public registerVendor(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/User/RegisterVendor', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> GetProviderDetails
  public GetProviderDetails(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
    return this.http.get(this.baseUrl1 + 'TLHUB/Provider/GetProviderDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Provider -> UpdateProviderDetails
  public UpdateProviderDetails(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Provider/UpdateProviderDetails', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // ProviderSearch -> ProviderSearchResult
  public ProviderSearchResult(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/ProviderSearch/ProviderSearchResult', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Provider -> AddProviderEnquiry
  public AddProviderEnquiry(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Provider/AddProviderEnquiry', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Provider -> GetAllProviderEnquiry
  // public GetAllProviderEnquiry(dataParams: any) {
  //   const params = new HttpParams()
  //     .set('providerId', dataParams.providerId)
  //   return this.http.get(this.baseUrl1 + 'TLHUB/Provider/GetAllProviderEnquiry', { params }).pipe(
  //     map((res: any) => {
  //       return res;
  //     })
  //   );
  // }

  // Provider -> GetAllProviderEnquiry
  public GetAllProviderEnquiry(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Provider/GetAllProviderEnquiry', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Provider -> GetAllProviderEnquiry
  public GetProviderDetailsByProviderId(dataParams: any) {
    const params = new HttpParams().set('providerId', dataParams.providerId)
    return this.http.get(this.baseUrl1 + 'TLHUB/Provider/GetProviderDetailsByProviderId', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

}
