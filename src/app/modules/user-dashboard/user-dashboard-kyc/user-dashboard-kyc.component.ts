import { Component, Input } from '@angular/core';
import { dashboardDetails } from '../../../shared/interface/pages';
import { GlobalService } from '../../../shared/services/global.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { ToastService } from '../../../shared/services/toast.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

import { FleetOwnerDetailsComponent } from '../widgets/fleet-owner-details/fleet-owner-details.component';
import { DriverInfoDetailsComponent } from '../widgets/driver-info-details/driver-info-details.component';
import { DriverDetailsFormComponent } from '../comman/driver-details-form/driver-details-form.component';
import { PaymentOptionListComponent } from '../comman/account-info/payment-option-list/payment-option-list.component';
import { BranchbranchListComponent } from '../comman/branch-info/branch-list/branch-list.component';
import { DeleteModalComponent } from '../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../../shared/services/profile.service';
import { DynamicFormComponent } from '../comman/dynamic-form/dynamic-form.component';
import { DynamicGridComponent } from '../comman/dynamic-grid/dynamic-grid.component';
import { NftsInfoComponent } from '../comman/nfts-info/nfts-info.component';
import { ConfirmationModalComponent } from '../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-user-dashboard-kyc',
  standalone: true,
  imports: [
    DriverInfoDetailsComponent,
    FleetOwnerDetailsComponent,
    NftsInfoComponent,

    // Common
    DriverDetailsFormComponent,
    PaymentOptionListComponent,
    BranchbranchListComponent,
    DynamicFormComponent,
    DynamicGridComponent,

    // Module
    CommonModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    MatMenuModule,
    MatExpansionModule,
    MatButtonModule
  ],
  // providers: [GlobalService],
  templateUrl: './user-dashboard-kyc.component.html',
  styleUrl: './user-dashboard-kyc.component.scss'
})
export class UserDashboardKycComponent {

  kycForm: any = {
    i_am: 1, // 1 need to do
    looking_for: "",
    state: null,   // New York City need to do null
  }

  isFormEdit: boolean = false;
  isEditCarOwnerInfo: boolean = false;
  driverInfoData: any = [];
  fleetOwnerInfoData: any = {};

  singleDetailInfo: any = {};

  isStartGetKyc: boolean = false;
  isVehicleInfoEdit: boolean = false;
  activeKycTab: any = "";
  selectedTabObj: any = {};
  profileUrl: any = "";
  vin_document_upload: any = "";
  vehicleUploadType: any = null;

  usaStatesArray: any = [];
  sidebarTabs: any = []; // All Main Side bar Tabs
  allPendingKycVehicleList: any = [];
  allComplateKycVehicleList: any = [];

  // Driver List Columns and Data
  driverColumns = [
    { header: 'Last name', fieldObject: null, field: 'lastName' },
    { header: 'License Number', fieldObject: null, field: 'driverLicenseNumber' },
    { header: 'License effective date', fieldObject: null, field: 'driverLicenseEffectiveDate' },
    { header: 'License expiration date', fieldObject: null, field: 'driverLicenseExpirationDate' },
  ];

  fleetOwnerColumns = [
    { header: 'Last name', fieldObject: null, field: 'lastName' },
    { header: 'License Number', fieldObject: null, field: 'driverLicNum' },
    { header: 'License effective date', fieldObject: null, field: 'driverLicenceEffDate' },
    { header: 'License expiration date', fieldObject: null, field: 'driverLicenceExpDate' },
  ];

  // Vehicle List Columns and Data
  myVehicleColumns = [
    { header: 'VIN Number', fieldObject: null, field: 'vinNumber' },
    { header: 'Fuel Type', fieldObject: null, field: 'fuelType' },
    { header: 'Territory Code', fieldObject: null, field: 'territoryCode' },
  ];

  // Actions grids
  driverActions = ['View', 'Edit'];
  myVehicleActions = ['View'];

  iAmArray: any = [
    {
      id: 1,
      name: "Driver",
      value: "Driver",
      roleName: "53D8CF61-E99B-43A9-AA8F-4CE5B0E12872",
    },
    {
      id: 2,
      name: "Fleet owner",
      value: "Fleet owner",
      roleName: "B5107AB1-19BF-430B-9553-76F39DB1CDCD",
    },
    {
      id: 3,
      name: "Individual car owner",
      value: "Individual car owner",
      roleName: "E56F8C18-B4F6-4EE4-976D-A693AA6F98FF",
    },
    {
      id: 4,
      name: "Driver with owned car",
      value: "Driver with owned car",
      roleName: "416D4E0F-32BB-4218-B2EA-499764D5F62E",
    }
  ];

