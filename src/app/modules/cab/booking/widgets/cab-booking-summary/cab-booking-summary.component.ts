import { Component } from '@angular/core';
import { CabService } from '../../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../../../shared/pipe/currency.pipe';

@Component({
  selector: 'app-cab-booking-summary',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CurrencySymbolPipe
  ],
  templateUrl: './cab-booking-summary.component.html',
  styleUrl: './cab-booking-summary.component.scss'
})
export class CabBookingSummaryComponent {

  public params: Params;
  public type: any = "";

  constructor(
    public cabService: CabService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.type = this.params['type'];
    })
  }

}
