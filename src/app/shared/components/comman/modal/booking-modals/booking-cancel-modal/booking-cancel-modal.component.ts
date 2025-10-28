import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../../../../services/toast.service';
import { BookingService } from '../../../../../services/booking.service';
import { GlobalService } from '../../../../../services/global.service';

@Component({
  selector: 'app-booking-cancel-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './booking-cancel-modal.component.html',
  styleUrl: './booking-cancel-modal.component.scss'
})
export class BookingCancelModalComponent {

  @Input() title: string;
  @Input() bookingRefNo: any = "";
  isShowOwnerDetails: any = false;
  isShowDriverDetails: any = false;
  bookingDetails: any = {
    bookingDetails: {},
    rentaldetails: {},
    personalDetails: {},
  };
  @Input() type: string;
  reason: any = "";
  reasons: any = [];
  cancellationForm: FormGroup;
  submitted: boolean = false;

  carRentCancellationReasons = [
    { id: 1, Name: 'Change in travel plans' },
    { id: 2, Name: 'Found a better deal elsewhere' },
    { id: 3, Name: 'Vehicle not available on required date' },
    { id: 4, Name: 'Vehicle type no longer needed' },
    { id: 5, Name: 'Booking made by mistake' },
    { id: 6, Name: 'Unsatisfactory customer service' },
    { id: 7, Name: 'Pickup/drop location not suitable' }
  ];


  driverRentCancellationReasons = [
    { id: 1, Name: 'Trip postponed or cancelled' },
    { id: 2, Name: 'Driver arrival delay' },
    { id: 3, Name: 'Preferred driver not assigned' },
    { id: 4, Name: 'Driver behavior concerns' },
    { id: 5, Name: 'Change in travel mode (self-drive, etc.)' },
    { id: 6, Name: 'Incorrect booking details entered' },
    { id: 7, Name: 'Health/emergency issues' }
  ];


  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public bf: FormBuilder,
    private toast: ToastService,
    public gs: GlobalService,
    private bookingService: BookingService,
  ) {
    this.cancellationForm = this.bf.group({
      // "userId": this.providerDetails.userId,
      "reason": [null, Validators.required],
      "remarks": ["", Validators.required],
    })
  }

  ngOnInit() {
    console.log("bookingDetails >>>>>", this.bookingDetails);
    this.GetBookingByBookingRefNo();
    if (this.type == "driver") {
      this.reasons = this.driverRentCancellationReasons;
    } else {
      this.reasons = this.carRentCancellationReasons;
    }
  }


  GetBookingByBookingRefNo() {
    console.log("bookingRefNo >>>>", this.bookingRefNo);

    this.bookingService.GetBookingByBookingRefNo({
      bookingRefNo: this.bookingRefNo,
      loginUserId: this.gs.loggedInUserInfo.userId,
    }).subscribe((response: any) => {
      if (response.response && response.response.statusCode == "200") {
        this.bookingDetails = response;
        if (!this.bookingDetails.isBooker && this.bookingDetails.bookingDetails?.riskType == 'Driver' || this.bookingDetails.isBooker && this.bookingDetails.bookingDetails?.riskType == 'Vehicle') {
          this.isShowOwnerDetails = true;
          this.bookingDetails.personalDetails = this.bookingDetails.vehicleOwnerPersonalDetails;
        }

        if (!this.bookingDetails.isBooker && this.bookingDetails.bookingDetails?.riskType == 'Vehicle' || this.bookingDetails.isBooker && this.bookingDetails.bookingDetails?.riskType == 'Driver') {
          this.isShowDriverDetails = true;
          this.bookingDetails.personalDetails = this.bookingDetails.driverPersonalDetails;
        }
      }
    })
  }

  get cancelFormControl(): any {
    return this.cancellationForm.controls;
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {
    this.submitted = true;
    if (this.cancellationForm.valid) {
      this.activeModal.close({ confirmed: true, reason: this.reason });
    } else {
      this.toast.errorToastr("Please fill the all required fields.")
    }
  }

}
