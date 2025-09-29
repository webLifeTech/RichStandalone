import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  public GetAdminDashboardDetails(dataParams: any) {
    const params = new HttpParams().set('filter', dataParams.filter)
    return this.http.get(this.baseUrl1 + `TLHUB/Admin/GetAdminDashboardDetails`, { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  // Admin -> UpdateUserStatus
  public UpdateUserStatus(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/COMMON/UpdateUserStatus`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> GetMasterRefundStatus
  public GetMasterRefundStatus() {
    return this.http.get(this.baseUrl1 + `TLHUB/Master/GetMasterRefundStatus`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Admin -> GetBookingRefundDetailsForAdmin
  public GetBookingRefundDetailsForAdmin(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Admin/GetBookingRefundDetailsForAdmin`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Refund -> UpdateBookingRefundStatus
  public UpdateBookingRefundStatus(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Refund/UpdateBookingRefundStatus`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
