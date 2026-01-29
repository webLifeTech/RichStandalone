import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OtpVerificationModalComponent } from '../../../../../modules/user-dashboard/user-settings/modals/otp-verification-modal/otp-verification-modal.component';
import { VerificationSuccessModalComponent } from '../../../../../modules/user-dashboard/user-settings/modals/verification-success-modal/verification-success-modal.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule, DatePipe } from '@angular/common';
import { OnlynumberDirective } from '../../../../directives/number-only.directive';
import { GlobalService } from '../../../../services/global.service';
import { VendorServService } from '../../../../services/vendor-service.service';
import { ToastService } from '../../../../services/toast.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../../../services/profile.service';

@Component({
  selector: 'app-bulk-upload-vc-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    OnlynumberDirective,
    TranslateModule,
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './bulk-upload-vc-modal.component.html',
  styleUrl: './bulk-upload-vc-modal.component.scss'
})
export class BulkUploadVcModalComponent {
  // @Input() providerDetails: any = {};
  // @Input() searchDetails: any = {};
  @ViewChild('fileInput') fileInput!: ElementRef;
  uploadedBulkFile: any = {};

  vin_document_upload: any = "";
  vehicleUploadType: any = null;
  allPendingKycVehicleList: any = [];
  allComplateKycVehicleList: any = [];
  draftVehiclesResponse: any = [];
  vinUploadResponse: any = {};

  enquiryForm: FormGroup;
  todayDate = new Date();
  submitted: boolean = false;


  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public bf: FormBuilder,
    public gs: GlobalService,
    private datePipe: DatePipe,
    private vendorService: VendorServService,
    private toast: ToastService,
    private profileService: ProfileService,
  ) {
  }

  ngOnInit() {

  }
  closeModal() {
    this.activeModal.close({ confirmed: true });
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedBulkFile = file;
      this.gs.isSpinnerShow = true;
      this.gs.readExcel(file).then((vinData) => {
        this.profileService.bulkVehicleUpload(vinData, {
          "userId": this.gs.loggedInUserInfo.userId,
        }).subscribe((response: any) => {
          this.gs.isSpinnerShow = false;
          this.vinUploadResponse = response;
          this.vinUploadResponse.allVinList = vinData;
          this.fileInput.nativeElement.value = '';
          this.gs.isProgressStepShow = false;
          setTimeout(() => {
            this.gs.isProgressStepShow = true;
          }, 100);
          if (response && response.statusCode == "200") {
            this.toast.successToastr("VIN uploaded successfully");
          }
          if (response && response.successList.length == vinData.length) {
            this.toast.successToastr("All VIN uploaded successfully");
          }
        }, (err: any) => {
          this.fileInput.nativeElement.value = '';
          this.gs.isSpinnerShow = false;
          this.vinUploadResponse = err.error;
          this.toast.errorToastr(err?.error?.message || "Something went wrong");
        })
      });
    }
  }


}
