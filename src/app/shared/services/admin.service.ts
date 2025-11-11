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

  // Admin -> GetAllVehicleOwners
  public GetAllVehicleOwners(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Admin/GetAllVehicleOwners`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Admin -> GetAllOwnerVehicles
  public GetAllOwnerVehicles(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Admin/GetAllOwnerVehicles`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Admin -> GetAllUsers
  public GetAllUsers(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Admin/GetAllUsers`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Admin -> GetAllBookingOverview
  public GetAllBookingOverview(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Admin/GetAllBookingOverview`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Admin -> GetAdminDashboardDetails
  public GetAdminDashboardDetails(dataParams: any) {
    const params = new HttpParams().set('filter', dataParams.filter).set('type', dataParams.type)
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

  // Admin -> GetBookingRefundDetails
  public GetBookingRefundDetails(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Admin/GetBookingRefundDetails`, data).pipe(
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

  // Admin -> GetPendingConfirmationBookingPayments
  public GetPendingConfirmationBookingPayments(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Admin/GetPendingConfirmationBookingPayments', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Admin -> GetPendingClearanceBookingPayments
  public GetPendingClearanceBookingPayments(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Admin/GetPendingClearanceBookingPayments', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Admin -> GetTLHPaymentOverview
  public GetTLHPaymentOverview(dataParams: any) {
    const params = new HttpParams().set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + `TLHUB/Admin/GetTLHPaymentOverview`, { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Admin -> UpdatePendingPaymentStatus
  public UpdatePendingPaymentStatus(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Admin/UpdatePendingPaymentStatus', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
