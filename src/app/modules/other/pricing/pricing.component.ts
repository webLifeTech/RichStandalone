import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PricingService } from '../../../shared/services/pricing.service';
import { apiResultFormat } from '../../../shared/services/model/model';
import { GlobalService } from '../../../shared/services/global.service';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { AuthService } from '../../../shared/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InformationModalComponent } from '../../../shared/components/comman/modal/information-modal/information-modal.component';
import { ToastService } from '../../../shared/services/toast.service';
import { PackageCardComponent } from './package-card/package-card.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    CommonModule,
    PackageCardComponent
  ],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {
  @Input() from: string;
  @Output() onHandleSubmit = new EventEmitter<any>();

  pricingList: any = [];
  obj: any = [];
  activeTab: any = null;
  packageList: any = [];
  filteredPackageList: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pricingS: PricingService,
    public gs: GlobalService,
    private auth: AuthService,
    private modalService: NgbModal,
    private toast: ToastService,
  ) {
    this.getMasterPackageType();
  }

  getMasterPackageType() {
    let body = {
      "code": null,
    }
    this.gs.isSpinnerShow = true;
    this.pricingS.getMasterPackageType(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.length) {
        this.packageList = response;
        if (this.auth.isLoggedIn) {
          this.filteredPackageList = this.packageList.filter((i: any) => i.Name == this.gs.loggedInUserInfo.userRoleName);
        } else {
          this.filteredPackageList = this.packageList;
        }
        this.activeTab = this.filteredPackageList[0].Code;
        this.getPricing(this.filteredPackageList[0].Name);
      } else {
        this.toast.errorToastr("Something went wrong");
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
  }

  getPricing(userRoleName: any) {
    let body = {
      "roleName": userRoleName || null,
    }

    this.gs.isSpinnerShow = true;
    this.pricingS.getPackageDetails(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("response >>>>>", response);
      if (response && response.length) {
        // response[0].packages[0].purchased = true;
        if (this.from === 'subscription') {
          this.pricingList = response[0].packages.filter((item: any) => !item.purchased);
        } else {
          this.pricingList = response[0].packages;
        }
        console.log("this.pricingList >>>>>", this.pricingList);

      } else {
        this.toast.errorToastr("Something went wrong");
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
  }

  // getCurrentPackageDetails() {
  //   let body = {
  //     "packageId": this.params.packageId || null,
  //     "packageCode": null,
  //     "userId": this.gs.loggedInUserInfo.userId || null,
  //   }
  //   this.gs.isSpinnerShow = true;
  //   this.pricingS.getCurrentPackageDetails(body).subscribe((response: any) => {
  //     this.gs.isSpinnerShow = false;
  //     console.log("getCurrentPackageDetails >>>>>", response);
  //     if (response && response.package) {
  //       this.currentPlan = response;
  //     }
  //   }, err => {
  //     this.gs.isSpinnerShow = false;
  //   })
  // }

  changeType(item: any) {
    this.activeTab = item.Code;
    this.getPricing(item.Name);
  }

  subscribe(item: any) {
    console.log("item >>>>>>", item);

    if (!this.auth.isLoggedIn) {
      const modalRef = this.modalService.open(InformationModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = "Please login to book";
      modalRef.result.then((res: any) => {
        if (res.confirmed) {
          this.router.navigateByUrl('/auth/log-in');
        }
      });
      return;
    }
    if (this.from !== 'subscription') {
      this.router.navigate(['/user/master-configuration'], {
        // relativeTo: this.route,
        queryParams: { packageId: item.packageId },
        queryParamsHandling: "merge"
      });
      // this.router.navigate(['/user/master-configuration', item.packageCode, item.packageId]);
    } else {
      this.onHandleSubmit.emit({
        packageCode: item.packageCode,
        packageId: item.packageId
      })
    }
  }

}
