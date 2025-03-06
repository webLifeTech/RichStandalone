import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalService } from '../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../../shared/services/profile.service';
import { DynamicFormComponent } from '../comman/dynamic-form/dynamic-form.component';
import { DynamicGridComponent } from '../comman/dynamic-grid/dynamic-grid.component';
import { DriverDetailsFormComponent } from '../comman/driver-details-form/driver-details-form.component';
import { PaymentOptionListComponent } from '../comman/account-info/payment-option-list/payment-option-list.component';
import { BranchbranchListComponent } from '../comman/branch-info/branch-list/branch-list.component';
import { PricingComponent } from '../../other/pricing/pricing.component';
import { PlanSubscribeComponent } from '../../other/pricing/plan-subscribe/plan-subscribe.component';
import { PackageCardComponent } from '../../other/pricing/package-card/package-card.component';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { PaymentSuccessComponent } from '../../../shared/components/comman/payment-success/payment-success.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PackageSubscriptionComponent } from '../comman/package-subscription/package-subscription.component';
import { BranchService } from '../../../shared/services/branch.service';

@Component({
  selector: 'app-user-master-configuration',
  standalone: true,
  imports: [
    DynamicFormComponent,
    DynamicGridComponent,
    DriverDetailsFormComponent,
    PaymentOptionListComponent,
    BranchbranchListComponent,
    PlanSubscribeComponent,
    PackageCardComponent,
    PaymentSuccessComponent,
    PackageSubscriptionComponent,

    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    CurrencySymbolPipe,
    NgxPaginationModule,
  ],
  templateUrl: './user-master-configuration.component.html',
  styleUrl: './user-master-configuration.component.scss'
})
export class UserMasterConfigurationComponent {

  kycForm: any = {
    state: 42,
    menuId: 29
  }
  selectedPackage: any = "";
  activeKycTab: any = "";
  sidebarTabs: any = []; // All Main Side bar Tabs
  gridInfoData: any = [];
  singleDetailInfo: any = {};
  selectedTabObj: any = {};
  isFormEdit: boolean = false;
  isVehicleInfoEdit: boolean = false;
  isUpgradePlan: boolean = false;
  subscriptionStep: any = 1;
  isAddEditBranch: boolean = false;
  isLoadBranch: boolean = false;

  // Vehicle List Columns and Data
  myVehicleColumns = [
    { header: 'VIN Number', fieldObject: null, field: 'vinNumber' },
    { header: 'PLATE NUMBER', fieldObject: null, field: 'plateNumber' },
    { header: 'PRICE PER DAY', fieldObject: null, field: 'pricePerDay' },
    { header: 'VEHICLE STATUS', fieldObject: null, field: 'vehicleStatus' },
  ];

  // Actions grids
  driverActions = ['View', 'Edit'];
  myVehicleActions = ['View', 'Edit'];

  // Vehicle List Columns and Data
  branchInfoColumns = [
    { header: 'DBA Name', fieldObject: null, field: 'dbaName' },
    { header: 'Contact Number', fieldObject: null, field: 'phoneNumber' },
    { header: 'Email ID', fieldObject: null, field: 'emailId' },
    { header: 'City', fieldObject: null, field: 'city' },
  ];

  // Actions grids
  branchInfoActions = ['View', 'Edit'];



