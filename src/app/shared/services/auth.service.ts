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
    let body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "userName": this.gs.loggedInUserInfo.userNameId,
      "userUniqueId": null,
      "Source": "Web"
    }
    this.gs.isSpinnerShow = true;
    this.SignOut(body).subscribe((res: any) => {
      console.log("res >>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.router.navigateByUrl('/home');
        this.resetStorage();
      }
    })
  }

  resetStorage() {
    setTimeout(() => {
      this.isLoggedIn = false;
      this.gs.isLicenseVerified = false;
      this.gs.isFleetOwnerLicenseVerified = false;
      this.gs.isIndCarOwnerLicenseVerified = false;
      this.gs.isDivComeOwnedCarLicenseVerified = false;
      this.gs.isSpinnerShow = false;
      this.gs.loggedInUserInfo = {};
      localStorage.removeItem('isLicenseVerified');
      localStorage.removeItem('driverInfoData');
      localStorage.removeItem('isFleetOwnerLicenseVerified');
      localStorage.removeItem('fleetOwnerKycData');
      localStorage.removeItem('isIndCarOwnerLicenseVerified');
      localStorage.removeItem('individualCarOwnerKycData');
      localStorage.removeItem('isDivComeOwnedCarLicenseVerified');
      localStorage.removeItem('divComeOwnedCarKycData');
      localStorage.removeItem('driverDetailsData');
      localStorage.removeItem('MyWishlistStore');
      localStorage.removeItem('purchasedNFTUser');
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('loggedInUser');
    }, 1000);
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
      .set('grant_type', 'password')
      .set('Source', 'Web');
    return this.http.post(this.baseUrl1 + `TLHUB/token`, body.toString(), { headers }).pipe(
      map((res: any) => {
        return res;
      })
    );
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

  // Communication -> ReSendPhoneVerificationCodeAsync
  public ReSendPhoneVerificationCodeAsync(dataParams: any) {
    const params = new HttpParams()
      .set('phoneNumber', dataParams.phoneNumber)
      .set('countryName', dataParams.countryName)
      .set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB/Communication/ReSendPhoneVerificationCodeAsync', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Communication -> ReSendEmailVerificationCodeAsync
  public ReSendEmailVerificationCodeAsync(dataParams: any) {
    const params = new HttpParams().set('emailId', dataParams.emailId).set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB/Communication/ReSendEmailVerificationCodeAsync', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // User -> SignOut
  public SignOut(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/User/SignOut`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
