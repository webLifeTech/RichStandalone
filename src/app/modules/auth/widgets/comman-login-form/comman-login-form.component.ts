import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../../../shared/services/toast.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { VendorServService } from '../../../../shared/services/vendor-service.service';
import { OnlynumberDirective } from '../../../../shared/directives/number-only.directive';
import { RolePermissionService } from '../../../../shared/services/rolepermission.service';

@Component({
  selector: 'app-comman-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    OnlynumberDirective
  ],
  templateUrl: './comman-login-form.component.html',
  styleUrl: './comman-login-form.component.scss'
})
export class CommanLoginFormComponent {

  params: any = {};
  isVendor: any = false;
  loginForm: any = {
    name: "",
    username: "",
    password: ""
  };
  registerForm: any = {
    category: null,
    categoryCd: null,
    subCategory: null,
    subCategoryCd: null,
    type: null,
    otp: null,
  };

  @Input() type: string;
  enterOTP: boolean = false;
  sentotp: boolean = false;
  timer: number = 0;
  isOtpVerified: boolean = false;

  vendorTypes: any = [];
  subCategories: any = [];
  rolesList: any = [];
  verificationType: any = null;


  users: any = [
    {
      "name": "Driver",
      "username": "driver@gmail.com",
      "password": "123123",
      "role": "user",
      "userRoleName": "Driver",
      "roleName": "53D8CF61-E99B-43A9-AA8F-4CE5B0E12872",

      // New york (Driver User)
      "userId": "99ea64c3-17b4-4bb4-bcbc-c9ed65708ff5",
      "contactId": 1001,

      // New york city (Driver User)
      // "userId": "bd485943-ece2-4d67-85a4-113fd36f3908",
      // "contactId": 10020,

      // Other (Driver User)
      // "userId": "f408b99f-6ec4-4603-b89d-be8fb828238e",
      // "contactId": 10029,
      "id": 1
    },
    {
      "name": "Individualcarowner",
      "username": "individualcarowner@gmail.com",
      "password": "123123",
      "role": "user_2",
      "userRoleName": "Individual car owner",
      "roleName": "E56F8C18-B4F6-4EE4-976D-A693AA6F98FF",

      // New york (Individualcarowner User)
      // "userId": "dce35052-51e8-4091-bada-b1d7108d6bf8",
      // "contactId": 10023,

      // New york city (Individualcarowner User)
      "userId": "f438ebd8-a2d3-4cc6-addf-2d29aff084d7",
      "contactId": 10040,

      // Other (Individualcarowner User)
      // "userId": "31f77d5b-5749-44dc-9e16-6d0140bf86dd",
      // "contactId": 301,

      "id": 2
    },
    {
      "name": "Fleetowner",
      "username": "fleetowner@gmail.com",
      "password": "123123",
      "role": "user_3",
      "userRoleName": "Fleet owner",
      "roleName": "B5107AB1-19BF-430B-9553-76F39DB1CDCD",

      // New york (Fleetowner User)
      // "userId": "2991e709-4966-4b64-beb4-4e9ff34f4a4f",
      // "contactId": 10066,

      // New york city (Fleetowner User)
      "userId": "5901c8d4-6a9b-400e-b063-fa2d217b2af5",
      "contactId": 10081,

      // Other (Fleetowner User)
      // "userId": "f7cce929-b2bf-422c-9383-35480e468ff0",
      // "contactId": 10025,
      "id": 3
    },
    {
      "name": "Driverwithownedcar",
      "username": "driverwithownedcar@gmail.com",
      "password": "123123",
      "role": "user_4",
      "userRoleName": "Individual car owner",
      "roleName": "416D4E0F-32BB-4218-B2EA-499764D5F62E",

      // New york (Driverwithownedcar User 1)
      "userId": "d837179a-44cd-4fec-b45e-bb16bf572966",
      "contactId": 297,

      // New york city (Driverwithownedcar User 1)
      // "userId": "fbe52ab4-3bf2-4131-9265-1f8fb6a1d152",
      // "contactId": 1002,

      // Other (Driverwithownedcar User 1)
      // "userId": "00a25198-7a94-4265-9ae1-2446c7928fb3",
      // "contactId": 304,
      "id": 4
    }
  ]

  constructor(
    private router: Router,
    private authService: AuthService,
    private gs: GlobalService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private vendorServ: VendorServService,
    private roleService: RolePermissionService,
  ) {
    this.route.queryParams.subscribe((pera: any) => {
      this.params = pera;
      if (pera && pera.type === "vendor") {
        this.isVendor = true;
        this.getVendorTypes();
      }
      this.getRolesList();
    })
  }

  getRolesList() {
    this.roleService.GetRolesList({
      userRole: 'general'
    }).subscribe((res: any) => {
      this.rolesList = res;
    })
  }

  userAuth(type: string) {
    if (type == 'login') {
      this.router.navigate(['/auth/register'], {
        queryParams: this.params
      });
    }
    else {
      if (this.isVendor) {
        this.router.navigateByUrl('/vendor/dashboard');
      } {
        this.router.navigateByUrl('/auth/log-in');
      }
    }
  }

