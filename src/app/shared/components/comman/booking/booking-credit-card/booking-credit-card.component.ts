import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CardTypesComponent } from '../../card-types/card-types.component';

@Component({
  selector: 'app-booking-credit-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    CardTypesComponent,
  ],
  templateUrl: './booking-credit-card.component.html',
  styleUrls: ['./booking-credit-card.component.scss']
})
export class BookingCreditCardComponent {

  selectedMethod: any = "";

  paymentOptions: any = [
    {
      "id": 1,
      "holder_name": "Abcd",
      "card_name": "SBI Credit Card",
      "card_type": "visa",
      "type": "credit_card",
      "last4": "2245",
      "card_number": "875987342245",
      "cvv": "123",
      "expiry_date": "22/30",
      "status": true,
      "description": "Its Paras user",
    },
    // {
    //   "id": 2,
    //   "wallet_name": "Apple Pay",
    //   "wallet_type": "Wallet",
    //   "type": "wallet",
    //   "status": true,
    //   "description": "Its Lala user",
    // },
    {
      "id": 3,
      "holder_name": "Abcd",
      "card_name": "Axis Credit Card",
      "card_type": "mastercard",
      "type": "credit_card",
      "last4": "4332",
      "card_number": "875987344332",
      "cvv": "123",
      "expiry_date": "22/30",
      "status": true,
      "description": "Its Lala user",
    },
  ];

}
