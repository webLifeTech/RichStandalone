import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../services/global.service';
import { CurrencySymbolPipe } from '../../../../../pipe/currency.pipe';
import { BookingService } from '../../../../../services/booking.service';

@Component({
  selector: 'app-booking-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    CurrencySymbolPipe
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './booking-details-modal.component.html',
  styleUrl: './booking-details-modal.component.scss'
})
export class BookingDetailsModalComponent {
  @Input() bookingRefNo: any = "";
  isShowOwnerDetails: any = false;
  isShowDriverDetails: any = false;
  bookingDetails: any = {
    bookingDetails: {},
    rentaldetails: {},
    personalDetails: {},
  };

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
    private bookingService: BookingService,
  ) { }

  ngOnInit() {
    this.GetBookingByBookingRefNo();
  }

  GetBookingByBookingRefNo() {
    console.log("bookingRefNo >>>>", this.bookingRefNo);

    this.bookingService.GetBookingByBookingRefNo({
      bookingRefNo: this.bookingRefNo,
      loginUserId: this.gs.loggedInUserInfo.userId,
    }).subscribe((response: any) => {
      console.log("GetBookingByBookingRefNo >>>>>", response);
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
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

  closeModal() {
    this.modalService.dismissAll();
  }

}
