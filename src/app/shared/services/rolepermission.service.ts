import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  baseUrl1 = environment.apiUrl1;
  menuItems: any = [];
  actionPermissions: any = {

  }

  constructor(private http: HttpClient) {

  }

  public GetRolesList(dataParams: any) {
    const params = new HttpParams().set('userRole', dataParams.userRole);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/GetRolesList', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Menu -> GetUsrMenuDetails
  public GetUsrMenuDetails(dataParams: any) {
    const params = new HttpParams()
      .set('userName', dataParams.userName)
      .set('systemId', dataParams.systemId)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Menu/GetUsrMenuDetails', { params }).pipe(
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

}
