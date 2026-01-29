import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule, DatePipe } from '@angular/common';
import { OnlynumberDirective } from '../../../../directives/number-only.directive';
import { GlobalService } from '../../../../services/global.service';
import { VendorServService } from '../../../../services/vendor-service.service';
import { ToastService } from '../../../../services/toast.service';
import { BookingService } from '../../../../services/booking.service';

@Component({
  selector: 'app-instructions-modal',
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
  templateUrl: './instructions-modal.component.html',
  styleUrl: './instructions-modal.component.scss'
})
export class InstructionsModalComponent {
  @Input() singleDetails: any = {};
  submitted: boolean = true;

  form: FormGroup;
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public bf: FormBuilder,
    public gs: GlobalService,
    private toast: ToastService,
    private bookingService: BookingService,
  ) {
  }

  ngOnInit() {

    this.form = this.bf.group({
      "bookingId": [this.singleDetails.bookingId],
      "bookingReferenceNumber": [this.singleDetails.bookingReferenceNumber],
      "userId": [this.gs.loggedInUserInfo.userId],
      "pickupInstruction": [""],
      "dropInstruction": [""],
    });

    this.GetBookingByBookingRefNo();
  }

  GetBookingByBookingRefNo() {
    this.gs.isSpinnerShow = true;
    this.bookingService.GetBookingByBookingRefNo({
      bookingRefNo: this.singleDetails.bookingReferenceNumber,
      loginUserId: this.gs.loggedInUserInfo.userId,
    }).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response.response && response.response.statusCode == "200") {
        this.form.controls['pickupInstruction'].setValue(response?.bookingDetails?.pickupInstruction);
        this.form.controls['dropInstruction'].setValue(response?.bookingDetails?.dropInstruction);
      }
    })
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onConfirm() {
    this.submitted = true;
    if (this.form.valid) {
      this.gs.isSpinnerShow = true;
      this.bookingService.UpdatePickupDropInstruction(this.form.value).subscribe((res: any) => {
        this.gs.isSpinnerShow = false;
        if (res && res.statusCode == "200") {
          this.toast.successToastr(res.message);
          this.submitted = false;
          this.activeModal.close({ confirmed: true });
        } else {
          this.toast.errorToastr("Something went wrong");
        }
      })
    }
  }

  get formControl(): any {
    return this.form.controls;
  }
}
