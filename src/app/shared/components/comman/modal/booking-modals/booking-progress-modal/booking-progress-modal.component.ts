import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../services/global.service';
import { CurrencySymbolPipe } from '../../../../../pipe/currency.pipe';
import { BookingService } from '../../../../../services/booking.service';
import { ToastService } from '../../../../../services/toast.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-booking-progress-modal',
  standalone: true,
  imports: [
    CommonModule,
    CurrencySymbolPipe,
    MatIconModule
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './booking-progress-modal.component.html',
  styleUrl: './booking-progress-modal.component.scss'
})
export class BookingProgressModalComponent {
  @Input() bookingRefNo: any = "";
  @Input() bookingId: any = "";
  bookingDetails: any = {
    bookingDetails: {},
    rentaldetails: {},
    personalDetails: {},
    driverPersonalDetails: {},
    vehicleOwnerPersonalDetails: {},
    cancellationRefundDetails: {},
  };
  timelineEvents: any = []

  icons: any = {
    0: 'event_available',
    1: 'draw',
    2: 'draw',
    3: 'payments',
    4: 'check_circle',
    5: 'directions_car',
    6: 'commute',
    11: 'credit_card_off',
    12: 'assignment_return',
    9: 'verified',
  }
  colors: any = {
    0: 'success',
    1: 'warning',
    2: 'info',
    4: 'warning',
    5: 'danger',
    6: 'success',
  }


  config: any = {
    "22": {
      "color": "success",
      "statusColor": "danger",
      "icon": "verified"
    },
    "21": {
      "color": "warning",
      "statusColor": "danger",
      "icon": "verified"
    },
    "19": {
      "color": "danger",
      "statusColor": "danger",
      "icon": "cancel"
    },
    "18": {
      "color": "danger",
      "statusColor": "danger",
      "icon": "cancel"
    },
    "17": {
      "color": "danger",
      "statusColor": "danger",
      "icon": "cancel"
    },
    "16": {
      "color": "danger",
      "statusColor": "danger",
      "icon": "cancel"
    },
    "15": {
      "color": "success",
      "statusColor": "success",
      "icon": "verified"
    },
    "14": {
      "color": "success",
      "statusColor": "success",
      "icon": "verified"
    },
    "13": {
      "color": "warning",
      "statusColor": "warning",
      "icon": "car_crash"
    },
    "12": {
      "color": "success",
      "statusColor": "warning",
      "icon": "assignment_return"
    },
    "11": {
      "color": "success",
      "statusColor": "warning",
      "icon": "emoji_transportation"
    },
    "10": {
      "color": "success",
      "statusColor": "warning",
      "icon": "commute"
    },
    "9": {
      "color": "success",
      "statusColor": "warning",
      "icon": "edit_document"
    },
    "8": {
      "color": "warning",
      "statusColor": "warning",
      "icon": "directions_car"
    },
    "2": {
      "color": "info",
      "statusColor": "info",
      "icon": "credit_score"
    },
    "7": {
      "color": "warning",
      "statusColor": "warning",
      "icon": "payments"
    },
    "6": {
      "color": "success",
      "statusColor": "warning",
      "icon": "draw"
    },
    "5": {
      "color": "warning",
      "statusColor": "warning",
      "icon": "border_color"
    },
    "4": {
      "color": "success",
      "statusColor": "warning",
      "icon": "draw"
    },
    "3": {
      "color": "warning",
      "statusColor": "warning",
      "icon": "border_color"
    },
    "1": {
      "color": "success",
      "statusColor": "warning",
      "icon": "add_shopping_cart"
    }
  }

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
    private bookingService: BookingService,
    private toast: ToastService,
  ) { }

  ngOnInit() {
    this.GetBookingByBookingRefNo();
    this.checkUpdate();
  }

  checkUpdate() {
    this.GetTrackBookingDetails();
  }

  GetBookingByBookingRefNo() {
    this.gs.isSpinnerShow = true;
    this.bookingService.GetBookingByBookingRefNo({
      bookingRefNo: this.bookingRefNo,
      loginUserId: this.gs.loggedInUserInfo.userId,
    }).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response.response && response.response.statusCode == "200") {
        this.bookingDetails = response;
      }
    })
  }

  GetTrackBookingDetails() {
    const body = {
      bookingId: this.bookingId,
      bookingReferenceNumber: this.bookingRefNo,
    };

    this.gs.isSpinnerShow = true;
    this.bookingService.TrackBookingDetails(body).subscribe((response: any) => {
      if (this.bookingDetails.bookingDetails && this.bookingDetails.bookingDetails.bookingReferenceNumber) {
        this.gs.isSpinnerShow = false;
      }
      this.timelineEvents = response ? JSON.parse(response) : [];
      console.log("this.timelineEvents >>>>>", this.timelineEvents);
      if (this.timelineEvents.length) {
        for (let i in this.timelineEvents) {
          this.timelineEvents[i].color = this.config[this.timelineEvents[i].eventType].color;
          this.timelineEvents[i].icon = this.config[this.timelineEvents[i].eventType].icon;
          this.timelineEvents[i].statusColor = this.config[this.timelineEvents[i].eventType].statusColor;
          // this.timelineEvents[i].color = this.colors[this.timelineEvents[i].bookingStatusCd];
          // this.timelineEvents[i].icon = this.icons[this.timelineEvents[i].bookingStatusRemarksCd];
          // if (this.timelineEvents[i].bookingStatusCd === 5) {
          //   this.timelineEvents[i].icon = 'cancel';
          // }
          // if (this.timelineEvents[i].bookingStatusRemarksCd === 11) {
          //   this.timelineEvents[i].color = 'danger';
          // }
        }
      }
    }, (error) => {
      this.toast.errorToastr(error.error.Message);
      this.gs.isSpinnerShow = false;
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
