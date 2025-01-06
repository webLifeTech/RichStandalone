import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../shared/services/alert.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-driver-info-form',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    MatExpansionModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './driver-info-form.component.html',
  styleUrl: './driver-info-form.component.scss'
})
export class DriverInfoFormComponent {
  @Input() activeKycTab: any;
  @Input() kycForm: any;
  @Input() fleetOwnerForm: any;
  @Input() isEditInfo: any;
  @Input() upload_type: any;
  @Input() isVehicleInfoEdit: any;

  @Input() driverInfoForm: any = {};
  // @Input() isHaveForeignLicense: any;

  @Output() onDivInfoSubmit = new EventEmitter<any>();
  @Output() vfVehicleKycUpdate = new EventEmitter<any>();
  @Output() changeKycTab = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  profileUrl: any = "";

  usaStatesArray: any = [];

  infoTabs: any = [
    {
      title: "userDashboard.kyc.driverInfo.title",
      tab: "driver_info",
      isOpen: true,
    },
    {
      title: "userDashboard.kyc.foreign_drv_lics_info.title",
      tab: "foreign_driver_license",
      isOpen: false,
    },
    {
      title: "userDashboard.kyc.personal_info.title",
      tab: "personal_info",
      isOpen: false,
    },
    {
      title: "userDashboard.kyc.address.current_address",
      tab: "current_address",
      isOpen: false,
    },
    {
      title: "userDashboard.kyc.address.permanent_address",
      tab: "permanent_address",
      isOpen: false,
    },
    {
      title: "userDashboard.kyc.address.billing_address",
      tab: "billing_address",
      isOpen: false,
    },
    {
      title: "userDashboard.kyc.other_info.title",
      tab: "other_information",
      isOpen: false,
    },
  ]

  yesNoList: any = [
    { name: 'Yes', value: 'Yes' },
    { name: 'No', value: 'No' },
  ];
  prifixList: any = [
    { name: 'Dr', value: 'Dr' },
    { name: 'Mr', value: 'Mr' },
    { name: 'Mrs', value: 'Mrs' },
    { name: 'Ms', value: 'Ms' },
  ];
  suffixList: any = [
    { name: '2ND', value: '2ND' },
    { name: '3RD', value: '3RD' },
    { name: '4TH', value: '4TH' },
    { name: 'General Partner', value: 'General Partner' },
    { name: 'II', value: 'II' },
    { name: 'III', value: 'III' },
    { name: 'IV', value: 'IV' },
    { name: 'Jr', value: 'Jr' },
    { name: 'MD', value: 'MD' },
    { name: 'Sr', value: 'Sr' },
    { name: 'Trustee', value: 'Trustee' },
  ];
  genderList: any = [
    { name: 'Male', value: 'Male' },
    { name: 'Female', value: 'Female' },
  ];
  maritalStatusList: any = [
    { name: 'Married', value: 'Married' },
    { name: 'Unmarried', value: 'Unmarried' },
  ];
  availableForPrivate: any = [
    { name: 'Yes', value: 'Yes' },
    { name: 'No', value: 'No' },
  ];
  statusList: any = [
    { name: 'Yes', value: 'Yes' },
    { name: 'No', value: 'No' },
  ];
  creditScoreList: any = [
    { name: 'Poor 250-579', value: 'Poor 250-579' },
    { name: 'Fair 580-6669', value: 'Fair 580-6669' },
    { name: 'Good 670-739', value: 'Good 670-739' },
    { name: 'Very Good 740-799', value: 'Very Good 740-799' },
    { name: 'Exceptional 800-900', value: 'Exceptional 800-900' },
  ];
  countryList: any = [
    { name: 'USA', value: 'USA' },
    { name: 'China', value: 'China' },
  ];
  stateList: any = [
    { name: 'New York', value: 'New York', country: "USA" },
    { name: 'New York City', value: 'New York City', country: "USA" },
    { name: 'North Carolina', value: 'North Carolina', country: "USA" },
    { name: 'Hebei', value: 'Hebei', country: "China" },
    { name: 'Shanxi', value: 'Shanxi', country: "China" },
  ];
  cityList: any = [
    { name: 'Albany', value: 'Albany', country: "USA" },
    { name: 'Raleigh', value: 'Raleigh', country: "USA" },
    { name: 'Shijiazhuang', value: 'Shijiazhuang', country: "China" },
    { name: 'Taiyuan', value: 'Taiyuan', country: "China" },
  ];
  relationTypeList: any = [
    { name: 'Father', value: 'Father' },
    { name: 'Mother', value: 'Mother' },
    { name: 'Son', value: 'Son' },
    { name: 'Daughter', value: 'Daughter' },
  ];
  companyList: any = [
    { name: 'HDFC Life Insurance Company Limited', value: 'HDFC Life' },
    { name: 'TATA AIA Life Insurance', value: 'TATA AIA' },
    { name: 'Aditya Birla SunLife Insurance', value: 'Aditya Birla' },
  ];

  insuranceTypeList: any = [
    { name: 'Medical', value: 'Medical' },
    { name: 'Auto', value: 'Auto' },
    { name: 'Home', value: 'Home' },
    { name: 'Life', value: 'Life' },
  ];

  constructor(
    private modal: NgbModal,
    public gs: GlobalService,
    private alert: AlertService,
  ) {
    this.gs.usStates().subscribe(response => {
      this.usaStatesArray = response;
    })
  }

  ngOnInit() {
  }

  openModal() {
  }

  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profileUrl = reader.result;
    };
  }

  setPrimaryAddress(event: any, type: any) {

  }
  sameAsAddress(event: any, type: any) {
    if (event.target.checked) {

      if (type === 'Permanent') {
        this.driverInfoForm.perm_add_country = this.driverInfoForm.country;
        this.driverInfoForm.perm_add_state = this.driverInfoForm.state;
        this.driverInfoForm.perm_add_city = this.driverInfoForm.city;
        this.driverInfoForm.perm_add_zip_code = this.driverInfoForm.zip_code;
        this.driverInfoForm.perm_add_address_1 = this.driverInfoForm.address_1;
        this.driverInfoForm.perm_add_address_2 = this.driverInfoForm.address_2;
      }
      if (type === 'Billing') {
        this.driverInfoForm.bill_add_country = this.driverInfoForm.country;
        this.driverInfoForm.bill_add_state = this.driverInfoForm.state;
        this.driverInfoForm.bill_add_city = this.driverInfoForm.city;
        this.driverInfoForm.bill_add_zip_code = this.driverInfoForm.zip_code;
        this.driverInfoForm.bill_add_address_1 = this.driverInfoForm.address_1;
        this.driverInfoForm.bill_add_address_2 = this.driverInfoForm.address_2;
      }
    }
  }

  documentUpload(type: any) {
    if (type === 'driver') {
      this.driverInfoForm.firstName = "John";
      this.driverInfoForm.middleName = "Duchac";
      this.driverInfoForm.lastName = "Doe";
      this.driverInfoForm.date_of_birth = "1990-04-15";
      this.driverInfoForm.dl_state = "CA (California)";
      this.driverInfoForm.dl_effective_date = "2022-05-10";
      this.driverInfoForm.dl_expiration_date = "2026-05-10";
    }
  }

  vehicleKycUpdate() {
    this.vfVehicleKycUpdate.emit(null)
  }
  onSubmit() {
    this.onDivInfoSubmit.emit(null)
  }
  onChangeKycTab(value: any) {
    this.changeKycTab.emit(value)
  }
  onCancel() {
    this.cancel.emit(null)
  }
}