  authUser(frm: any, type: string) {
    if (type == 'login') {
      // if (this.loginForm.username === 'admin@gmail.com') {
      //   this.loginForm.role = 'admin';
      //   this.loginForm.name = 'Admin';
      //   this.loginForm.id = 100;
      // } else {
      this.gs.isSpinnerShow = true;
      this.authService.userLogin(this.loginForm).subscribe((res: any) => {
        console.log("res >>>>>>>", res);
        this.gs.isSpinnerShow = false;
        let roles: any = {
          ["Driver"]: "user",
          ["Individual car owner"]: "user_2",
          ["Fleet owner"]: "user_3",
          ["Driver with owned car"]: "user_4",
          ["Administrator"]: "admin",
          ["Vendor"]: "Vendor",
        }

        this.loginForm = {
          "name": res.fullName,
          "username": this.loginForm.username,
          "userNameId": res.userName,
          "password": this.loginForm.password,
          "role": roles[res.roleName],
          "userRoleName": res.roleName, // "Fleet owner",
          "roleName": res.userType, // "B5107AB1-19BF-430B-9553-76F39DB1CDCD",
          "userId": res.userID, // "5901c8d4-6a9b-400e-b063-fa2d217b2af5",
          "contactId": res.personNum,
          "activeStatus": res.activeStatus || false,
          "isKYCCompleted": res.isKYCCompleted == "false" ? false : true,
        };

        this.authService.login(this.loginForm);
        this.toast.successToastr("Logged in successfully");

      }, err => {
        this.gs.isSpinnerShow = false;
        console.log("Username or password not correct!");
        this.toast.errorToastr("Username or password not correct!");

      })
      // }
    }

    // return;
    if (type == 'register') {

      let body: any = {
        "passWord": this.loginForm.password,
        "firstName": this.registerForm.full_name,
        "userType": this.registerForm.type,
        "phoneNo": this.verificationType == "PhoneNo" ? this.loginForm.username : null,
        "email": this.verificationType == "EmailId" ? this.loginForm.username : null,
      }

      if (this.isVendor) {
        body["category"] = this.registerForm.category;
        body["categoryCd"] = this.registerForm.categoryCd;
        body["userType"] = "06E0E6F2-E9E6-4555-B4C8-8C91507FE3D6";
      }

      console.log("body >>>>>", body);
      this.authService.register(body).subscribe((res: any) => {
        console.log("registerVendor --->", res);
        if (res && res.statusCode == "200") {
          this.toast.successToastr(res.message);
          this.router.navigateByUrl('/auth/log-in');
        } else {
          this.toast.errorToastr(res.message);
        }
      })
    }
  }

  sendOtp() {

    console.log("(this.isVendor && !this.registerForm.category) >>", (this.isVendor && !this.registerForm.category));
    console.log("(!this.isVendor && !this.registerForm.type) >>", (!this.isVendor && !this.registerForm.type));

    if (!this.loginForm.username || !this.registerForm.full_name || (this.isVendor && !this.registerForm.category) || (!this.isVendor && !this.registerForm.type)) {
      this.toast.warningToastr("Please fill the all details!");
      return;
    }

    if (this.loginForm.username.includes('@', '@gmail.com')) {
      this.verificationType = "EmailId";
    } else {
      this.verificationType = "PhoneNo";
    }

    const body = {
      verificationType: this.verificationType,
      phoneNumber: this.verificationType == "PhoneNo" ? this.loginForm.username : null,
      emailId: this.verificationType == "EmailId" ? this.loginForm.username : null,
      countryName: 'India',
      userId: null,
    }
    this.gs.isSpinnerShow = true;
    this.authService.SendVerificationCodeAsync(body).subscribe((res: any) => {
      console.log("SendVerificationCodeAsync >>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(res.message);
        this.enterOTP = true;
        this.sentotp = true;
        this.timer = 60; // Start the timer at 60 seconds
        this.isOtpVerified = false;
        const countdown = setInterval(() => {
          if (this.timer > 0) {
            this.timer--; // Decrease the timer by 1 second
          } else {
            clearInterval(countdown); // Stop the countdown when the timer reaches 0
            this.sentotp = false; // Optionally, hide the OTP input if the timer runs out
          }
        }, 1000);
      } else {
        this.toast.errorToastr(res.message);
      }
    })

  }

  confirmOtp() {
    if (!this.registerForm.otp) {
      this.toast.warningToastr("Please enter otp.");
      return;
    }
    const body = {
      verificationType: this.verificationType,
      phoneNumber: this.verificationType == "PhoneNo" ? this.loginForm.username : null,
      emailId: this.verificationType == "EmailId" ? this.loginForm.username : null,
      verificationCode: this.registerForm.otp,
      userId: null,
    }
    this.gs.isSpinnerShow = true;
    this.authService.ValidateVerificationCodeMethod(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      console.log("ValidateVerificationCodeMethod >>>", res);
      if (res && res.statusCode == "200") {
        this.isOtpVerified = true;
        this.toast.successToastr(res.message);
      } else {
        this.toast.errorToastr(res.message);
      }
    })
  }

  getVendorTypes() {
    this.vendorServ.getMasterProviderCategories().subscribe((res: any) => {
      this.vendorTypes = res;
    })
  }

  selectCategory(vendor: any) {
    console.log("vendor >>>>>>", vendor);
    this.registerForm.categoryCd = vendor.ID;
    this.vendorServ.getMasterProviderSubCategories({
      categoryId: vendor.ID
    }).subscribe((res: any) => {
      this.subCategories = res;
    })
  }

  changeSubCat(subCat: any) {

  }

}