  allVehicleList: any = [
    {
      "id": 1,
      "vin_number": "1HGCM82633A004352",
      "plate_number": "TLC1234",
      "car_category": "Luxury",
      "fuel_type": "Fully Electric",
      "transmission": "Automatic",
      "status": "Pending",
      "kyc": false
    },
    {
      "id": 2,
      "vin_number": "2T1BU4EE9DC123456",
      "plate_number": "TLC5678",
      "car_category": "SUV",
      "fuel_type": "Hybrid",
      "transmission": "Automatic",
      "status": "Pending",
      "kyc": false
    },
    {
      "id": 3,
      "vin_number": "3FAHP0HA4CR123456",
      "plate_number": "TLC9101",
      "car_category": "Medium",
      "fuel_type": "Fully Electric",
      "transmission": "Gas",
      "status": "Pending",
      "kyc": false
    },
    {
      "id": 4,
      "vin_number": "1FTFW1EF1EFC12345",
      "plate_number": "TLC1122",
      "car_category": "Standrad",
      "fuel_type": "Hybrid",
      "transmission": "Automatic",
      "status": "Pending",
      "kyc": false
    },
    {
      "id": 5,
      "vin_number": "JH4KA8270MC012345",
      "plate_number": "TLC3344",
      "car_category": "Luxury",
      "fuel_type": "Hybrid",
      "transmission": "Automatic",
      "status": "Pending",
      "kyc": false
    }
  ];

  constructor(
    public gs: GlobalService,
    private fb: FormBuilder,
    private alert: AlertService,
    private toast: ToastService,
    private modalService: NgbModal,
    private profileService: ProfileService,
  ) {
    this.gs.isModificationOn = false;
    this.allPendingKycVehicleList = this.allVehicleList;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    for (let i in this.iAmArray) {
      if (this.gs.loggedInUserInfo.roleName === this.iAmArray[i].roleName) {
        this.kycForm.i_am = this.iAmArray[i].id;
      }
    }

    this.gs.usStates().subscribe(response => {
      this.usaStatesArray = response;
    })
    this.onChangeIam();
  }

  canDeactivate(): boolean {
    if (!this.gs.isLicenseVerified || this.isFormEdit) {
      return confirm('Are you sure you want to leave this page? You will lose any unsaved data.');
    }
    return true;
  }

