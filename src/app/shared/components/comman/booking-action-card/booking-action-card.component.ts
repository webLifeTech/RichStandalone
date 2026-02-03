import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GlobalService } from '../../../services/global.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-action-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    NgSelectModule,
    FormsModule
  ],
  templateUrl: './booking-action-card.component.html',
  styleUrls: ['./booking-action-card.component.scss']
})
export class BookingActionCardComponent implements OnChanges {
  @Input() bookingArray: any = []; // Backend se jo remarks aa rahe hain
  @Input() bookingDetails: any = {}; // Backend se jo remarks aa rahe hain
  userType: any = ''; // Current logged-in user
  selectedBooking: any = ''; // Current logged-in user

  @Output() actionTriggered = new EventEmitter<string>(); // Parent ko batane ke liye

  // UI State Variables
  uiState: any = {
    showCard: false,
    isAction: false, // True = Button dikhega, False = Sirf Info
    message: '',
    subMessage: '',
    btnText: '',
    btnAction: '', // Identifier like 'SIGN_DRIVER', 'PAY_NOW'
    icon: '',
    colorClass: '', // 'state-warning' | 'state-info' | 'state-success'
    isStart: true // 'state-warning' | 'state-info' | 'state-success'
  };

  constructor(
    private gs: GlobalService
  ) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bookingDetails'] || changes['bookingArray']) {
      const filtered = this.bookingArray.filter((i: any) => ["1", "2", "3", "4"].includes(i.bookingStatusCd))
      this.bookingArray = JSON.parse(JSON.stringify(filtered));

      if ((this.gs.loggedInUserInfo.role === 'user' || this.gs.loggedInUserInfo.role === 'user_4') && this.bookingDetails.isBooker) {
        this.userType = 'driver';
      } else {
        this.userType = 'owner';
      }

