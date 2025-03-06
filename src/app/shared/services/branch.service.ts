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

  // KYC -> GetAllCompanyBranches
  public GetAllCompanyBranches(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/GetAllCompanyBranches', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> GetCompanyBranchByBrnachId
  public GetCompanyBranchByBrnachId(dataParams: any) {
    const params = new HttpParams()
      .set('branchContactId', dataParams.branchContactId)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/GetCompanyBranchByBranchId', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> InsertAndUpdateCompanyBranch
  public InsertAndUpdateCompanyBranch(data: any, dataParams: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/InsertAndUpdateCompanyBranch?userId=${dataParams.userId}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

}