  changeKycTab(tab: any) {
    console.log("this.isFormEdit >>>>>", this.isFormEdit);

    const confirm = () => {
      this.selectedTabObj = tab;
      this.activeKycTab = tab.formId;
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }

    if (this.gs.isModificationOn) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = 'Are you sure you want to leave this page? You will lose any unsaved data.';
      modalRef.componentInstance.confirmButton = "Yes";
      modalRef.result.then((res: any) => {
        if (res.confirmed) {
          this.isFormEdit = false;
          this.gs.isModificationOn = false;
          confirm();
        }
      }, () => { });
    } else {
      confirm();
    }

  }

  onChangeIam() {
    if (!this.isFormEdit) {
      this.kycForm.state = null;
    }
    this.sidebarTabs = [];
    // this.filter(); // need to do uncomment

    console.log("this.kycForm.i_am >>>", this.kycForm.i_am);


    this.kycForm.state = 42; // need to do for direct
    this.onSelectState() // // need to do for direct
    if (this.kycForm.i_am != 2) {
      this.getDriverDetails(); // Driver, Individual car owner, Driver with owned car
    }
    if (this.kycForm.i_am == 2) {
      this.getCompanyKyc(); // Fleet owner
    }
  }

  onSelectState() {
    this.getConfigUIForms();
  }

  getDriverDetails() {
    this.gs.isLicenseVerified = false;
    this.profileService.getAllDrivers({
      "userId": this.gs.loggedInUserInfo.userId,
    }).subscribe((response: any) => {
      if (response && response.length) {
        this.driverInfoData = response;
        this.gs.isLicenseVerified = true;
        this.kycForm.state = 42;
        this.onSelectState();
      }
      console.log("getAllDrivers >>>>>", response);
    })
  }

  getCompanyKyc() {
    this.gs.isLicenseVerified = false;
    this.profileService.getCompanyKyc({
      "userId": this.gs.loggedInUserInfo.userId, // "Narendra"
    }).subscribe((response: any) => {
      if (response && response.userId) {
        this.driverInfoData = [{
          driverLicenceEffDate: response.fleetOwnerDetails.driverLicenceEffDate,
          driverLicenceExpDate: response.fleetOwnerDetails.driverLicenceExpDate,
          driverLicNum: response.fleetOwnerDetails.driverLicNum,
          lastName: response.fleetOwnerDetails.contactInfo.lastName,
        }];
        console.log(" >>>>>", this.driverInfoData);

        this.gs.isLicenseVerified = true;
        this.kycForm.state = 42;
        this.onSelectState();
      }
      console.log("getAllDrivers >>>>>", response);
    })
  }


  getConfigUIForms() {
    const findRoleObj = this.iAmArray.find((item: any) => item.id == this.kycForm.i_am) || {};

    let body = {
      "stateCode": this.kycForm.state || "42",
      "languageId": 1,
      "roleName": findRoleObj.roleName || null,
      "countryId": 230,
      "transactionId": 1,
      "menuId": 27
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

  reset() {
    this.kycForm.i_am = 1;
    this.kycForm.state = null;
    this.activeKycTab = "";
    this.onChangeIam();
  }

  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profileUrl = reader.result;
    };
  }

  onEditInfo() {
    this.isFormEdit = true;
    this.gs.isModificationOn = true;
    this.onChangeIam();
    this.onSelectState();
  }

  handleSubmit() {
    this.getDriverDetails();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  handleFleetSubmit() {
    this.getCompanyKyc();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  onVehicleUploadSubmit() {
    this.gs.isModificationOn = false;
    let setMyVehicle = this.sidebarTabs.find((sItem: any) => sItem.formId == 8) || {};
    console.log("setMyVehicle >>>>", setMyVehicle);
    this.changeKycTab(setMyVehicle);
    // { // need to do
    //   "menuId": 0,
    //   "roleName": "E56F8C18-B4F6-4EE4-976D-A693AA6F98FF",
    //   "transactionId": 1,
    //   "languageId": "1",
    //   "formId": 8,
    //   "formName": "MY VEHICLE",
    //   "description": "My Vehicle",
    //   "formClass": null,
    //   "formIcon": "fa fa-car",
    //   "formAction": null,
    //   "isVisible": true,
    //   "isActive": false,
    //   "priority": 4,
    //   "isHidden": false
    // }
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
  // Confirm
  onDivInfoSubmit() {
    let mergedForm = {};
    localStorage.setItem('driverInfoData', JSON.stringify(mergedForm));
    this.gs.licenseVerified();
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.driverInfoData = this.gs.getDriverInfo();

    this.activeKycTab = "Driver info";
    if (this.isFormEdit) {
      this.toast.successToastr("Updated Successfully");
    } else {
      this.toast.successToastr("KYC Completed Successfully");
    }
    this.isFormEdit = false;
  }

  uploadFile(event: any) {
    const file = event.target.files[0];

    let dataParams = {
      "UserId": this.gs.loggedInUserInfo.userId,
      "DocumentType": "VIN_DOC",
    }
    let fileFormData: any = new FormData();
    fileFormData.append('Doc', file, file.name);
    this.profileService.uploadedDocument(fileFormData, dataParams).subscribe((res: any) => {
      console.log("VIN_DOC >>>>>", res);
    })
  }

  handleCancel() {
    this.isFormEdit = false;
    this.getDriverDetails();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  cancelFleet() {
    this.isFormEdit = false;
    this.getCompanyKyc();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }


  getKyc(item: any) {
    this.isStartGetKyc = true;
  }

  backMyVehicle() {
  }

  onChangeUpload() {
    this.isStartGetKyc = false;
    this.isFormEdit = false;

    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  async deleteFormBulk(array: any, index: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        array.splice(index, 1);
        this.toast.successToastr("Deleted successfully");
      }
    }, () => { });
  }

  handleAction(event: any, type: any) {
    const singleDetail = event.singleDetail;
    if (type === 'driver') {
      const body = {
        userId: this.gs.loggedInUserInfo.userId,
        driverId: singleDetail.driverId,
      }
      this.profileService.getDriverDetails(body).subscribe(async (response: any) => {
        if (response && response.driveInCity) {
          this.isFormEdit = true;
          this.singleDetailInfo = response;
          console.log("getDriverDetails -------->>>>>>>>", this.singleDetailInfo);

          this.kycForm.state = this.singleDetailInfo.driveInCity
        }
      })
    }

    if (type === 'fleetOwner') {
      const body = {
        userId: this.gs.loggedInUserInfo.userId,
      }

      this.profileService.getCompanyKyc(body).subscribe(async (response: any) => {
        console.log("getCompanyKyc -------->>>>>>>>", response);
        if (response && response.userId) {
          this.isFormEdit = true;
          this.singleDetailInfo = response;

          this.kycForm.state = this.singleDetailInfo.driveInCity || 42
        }
      })
    }
  }
}
