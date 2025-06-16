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
import { AlphabetOnlyDirective } from '../../../../shared/directives/alphabet-only.directive';
import { CountryDialogComponent } from '../../../../shared/components/dialoge/country-dialog/country-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comman-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    OnlynumberDirective,
    AlphabetOnlyDirective
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
  countryList: any = [];
  verificationType: any = null;
  rePassword: any = "";
  isShowPassOne: boolean = false;
  isShowPassTwo: boolean = false;
  userNameType: any = "mobile";
  countryCode: any = "INDIA";
  selectedCountry: any = {};
  submitted: boolean = false;

  emailPattern: any = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  passRequirement = {
    passwordMinUpperCase: 1,
    passwordMinLowerCase: 1,
    passwordMinNumber: 1,
    passwordMinSymbol: 1,
    passwordMinCharacters: 8
  };
  passPattern = [
    `(?=([^A-Z]*[A-Z]){${this.passRequirement.passwordMinUpperCase},})`,
    `(?=([^a-z]*[a-z]){${this.passRequirement.passwordMinLowerCase},})`,
    `(?=([^0-9]*[0-9])\{${this.passRequirement.passwordMinNumber},\})`,
    `(?=(\.\*[\$\@\$\!\%\*\#\^\(\)\&])\{${this.passRequirement.passwordMinSymbol},\})`,
    `[A-Za-z\\d\$\@\$\!\%\*\#\^\(\)\&]{${this.passRequirement.passwordMinCharacters},}`
  ].map(item => item.toString()).join('');


  constructor(
    private router: Router,
    private authService: AuthService,
    private gs: GlobalService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private vendorServ: VendorServService,
    private roleService: RolePermissionService,
    private dialog: MatDialog
  ) {
    this.route.queryParams.subscribe((pera: any) => {
      this.params = pera;
      if (pera && pera.type === "vendor") {
        this.isVendor = true;
        this.getVendorTypes();
      }
      this.getRolesList();
      this.getCountryCodeList();
    })
  }

  getRolesList() {
    this.roleService.GetRolesList({
      userRole: 'general'
    }).subscribe((res: any) => {
      this.rolesList = res;
    })
  }

  getCountryCodeList(): void {
    this.authService.GetTwilioCountryCodeList().subscribe((res: any) => {
      this.countryList = res;
      this.selectedCountry = this.countryList[1];
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
    this.submitted = true;
    if (type == 'login') {
      console.log("frm >>>>>", frm);

      if (!frm.valid) {
        this.toast.errorToastr("Fill the required fields!");
        return;
      }
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
        console.log("err >>>>>", err);

        this.toast.errorToastr(err?.error?.error_description || "Username or password not correct!");
      })
      // }
    }

    // return;
    if (type == 'register') {

      if (!frm.valid) {
        this.toast.errorToastr("Please enter valid details.");
        return;
      }
      if (this.loginForm.password !== this.rePassword) {
        this.toast.errorToastr('Password and confirm password do not match.');
        return;
      }

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

  async sendOtp(frm: any, sendType: any) {

    this.submitted = true;
    // if (!this.loginForm.username || !this.registerForm.full_name?.trim() || (this.isVendor && !this.registerForm.category) || (!this.isVendor && !this.registerForm.type)) {
    //   this.toast.errorToastr("Please fill the all details!");
    //   return;
    // }

    if (!frm.valid) {
      this.toast.errorToastr("Please fill the all required fields.");
      return;
    }

    if (this.loginForm.username.includes('@', '@gmail.com')) {
      this.verificationType = "EmailId";
    } else {
      this.verificationType = "PhoneNo";
    }

    const checkExist: any = await this.authService.IsEmailOrPhoneNumberExist({
      phoneNumber: this.verificationType == "PhoneNo" ? this.loginForm.username : null,
      email: this.verificationType == "EmailId" ? this.loginForm.username : null,
    })

    console.log("checkExist >>>>", checkExist);
    if (checkExist.statusCode != "200") {
      this.toast.errorToastr(checkExist.message);
      return;
    }


    const body = {
      verificationType: this.verificationType,
      phoneNumber: this.verificationType == "PhoneNo" ? this.loginForm.username : null,
      emailId: this.verificationType == "EmailId" ? this.loginForm.username : null,
      countryName: this.selectedCountry.CountryName,
      userId: null,
    }
    this.gs.isSpinnerShow = true;
    this.authService.SendVerificationCodeAsync(body).subscribe((res: any) => {
      console.log("SendVerificationCodeAsync >>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.submitted = false;
        if (sendType === 'resend') {
          this.toast.successToastr("Re-Send OTP Succesfully");
        } else {
          this.toast.successToastr(res.message);
        }
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
    this.submitted = true;
    if (!this.registerForm.otp) {
      this.toast.errorToastr("Please enter otp.");
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
        this.submitted = false;
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

  viewPassword(pass: any) {
    if (pass == 1) {
      this.isShowPassOne = !this.isShowPassOne;
    }
    if (pass == 2) {
      this.isShowPassTwo = !this.isShowPassTwo;
    }
  }

  openCountryDialog(): void {
    const dialogRef = this.dialog.open(CountryDialogComponent, {
      width: '300px',
      data: {
        selectedCountry: this.selectedCountry,
        countries: this.countryList,
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Selected Country Code:', result);
      if (result) {
        this.selectedCountry = result;
      }
    });
  }
}
