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
  @Input() bookingId: any = "";
  bookingDetails: any = {};

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
    private bookingService: BookingService,
  ) { }

  ngOnInit() {
    this.GetBookingByBookingId();
  }

  GetBookingByBookingId() {
    console.log("bookingId >>>>", this.bookingId);

    this.bookingService.GetBookingByBookingId({
      bookingId: this.bookingId
    }).subscribe((response: any) => {
      console.log("GetBookingByBookingId >>>>>", response);
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        this.bookingDetails = response;
      }
    })
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
