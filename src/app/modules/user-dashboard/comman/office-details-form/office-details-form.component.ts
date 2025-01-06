import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../shared/services/alert.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-office-details-form',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    MatExpansionModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './office-details-form.component.html',
  styleUrl: './office-details-form.component.scss'
})
export class OfficeDetailsFormComponent {
  @Input() activeKycTab: any;
  @Input() isEditInfo: any;
  @Input() fleetOwnerForm: any;

  @Output() onDivInfoSubmit = new EventEmitter<any>();
  @Output() vfVehicleKycUpdate = new EventEmitter<any>();
  @Output() changeKycTab = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  profileUrl: any = "";

  availableForPrivate: any = [
    { name: 'Yes', value: 'Yes' },
    { name: 'No', value: 'No' },
  ];
  statusList: any = [
    { name: 'Yes', value: 'Yes' },
    { name: 'No', value: 'No' },
  ];

  multipleLocation: any = [
    { name: 'Yes', value: 'Yes' },
    { name: 'No', value: 'No' },
  ];

  companyInfoTabs: any = [
    {
      title: "userDashboard.kyc.office_details.title",
      tab: "office_details",
      isOpen: true,
    },
    {
      title: "userDashboard.kyc.branch_info.title",
      tab: "branch_info",
      isOpen: false,
    },
  ]

  constructor(
    private modal: NgbModal,
    public gs: GlobalService,
    private alert: AlertService,
    private toast: ToastService,
  ) {

  }

  onChangeTime(event: any) {

  }

  addMoreBranch() {
    this.fleetOwnerForm.branchInfo.push({
      branch_dba_name: [''],
      branch_first_name: [''],
      branch_last_name: [''],
      branch_contact_number: [''],
      branch_email_id: [''],
      branch_city: [''],
      branch_postal_code: [''],
      branch_address: [''],
      branch_address2: [''],
      branch_map_location: [''],
    })
  }
  changeMulti() {
    this.fleetOwnerForm.branchInfo = [{
      branch_dba_name: [''],
      branch_first_name: [''],
      branch_last_name: [''],
      branch_contact_number: [''],
      branch_email_id: [''],
      branch_city: [''],
      branch_postal_code: [''],
      branch_address: [''],
      branch_address2: [''],
      branch_map_location: [''],
    }]
  }

  vehicleKycUpdate() {
    this.vfVehicleKycUpdate.emit(null)
  }
  onSubmit() {
    // this.onDivInfoSubmit.emit(null)
    this.toast.successToastr("Updated Successfully");

  }
  onChangeKycTab(value: any) {
    this.changeKycTab.emit(value)
  }
  onCancel() {
    this.fleetOwnerForm.office_dtl_first_name = "";
    this.fleetOwnerForm.office_dtl_last_name = "";
    this.fleetOwnerForm.office_dtl_contact_number = "";
    this.fleetOwnerForm.office_dtl_email_id = "";
    this.fleetOwnerForm.office_dtl_city = "";
    this.fleetOwnerForm.office_dtl_postal_code = "";
    this.fleetOwnerForm.office_dtl_company_address = "";
    this.fleetOwnerForm.office_dtl_map_location = "";
    // this.cancel.emit(null)
  }
  onCancelBranchInfo() {
    this.changeMulti();
  }
}
