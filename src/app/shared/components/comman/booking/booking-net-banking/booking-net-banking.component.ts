import { Component } from '@angular/core';
import { netBankingDetails } from '../../../data/data/booking';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-net-banking',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
  ],
  templateUrl: './booking-net-banking.component.html',
  styleUrls: ['./booking-net-banking.component.scss']
})
export class BookingNetBankingComponent {

  selectedMethod: any = "";
  public netBankingDetails = netBankingDetails;

  paymentOptions: any = [
    {
      "id": 1,
      "routing_number": "333333333333",
      "account_number": "8888888888",
      "bank_name": "SBI",
      "holder_name": "Paras",
      "last4": "8888",
      "type": "banking"
    }
  ];
}
