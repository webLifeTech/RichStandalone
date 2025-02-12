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

@Component({
  selector: 'app-user-master-configuration',
  standalone: true,
  imports: [
    DynamicFormComponent,
    DynamicGridComponent,
    DriverDetailsFormComponent,
    PaymentOptionListComponent,
    BranchbranchListComponent,

    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    NgbModule,
    TranslateModule,
    RouterOutlet
  ],
  templateUrl: './user-master-configuration.component.html',
  styleUrl: './user-master-configuration.component.scss'
})
export class UserMasterConfigurationComponent {

  kycForm: any = {
    state: 42,
    menuId: 29
  }
  activeKycTab: any = "";
  sidebarTabs: any = []; // All Main Side bar Tabs
  singleDetailInfo: any = {};
  selectedTabObj: any = {};
  isFormEdit: boolean = false;
  isVehicleInfoEdit: boolean = false;

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

  constructor(
    private route: ActivatedRoute,
    private toast: ToastService,
    public gs: GlobalService,
    private profileService: ProfileService,

  ) {
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
    setTimeout(() => {
      this.selectedTabObj = this.sidebarTabs[0]; // need to do 0
      this.activeKycTab = this.sidebarTabs[0].formId; // need to do 0
      for (let i in this.sidebarTabs) {
        this.sidebarTabs[i].isHidden = false;
      }
    }, 200);
    return;
  }

  changeKycTab(tab: any) {
    this.selectedTabObj = JSON.parse(JSON.stringify(tab));
    this.activeKycTab = tab.formId;
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  onEditInfo() {
    this.isFormEdit = true;
    this.gs.isModificationOn = true;
  }

  handleSubmit() {
    // this.getDriverDetails();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  handleCancel() {
    this.isFormEdit = false;
    this.gs.isModificationOn = false;
    this.isVehicleInfoEdit = false;
    // this.getDriverDetails();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  handleAction(event: any, type: any) {
    const singleDetail = event.singleDetail;
    if (type === 'my_vehicle') {
      const body = {
        userId: this.gs.loggedInUserInfo.userId,
        vehicleId: singleDetail.vehicleId
      }

      this.profileService.getVehicleDetails(body).subscribe(async (response: any) => {
        if (response && response.driveInCity) {
          this.isFormEdit = true;
          this.isVehicleInfoEdit = true;
          this.singleDetailInfo = response;
          this.selectedTabObj.formName = "VEHICLE DETAILS";
        }
      })
    }
  }

}
