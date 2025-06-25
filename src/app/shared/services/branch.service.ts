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
  public GetAllCompanyBranches(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
    return this.http.get(this.baseUrl1 + 'TLHUB/CompanyBranchKYC/GetAllCompanyBranches', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // CompanyBranchKYC -> GetCompanyBranchByBranchId
  public GetCompanyBranchByBrnachId(dataParams: any) {
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

}
