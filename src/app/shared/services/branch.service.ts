import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BranchService {

  baseUrl1 = environment.apiUrl1;

  constructor(private http: HttpClient) { }

  // CompanyBranchKYC -> GetAllCompanyBranches
  public GetAllCompanyBranches(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/CompanyBranchKYC/GetAllCompanyBranches`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // CompanyBranchKYC -> GetCompanyBranchByBranchId
  public GetCompanyBranchByBranchId(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('branchPersonNum', dataParams.branchPersonNum)
    return this.http.get(this.baseUrl1 + 'TLHUB/CompanyBranchKYC/GetCompanyBranchByBranchId', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // CompanyBranchKYC -> InsertAndUpdateCompanyBranch
  public InsertAndUpdateCompanyBranch(data: any, dataParams: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/CompanyBranchKYC/InsertAndUpdateCompanyBranch?userId=${dataParams.userId}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // CompanyBranchKYC -> GetBranchNames
  public GetBranchNames(dataParams: any) {
    const params = new HttpParams().set('userId', dataParams.userId);
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB/CompanyBranchKYC/GetBranchNames', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }


  // GarageInfo -> GetGarageInformations // get all garage
  public GetGarageInformations(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/GarageInfo/GetGarageInformations`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // GarageInfo -> GetGarageInfoByGarageId
  public GetGarageInfoByGarageId(dataParams: any) {
    const params = new HttpParams().set('userId', dataParams.userId).set('garagePersonNum', dataParams.garagePersonNum);
    return this.http.get(this.baseUrl1 + 'TLHUB/GarageInfo/GetGarageInfoByGarageId', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // GarageInfo -> InsertAndUpdateGarageInformation
  public InsertAndUpdateGarageInformation(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/GarageInfo/InsertAndUpdateGarageInformation`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // GarageInfo -> GetGarageAddresses
  public GetGarageAddresses(dataParams: any) {
    const params = new HttpParams().set('userId', dataParams.userId);
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB/GarageInfo/GetGarageAddresses', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }
}
