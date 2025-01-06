import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../shared/services/alert.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-info-form',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    MatExpansionModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './company-info-form.component.html',
  styleUrl: './company-info-form.component.scss'
})
export class CompanyInfoFormComponent {
  @Input() activeKycTab: any;
  @Input() isEditInfo: any;
  @Input() fleetOwnerForm: any;
  usaStatesArray: any = [];

  @Output() onFleetOwnerSubmit = new EventEmitter<any>();
  @Output() changeKycTab = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  profileUrl: any = "";

  companyInfoTabs: any = [
    {
      title: "userDashboard.kyc.company_details.title",
      tab: "company_details",
      isOpen: true,
    },
    {
      title: "userDashboard.kyc.fleet_owner_details.title",
      tab: "fleet_owner_details",
      isOpen: false,
    },
    // {
    //   title: "userDashboard.kyc.office_details.title",
    //   tab: "office_details",
    //   isOpen: false,
    // },
    // {
    //   title: "userDashboard.kyc.branch_info.title",
    //   tab: "branch_info",
    //   isOpen: false,
    // },
  ]

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

  constructor(
    private modal: NgbModal,
    public gs: GlobalService,
    private alert: AlertService,
  ) {
    this.gs.usStates().subscribe(response => {
      this.usaStatesArray = response;
    })
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


  registrationDocUpload(type: any) {
    if (type === 'registration') {
      this.fleetOwnerForm.comp_info_company_name = "Acme Corporation";
      this.fleetOwnerForm.comp_info_date_of_registration = "2021-07-15";
      this.fleetOwnerForm.comp_info_city = "New York City";
      this.fleetOwnerForm.comp_info_postal_code = "10001";
      this.fleetOwnerForm.comp_info_registration_address = "456 Park Avenue, Suite 101, New York City, NY 10001";
    }
  }


  vehicleKycUpdate() {
    // this.vfVehicleKycUpdate.emit(null)
  }
  onSubmit() {
    this.onFleetOwnerSubmit.emit(null)
  }
  onChangeKycTab(value: any) {
    this.changeKycTab.emit(value)
  }
  onCancel() {
    this.cancel.emit(null)
  }
}
