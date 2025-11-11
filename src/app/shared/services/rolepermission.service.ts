import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GlobalService } from './global.service';

// Interface for the API response
export interface ButtonConfig {
  StateCode: string | null;
  CarierID: string | null;
  PolicyType: string | null;
  LOB: string | null;
  SubLOB: string | null;
  Code: string;
  Name: string;
  TransactionCode: string;
  Roles: string;
  Class: string | null;
  ActionIcon: string | null;
  ActionType: string | null;
  Priority: number;
  IsActive: boolean;
}

@Injectable({
  providedIn: 'root'
})


export class RolePermissionService {
  baseUrl1 = environment.apiUrl1;
  menuItems: any = [];
  permissions: any = {}

  constructor(
    private http: HttpClient,
    private gs: GlobalService
  ) {

  }

  public GetRolesList(dataParams: any) {
    const params = new HttpParams().set('userRole', dataParams.userRole);
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetRolesList', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Menu -> GetUsrMenuDetails
  public GetUsrMenuDetails(dataParams: any) {
    const params = new HttpParams().set('userName', dataParams.userName).set('systemId', dataParams.systemId)
    return this.http.get(this.baseUrl1 + 'TLHUB/Menu/GetUsrMenuDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Menu -> GetGridTabsDetails
  public GetGridTabsDetails(dataParams: any) {
    const params = new HttpParams().set('roleId', dataParams.roleId).set('menuId', dataParams.menuId)
    return this.http.get(this.baseUrl1 + 'TLHUB/Menu/GetGridTabsDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getActionButtons(data: any): Observable<ButtonConfig[]> {
    return this.http.post(this.baseUrl1 + 'TLHUB//ConfigUI/GetActionButtons', data).pipe(
      map((buttons: any) => buttons.sort((a: any, b: any) => a.Priority - b.Priority))
    );
  }

  getButtons(transactionCode: string) {
    const body = {
      TransactionCode: transactionCode,
      UserType: this.gs.loggedInUserInfo?.['roleName']
    };
    this.getActionButtons(body).subscribe(async (response: any) => {
      this.permissions = response.reduce((acc: any, item: any) => {
        acc[item.Code] = item;
        return acc;
      }, {});
      console.log("this.permissions >>>>>", this.permissions);

    })
  }
}
