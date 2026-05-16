import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../../../shared/services/toast.service';
import { BookingService } from '../../../../shared/services/booking.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';
import { ConfirmationModalComponent } from '../../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-booking-cancellation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    CurrencySymbolPipe,
    TranslateModule
  ],
  providers: [DatePipe],
  templateUrl: './booking-cancellation.component.html',
  styleUrl: './booking-cancellation.component.scss'
})
export class BookingCancellationComponent {

  @Input() title: string;
  @Input() singleBookingDetail: any = {};
  @Input() cancellationInfo: any = {};
  @Output() onCancel = new EventEmitter<any>();

  reason: any = "";
  reasons: any = [];
  cancellationForm: FormGroup;
  submitted: boolean = false;
  isBookingCancelled: boolean = false;


  constructor(
    public bf: FormBuilder,
    private toast: ToastService,
    public gs: GlobalService,
    private bookingService: BookingService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    this.cancellationForm = this.bf.group({
      "reason": [null, Validators.required],
      "remarks": ["", Validators.required],
    })
  }

  ngOnInit() {
    this.GetMasterBookingCancellationReasons();
  }

  GetMasterBookingCancellationReasons() {
    this.gs.isSpinnerShow = true;
    this.bookingService.GetMasterBookingCancellationReasons({
      riskType: this.gs.loggedInUserInfo.role == 'admin' ? 'All' : this.singleBookingDetail.riskType,
    }).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      this.reasons = response;
    })
  }

  get cancelFormControl(): any {
    return this.cancellationForm.controls;
  }

  closeModal() {
    // this.modalService.dismissAll();
  }
  onConfirm() {
    this.submitted = true;
    if (this.cancellationForm.valid) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = "Are you sure want to cancel booking?";
      modalRef.result.then((res: any) => {
        if (res.confirmed) {
          const body = {
            "bookingId": this.singleBookingDetail.bookingId,
            "userId": this.gs.loggedInUserInfo.userId,
            "riskId": this.singleBookingDetail.riskId,
            "riskType": this.singleBookingDetail.riskType,
            "cancellationReason": this.cancellationForm.value.reason || null,
            "remarks": this.cancellationForm.value.remarks,
            "modifiedBy": this.gs.loggedInUserInfo.userId,
          }

          this.gs.isSpinnerShow = true;
          this.bookingService.BookingCancellationRequest(body).subscribe((res: any) => {
            this.gs.isSpinnerShow = false;
            if (res && res.statusCode == "200") {
              this.toast.successToastr(res.message);
              this.back();
            } else {
              this.toast.errorToastr(res.message);
            }
          }, (err) => {
            this.gs.isSpinnerShow = false;
            this.toast.errorToastr(err.error.message);
          });
        }
      }, () => {
      });
    } else {
      this.toast.errorToastr("Please fill the all required fields.")
    }
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  back() {
    this.onCancel.emit(null);
  }
}
