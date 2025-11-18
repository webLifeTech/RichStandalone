import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../shared/services/toast.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { ChangeEmailModalComponent } from '../modals/change-email-modal/change-email-modal.component';
import { ChangePasswordModalComponent } from '../modals/change-password-modal/change-password-modal.component';
import { ChangePhoneModalComponent } from '../modals/change-phone-modal/change-phone-modal.component';
import { DeactiveAccountModalComponent } from '../modals/deactive-account-modal/deactive-account-modal.component';
import { EmailVerificationModalComponent } from '../modals/email-verification-modal/email-verification-modal.component';
import { EmailVerificationSuccessModalComponent } from '../modals/email-verification-success-modal/email-verification-success-modal.component';
import { OtpVerificationModalComponent } from '../modals/otp-verification-modal/otp-verification-modal.component';
import { VerificationSuccessModalComponent } from '../modals/verification-success-modal/verification-success-modal.component';
import { DeleteModalComponent } from '../../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { SettingsService } from '../../../../shared/services/setting.service';
// import { SettingsService } from '../../../../shared/services/settings.service';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,
    NgbModule,
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss'
})
export class SecurityComponent {
  settingsDetails: any = [];

  constructor(
    private toast: ToastService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private settingsService: SettingsService,

  ) {
    this.getSettingsDetails();
  }

  getSettingsDetails() {
    let body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "type": "Security",
    }
    this.gs.isSpinnerShow = true;
    this.settingsService.GetSettingsDetails(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response) {
        this.settingsDetails = JSON.parse(response)?.settingTabs || [];
        console.log("Security Details >>>>>", this.settingsDetails);
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  openChange(item: any) {
    if (item.Code === 'Pwd') {
      this.openChangePassword();
    }
  }

  openChangePassword() {
    const modalRef = this.modalService.open(ChangePasswordModalComponent, {
      centered: true
    });
    modalRef.result.then((res: any) => {

      if (res.confirmed) {
        this.getSettingsDetails();
      }
    }, () => {
    });
  }

  openChangePhone() {
    const modalRef = this.modalService.open(ChangePhoneModalComponent, {
      centered: true
    });
    modalRef.result.then((res: any) => {

      if (res.confirmed) {
        this.openOtpVerification();
        // this.toast.successToastr("Phone number changed successfully");
      }
    }, () => {
    });
  }

  openOtpVerification() {
    const modalRef = this.modalService.open(OtpVerificationModalComponent, {
      centered: true
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.openVerificationSuccess();
      }
    }, () => {
    });
  }

  openVerificationSuccess() {
    const modalRef = this.modalService.open(VerificationSuccessModalComponent, {
      centered: true
    });
    modalRef.componentInstance.title = "You Phone number has been successfully Verified.";
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

  openChangeEmail() {
    const modalRef = this.modalService.open(ChangeEmailModalComponent, {
      centered: true
    });
    modalRef.result.then((res: any) => {

      if (res.confirmed) {
        this.openEmailVerification();
      }
    }, () => {
    });
  }

  openEmailVerification() {
    const modalRef = this.modalService.open(EmailVerificationModalComponent, {
      centered: true
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.openEmailVerificationSuccess();
      }

    }, () => {
    });
  }
  openEmailVerificationSuccess() {
    // EmailVerificationSuccessModalComponent
    const modalRef = this.modalService.open(VerificationSuccessModalComponent, {
      centered: true
    });
    modalRef.componentInstance.title = "You Email has been successfully Verified.";
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }




  openDeactiveAccount() {
    const modalRef = this.modalService.open(DeactiveAccountModalComponent, {
      centered: true
    });
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }



  async onDeleteTwoFactor() {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true
    });
    modalRef.componentInstance.mainTitle = "Delete Two Factor";
    modalRef.result.then((res: any) => {

      if (res.confirmed) {
        this.toast.successToastr("Deleted successfully");
      }
    }, () => {
    });
  }
  async onDelete() {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true
    });
    modalRef.componentInstance.mainTitle = "Delete Account";
    modalRef.result.then((res: any) => {

      if (res.confirmed) {
        this.toast.successToastr("Deleted successfully");
      }
    }, () => {
    });
  }

}
