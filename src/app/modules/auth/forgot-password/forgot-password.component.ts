import { Component } from '@angular/core';
import { AnimationComponent } from '../../../shared/components/comman/animation/animation.component';
import { BreadcrumbsComponent } from '../../../shared/components/comman/breadcrumbs/breadcrumbs.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { GlobalService } from '../../../shared/services/global.service';
import { ToastService } from '../../../shared/services/toast.service';
import { CountryDialogComponent } from '../../../shared/components/dialoge/country-dialog/country-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OnlynumberDirective } from '../../../shared/directives/number-only.directive';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    AnimationComponent,
    BreadcrumbsComponent,
    TranslateModule,
    CommonModule,
    FormsModule,
    OnlynumberDirective,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  public bg_image = 'assets/images/cab/bg.jpg';
  public title = 'auth.forgot_password';
  public parent = 'auth.login';
  public parentRoute = '/auth/log-in';
  public child = 'auth.forgot_password';

  forgotPassForm: any = {
    name: "",
    username: "",
    otp: "",
    password: "",
  };
  rePassword: any = "";

  selectedCountry: any = {};
  countryList: any = [];
  userNameType: any = "mobile";
  countryCode: any = "INDIA";
  verificationType: any = null;

  enterOTP: boolean = false;
  sentotp: boolean = false;
  timer: number = 0;
  isOtpVerified: boolean = false;
  submitted: boolean = false;
  isShowPassOne: boolean = false;
  isShowPassTwo: boolean = false;

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
    private route: ActivatedRoute,
    private authService: AuthService,
    private gs: GlobalService,
    private toast: ToastService,
    private dialog: MatDialog,
  ) {
    window.scrollTo({ top: 10, behavior: 'smooth' });
    this.getCountryCodeList();
  }

  getCountryCodeList(): void {
    this.authService.GetTwilioCountryCodeList().subscribe((res: any) => {
      this.countryList = res;
      this.selectedCountry = this.countryList[1];
    })
  }

  backToLogin() {
    this.router.navigateByUrl('/auth/log-in');
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

  async sendOtp(frm: any, sendType: any) {

    this.submitted = true;
    // if (!this.forgotPassForm.username || !this.registerForm.full_name?.trim() || (this.isVendor && !this.registerForm.category) || (!this.isVendor && !this.registerForm.type)) {
    //   this.toast.errorToastr("Please fill the all details!");
    //   return;
    // }

    if (!frm.valid && sendType !== 'resend') {
      this.toast.errorToastr("Please fill the all required fields.");
      return;
    }

    if (this.forgotPassForm.username.includes('@', '@gmail.com')) {
      this.verificationType = "EmailId";
    } else {
      this.verificationType = "PhoneNo";
    }

    const body = {
      verificationType: this.verificationType,
      phoneNumber: this.verificationType == "PhoneNo" ? this.forgotPassForm.username : null,
      emailId: this.verificationType == "EmailId" ? this.forgotPassForm.username : null,
      countryName: this.selectedCountry.CountryName,
      userId: null,
      OTPPurpose: "forgotpassword",
    }
    this.gs.isSpinnerShow = true;
    this.authService.SendVerificationCodeAsync(body).subscribe((res: any) => {
      console.log("SendVerificationCodeAsync >>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.submitted = false;
        if (sendType === 'resend') {
          this.forgotPassForm.otp = "";
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

  confirmOtp(frm: any) {
    this.submitted = true;
    if (!frm.valid) {
      this.toast.errorToastr("Please enter valid details.");
      return;
    }
    console.log("this.forgotPassForm.password >>>>>>", this.forgotPassForm.password);
    console.log("this.rePassword >>>>>>", this.rePassword);

    if (this.forgotPassForm.password !== this.rePassword) {
      this.toast.errorToastr('Password and confirm password do not match.');
      return;
    }

    // if (!this.forgotPassForm.otp) {
    //   this.toast.errorToastr("Please enter otp.");
    //   return;
    // }
    // this.toast.successToastr("Password updated successfully");
    // this.backToLogin();
    // return;
    const body = {
      verificationType: this.verificationType,
      verificationCode: this.forgotPassForm.otp,
      userName: this.forgotPassForm.username,
      newPassword: this.forgotPassForm.password,
      confirmPassword: this.rePassword
    }
    this.gs.isSpinnerShow = true;
    this.authService.SetPassword(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      console.log("SetPassword >>>", res);
      if (res && res.statusCode == "200") {
        this.toast.successToastr(res.message);
        this.backToLogin();
      } else {
        this.toast.errorToastr(res.message);
      }
    })
  }

}
