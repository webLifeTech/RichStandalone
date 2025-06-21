import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
// import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean;
  loggedInUserInfo: any = {};
  baseUrl1 = environment.apiUrl1;

  constructor(
    private router: Router,
    private gs: GlobalService,
    private http: HttpClient
  ) {
    this.isLoggedIn = localStorage.getItem('loggedIn') === 'true' || false;
  }

  login(data: any) {
    this.isLoggedIn = true;
    if (this.isLoggedIn) {
      this.loggedInUserInfo = data;
      this.gs.loggedInUserInfo = this.loggedInUserInfo;
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('loggedInUser', JSON.stringify(data));
      if (this.loggedInUserInfo.role === 'admin') {
        this.router.navigateByUrl('/user/profile'); // admin/my-profile
      } else if (this.loggedInUserInfo.role === 'Vendor') {
        this.router.navigateByUrl('/user/profile');
      } else {
        this.router.navigateByUrl('/cab/listing/list-view');
      }
      // this.toast.successToastr("LoggedIn Successfully");
    }
  }

  register(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/User/RegisterUser`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
    // this.isLoggedIn = true;
    // if (this.isLoggedIn) {
    //   this.loggedInUserInfo = data;
    //   this.gs.loggedInUserInfo = this.loggedInUserInfo;
    //   localStorage.setItem('loggedIn', 'true');
    //   localStorage.setItem('loggedInUser', JSON.stringify(data));
    //   this.router.navigateByUrl('/cab/listing/list-view');
    //   // this.toast.successToastr("Registration Successfully");
    // }
  }

  logOut() {
    this.isLoggedIn = false;
    this.gs.loggedInUserInfo = {};
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loggedInUser');
    this.router.navigateByUrl('/home');
  }

  // User Login
  public userLogin(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new HttpParams()
      .set('UUID', '2C096954-6A8F-42A8-B57B-6728C0F0311C')
      .set('password', data.password)
      .set('username', data.username)
      .set('client_id', 'tlcHubAuthApp')
      .set('grant_type', 'password');
    return this.http.post(this.baseUrl1 + `TLHUB/token`, body.toString(), { headers }).pipe(
      map((res: any) => {
        return res;
      })
    );
    // return this.http.post(this.baseUrl1 + `TLHUB/token`, data).pipe(
    //   map((res: any) => {
    //     return res;
    //   })
    // );
  }

  public SendVerificationCodeAsync(dataParams: any) {
    const params = new HttpParams()
      .set('verificationType', dataParams.verificationType)
      .set('phoneNumber', dataParams.phoneNumber)
      .set('countryName', dataParams.countryName)
      .set('emailId', dataParams.emailId)
      .set('userId', dataParams.userId)
      .set('OTPPurpose', dataParams.OTPPurpose);
    return this.http.get(this.baseUrl1 + 'TLHUB/Communication/SendVerificationCodeAsync', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Communication -> ValidateVerificationCodeMethod
  public ValidateVerificationCodeMethod(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Communication/ValidateVerificationCode`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // User -> IsEmailOrPhoneNumberExist
  public IsEmailOrPhoneNumberExist(dataParams: any) {
    return new Promise((resolve, reject) => {
      const params = new HttpParams().set('email', dataParams.email).set('phoneNumber', dataParams.phoneNumber)
      this.http.get(this.baseUrl1 + 'TLHUB/User/IsEmailOrPhoneNumberExist', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })

    // return this.http.get(this.baseUrl1 + 'TLHUB/User/IsEmailOrPhoneNumberExist', { params }).pipe(
    //   map((res: any) => {
    //     return res;
    //   })
    // );
  }

  // Master -> GetTwilioCountryCodeList
  public GetTwilioCountryCodeList() {
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetTwilioCountryCodeList').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Account -> SetPassword
  public SetPassword(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Account/SetPassword`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
