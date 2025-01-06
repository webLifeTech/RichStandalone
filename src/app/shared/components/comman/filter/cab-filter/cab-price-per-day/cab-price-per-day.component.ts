import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { pricePeDday } from '../../../../../../shared/components/data/data/filter/cab';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cab-price-per-day',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './cab-price-per-day.component.html',
  styleUrl: './cab-price-per-day.component.scss'
})
export class CabPricePerDayComponent {
  public caPPDs = pricePeDday;

  public isOpenPPD: boolean = true;
  public selectedCaPPD: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.selectedCaPPD = params['price_per_day'] ? params['price_per_day'].split(",") : []
    })
  }

  applyFilter(event: Event) {
    const index = this.selectedCaPPD.indexOf((event.target as HTMLInputElement).value);  // checked and unchecked value

    if ((event.target as HTMLInputElement).checked) {
      this.selectedCaPPD.push((event.target as HTMLInputElement).value)
    } else {
      this.selectedCaPPD.splice(index, 1)
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { price_per_day: this.selectedCaPPD.length ? this.selectedCaPPD.join(",") : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedCaPPD?.includes(item)) {
      return true;
    }
    return false;
  }

  openPPD() {
    this.isOpenPPD = !this.isOpenPPD;
  }
}
