import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiResultFormat } from './model/model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BookingService {

  baseUrl1 = environment.apiUrl1;
  constructor(private http: HttpClient) { }

  public getuserPayment() {
    return this.http.get<apiResultFormat>('assets/json/pages/user-payment.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getuserWallet() {
    return this.http.get<apiResultFormat>('assets/json/pages/user-wallet.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getUserBookingCancelled() {
    return this.http
      .get<apiResultFormat>('assets/json/pages/user-booking-cancelled.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }

  public getUserBookingComplete() {
    return this.http
      .get<apiResultFormat>('assets/json/pages/user-booking-complete.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getUserBookingInprogress() {
    return this.http
      .get<apiResultFormat>('assets/json/pages/user-booking-inprogress.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getUserBookingUpcoming() {
    return this.http
      .get<apiResultFormat>('assets/json/pages/user-booking-upcoming.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getUserBookingPending() {
    return this.http
      .get<apiResultFormat>('assets/json/pages/user-booking-pending.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getUserBookings() {
    return this.http
      .get<apiResultFormat>('assets/json/pages/user-bookings.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }

  public getBookedDrivers() {
    return this.http
      .get<apiResultFormat>('assets/json/pages/all-booked-drivers.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }

  public getBookedCars() {
    return this.http
      .get<apiResultFormat>('assets/json/pages/all-booked-cars.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }

  // Booking -> GetAllBookings
  public GetAllBookings(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Booking/GetAllBookings`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Booking -> GetBookingByBookingRefNo
  public GetBookingByBookingRefNo(dataParams: any) {
    const params = new HttpParams()
      .set('bookingRefNo', dataParams.bookingRefNo)
      .set('loginUserId', dataParams.loginUserId);
    return this.http.get(this.baseUrl1 + 'TLHUB/Booking/GetBookingByBookingRefNo', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Cancellation -> BookingCancellationRequest
  public BookingCancellationRequest(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Cancellation/BookingCancellationRequest`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // BookingAgreement -> InitiateDeliverVehicleToDriver
  public InitiateDeliverVehicleToDriver(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/BookingAgreement/InitiateDeliverVehicleToDriver`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> GetMasterInspectionLineItems
  public GetMasterInspectionLineItems(dataParams: any) {
    const params = new HttpParams().set('inspectiontype', dataParams.inspectiontype);
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterInspectionLineItems', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> GetPostMasterInspectionLineItems
  public GetPostMasterInspectionLineItems(dataParams: any) {
    const params = new HttpParams().set('bookingId', dataParams.bookingId);
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetPostMasterInspectionLineItems', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // BookingAgreement -> ConfirmVehicleAcceptanceByDriver
  public ConfirmVehicleAcceptanceByDriver(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/BookingAgreement/ConfirmVehicleAcceptanceByDriver`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // BookingAgreement -> ConfirmVehicleReceivedByOwnerfromDriver
  public ConfirmVehicleReceivedByOwnerfromDriver(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/BookingAgreement/ConfirmVehicleReceivedByOwnerfromDriver`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // http://209.10.88.76:2025/TLHUB_API_DEMO/TLHUB/COMMON/GetBookingAllDocuments?
  // bookingId=42&
  // userId=3e89dba8-792c-493e-a26d-562914d1da78&
  // riskId=4610&
  // riskType=Vehicle

  // Booking -> GetBookingAllDocuments
  public GetBookingAllDocuments(dataParams: any) {
    const params = new HttpParams()
      .set('bookingId', dataParams.bookingId)
      .set('userId', dataParams.userId)
      .set('riskId', dataParams.riskId)
      .set('riskType', dataParams.riskType);
    return this.http.get(this.baseUrl1 + 'TLHUB/COMMON/GetBookingAllDocuments', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
