import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabService } from '../../../../../shared/services/cab.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { getCab } from '../../../../../shared/store/action/cab.action';
import { priceFilter } from '../../../../interface/cab';
import { getDriver } from '../../../../../shared/store/action/driver.action';
import { d_priceFilter } from '../../../../interface/driver';
import { CommonModule } from '@angular/common';
import { CabCarTypeComponent } from './cab-car-type/cab-car-type.component';
import { CabRatingComponent } from './cab-rating/cab-rating.component';
import { CabPriceComponent } from './cab-price/cab-price.component';
import { CabCapacityComponent } from './cab-capacity/cab-capacity.component';
import { CabOptionComponent } from './cab-option/cab-option.component';
import { DriverExperienceComponent } from './driver-experience/driver-experience.component';
import { TranslateModule } from '@ngx-translate/core';
import { CabOwnerComponent } from './cab-owner/cab-owner.component';
import { CabSuppliersComponent } from './cab-suppliers/cab-suppliers.component';
import { CabLocationComponent } from './cab-location/cab-location.component';
import { CabPricePerDayComponent } from './cab-price-per-day/cab-price-per-day.component';
import { CabSpecsComponent } from './cab-specs/cab-specs.component';
import { CabElectricComponent } from './cab-electric/cab-electric.component';
import { CabShiftComponent } from './cab-shift/cab-shift.component';
import { DynamicFilterComponent } from './dynamic-filter/dynamic-filter.component';

@Component({
  selector: 'app-cab-filter',
  standalone: true,
  imports: [
    CabCarTypeComponent,
    CabRatingComponent,
    CabPriceComponent,
    CabCapacityComponent,
    CabOptionComponent,
    DriverExperienceComponent,
    CabLocationComponent,
    CabPricePerDayComponent,
    CabSpecsComponent,
    CabElectricComponent,
    CabOwnerComponent,
    CabSuppliersComponent,
    CabShiftComponent,
    DynamicFilterComponent,

    CommonModule,
    TranslateModule,
  ],
  templateUrl: './cab-filter.component.html',
  styleUrl: './cab-filter.component.scss'
})
export class CabFilterComponent {

  @Input() aggregateFilters: any = {};
  @Input() cabHorizontal: boolean = false;
  @Input() shadowClass: boolean = false;
  @Output() searchEvent = new EventEmitter<any>();

  public isOpenCab: boolean = true;

  public type: string = "";
  public getCarLocationParams: string[] = [];
  public getCarTypeParams: string[] = [];
  public getOwnerTypeParams: string[] = [];
  public getCarSupplierParams: string[] = [];
  public getCarCapacityParams: string[] = [];
  public getRatingParams: string[] = [];
  public getCarOptionParams: string[] = [];
  public getDrivExpOptionParams: string[] = [];
  public minPrice: number;
  public maxPrice: number;
  public priceData: priceFilter;
  public paramsTag: string[];

  constructor(
    public cabService: CabService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.cabService.isOpenResponsiveFilter = false;

    this.route.queryParams.subscribe((params) => {
      this.type = params['type'] ? params['type'] : "car";
      this.getCarLocationParams = params['car_location'] ? params['car_location'].split(',') : [];
      this.getCarTypeParams = params['car_type'] ? params['car_type'].split(',') : [];
      this.getOwnerTypeParams = params['owner_type'] ? params['owner_type'].split(',') : [];
      this.getCarSupplierParams = params['car_sup'] ? params['car_sup'].split(',') : [];
      this.getCarCapacityParams = params['capacity'] ? params['capacity'].split(',') : [];
      this.getRatingParams = params['rating'] ? params['rating'].split(',') : [];
      this.getCarOptionParams = params['car_option'] ? params['car_option'].split(',') : [];
      this.getDrivExpOptionParams = params['experience'] ? params['experience'].split(',') : [];
      this.minPrice = params['minPrice'] ? params['minPrice'] : [];
      this.maxPrice = params['maxPrice'] ? params['maxPrice'] : [];
      this.priceData = {
        minPrice: this.minPrice,
        maxPrice: this.maxPrice
      }

      if (this.type === 'car') {
        this.paramsTag = [...this.getCarLocationParams, ...this.getCarTypeParams, ...this.getOwnerTypeParams, ...this.getCarSupplierParams, ...this.getCarCapacityParams, ...this.getRatingParams, ...this.getCarOptionParams];

        this.store.dispatch(new getCab(this.paramsTag, this.priceData));
      }
      if (this.type === 'driver') {
        this.paramsTag = [...this.getCarLocationParams, ...this.getRatingParams, ...this.getDrivExpOptionParams];

        this.store.dispatch(new getDriver(this.paramsTag, this.priceData));
      }

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
