import { Component, EventEmitter, Input, Output } from '@angular/core';
import { walletDetails } from '../../../data/data/booking';
import { PaymentService } from '../../../../services/payment.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../services/toast.service';
import { GlobalService } from '../../../../services/global.service';

@Component({
  selector: 'app-booking-crypto',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule
  ],
  templateUrl: './booking-crypto.component.html',
  styleUrls: ['./booking-crypto.component.scss']
})
export class BookingCryptoComponent {

  @Input() coinList: any = [];
  @Output() onSelectCoin = new EventEmitter<any>();
  // public coinList: any = [];
  selectedCoin: any = null;
  constructor(
    private paymentService: PaymentService,
    private toast: ToastService,
    private gs: GlobalService,
  ) {

  }

  onChange(selectedCoin: any) {
    this.onSelectCoin.emit(selectedCoin);
  }


}
