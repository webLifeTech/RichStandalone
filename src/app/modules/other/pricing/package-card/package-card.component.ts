import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';
import { CabPromoCodeComponent } from '../../../cab/booking/widgets/cab-promo-code/cab-promo-code.component';
import { BookingCreditCardComponent } from '../../../../shared/components/comman/booking/booking-credit-card/booking-credit-card.component';
import { BookingMyWalletComponent } from '../../../../shared/components/comman/booking/booking-my-wallet/booking-my-wallet.component';
import { BookingNetBankingComponent } from '../../../../shared/components/comman/booking/booking-net-banking/booking-net-banking.component';
import { cabDetails } from '../../../../shared/interface/cab';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../shared/services/global.service';
import { PricingService } from '../../../../shared/services/pricing.service';

@Component({
  selector: 'app-package-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    CurrencySymbolPipe
  ],
  templateUrl: './package-card.component.html',
  styleUrl: './package-card.component.scss'
})
export class PackageCardComponent {
  @Input() item: any = {};
  @Input() currentPlan: any = {};
  @Output() onSubscribe = new EventEmitter<any>();
  params: any = {};

  constructor(
    public cabService: CabService,
    public gs: GlobalService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
    })
  }

  ngOnInit() {

  }

  subscribe(item: any, payckageStatus: any) {
    this.onSubscribe.emit({ item: item, payckageStatus: payckageStatus })

  }
}
