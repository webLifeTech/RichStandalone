import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../../../shared/services/alert.service';
import { AuthService } from '../../../../../shared/services/auth.service';
import { GlobalService } from '../../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../comman/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @Input() type: string;
  constructor(
    public authService: AuthService,
    private alert: AlertService,
    public gs: GlobalService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

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
        this.gs.isLicenseVerified = false;
        this.gs.isFleetOwnerLicenseVerified = false;
        this.gs.isIndCarOwnerLicenseVerified = false;
        this.gs.isDivComeOwnedCarLicenseVerified = false;
        this.authService.logOut();
      }
    }, () => { });
  }

  goDashBoard() {
    this.router.navigateByUrl('/user/my-profile');
  }

  goSettings() {
    this.router.navigateByUrl('/user/settings/security');
  }

  goAdminDashBoard() {
    this.router.navigateByUrl('/admin/dashboard');
  }
}
