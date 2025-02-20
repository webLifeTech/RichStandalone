import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImageFileModalComponent } from '../../../../shared/components/comman/modal/image-file-modal/image-file-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';
import { DynamicInfoModalComponent } from '../../comman/modal/dynamic-info-modal/dynamic-info-modal.component';
import { DeleteModalComponent } from '../../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { ProfileService } from '../../../../shared/services/profile.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-driver-info-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './driver-info-details.component.html',
  styleUrl: './driver-info-details.component.scss'
})
export class DriverInfoDetailsComponent {

  public params: Params;
  public type: any = "";
  @Input() driverInfoData: any = {};
  @Input() selectedTabObj: any = {};
  @Output() onEditInfo = new EventEmitter<any>();
  // editInfo

  formArray: any[] = [];
  groupedSectionsData: any = [];

  constructor(
    public cabService: CabService,
    public profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private toast: ToastService,
    private translateService: TranslateService,
    public gs: GlobalService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.type = this.params['type'];
    })
  }

  ngOnInit() {
    this.getConfigUIFields();
  }

  // Get Config UI Fields
  getConfigUIFields() {
    this.gs.isSpinnerShow = true;
    let body = {
      "clientID": null,
      "stateCode": 42,
      "languageId": 1,
      "roleName": this.selectedTabObj.roleName,// You can change this role from above role id
      "countryId": 230,
      "transactionId": 1,
      "formName": this.selectedTabObj.formName,//THis is name you have send form names
      "menuId": 27
    }

    this.profileService.getConfigUIFields(body).subscribe(async (response: any) => {
      this.formArray = response;
      console.log("aaaaaaaaaaaa >>>>>>>>", this.formArray);
      const groupedSections = this.groupBy(this.formArray, 'sectionID');
      console.log("groupedSections >>>>>>>>", groupedSections);

      Object.keys(groupedSections).forEach((sectionID, index) => {
        const fieldsArray: any = groupedSections[sectionID].sort(
          (a: any, b: any) => a.fieldOrder - b.fieldOrder
        );

        const modalObjectCounts: { [key: string]: number } = {};
        fieldsArray.forEach((item: any) => {
          modalObjectCounts[item.modalObject] = (modalObjectCounts[item.modalObject] || 0) + 1;
        });
        const mostFrequentModalObject = Object.keys(modalObjectCounts).reduce((a, b) =>
          modalObjectCounts[a] > modalObjectCounts[b] ? a : b
        );

        const section: any = {
          sectionID: sectionID,
          sectionName: (fieldsArray[0]?.sectionName || ''),
          modalObject: mostFrequentModalObject, // (fieldsArray[0]?.modalObject || ''),
          fields: fieldsArray
        };
        this.groupedSectionsData.push(section);
      });

      this.gs.isSpinnerShow = false;
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
      this.toast.errorToastr(err || "Something went wrong");
    })
  }

  groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  }

  viewDocumentFile(): void {
    this.dialog.open(ImageFileModalComponent, {
      width: '600px',
      data: {}
    });
  }

  onView(item: any) {
    this.driverInfoData.profile_picture = "assets/images/driver/d1.png";
    const modalRef = this.modalService.open(DynamicInfoModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.driverInfoData = this.driverInfoData;
    modalRef.componentInstance.groupedSectionsData = this.groupedSectionsData;
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

  onEdit(item: any, index: any) {
    this.onEditInfo.emit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  blockchainPDF(item: any) {
    this.gs.isSpinnerShow = true;
    let body = {
      [this.translateService.instant('userDashboard.kyc.driverInfo.title')]: '',
      [this.translateService.instant('userDashboard.kyc.driverInfo.driver_license_number')]: item.driver_license_number || "",
      [this.translateService.instant('userDashboard.kyc.driverInfo.dl_state')]: item.dl_state || "",
      [this.translateService.instant('userDashboard.kyc.driverInfo.firstname')]: item.firstName || "",
      [this.translateService.instant('userDashboard.kyc.driverInfo.middlename')]: item.middleName || "",
      [this.translateService.instant('userDashboard.kyc.driverInfo.lastname')]: item.lastName || "",
      [this.translateService.instant('userDashboard.kyc.driverInfo.prefix')]: item.prefix || "",
      [this.translateService.instant('userDashboard.kyc.driverInfo.suffix')]: item.suffix || "",
      [this.translateService.instant('userDashboard.kyc.driverInfo.date_of_birth')]: item.date_of_birth || "",
      [this.translateService.instant('userDashboard.kyc.driverInfo.dl_effective_date')]: item.dl_effective_date || "",
      [this.translateService.instant('userDashboard.kyc.driverInfo.dl_expiration_date')]: item.dl_expiration_date || "",
      [this.translateService.instant('userDashboard.kyc.foreign_drv_lics_info.title')]: '',
      [this.translateService.instant('userDashboard.kyc.foreign_drv_lics_info.have_foreign_licns')]: item.isHaveForeignLicense || "",
      [this.translateService.instant('userDashboard.kyc.foreign_drv_lics_info.country')]: item.forn_licn_country || "",
      [this.translateService.instant('userDashboard.kyc.foreign_drv_lics_info.state')]: item.forn_licn_state || "",
      [this.translateService.instant('userDashboard.kyc.foreign_drv_lics_info.city')]: item.forn_licn_city || "",
      [this.translateService.instant('userDashboard.kyc.foreign_drv_lics_info.postal_code')]: item.forn_licn_postal_code || "",
      [this.translateService.instant('userDashboard.kyc.foreign_drv_lics_info.issue_date')]: item.forn_licn_issue_date || "",
      [this.translateService.instant('userDashboard.kyc.foreign_drv_lics_info.expire_date')]: item.forn_licn_expire_date || "",
      [this.translateService.instant('userDashboard.kyc.foreign_drv_lics_info.document_upload')]: item.forn_licn_document_upload || "",
      [this.translateService.instant('userDashboard.kyc.personal_info.title')]: '',
      [this.translateService.instant('userDashboard.kyc.personal_info.gender')]: item.gender || "",
      [this.translateService.instant('userDashboard.kyc.personal_info.date_of_birth')]: item.date_of_birth || "",
      [this.translateService.instant('userDashboard.kyc.personal_info.year_of_experience')]: item.year_of_experience || "",
      [this.translateService.instant('userDashboard.kyc.personal_info.marital_status')]: item.marital_status || "",
      [this.translateService.instant('userDashboard.kyc.personal_info.number_of_children')]: item.number_of_children || "",
      [this.translateService.instant('userDashboard.kyc.personal_info.contact_number')]: item.contact || "",
      [this.translateService.instant('userDashboard.kyc.personal_info.email_id')]: item.email_id || "",
      [this.translateService.instant('userDashboard.kyc.personal_info.emergency_contact_number')]: item.emergency_contact_number || "",
      [this.translateService.instant('userDashboard.kyc.personal_info.emergency_contact_person_name')]: item.emergency_contact_person_name || "",
      [this.translateService.instant('userDashboard.kyc.address.current_address')]: '',
      [this.translateService.instant('userDashboard.kyc.address.country')]: item.country || "",
      [this.translateService.instant('userDashboard.kyc.address.address_1')]: item.address_1 || "",
      [this.translateService.instant('userDashboard.kyc.address.address_2')]: item.address_2 || "",
      [this.translateService.instant('userDashboard.kyc.address.zip_code')]: item.zip_code || "",
      [this.translateService.instant('userDashboard.kyc.address.city')]: item.city || "",
      [this.translateService.instant('userDashboard.kyc.address.state')]: item.state || "",
      [this.translateService.instant('userDashboard.kyc.address.permanent_address')]: '',
      [this.translateService.instant('userDashboard.kyc.address.address_1')]: item.perm_add_address_1 || "",
      [this.translateService.instant('userDashboard.kyc.address.address_2')]: item.perm_add_address_2 || "",
      [this.translateService.instant('userDashboard.kyc.address.zip_code')]: item.perm_add_zip_code || "",
      [this.translateService.instant('userDashboard.kyc.address.city')]: item.perm_add_city || "",
      [this.translateService.instant('userDashboard.kyc.address.state')]: item.perm_add_state || "",
      [this.translateService.instant('userDashboard.kyc.address.country')]: item.perm_add_country || "",
      [this.translateService.instant('userDashboard.kyc.address.userDashboard.kyc.address.billing_address')]: '',
      [this.translateService.instant('userDashboard.kyc.address.address_1')]: item.bill_add_address_1 || "",
      [this.translateService.instant('userDashboard.kyc.address.address_2')]: item.bill_add_address_2 || "",
      [this.translateService.instant('userDashboard.kyc.address.zip_code')]: item.bill_add_zip_code || "",
      [this.translateService.instant('userDashboard.kyc.address.city')]: item.bill_add_city || "",
      [this.translateService.instant('userDashboard.kyc.address.state')]: item.bill_add_state || "",
      [this.translateService.instant('userDashboard.kyc.address.country')]: item.bill_add_country || "",
      [this.translateService.instant('userDashboard.kyc.other_info.title')]: '',
      [this.translateService.instant('userDashboard.kyc.other_info.taxid')]: item.taxid || "",
      [this.translateService.instant('userDashboard.kyc.other_info.ssn')]: item.ssn || "",
      [this.translateService.instant('userDashboard.kyc.personal_info.credit_score')]: item.credit_score || "",
      [this.translateService.instant('userDashboard.kyc.other_info.pickup_location')]: item.pickup_location || "",
      [this.translateService.instant('userDashboard.kyc.other_info.drop_location')]: item.drop_location || "",
      [this.translateService.instant('userDashboard.kyc.other_info.is_active_inactive')]: item.is_active_inactive || "",
      [this.translateService.instant('userDashboard.kyc.other_info.is_available_for_private_booking')]: item.is_available_for_private_booking || "",
      [this.translateService.instant('userDashboard.kyc.other_info.price_per_day')]: item.price_per_day || "",
      [this.translateService.instant('userDashboard.kyc.other_info.working_hours')]: item.is_available_for_private_booking || "",
      [this.translateService.instant('userDashboard.kyc.tlc_info.title')]: '', // driverInfoData.sr_state === 'New York City'
      [this.translateService.instant('userDashboard.kyc.tlc_info.driver_license_number')]: item.tlc_driver_license_number || "",
      [this.translateService.instant('userDashboard.kyc.tlc_info.license_document_upload')]: item.tlc_license_document_upload || "",
      [this.translateService.instant('userDashboard.kyc.tlc_info.firstname')]: item.tlc_firstName || "",
      [this.translateService.instant('userDashboard.kyc.tlc_info.lastname')]: item.tlc_lastName || "",
      [this.translateService.instant('userDashboard.kyc.tlc_info.dl_state')]: item.tlc_dl_state || "",
      [this.translateService.instant('userDashboard.kyc.tlc_info.dl_effective_date')]: item.tlc_dl_effective_date || "",
      [this.translateService.instant('userDashboard.kyc.tlc_info.dl_expiration_date')]: item.tlc_dl_expiration_date || "",

    };
    this.profileService.storeJSON(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.data) {
        setTimeout(() => {
          window.open(response.data, "_blank");
        }, 100);
      } else {
        this.toast.errorToastr("Something went wrong");
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
    // window.open(response.checkout_url, "_blank");
  }

  async onDelete(index: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

}
