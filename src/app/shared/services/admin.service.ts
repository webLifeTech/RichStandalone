import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { apiResultFormat } from './model/model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl1 = environment.apiUrl1;
  constructor(private http: HttpClient) { }

  // Admin -> GetAllVehiclesForAdmin
  public GetAllVehiclesForAdmin(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Admin/GetAllVehiclesForAdmin`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Admin -> GetAllUsersForAdmin
  public GetAllUsersForAdmin(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Admin/GetAllUsersForAdmin`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Admin -> GetAllBookingOverviewForAdmin
  public GetAllBookingOverviewForAdmin(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Admin/GetAllBookingOverviewForAdmin`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Admin -> GetAdminDashboardDetails
  public GetAdminDashboardDetails() {
    return this.http.get(this.baseUrl1 + `TLHUB/Admin/GetAdminDashboardDetails`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
