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

@Component({
  selector: 'app-booking-cancellation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    CurrencySymbolPipe,
  ],
  providers: [DatePipe],
  templateUrl: './booking-cancellation.component.html',
  styleUrl: './booking-cancellation.component.scss'
})
export class BookingCancellationComponent {

  @Input() title: string;
  @Input() singleBookingDetail: any = {};
  @Output() onCancel = new EventEmitter<any>();

  cancellationInfo: any = {};
  reason: any = "";
  reasons: any = [];
  cancellationForm: FormGroup;
  submitted: boolean = false;
  isBookingCancelled: boolean = false;

  // carRentCancellationReasons = [
  //   { id: 1, Name: 'Change in travel plans' },
  //   { id: 2, Name: 'Found a better deal elsewhere' },
  //   { id: 3, Name: 'Vehicle not available on required date' },
  //   { id: 4, Name: 'Vehicle type no longer needed' },
  //   { id: 5, Name: 'Booking made by mistake' },
  //   { id: 6, Name: 'Unsatisfactory customer service' },
  //   { id: 7, Name: 'Pickup/drop location not suitable' }
  // ];


  // driverRentCancellationReasons = [
  //   { id: 1, Name: 'Trip postponed or cancelled' },
  //   { id: 2, Name: 'Driver arrival delay' },
  //   { id: 3, Name: 'Preferred driver not assigned' },
  //   { id: 4, Name: 'Driver behavior concerns' },
  //   { id: 5, Name: 'Change in travel mode (self-drive, etc.)' },
  //   { id: 6, Name: 'Incorrect booking details entered' },
  //   { id: 7, Name: 'Health/emergency issues' }
  // ];


  constructor(
    // private modalService: NgbModal,
    // public activeModal: NgbActiveModal,
    public bf: FormBuilder,
    private toast: ToastService,
    public gs: GlobalService,
    private bookingService: BookingService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    this.cancellationForm = this.bf.group({
      // "userId": this.providerDetails.userId,
      "reason": [null, Validators.required],
      "remarks": ["", Validators.required],
    })
  }

  ngOnInit() {
    console.log("singleBookingDetail >>>>>", this.singleBookingDetail);
    this.GetMasterBookingCancellationReasons();
    if (this.singleBookingDetail.riskType == "Vehicle") {
      this.GetCarBookingCancellationInfo();
    }
    if (this.singleBookingDetail.riskType == "Driver") {
      this.GetDriverBookingCancellationInfo();
    }
    // this.GetBookingByBookingRefNo();
    // if (this.type == "driver") {
    //   this.reasons = this.driverRentCancellationReasons;
    // } else {
    //   this.reasons = this.carRentCancellationReasons;
    // }
  }


  GetCarBookingCancellationInfo() {
    this.gs.isSpinnerShow = true;
    const todayDate = this.transformDate(new Date(), 'MM/dd/yy');
    this.bookingService.GetCarBookingCancellationInfo({
      bookingId: this.singleBookingDetail.bookingId,
      cancelDate: todayDate,
    }).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("GetCarBookingCancellationInfo >>>>>", response);
      if (response && response.responseResult && response.responseResult.statusCode == "200") {
        this.cancellationInfo = response;
      }
    })
  }

  GetDriverBookingCancellationInfo() {
    this.gs.isSpinnerShow = true;
    const todayDate = this.transformDate(new Date(), 'MM/dd/yy');
    this.bookingService.GetDriverBookingCancellationInfo({
      bookingId: this.singleBookingDetail.bookingId,
      cancelDate: todayDate,
    }).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("GetDriverBookingCancellationInfo >>>>>", response);
      if (response && response.responseResult && response.responseResult.statusCode == "200") {
        this.cancellationInfo = response;
      }
    })
  }

  GetMasterBookingCancellationReasons() {
    this.gs.isSpinnerShow = true;
    this.bookingService.GetMasterBookingCancellationReasons({
      riskType: this.singleBookingDetail.riskType,
    }).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("GetMasterBookingCancellationReasons >>>>>", response);
      this.reasons = response;
    })
  }

  // GetBookingByBookingRefNo() {
  //   this.gs.isSpinnerShow = true;
  //   this.bookingService.GetBookingByBookingRefNo({
  //     bookingRefNo: this.bookingRefNo,
  //     loginUserId: this.gs.loggedInUserInfo.userId,
  //   }).subscribe((response: any) => {
  //     this.gs.isSpinnerShow = false;
  //     console.log("GetBookingByBookingRefNo >>>>>", response);
  //     if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
  //       this.bookingDetails = response;
  //       this.GetMasterBookingCancellationReasons();
  //     }
  //   })
  // }



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
            "userId": this.gs.loggedInUserInfo.userId, // "c5c9b193-64ec-46ae-b1a1-f646bc1e0933" // this.gs.loggedInUserInfo.userId
            "bookingRefNo": this.singleBookingDetail.bookingReferenceNumber,
            "cancellationReason": this.cancellationForm.value.reason || null,
          }
          this.gs.isSpinnerShow = true;
          this.bookingService.BookingCancellationRequest(body).subscribe((res: any) => {
            console.log("BookingCancellationRequest >>>>>", res);
            this.gs.isSpinnerShow = false;
            if (res && res.statusCode == "200") {
              this.toast.successToastr(res.message);
              this.back();
            } else {
              this.toast.errorToastr(res.message);
            }
          });
          //     this.isBookingCancelled = true;
          // this.toast.successToastr("Booking Cancelled Successfully")
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
