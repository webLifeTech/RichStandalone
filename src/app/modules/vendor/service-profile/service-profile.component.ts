import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../shared/services/alert.service';
import { GlobalService } from '../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationModalComponent } from '../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';
import { DynamicFormComponent } from '../../user-dashboard/comman/dynamic-form/dynamic-form.component';
import { ProfileService } from '../../../shared/services/profile.service';
import { VendorServService } from '../../../shared/services/vendor-service.service';
import { DynamicGridComponent } from '../../user-dashboard/comman/dynamic-grid/dynamic-grid.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-service-profile',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    MatExpansionModule,
    TranslateModule,
    FormsModule,
    DynamicFormComponent,
    DynamicGridComponent,
  ],
  templateUrl: './service-profile.component.html',
  styleUrl: './service-profile.component.scss'
})

export class ServiceProfileComponent {
  activeKycTab: any;
  kycForm: any = {
    state: 42,
    menuId: 30
  };
  isFormEdit: boolean = false;
  isAddEditVendor: boolean = false;
  selectedTabObj: any = {};
  singleDetailInfo: any = {};

  @Output() onDivInfoSubmit = new EventEmitter<any>();
  @Output() vfVehicleKycUpdate = new EventEmitter<any>();
  @Output() changeKycTab = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  profileUrl: any = "";
  isEdit: boolean = false;
  sidebarTabs: any = [];
  gridInfoData: any = [];
  isLoadVendorDetail: boolean = false; // need to do

  //   vender photo
  // phone number
  // last name
  // Vehicle List Columns and Data
  vendorInfoColumns = [
    { header: 'Profile', fieldObject: "contactInfo", field: 'providerProfilePath' },
    { header: 'BUSINESS NAME', fieldObject: "contactInfo", field: 'dbaName' },
    { header: 'FIRST NAME', fieldObject: "contactInfo", field: 'firstName' },
    { header: 'LAST NAME', fieldObject: "contactInfo", field: 'lastName' },
    { header: 'PHONE NUMBER', fieldObject: null, field: 'phoneNumber' },
    { header: 'CATEGORY', fieldObject: null, field: 'category' },
  ];

  // Actions grids
  vendorInfoActions = ['View', 'Edit'];

  constructor(
    public gs: GlobalService,
    private modalService: NgbModal,
    private profileService: ProfileService,
    private vendorService: VendorServService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      if (this.gs.loggedInUserInfo.role == 'Vendor') {
        return;
      }
      if (params && params.type) {
        this.router.navigate(['/auth/log-in'], {
          queryParams: params,
        });
      }
    })
  }

  ngOnInit() {
    this.kycForm.state = 42;
    this.getConfigUIForms()
    this.getProviderDetails()
  }

  getConfigUIForms() {
    let body = {
      "stateCode": "42",
      "languageId": 1,
      "roleName": this.gs.loggedInUserInfo.roleName || null,
      "countryId": 230,
      "transactionId": 1,
      "menuId": 30
    }
    this.profileService.getConfigUIForms(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("response >>>>>", response);
      if (response && response.length) {
        this.sidebarTabs = response
        this.selectedTabObj = JSON.parse(JSON.stringify(this.sidebarTabs[0]));
        this.activeKycTab = 1;
      } else {
        // this.toast.errorToastr("Something went wrong");
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
  }

  getProviderDetails() {
    this.isLoadVendorDetail = false;
    const body = {
      userId: this.gs.loggedInUserInfo.userId,
    }
    this.vendorService.GetProviderDetails(body).subscribe(async (response: any) => {
      console.log("getProviderDetails response >>>>>>", response);
      this.singleDetailInfo = { providerRequest: response };
      if (response && !response.providerProfilePath) { // !response.businessType need to do
        this.isFormEdit = true;
        this.isAddEditVendor = true;
      } else {
        this.isLoadVendorDetail = true;
        response.phoneNumber = response.contactInfo.phoneNumbers[0].phoneNumber;
        this.gridInfoData = [response];
      }
    })
  }

  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profileUrl = reader.result;
    };
  }

  documentUpload(type: any) {
  }

  async changeStatus(item: any) {
    let newStatus = item.status === 'ON' ? 'OFF' : 'ON';
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Are sure you want to change status to ' + newStatus;
    modalRef.componentInstance.confirmButton = "Yes";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        item.status = newStatus;
      }
    }, () => { });
  }

  onChangeTime(event: any) {
  }

  handleAction(event: any, type: any) {
    if (type === 'vendor-profile') {
      this.isFormEdit = true;
      this.isAddEditVendor = true;
    }
  }

  handleSubmit() {
    // this.getDriverDetails();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  handleCancel() {
    this.isFormEdit = false;
    this.isAddEditVendor = false;
    this.gs.isModificationOn = false;
    this.getProviderDetails();
  }
}
