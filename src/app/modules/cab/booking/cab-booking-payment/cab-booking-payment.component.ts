import { Component } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CabSearchComponent } from '../../listing/widgets/cab-search/cab-search.component';
import { CabCardViewComponent } from '../../../../shared/components/comman/booking/cab-card-view/cab-card-view.component';
import { BookingComponent } from '../../../../shared/components/comman/booking/booking.component';
import { CabBookingSummaryComponent } from '../widgets/cab-booking-summary/cab-booking-summary.component';
import { CabPromoCodeComponent } from '../widgets/cab-promo-code/cab-promo-code.component';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';

@Component({
  selector: 'app-cab-booking-payment',
  standalone: true,
  imports: [
    CabSearchComponent,
    CabCardViewComponent,
    BookingComponent,
    CabBookingSummaryComponent,
    CabPromoCodeComponent,

    CommonModule,
    TranslateModule,
    CurrencySymbolPipe
  ],
  templateUrl: './cab-booking-payment.component.html',
  styleUrl: './cab-booking-payment.component.scss'
})
export class CabBookingPaymentComponent {

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'cab payment';
  public parent = 'Home';
  public child = 'cab payment';
  public itemId = '';
  public searchFrom = 'checkout';
  public params: Params;

  constructor(
    public cabService: CabService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.itemId = route.snapshot.params['id'];
    this.route.queryParams.subscribe((params) => {
      this.params = params;
    })
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    document.documentElement.style.setProperty('--theme-color1', '233, 179, 14');
    document.documentElement.style.setProperty('--theme-color2', '233, 179, 14');
  }

  ngOnDestroy() {
    document.documentElement.style.removeProperty('--theme-color1');
    document.documentElement.style.removeProperty('--theme-color2');
  }

  backToDeal() {
    this.router.navigate(['/cab/booking/booking', this.itemId], {
      // relativeTo: this.route,
      queryParams: this.params,
      queryParamsHandling: "merge"
    });
  }
}