  constructor(
    private route: ActivatedRoute,
    private toast: ToastService,
    public gs: GlobalService,
    private profileService: ProfileService,
    private branchService: BranchService,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.selectedPackage = params.packageId;
    })

    this.getConfigUIForms();
  }

  getConfigUIForms() {

    let body = {
      "stateCode": "42",
      "languageId": 1,
      "roleName": this.gs.loggedInUserInfo.roleName || null,
      "countryId": 230,
      "transactionId": 1,
      "menuId": 29
    }
    this.profileService.getConfigUIForms(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("response >>>>>", response);
      if (response && response.length) {
        this.sidebarTabs = response;
        this.filter();
      } else {
        this.toast.errorToastr("Something went wrong");
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
  }

  filter() {
    this.activeKycTab = "";
    let activeInx = 0;
    setTimeout(() => {

      if (this.selectedPackage) {
        activeInx = this.sidebarTabs.findIndex((i: any) => i.formId == 18);
      }

      const sidebarTab = this.sidebarTabs[activeInx];
      this.selectedTabObj = sidebarTab; // need to do 0
      this.activeKycTab = sidebarTab.formId; // need to do 0
      for (let i in this.sidebarTabs) {
        this.sidebarTabs[i].isHidden = false;
      }

      if (sidebarTab.formId == 6) {
        this.getAllCompanies();
      }
    }, 200);
    return;
  }

  getAllCompanies() {
    this.gs.isLicenseVerified = false;
    this.profileService.getAllCompanies({
      "userId": this.gs.loggedInUserInfo.userId,
    }).subscribe((response: any) => {
      if (response && response.length) {
        console.log("response[0] >>>>>>>", response[0]);
        this.kycForm.contactId = response[0].contactId;
        this.gs.isLicenseVerified = true;
        this.kycForm.isAddSearchSection = true;
        this.getCompanyBranches();
      }
      console.log("getAllDrivers >>>>>", response);
    })
  }

  getCompanyBranches() {
    this.gs.isLicenseVerified = false;
    this.isLoadBranch = false;
    this.gridInfoData = [];
    this.branchService.GetAllCompanyBranches({
      "userId": this.gs.loggedInUserInfo.userId,
    }).subscribe((response: any) => {
      console.log("getAllDrivers >>>>>", response);
      if (response && response.length) {
        this.gridInfoData = response;
      }
      this.isLoadBranch = true;
    })
  }

  changeKycTab(tab: any) {
    this.kycForm.isAddSearchSection = false;
    this.selectedTabObj = JSON.parse(JSON.stringify(tab));
    this.activeKycTab = tab.formId;
    if (this.selectedTabObj.formId == 6) {
      this.getAllCompanies();
    }
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  onEditInfo() {
    this.isFormEdit = true;
    this.gs.isModificationOn = true;
  }

  handleSubmit() {
    // this.getDriverDetails();
    this.isAddEditBranch = false;
    if (this.selectedTabObj.formId == 6) {
      this.getCompanyBranches();
    }
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  handleCancel() {
    this.isFormEdit = false;
    this.isAddEditBranch = false;
    this.gs.isModificationOn = false;
    this.isVehicleInfoEdit = false;
    if (this.selectedTabObj.formId == 6) {
      this.getCompanyBranches();
    }
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  handleAction(event: any, type: any) {
    console.log("event >>>>>>", event);

    if (event.add) {
      this.isAddEditBranch = true;
      return;
    }
    const singleDetail = event.singleDetail;
    if (type === 'my_vehicle') {
      const body = {
        userId: this.gs.loggedInUserInfo.userId,
        vehicleId: singleDetail.vehicleId
      }

      this.profileService.getVehicleDetails(body).subscribe(async (response: any) => {
        if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
          this.isFormEdit = true;
          this.isVehicleInfoEdit = true;
          this.singleDetailInfo = response;
          this.selectedTabObj.formName = "VEHICLE DETAILS";
        }
      })
    }

    if (type === 'branch') {
      const body = {
        branchContactId: singleDetail.contactId
      }

      this.branchService.GetCompanyBranchByBrnachId(body).subscribe(async (response: any) => {
        if (response && response.contactId) {
          this.isFormEdit = true;
          this.isAddEditBranch = true;
          this.singleDetailInfo = { 'branch': response };
        }
      })
    }
  }

  handleSubscribed() {
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.subscriptionStep = 2;
  }
  handleConfirm() {
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.subscriptionStep = 3;
  }
  handleBack(step: any) {
    console.log("step >>>>>", step);
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.subscriptionStep = step;
  }

  onUpgradePlan() {
    this.isUpgradePlan = true;
    window.scrollTo({ top: 800, behavior: 'smooth' });
  }



}
