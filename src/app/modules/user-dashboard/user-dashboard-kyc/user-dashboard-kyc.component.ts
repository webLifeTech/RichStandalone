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

import { MyVehiclesComponent } from '../comman/my-vehicles/my-vehicles.component';
import { CompanyInfoFormComponent } from '../comman/company-info-form/company-info-form.component';
import { CarOwnerInfoFormComponent } from '../comman/car-owner-info-form/car-owner-info-form.component';
import { VehicleInfoFormComponent } from '../comman/vehicle-info-form/vehicle-info-form.component';
import { TlcLicenseInfoFormComponent } from '../comman/tlc-license-info-form/tlc-license-info-form.component';
import { DriverInfoFormComponent } from '../comman/driver-info-form/driver-info-form.component';
import { IndvlCarCwnerDetailsComponent } from '../widgets/indvl-car-owner-info-details/indvl-car-owner-details.component';
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

@Component({
  selector: 'app-user-dashboard-kyc',
  standalone: true,
  imports: [
    DriverInfoDetailsComponent,
    FleetOwnerDetailsComponent,
    IndvlCarCwnerDetailsComponent,

    // Common
    DriverInfoFormComponent,
    TlcLicenseInfoFormComponent,
    VehicleInfoFormComponent,
    CarOwnerInfoFormComponent,
    CompanyInfoFormComponent,
    MyVehiclesComponent,
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
  templateUrl: './user-dashboard-kyc.component.html',
  styleUrl: './user-dashboard-kyc.component.scss'
})
export class UserDashboardKycComponent {

  @Input() dashboardDetails: dashboardDetails;
  @Input() activeTab: any;

  isEditDriverInfo: boolean = false;
  isEditCompanyInfo: boolean = false;
  isEditCarOwnerInfo: boolean = false;
  isEditVehicleInfo: boolean = false;
  driverInfoData: any = {};
  fleetOwnerInfoData: any = {};
  indCarOwnerInfoData: any = {};

  isStartGetKyc: boolean = false;
  isVehicleInfoView: boolean = false;
  isVehicleInfoEdit: boolean = false;
  vehicleInfoObj: any = {};
  vehicleEditIndex: any = 0;

  activeKycTab: any = "";
  selectedTabObj: any = {};
  profileUrl: any = "";
  kycForm: any = {
    i_am: 1, // 1 need to do
    looking_for: "",
    state: null,   // New York City need to do null
  }

  // Product List Columns and Data
  productColumns = [
    { header: 'VIN Number', fieldObject: 'vehicleInfo', field: 'vinNumber' },
    { header: 'Plate Number', fieldObject: 'vehicleInfo', field: 'plateNumber' },
    { header: 'Car Category', fieldObject: 'vehicleInfo', field: 'carCategory' },
    { header: 'Fuel Type', fieldObject: 'vehicleInfo', field: 'fuelType' },
    { header: 'Transmission', fieldObject: 'vehicleInfo', field: 'transmission' }
  ];

  // Actions for both grids
  actions = ['View'];




  // driverInfo Form
  driverInfoForm: any = {
    sr_i_am: '',
    sr_looking_for: '',
    sr_state: '',

    driver_license_number: '',
    license_document_upload: '',
    firstName: '',
    middleName: '',
    lastName: '',
    date_of_birth: '',
    dl_state: '',
    dl_effective_date: '',
    dl_expiration_date: '',

    isHaveForeignLicense: "No",
    forn_licn_country: null,
    forn_licn_state: null,
    forn_licn_city: null,
    forn_licn_postal_code: '',
    forn_licn_issue_date: '',
    forn_licn_expire_date: '',
    foreign_driver_license_number: '',
    forn_licn_document_upload: '',

    gender: null,
    year_of_experience: '',
    marital_status: null,
    number_of_children: '',
    contact: '',
    email_id: '',
    emergency_contact_number: '',
    emergency_contact_person_name: '',
    relation_type: null,
    credit_score: null,

    country: 'USA',
    state: null,
    city: null,
    zip_code: '',
    address_1: '',
    address_2: '',

    perm_add_country: null,
    perm_add_state: null,
    perm_add_city: null,
    perm_add_zip_code: '',
    perm_add_address_1: '',
    perm_add_address_2: '',

    bill_add_country: null,
    bill_add_state: null,
    bill_add_city: null,
    bill_add_zip_code: '',
    bill_add_address_1: '',
    bill_add_address_2: '',

    taxid: '',
    ssn: '',
    price_per_day: '',
    price_per_week: '',
    price_per_month: '',
    location: '',
    pickup_location: '',
    drop_location: '',
    have_medical_insurance: null,
    insurance_company_name: null,
    policy_number: "",
    policy_issue_date: "",
    policy_expiry_date: "",
    get_quotes_from_tlh: false,
    is_available_for_private_booking: null,
    is_active_inactive: null,
    from: '',
    to: '',

    workingHours: [
      { no: 1, name: 'Monday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 2, name: 'Tuesday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 3, name: 'Wednesday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 4, name: 'Thursday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 5, name: 'Friday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 6, name: 'Saturday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 7, name: 'Sunday', from_time: "10:00", to_time: "10:00", status: 'OFF' },
    ]
  };

  // TLC driver license Form
  tlcDriverLicenseForm: any = {
    tlc_driver_license_number: '',
    tlc_license_document_upload: '',
    tlc_firstName: '',
    tlc_lastName: '',
    tlc_dl_state: '',
    tlc_dl_effective_date: '',
    tlc_dl_expiration_date: '',
  };

  // fleetOwner Form
  fleetOwnerForm: any = {

    sr_i_am: "",
    sr_looking_for: "",
    sr_state: "",

    comp_info_taxid: "",
    comp_info_registration_document: "",
    comp_info_company_name: "",
    comp_info_date_of_registration: "",
    comp_info_city: "",
    comp_info_postal_code: "",
    comp_info_registration_address: "",

    fleet_owr_first_name: "",
    fleet_owr_last_name: "",
    fleet_owr_contact_number: "",
    fleet_owr_email_id: "",
    fleet_owr_ssn: "",
    fleet_owr_driver_license_number: "",
    fleet_owr_dl_state: "",
    fleet_owr_dl_effective_date: "",
    fleet_owr_dl_expiration_date: "",
    fleet_owr_driver_license_document: "",

    office_dtl_first_name: "",
    office_dtl_last_name: "",
    office_dtl_contact_number: "",
    office_dtl_email_id: "",
    office_dtl_city: "",
    office_dtl_postal_code: "",
    office_dtl_company_address: "",
    office_dtl_map_location: "",

    isMultipleLoctn: "No",
    branchInfo: [
      {
        branch_dba_name: [''],
        branch_first_name: [''],
        branch_last_name: [''],
        branch_contact_number: [''],
        branch_email_id: [''],
        branch_city: [''],
        branch_postal_code: [''],
        branch_address: [''],
        branch_map_location: [''],
      }
    ],

  };

  vehicleUploadType: any = null;
  vehicleInfoForm: any = {

    vin_number: "",
    vin_document_upload: "",
    plate_number: "",
    model_year: "",
    vehicle_age: "",
    make: null,
    model: null,
    gross_vehicle_weight: null,
    seating_capacity: "",
    registration_state: null,
    territory_code: null,
    garage_zip_code: "",
    fuel_type: null,
    dashboard_camera: null,
    collision_avoidance: null,
    transmission: null,
    car_category: null,

    is_inspection_report: "",
    valid_date: "",
    upload_inspection_report: "",


    is_insurance_covered: "",
    carriers_name: null,
    policy_number: "",
    limits_coverage: "",
    coverage_expire_date: "",
    coverage_effective_date: "",

    branch: null,
    price_per_day: "",
    price_per_week: "",
    price_per_month: "",
    car_image_upload: "",
  }

  // individualCarOwner Form
  individualCarOwnerForm: any = {

    sr_i_am: "",
    sr_looking_for: "",
    sr_state: "",

    car_owr_first_name: "",
    car_owr_last_name: "",
    car_owr_contact_number: "",
    car_owr_email_id: "",
    car_owr_ssn: "",
    car_owr_driver_license_number: "",
    car_owr_dl_state: "",
    car_owr_dl_effective_date: "",
    car_owr_dl_expiration_date: "",
    car_owr_driver_license_document: "",

    vin_number: "",
    vin_document_upload: "",
    plate_number: "",
    model_year: "",
    vehicle_age: "",
    make: null,
    model: null,
    gross_vehicle_weight: null,
    seating_capacity: "",
    registration_state: null,
    territory_code: null,
    garage_zip_code: "",
    fuel_type: null,
    dashboard_camera: null,
    collision_avoidance: null,
    transmission: null,
    car_category: null,

    is_inspection_report: "",
    valid_date: "",
    upload_inspection_report: "",

    is_insurance_covered: "",
    carriers_name: null,
    policy_number: "",
    limits_coverage: "",
    coverage_expire_date: "",
    coverage_effective_date: "",

    price_per_day: "",
    car_image_upload: "",
  };


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



  lookingForArray: any = [
    { id: 11, parent: 1, name: "Looking for car", value: "Looking for car" },
    { id: 12, parent: 2, name: "Looking for Driver", value: "Looking for Driver" },
    { id: 13, parent: 3, name: "Looking for Driver", value: "Looking for Driver" },
    { id: 14, parent: 4, name: "Looking for car and driver", value: "Looking for car and driver" }
  ];
  usaStatesArray: any = [];

  // All Main Side bar Tabs
  sidebarTabs: any = [];
  sideTabs: any = [
    {
      id: 1,
      name: "Driver info",
      value: "Driver info",
      alias: "driver_info",
      isHidden: true,
      icon: "feather icon-user"
    },
    {
      id: 2,
      name: "TLC license info",
      value: "TLC license info",
      alias: "tlc_license_info",
      isHidden: true,
      icon: "feather icon-file-text"
    },
    {
      id: 8,
      name: "Driver details",
      value: "Driver details",
      alias: "driver_details",
      isHidden: true,
      icon: "feather icon-user"
    },
    {
      id: 9,
      name: "My Account",
      value: "My Account",
      alias: "my_account",
      isHidden: true,
      icon: "feather icon-user"
    },
    {
      id: 3,
      name: "Company Info",
      value: "Company Info",
      alias: "company_info",
      isHidden: true,
      icon: "feather icon-file-text"
    },
    {
      id: 11,
      name: "Branch Info",
      value: "Branch Info",
      alias: "office_details",
      isHidden: true,
      icon: "feather icon-map-pin"
    },
    {
      id: 6,
      name: "Car owner info",
      value: "Car owner info",
      alias: "car_owner_info",
      isHidden: true,
      icon: "feather icon-user"
    },
    {
      id: 10,
      name: "Account info",
      value: "Account info",
      alias: "account_info",
      isHidden: true,
      icon: "feather icon-user"
    },
    {
      id: 5,
      name: "Vehicle Upload",
      value: "Vehicle Upload",
      alias: "vehicle_upload",
      isHidden: true,
      icon: "feather icon-upload-cloud"
    },
    {
      id: 7,
      name: "My Vehicle",
      value: "My Vehicle",
      alias: "my_vehicle",
      isHidden: true,
      icon: "fa fa-car"
    },
    {
      id: 4,
      name: "Vehicles info",
      value: "Vehicles info",
      alias: "vehicles_info",
      isHidden: true,
      icon: "fa fa-car"
    },

  ];

  bulkVehicleUploadTabs: any = [
    {
      title: "userDashboard.kyc.upload_bulk_vehicle.title",
      tab: "upload_bulk_vehicle",
      isOpen: true,
    }
  ]

  allPendingKycVehicleList: any = [];
  allComplateKycVehicleList: any = [];

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

    this.allPendingKycVehicleList = this.allVehicleList;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // this.driverInfoData = this.gs.getDriverInfo();
    this.fleetOwnerInfoData = this.gs.getFleetOwnerInfo();
    this.indCarOwnerInfoData = this.gs.getIndCarOwnerInfo();

    for (let i in this.iAmArray) {
      if (this.gs.loggedInUserInfo.roleName === this.iAmArray[i].roleName) {
        this.kycForm.i_am = this.iAmArray[i].id;
      }
    }

    if (this.driverInfoData && this.driverInfoData.sr_state) {
      this.kycForm.i_am = this.driverInfoData.sr_i_am;
      this.kycForm.looking_for = this.driverInfoData.sr_looking_for;
      this.kycForm.state = this.driverInfoData.sr_state;
    }
    if (this.fleetOwnerInfoData && this.fleetOwnerInfoData.sr_state) {
      this.kycForm.i_am = this.fleetOwnerInfoData.sr_i_am;
      this.kycForm.looking_for = this.fleetOwnerInfoData.sr_looking_for;
      this.kycForm.state = this.fleetOwnerInfoData.sr_state;
    }
    if (this.indCarOwnerInfoData && this.indCarOwnerInfoData.sr_state) {
      this.kycForm.i_am = this.indCarOwnerInfoData.sr_i_am;
      this.kycForm.looking_for = this.indCarOwnerInfoData.sr_looking_for;
      this.kycForm.state = this.indCarOwnerInfoData.sr_state;
    }

    this.gs.usStates().subscribe(response => {
      this.usaStatesArray = response;
    })
    this.onChangeIam();


  }

  changeKycTab(tab: any) {
    this.selectedTabObj = tab;
    this.activeKycTab = tab.formId;
    window.scrollTo({ top: 300, behavior: 'smooth' });
    if (this.activeKycTab === 'Driver info' || this.activeKycTab === 'TLC license info' || this.activeKycTab === 'Driver details' || this.activeKycTab === 'My Account') {
      return;
    }
    if (!this.isEditDriverInfo || !this.isEditCompanyInfo || !this.isEditCarOwnerInfo) {
      this.allFormReset();
    }
  }

  onChangeIam() {
    if (!this.isEditDriverInfo) {
      this.kycForm.state = null;
    }
    this.sidebarTabs = [];
    const findObj = this.lookingForArray.find((item: any) => item.parent == this.kycForm.i_am);
    this.kycForm.looking_for = findObj.id;
    this.filter(); // need to do uncomment

    // this.kycForm.state = 42; // need to do for direct
    // this.onSelectState() // // need to do for direct
    // this.getDriverDetails(); // need to do
  }

  onSelectState() {

    if (this.kycForm.i_am == 1 || this.kycForm.i_am == 4) {
      this.driverInfoForm.sr_i_am = this.kycForm.i_am;
      this.driverInfoForm.sr_looking_for = this.kycForm.looking_for;
      this.driverInfoForm.sr_state = this.kycForm.state;
      this.driverInfoForm.state = this.kycForm.state;
    }

    if (this.kycForm.i_am == 2) {
      this.fleetOwnerForm.sr_i_am = this.kycForm.i_am;
      this.fleetOwnerForm.sr_looking_for = this.kycForm.looking_for;
      this.fleetOwnerForm.sr_state = this.kycForm.state;
    }

    if (this.kycForm.i_am == 3) {
      this.individualCarOwnerForm.sr_i_am = this.kycForm.i_am;
      this.individualCarOwnerForm.sr_looking_for = this.kycForm.looking_for;
      this.individualCarOwnerForm.sr_state = this.kycForm.state;
    }

    // this.filter();
    this.getConfigUIForms();

  }

  getDriverDetails() {
    this.profileService.getDriverDetails({
      "userId": this.gs.loggedInUserInfo.userId,
    }).subscribe((response: any) => {
      if (response.driverInfo.driverId) {
        this.gs.isLicenseVerified = true;
        this.driverInfoData = response;
      }
      console.log("getDriverDetails >>>>>", response);
      console.log("this.gs.isLicenseVerified >>>>>", this.gs.isLicenseVerified);
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
    console.log("this.kycForm >>>>", this.kycForm);

    setTimeout(() => {
      if (this.kycForm.state) {
        this.selectedTabObj = this.sidebarTabs[0]; // need to do 0
        this.activeKycTab = this.sidebarTabs[0].formId; // need to do 0
        for (let i in this.sidebarTabs) {
          this.sidebarTabs[i].isHidden = false;
        }
      }

    }, 200);
    return;
  }

  reset() {
    this.kycForm.i_am = 1;
    this.kycForm.looking_for = "";
    this.kycForm.state = null;
    this.activeKycTab = "";
    this.onChangeIam();
    this.allFormReset();
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
    this.isEditDriverInfo = true;

    // I Am Driver
    // if (this.driverInfoData.sr_i_am === 1 || this.driverInfoData.sr_i_am === 4) {
    if (this.driverInfoData && this.driverInfoData.sr_state) {
      this.kycForm.i_am = this.driverInfoData.sr_i_am;
      this.kycForm.looking_for = this.driverInfoData.sr_looking_for;
      this.kycForm.state = this.driverInfoData.sr_state;
      this.driverInfoForm = this.driverInfoData;
    }
    // }

    this.onChangeIam();
    this.onSelectState();
  }

  onEditCompanyInfo() {
    this.isEditCompanyInfo = true;
    if (this.fleetOwnerInfoData.sr_i_am === 2) {
      if (this.fleetOwnerInfoData && this.fleetOwnerInfoData.sr_state) {
        this.kycForm.i_am = this.fleetOwnerInfoData.sr_i_am;
        this.kycForm.looking_for = this.fleetOwnerInfoData.sr_looking_for;
        this.kycForm.state = this.fleetOwnerInfoData.sr_state;

        this.fleetOwnerForm = this.fleetOwnerInfoData;
      }
    }

    this.onChangeIam();
    this.onSelectState();
  }

  onEditCarOwnerInfo() {
    this.isEditCarOwnerInfo = true;

    if (this.indCarOwnerInfoData.sr_i_am === 3) {
      if (this.indCarOwnerInfoData && this.indCarOwnerInfoData.sr_state) {
        this.kycForm.i_am = this.indCarOwnerInfoData.sr_i_am;
        this.kycForm.looking_for = this.indCarOwnerInfoData.sr_looking_for;
        this.kycForm.state = this.indCarOwnerInfoData.sr_state;

        this.individualCarOwnerForm = this.indCarOwnerInfoData;
      }
    }

    this.onChangeIam();
    this.onSelectState();
  }

  onDynamicFormSubmit() {
    this.getDriverDetails();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
  onVehicleUploadSubmit() {
    this.changeKycTab({
      "menuId": 0,
      "roleName": "E56F8C18-B4F6-4EE4-976D-A693AA6F98FF",
      "transactionId": 1,
      "languageId": "1",
      "formId": 8,
      "formName": "MY VEHICLE",
      "description": "My Vehicle",
      "formClass": null,
      "formIcon": "fa fa-car",
      "formAction": null,
      "isVisible": true,
      "isActive": false,
      "priority": 4,
      "isHidden": false
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
  // Confirm
  onDivInfoSubmit() {
    let mergedForm = { ...this.driverInfoForm, ...this.tlcDriverLicenseForm };
    localStorage.setItem('driverInfoData', JSON.stringify(mergedForm));
    this.gs.licenseVerified();
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.driverInfoData = this.gs.getDriverInfo();

    // for (let i in this.sideTabs) {
    //   this.sideTabs[i].isHidden = true;
    // }
    this.activeKycTab = "Driver info";
    if (this.isEditDriverInfo) {
      this.toast.successToastr("Updated Successfully");
    } else {
      this.toast.successToastr("KYC Completed Successfully");
    }
    this.isEditDriverInfo = false;
  }

  // Confirm
  onFleetOwnerSubmit(form: any) {
    localStorage.setItem('fleetOwnerKycData', JSON.stringify(this.fleetOwnerForm));
    this.gs.fleetOwnerLicenseVerified();
    this.isEditCompanyInfo = false;
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.fleetOwnerInfoData = this.gs.getFleetOwnerInfo();
  }

  // Confirm
  onIndCarCwnerSubmit() {
    localStorage.setItem('individualCarOwnerKycData', JSON.stringify(this.individualCarOwnerForm));
    this.gs.indCarOwnerLicenseVerified();
    this.isEditCarOwnerInfo = false;
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.indCarOwnerInfoData = this.gs.getIndCarOwnerInfo();
  }

  // Confirm // I Am driver come owned car
  onDivComeInfoSubmit() {
    let mergedForm = { ...this.driverInfoForm, ...this.tlcDriverLicenseForm };
    localStorage.setItem('driverInfoData', JSON.stringify(mergedForm));
    this.gs.divComeOwnedCarLicenseVerified();
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.driverInfoData = this.gs.getDriverInfo();

    this.activeKycTab = "Driver info";
    if (this.isEditDriverInfo) {
      this.toast.successToastr("Updated Successfully");
    } else {
      this.toast.successToastr("KYC Completed Successfully");
    }
    this.isEditDriverInfo = false;
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
      // if (this.submitted) {
      //   this.findInvalidControls();
      // }
    })
  }

  cancelDriverinfo() {
    this.isEditDriverInfo = false;
    this.isEditCompanyInfo = false;
    this.isEditCarOwnerInfo = false;
    // for (let i in this.sideTabs) {
    //   this.sideTabs[i].isHidden = true;
    // }
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  cancel() {
    this.isEditDriverInfo = false;
    this.isEditCompanyInfo = false;
    this.isEditCarOwnerInfo = false;
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }


  getKyc(item: any) {
    this.isStartGetKyc = true;
    this.vehicleInfoObj = item;
    this.vehicleInfoForm = item;
    // this.fleetOwnerForm.vin_number = this.vehicleInfoObj.tlc_plate_number;
  }

  cancelVehInfo() {
    this.isStartGetKyc = false;
    this.isEditDriverInfo = false;
    this.isEditCompanyInfo = false;
    this.isEditCarOwnerInfo = false;

    // this.allFormReset();

    this.vehicleInfoForm = {

      vin_number: "",
      vin_document_upload: "",
      plate_number: "",
      model_year: "",
      vehicle_age: "",
      make: null,
      model: null,
      gross_vehicle_weight: null,
      seating_capacity: "",
      registration_state: null,
      territory_code: null,
      garage_zip_code: "",
      fuel_type: null,
      dashboard_camera: null,
      collision_avoidance: null,
      transmission: null,
      car_category: null,

      is_inspection_report: "",
      valid_date: "",
      upload_inspection_report: "",


      is_insurance_covered: "",
      carriers_name: null,
      policy_number: "",
      limits_coverage: "",
      coverage_expire_date: "",
      coverage_effective_date: "",

      branch: null,
      price_per_day: "",
      price_per_week: "",
      price_per_month: "",
      car_image_upload: "",
    }
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  vehicleKycSaveAsDraft() {
    if (this.vehicleUploadType === 'bulk') {
      let i = this.allPendingKycVehicleList.findIndex((item: any) => item.id === this.vehicleInfoObj.id)
      this.allPendingKycVehicleList[i].status = "Draft";

      this.isStartGetKyc = false;
      window.scrollTo({ top: 300, behavior: 'smooth' });
      this.toast.warningToastr("Save as draft Successfully");
    }
  }

  vehicleKycSubmit() {
    if (this.vehicleUploadType === 'single') {
      this.vehicleInfoForm.kyc = true;
      this.allComplateKycVehicleList.push(this.vehicleInfoForm);
      this.changeKycTab('My Vehicle');
      this.toast.successToastr("KYC Completed Successfully");
    }

    if (this.vehicleUploadType === 'bulk') {
      this.vehicleInfoObj.kyc = true;
      let i = this.allVehicleList.findIndex((item: any) => item.id === this.vehicleInfoObj.id);
      this.allVehicleList[i].kyc = true;
      this.allVehicleList[i].status = "Completed";
      this.allPendingKycVehicleList = this.allPendingKycVehicleList.filter((item: any) => item.kyc === false);
      this.allComplateKycVehicleList = this.allVehicleList.filter((item: any) => item.kyc === true);

      this.isStartGetKyc = false;
      window.scrollTo({ top: 300, behavior: 'smooth' });
      this.toast.successToastr("KYC Completed Successfully");
    }
  }

  indCarOwnerVehicleKycSubmit() {
    if (this.vehicleUploadType === 'single') {
      this.individualCarOwnerForm.kyc = true;
      this.allComplateKycVehicleList.push(this.individualCarOwnerForm);
      this.changeKycTab('My Vehicle');
      this.toast.successToastr("KYC Completed Successfully");
    }
  }

  vehicleKycUpdate() {
    let i = this.allComplateKycVehicleList.findIndex((item: any) => item.id === this.vehicleInfoObj.id)
    this.allComplateKycVehicleList[i] = this.fleetOwnerForm;
    this.isVehicleInfoEdit = false;
    this.toast.successToastr("Updated Successfully");
    window.scrollTo({ top: 300, behavior: 'smooth' });
    // this.vehicleInfoObj
  }

  vehicleKycUpdateFromCarOwner() {
    let i = this.allComplateKycVehicleList.findIndex((item: any) => item.id === this.vehicleInfoObj.id)
    this.allComplateKycVehicleList[i] = this.individualCarOwnerForm;
    this.isVehicleInfoEdit = false;
    this.toast.successToastr("Updated Successfully");
    window.scrollTo({ top: 300, behavior: 'smooth' });
    // this.vehicleInfoObj
  }

  // editFile(item: any, index: any) {
  editFile(event: any) {
    let { item, index } = event;
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.vehicleInfoObj = item;
    this.fleetOwnerForm = item;
    this.fleetOwnerForm.vin_number = this.vehicleInfoObj.vin_number;
    this.fleetOwnerForm.plate_number = this.vehicleInfoObj.plate_number;
    this.fleetOwnerForm.fuel_type = this.vehicleInfoObj.fuel_type;
    this.fleetOwnerForm.transmission = this.vehicleInfoObj.transmission;
    this.fleetOwnerForm.car_category = this.vehicleInfoObj.car_category;
    this.vehicleEditIndex = index;
    this.isVehicleInfoEdit = true;
    // this.changeKycTab('Vehicles info');
  }

  editFromCarOwner(event: any) {
    let { item, index } = event;
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.vehicleInfoObj = item;
    this.individualCarOwnerForm = item;
    this.individualCarOwnerForm.vin_number = this.vehicleInfoObj.vin_number;
    this.individualCarOwnerForm.plate_number = this.vehicleInfoObj.plate_number;
    this.individualCarOwnerForm.fuel_type = this.vehicleInfoObj.fuel_type;
    this.individualCarOwnerForm.transmission = this.vehicleInfoObj.transmission;
    this.individualCarOwnerForm.car_category = this.vehicleInfoObj.car_category;
    this.vehicleEditIndex = index;
    this.isVehicleInfoEdit = true;
    // this.changeKycTab('Vehicles info');
  }

  viewVehicle(event: any) {
    let { item, index } = event;
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.vehicleInfoObj = item;
    this.isVehicleInfoView = true;
  }

  backMyVehicle() {
    this.isVehicleInfoView = false;
  }

  onChangeUpload() {
    this.cancelVehInfo();
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

  async deleteFile(event: any) {
    let { array, index } = event;
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


  allFormReset() {
    // driverInfo Form
    this.driverInfoForm = {
      sr_i_am: '',
      sr_looking_for: '',
      sr_state: '',

      driver_license_number: '',
      license_document_upload: '',
      firstName: '',
      middleName: '',
      lastName: '',
      date_of_birth: '',
      dl_state: '',
      dl_effective_date: '',
      dl_expiration_date: '',

      isHaveForeignLicense: "No",
      forn_licn_country: null,
      forn_licn_state: null,
      forn_licn_city: null,
      forn_licn_postal_code: '',
      forn_licn_issue_date: '',
      forn_licn_expire_date: '',
      foreign_driver_license_number: '',
      forn_licn_document_upload: '',

      gender: null,
      year_of_experience: '',
      marital_status: null,
      number_of_children: '',
      contact: '',
      email_id: '',
      emergency_contact_number: '',
      emergency_contact_person_name: '',
      relation_type: null,
      credit_score: null,

      country: 'USA',
      state: null,
      city: null,
      zip_code: '',
      address_1: '',
      address_2: '',

      perm_add_country: null,
      perm_add_state: null,
      perm_add_city: null,
      perm_add_zip_code: '',
      perm_add_address_1: '',
      perm_add_address_2: '',

      bill_add_country: null,
      bill_add_state: null,
      bill_add_city: null,
      bill_add_zip_code: '',
      bill_add_address_1: '',
      bill_add_address_2: '',

      taxid: '',
      ssn: '',
      price_per_day: '',
      price_per_week: '',
      price_per_month: '',
      location: '',
      pickup_location: '',
      drop_location: '',
      have_medical_insurance: "",
      insurance_company_name: null,
      policy_number: "",
      policy_issue_date: "",
      policy_expiry_date: "",
      get_quotes_from_tlh: false,
      is_available_for_private_booking: null,
      is_active_inactive: null,
      from: '',
      to: '',

      workingHours: [
        { no: 1, name: 'Monday', from_time: "10:00", to_time: "10:00", status: 'ON' },
        { no: 2, name: 'Tuesday', from_time: "10:00", to_time: "10:00", status: 'ON' },
        { no: 3, name: 'Wednesday', from_time: "10:00", to_time: "10:00", status: 'ON' },
        { no: 4, name: 'Thursday', from_time: "10:00", to_time: "10:00", status: 'ON' },
        { no: 5, name: 'Friday', from_time: "10:00", to_time: "10:00", status: 'ON' },
        { no: 6, name: 'Saturday', from_time: "10:00", to_time: "10:00", status: 'ON' },
        { no: 7, name: 'Sunday', from_time: "10:00", to_time: "10:00", status: 'OFF' },
      ],
    };

    // TLC driver license Form
    this.tlcDriverLicenseForm = {
      tlc_driver_license_number: '',
      tlc_license_document_upload: '',
      tlc_firstName: '',
      tlc_lastName: '',
      tlc_dl_state: '',
      tlc_dl_effective_date: '',
      tlc_dl_expiration_date: '',
    };

    // fleetOwner Form
    this.fleetOwnerForm = {

      sr_i_am: "",
      sr_looking_for: "",
      sr_state: "",

      comp_info_taxid: "",
      comp_info_registration_document: "",
      comp_info_company_name: "",
      comp_info_date_of_registration: "",
      comp_info_city: "",
      comp_info_postal_code: "",
      comp_info_registration_address: "",

      fleet_owr_first_name: "",
      fleet_owr_last_name: "",
      fleet_owr_contact_number: "",
      fleet_owr_email_id: "",
      fleet_owr_ssn: "",
      fleet_owr_driver_license_number: "",
      fleet_owr_dl_state: "",
      fleet_owr_dl_effective_date: "",
      fleet_owr_dl_expiration_date: "",
      fleet_owr_driver_license_document: "",

      office_dtl_first_name: "",
      office_dtl_last_name: "",
      office_dtl_contact_number: "",
      office_dtl_email_id: "",
      office_dtl_city: "",
      office_dtl_postal_code: "",
      office_dtl_company_address: "",
      office_dtl_map_location: "",

      isMultipleLoctn: "No",
      branchInfo: [
        {
          branch_dba_name: [''],
          branch_first_name: [''],
          branch_last_name: [''],
          branch_contact_number: [''],
          branch_email_id: [''],
          branch_city: [''],
          branch_postal_code: [''],
          branch_address: [''],
          branch_map_location: [''],
        }
      ]
    };

    this.vehicleInfoForm = {

      vin_number: "",
      vin_document_upload: "",
      plate_number: "",
      model_year: "",
      vehicle_age: "",
      make: null,
      model: null,
      gross_vehicle_weight: null,
      seating_capacity: "",
      registration_state: null,
      territory_code: null,
      garage_zip_code: "",
      fuel_type: null,
      dashboard_camera: null,
      collision_avoidance: null,
      transmission: null,
      car_category: null,

      is_inspection_report: "",
      valid_date: "",
      upload_inspection_report: "",


      is_insurance_covered: "",
      carriers_name: null,
      policy_number: "",
      limits_coverage: "",
      coverage_expire_date: "",
      coverage_effective_date: "",

      branch: null,
      price_per_day: "",
      price_per_week: "",
      price_per_month: "",
      car_image_upload: "",
    }

    // individualCarOwner Form
    this.individualCarOwnerForm = {

      sr_i_am: "",
      sr_looking_for: "",
      sr_state: "",

      car_owr_first_name: "",
      car_owr_last_name: "",
      car_owr_contact_number: "",
      car_owr_email_id: "",
      car_owr_ssn: "",
      car_owr_driver_license_number: "",
      car_owr_dl_state: "",
      car_owr_dl_effective_date: "",
      car_owr_dl_expiration_date: "",
      car_owr_driver_license_document: "",
    };
  }


  handleAction(event: any) {
    console.log("event >>>>>>", event);
  }
}
