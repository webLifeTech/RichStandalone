import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabService } from '../../../../../shared/services/cab.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { getCab } from '../../../../../shared/store/action/cab.action';
import { priceFilter } from '../../../../interface/cab';
import { getDriver } from '../../../../../shared/store/action/driver.action';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicFilterComponent } from './dynamic-filter/dynamic-filter.component';

@Component({
  selector: 'app-cab-filter',
  standalone: true,
  imports: [
    DynamicFilterComponent,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './cab-filter.component.html',
  styleUrl: './cab-filter.component.scss'
})
export class CabFilterComponent {

  @Input() aggregateFilters: any = {};
  @Output() searchEvent = new EventEmitter<any>();

  public isOpenCab: boolean = true;

  public type: string = "";
  public paramsTag: string[];
  windowWidth: number;

  constructor(
    public cabService: CabService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.cabService.isOpenResponsiveFilter = false;
    this.windowWidth = window.innerWidth;

    // if (this.windowWidth < 991) {
    //   this.cabHorizontal = true;
    // }

    this.route.queryParams.subscribe((params) => {
      this.type = params['type'] ? params['type'] : "car";
    })
  }

  openCab() {
    this.isOpenCab = !this.isOpenCab;
  }

  filterReset() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        car_location: null,
        car_type: null,
        capacity: null,
        rating: null,
        car_option: null,
        experience: null,
        price_per_day: null,
        car_spec: null,
        car_electric: null,
        km: null,
        fuel_policy: null,
        car_deposite: null,
        car_sup: null,
        minPrice: null,
        CAROWNERS: null,
        LOCATION: null,
        FLEETCOMPANY: null,
        TRANSMISSION: null,
        FUELTYPE: null,
        SEATINGCAPACITY: null,
        SHIFTINFO: null,
        VEHICLERATING: null,
        VEHICLETYPE: null,
        DRIVERRATING: null,
        EXPERIENCE: null,
      },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  closeResponsiveFilter() {
    this.cabService.isOpenResponsiveFilter = false;
  }

  closeResponsiveHorizontalFilter() {
    this.cabService.isOpenHorizontalFilter = false;
  }
}
