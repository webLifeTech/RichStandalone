import { Component, Input } from '@angular/core';
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

@Component({
  selector: 'app-enquiries-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    OnlynumberDirective
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './enquiries-modal.component.html',
  styleUrl: './enquiries-modal.component.scss'
})
export class EnquiriesModalComponent {
  @Input() providerDetails: any = {};
  @Input() searchDetails: any = {};

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
  ) {
  }

  ngOnInit() {
    console.log("this.searchDetails >>>", this.searchDetails);
    console.log("providerDetails >>>", this.providerDetails);

    this.enquiryForm = this.bf.group({
      "userId": this.providerDetails.userId,
      "id": 0,
      "providerId": this.providerDetails.providerId,
      "name": ["", Validators.required],
      "phoneNumber": ["", Validators.required],
      "emailId": ["", [Validators.required, Validators.email]],
      "remarks": ["", Validators.required],
      "category": this.providerDetails?.categoryName,
      "categoryCd": this.providerDetails?.categoryId,
      "subCategory": null,
      "subCategoryCd": [null, Validators.required],
      "isRead": true,
      "enquiryDate": [this.transformDate(this.todayDate, 'MM/dd/yy')]
    })
    console.log("providerDetails >>>", this.providerDetails);

  }

  changeSubCategory(event: any) {
    console.log("event >>>>>", event);
    this.enquiryForm?.patchValue({ subCategory: event.subCategoryName });

  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {
    console.log("enquiryForm.valid >>>>>>>", this.enquiryForm.valid);
    console.log("this.enquiryForm.value >>>>>>>", this.enquiryForm.value);
    this.submitted = true;
    if (this.enquiryForm.valid) {
      this.gs.isSpinnerShow = true;
      this.vendorService.AddProviderEnquiry(this.enquiryForm.value).subscribe((res: any) => {
        this.submitted = false;
        this.gs.isSpinnerShow = false;
        if (res && res.statusCode == "200") {
          this.openVerificationSuccess();
          this.activeModal.close({ confirmed: true });
        } else {
          this.toast.errorToastr("Something went wrong");
        }
      })
    }

    // this.openOtpVerification();
  }

  get enquiryFormControl(): any {
    return this.enquiryForm.controls;
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  openOtpVerification() {
    const modalRef = this.modalService.open(OtpVerificationModalComponent, {
      centered: true
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.openVerificationSuccess();
      }
    }, () => {
    });
  }

  openVerificationSuccess() {
    const modalRef = this.modalService.open(VerificationSuccessModalComponent, {
      centered: true
    });
    modalRef.componentInstance.title = "Enquiry sent successfully.";
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }
}
