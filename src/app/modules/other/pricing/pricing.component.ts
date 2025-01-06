import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PricingService } from '../../../shared/services/pricing.service';
import { apiResultFormat } from '../../../shared/services/model/model';
import { GlobalService } from '../../../shared/services/global.service';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    CurrencySymbolPipe
  ],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {

  pricingList: any = [];
  obj: any = [];
  activeTab: any = "driver";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pricingS: PricingService,
    public gs: GlobalService,
  ) {
    this.getPricing();
  }

  getPricing() {
    this.pricingS.getPricing().subscribe((apiRes: any) => {
      this.obj = apiRes;
      this.pricingList = apiRes['driver_package'];
    });
  }

  changeType(type: any) {
    this.activeTab = type;
    if (this.activeTab === "driver") {
      this.pricingList = this.obj['driver_package'];
    }
    if (this.activeTab === "car_owner") {
      this.pricingList = this.obj['car_owner_package'];
    }
    if (this.activeTab === "fleet_owner") {
      this.pricingList = this.obj['fleet_owner_package'];
    }
  }

  subscribe(item: any) {
    this.router.navigate(['/pricing/package-subscribe', item.package_for, item.id]);
  }
}
