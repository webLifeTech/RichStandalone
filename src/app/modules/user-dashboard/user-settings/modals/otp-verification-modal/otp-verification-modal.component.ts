import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../shared/services/global.service';
import { AuthService } from '../../../../../shared/services/auth.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-otp-verification-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './otp-verification-modal.component.html',
  styleUrl: './otp-verification-modal.component.scss'
})
export class OtpVerificationModalComponent {

  @Input() title: string;
  @Input() verificationType: string;
  @Input() username: string;

  reason: any = "";

  enterOTP: boolean = false;
  sentotp: boolean = false;
  timer: number = 0;
  isOtpVerified: boolean = false;
  countryCode: any = "INDIA";
  submitted: boolean = false;

  public oneTimePassword = {
    data1: "",
    data2: "",
    data3: "",
    data4: ""
  };

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private gs: GlobalService,
    private toast: ToastService,
  ) { }

  ngOnInit() {
    console.log("verificationType >>", this.verificationType);
    console.log("username >>", this.username);

    if (this.verificationType == "PhoneNo") { // need to do once Twilio recharge
      this.toast.successToastr("Verification Code Sent Successfully");
      return;
    }
    this.sendOtp('send');
  }

  async sendOtp(sendType: any) {

    this.submitted = true;
    if (!this.username && sendType !== 'resend') {
      this.toast.errorToastr("Please fill the all required fields.");
      return;
    }

    const body = {
      verificationType: this.verificationType,
      phoneNumber: this.verificationType == "PhoneNo" ? this.username : null,
      emailId: this.verificationType == "EmailId" ? this.username : null,
      countryName: this.countryCode,
      userId: this.gs.loggedInUserInfo.userId,
      OTPPurpose: "KycVerification",
    }
    this.gs.isSpinnerShow = true;
    this.authService.SendVerificationCodeAsync(body).subscribe((res: any) => {
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
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
      this.toast.errorToastr(err?.error?.message || "Something went wrong");
    })

  }

  async reRendOTP(sendType: any) {
    if (sendType !== 'resend') {
      this.toast.errorToastr("Please fill the all required fields.");
      return;
    }

    if (this.verificationType == "PhoneNo") {
      this.toast.successToastr("Verification Code Re Sent Successfully");
      // this.ReSendPhoneVerificationCodeAsync(); // need to do once Twilio recharge
    }
    if (this.verificationType == "EmailId") {
      this.ReSendEmailVerificationCodeAsync();
    }
  }

  ReSendPhoneVerificationCodeAsync() {
    const body = {
      phoneNumber: this.username,
      countryName: this.countryCode,
      userId: null,
    };
    this.gs.isSpinnerShow = true;
    this.authService.ReSendPhoneVerificationCodeAsync(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  ReSendEmailVerificationCodeAsync() {
    const body = {
      emailId: this.username,
      userId: null,
    };
    this.gs.isSpinnerShow = true;
    this.authService.ReSendEmailVerificationCodeAsync(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  confirmOtp() {
    this.submitted = true;
    console.log("this.oneTimePassword >>>", this.oneTimePassword);
    const otp = this.oneTimePassword.data1 + this.oneTimePassword.data2 + this.oneTimePassword.data3 + this.oneTimePassword.data4
    console.log("otp >>>", otp);
    // return;

    if (!otp) {
      this.toast.errorToastr("Please enter otp.");
      return;
    }

    if (this.verificationType == "PhoneNo") { // need to do once Twilio recharge
      this.toast.successToastr("Verification Successfully");
      this.activeModal.close({ confirmed: true });
      return;
    }

    const body = {
      verificationType: this.verificationType,
      phoneNumber: this.verificationType == "PhoneNo" ? this.username : null,
      emailId: this.verificationType == "EmailId" ? this.username : null,
      verificationCode: otp,
      userId: this.gs.loggedInUserInfo.userId,
    }
    this.gs.isSpinnerShow = true;
    this.authService.ValidateVerificationCodeMethod(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.isOtpVerified = true;
        this.submitted = false;
        this.toast.successToastr(res.message);
        this.activeModal.close({ confirmed: true });
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
      this.toast.errorToastr(err?.error?.message || "Something went wrong");
    })
  }

  public ValueChanged(data: string, box: string): void {
    if (box == 'digit-1' && data.length > 0) {
      document.getElementById('digit-2')?.focus();
    } else if (box == 'digit-2' && data.length > 0) {
      document.getElementById('digit-3')?.focus();
    } else if (box == 'digit-3' && data.length > 0) {
      document.getElementById('digit-4')?.focus();
    } else {
      return
    }
  }
  public tiggerBackspace(data: string, box: string) {
    let StringyfyData;
    if (data) {
      StringyfyData = data.toString();
    } else {
      StringyfyData = null;
    }
    if (box == 'digit-4' && StringyfyData == null) {
      document.getElementById('digit-3')?.focus();
    } else if (box == 'digit-3' && StringyfyData == null) {
      document.getElementById('digit-2')?.focus();
    } else if (box == 'digit-2' && StringyfyData == null) {
      document.getElementById('digit-1')?.focus();
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {

    this.activeModal.close({ confirmed: true, reason: this.reason });
  }

}
