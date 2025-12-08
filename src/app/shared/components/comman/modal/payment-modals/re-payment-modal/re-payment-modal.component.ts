import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { WalletService } from '../../../../../services/wallet.service';
import { GlobalService } from '../../../../../services/global.service';
import { OnlynumberDirective } from '../../../../../directives/number-only.directive';
import { BookingComponent } from '../../../booking/booking.component';
import { PaymentService } from '../../../../../../shared/services/payment.service';
import { ToastService } from '../../../../../../shared/services/toast.service';

@Component({
  selector: 'app-re-payment-modal',
  standalone: true,
  imports: [
    TranslateModule,
    NgbModule,
    CommonModule,
    FormsModule,
    BookingComponent,
    OnlynumberDirective
  ],
  templateUrl: './re-payment-modal.component.html',
  styleUrl: './re-payment-modal.component.scss'
})
export class RePaymentModalComponent {

  @Input() singleItem: any = {};

  reason: any = "";
  type: any = "CreditCard";
  amount: any;
  coinList: any = [];
  paymentOptions: any = [];
  firstPayOpt: any = {};
  selectedCoin = "";

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public gs: GlobalService,
    public walletService: WalletService,
    private toast: ToastService,
    private paymentService: PaymentService,
  ) {
  }

  ngOnInit() {
    console.log("singleItem >>>", this.singleItem);

  }
  closeModal() {
    this.modalService.dismissAll();
  }

  makePayment(event: any) {
    console.log("event >>>>>", event);
    // this.singleItem.totalAmount
    // BookingPaymentRequest: event

    const body: any = {
      "bookingId": this.singleItem.bookingId,
      "userId": this.gs.loggedInUserInfo.userId,
      "BookingPaymentRequest": event,
      "bookingRefNumber": this.singleItem.bookingReferenceNumber,
      "totalAmount": this.singleItem.totalAmount,
      "remarks": "Repayment of ref : " + this.singleItem.bookingReferenceNumber
    }

    console.log("body >>>>>>", body);

    // return;
    this.gs.isSpinnerShow = true;
    this.paymentService.RePaymentConfirmBooking(body).subscribe((response: any) => {
      console.log("RePaymentConfirmBooking >>>>", response);

      this.gs.isSpinnerShow = false;
      if (response && response.statusCode == "200") {
        this.toast.successToastr(response.message);
        this.activeModal.close({ confirmed: true });
      } else {
        this.toast.errorToastr(response.message);
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
      this.toast.errorToastr(err.error.message);
    })

  }

  change(details: any, type: any) {
    this.type = type;
    for (let i in this.paymentOptions) {
      this.paymentOptions[i].checked = false;
    }
    details.checked = true;
  }

}
