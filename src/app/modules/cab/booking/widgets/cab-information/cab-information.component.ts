import { Component, Input } from '@angular/core';
import { CabService } from '../../../../../shared/services/cab.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../../../../shared/services/global.service';
import { CurrencySymbolPipe } from '../../../../../shared/pipe/currency.pipe';

@Component({
  selector: 'app-cab-information',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    CurrencySymbolPipe,
  ],
  templateUrl: './cab-information.component.html',
  styleUrl: './cab-information.component.scss'
})
export class CabInformationComponent {
  @Input() singleItem: any = {};
  refundPolicy: any = [
    {
      "time_of_cancellation": "Before 48 Hours",
      "cancellation_charges": "85%",
      "cancellation_type": "Percentage",
      "refund_amount": "850",
    },
    {
      "time_of_cancellation": "Before 24 Hours",
      "cancellation_charges": "70%",
      "cancellation_type": "Percentage",
      "refund_amount": "700",
    },
    {
      "time_of_cancellation": "Before 12 Hours",
      "cancellation_charges": "100",
      "cancellation_type": "Fixed",
      "refund_amount": "100",
    },
  ];
  constructor(
    public cabService: CabService,
    public gs: GlobalService,
  ) { }

}