      if (this.bookingArray.length) {
        this.selectedBooking = this.bookingArray[0]?.bookingReferenceNumber || null;
        this.updateCardState();
      } else {
        this.uiState.showCard = false;
      }
    }
  }

  onChange(event: any): void {
    console.log('Selection changed:', event);
    this.bookingDetails = event;
    this.updateCardState();
    // You can perform further logic here,
    // e.g., update other parts of your application or validate the value.
  }

  updateCardState() {
    // String normalize kar rahe hain taaki case-sensitive issue na ho
    const status = this.bookingDetails.bookingStatusRemarks?.toLowerCase() || '';
    console.log("status >>>", status);

    this.uiState.showCard = false;

    // =========================================================
    // 1. DRIVER SIGNATURE
    // =========================================================
    if (this.bookingDetails.bookingStatusRemarksCd == '1') {
      this.uiState.showCard = true;
      if (this.userType === 'driver') {
        this.setUI(true, 'Action Required: Sign Agreement', 'Please sign the digital agreement to proceed.', 'Sign Document', 'SIGN', 'draw', 'state-warning', true);
      } else {
        this.setUI(false, 'Waiting for Driver Signature', 'Driver needs to sign the agreement first.', '', '', 'hourglass_empty', 'state-info', true);
      }
    }

    // =========================================================
    // 2. VEHICLE OWNER SIGNATURE // status.includes('Vehicle Owner Signature  Pending')
    // =========================================================
    else if (this.bookingDetails.bookingStatusRemarksCd == '2') {
      this.uiState.showCard = true;
      if (this.userType === 'owner') {
        this.setUI(true, 'Action Required: Sign Agreement', 'Driver has signed. Please sign to confirm.', 'Sign Document', 'SIGN', 'verified_user', 'state-warning', true);
      } else {
        this.setUI(false, 'Waiting for Owner Approval', 'We have notified the owner. Please wait.', '', '', 'hourglass_bottom', 'state-info', true);
      }
    }

    // =========================================================
    // 3. PAYMENT PENDING
    // =========================================================
    else if (this.bookingDetails.bookingStatusRemarksCd === '3') {
      this.uiState.showCard = true;
      if (this.userType === 'driver') {
        this.setUI(true, 'Payment Due', 'Please complete the payment to confirm booking.', 'Pay Now', 'MAKE_PAYMENT', 'credit_card', 'state-danger', true);
      } else {
        this.setUI(false, 'Waiting for Payment', 'Driver is processing the payment.', '', '', 'payments', 'state-info', true);
      }
    }

    // =========================================================
    // 3.5 PAYMENT COMPLETED (NEW ADDITION ✅)
    // =========================================================
    // Ye block missing tha. Ab driver ko 'Payment Successful' dikhega.
    else if (this.bookingDetails.bookingStatusRemarksCd == '4') {
      this.uiState.showCard = true;
      if (this.userType === 'driver') {
        // Driver wait karega car handover ka
        this.setUI(false, 'Payment Successful', 'Waiting for vehicle owner to handover the car.', '', '', 'check_circle', 'state-success', true);
      } else {
        // Owner ko action lena hai (Car Deliver karna)
        this.setUI(true, 'Action Required: Handover Car', 'Payment received. Please deliver car to driver.', 'Delivered', 'CONFIRM_HANDOVER', 'key', 'state-warning', true);
      }
    }

    // =========================================================
    // 4. INSPECTION (PICKUP)
    // =========================================================
    else if (this.bookingDetails.bookingStatusRemarksCd == '5') {
      this.uiState.showCard = true;
      if (this.userType === 'driver') {
        this.setUI(true, 'Vehicle Inspection Pending', 'Owner has delivered the car. Please inspect to start trip.', 'Accept', 'INSPECT_PICKUP', 'directions_car', 'state-warning', true);
      } else {
        this.setUI(false, 'Pickup Inspection in Progress', 'Driver is inspecting your vehicle for pickup.', '', '', 'manage_search', 'state-info', true);
      }
    }

    // =========================================================
    // 5. TRIP STARTED
    // =========================================================
    else if (this.bookingDetails.bookingStatusRemarksCd == '6') {
      this.uiState.showCard = true;
      if (this.userType === 'driver') {
        this.setUI(true, 'Trip in Progress', 'Drive safely. Click below when you return the car.', 'Return & End Trip', 'INITIATE_RETURN', 'commute', 'state-info', true);
      } else {
        this.setUI(false, 'Car Picked Up By Driver and Trip Started', 'Your vehicle is currently on a trip.', '', '', 'emoji_transportation', 'state-success', true);
      }
    }

    // =========================================================
    // 6. RETURN PROCESS
    // =========================================================
    else if (this.bookingDetails.bookingStatusRemarksCd == '12') {
      this.uiState.showCard = true;
      if (this.userType === 'owner') {
        this.setUI(true, 'Action Required: Verify Return', 'Driver returned the car. Please inspect and confirm receipt.', 'Received', 'INSPECT_RETURN', 'assignment_return', 'state-warning', true);
      } else {
        this.setUI(false, 'Waiting for Owner Confirmation', 'Owner is inspecting the vehicle to close the booking.', '', '', 'fact_check', 'state-info', true);
      }
    }

    // =========================================================
    // 7. COMPLETED
    // =========================================================
    else if (this.bookingDetails.bookingStatusRemarksCd == '9') {
      this.uiState.showCard = true;
      this.setUI(false, 'Booking Completed', 'This trip has been successfully completed.', '', '', 'verified', 'state-success', false);
    }
  }

  // Helper to set state easily
  setUI(isAction: boolean, msg: string, subMsg: string, btnText: string, btnAction: string, icon: string, colorClass: string, isStart: boolean) {
    this.uiState = { showCard: true, isAction, message: msg, subMessage: subMsg, btnText, btnAction, icon, colorClass, isStart };
  }

  // Button Click Handler
  onButtonClick() {
    this.actionTriggered.emit(this.uiState.btnAction);
  }
}
