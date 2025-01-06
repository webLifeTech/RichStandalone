import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { cabClassic } from '../interface/cab-classic';
import { cabMap } from '../interface/cab-map';
import { cabDetails, cabs, cab, blog, testimonials, services } from '../interface/cab';
import { driverDetails, drivers, driver } from '../interface/driver';
import { apiResultFormat } from './model/model';


@Injectable({
  providedIn: 'root'
})
export class BookingService {

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




}
