import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../../../shared/services/alert.service';
import { AuthService } from '../../../../../shared/services/auth.service';
import { GlobalService } from '../../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../comman/modal/confirmation-modal/confirmation-modal.component';
import { ToastService } from '../../../../services/toast.service';
import { ProfileService } from '../../../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,

  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @Input() type: string;
  isKYCCompleted: any = 0;


  constructor(
    public authService: AuthService,
    public gs: GlobalService,
    private router: Router,
    private modalService: NgbModal,
    private toast: ToastService,
    private profileService: ProfileService,
  ) {
    if (this.authService.isLoggedIn) {
      this.GetKycByUserId();
    }
  }

  ngAfterViewInit() {
    console.log("dddd <<<<");
  }

  GetKycByUserId() {
    this.profileService.GetKycByUserId({
      "userId": this.gs.loggedInUserInfo.userId,
    }).subscribe((response: any) => {
      const type: any = {
        "Driver": "driverkyc",
        "Driver with owned car": "driverkyc",
        "Vendor": "providerkyc",
      }
      this.isKYCCompleted = response[type[response.risktype]] == 0 ? false : true;
      console.log("type[response.risktype] >>>>>", response.risktype[type[response.risktype]]);
      console.log("type[response.risktype] >>>>>", type[response.risktype]);
      console.log("isKYCCompleted >>>>>", this.isKYCCompleted);
    })
  }

  async logOut() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = "Are you sure, you want to logout?";
    modalRef.componentInstance.confirmButton = "Yes";
    // modalRef.componentInstance.cancelButton = "Close";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
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
        this.gs.isLicenseVerified = false;
        this.gs.isFleetOwnerLicenseVerified = false;
        this.gs.isIndCarOwnerLicenseVerified = false;
        this.gs.isDivComeOwnedCarLicenseVerified = false;
        this.authService.logOut();
      }
    }, () => { });
  }

  async updateStatus(event: any) {
    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "status": event.target.checked,
      "risktype": this.gs.loggedInUserInfo.role === "Vendor" ? "Provider" : "Driver",
    };

    this.profileService.UpdateDriverAndProviderStatus(Body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr("Updated successfully");
        this.gs.loggedInUserInfo.activeStatus = event.target.checked;
        localStorage.setItem('loggedInUser', JSON.stringify(this.gs.loggedInUserInfo));
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  goDashBoard() {
    this.router.navigateByUrl('/user/profile');
  }

  goSettings() {
    this.router.navigateByUrl('/user/setting');
  }

  goAdminDashBoard() {
    this.router.navigateByUrl('/user/profile');
  }

  goConfiguration() {
    this.router.navigateByUrl('/user/configuration');
  }
}
