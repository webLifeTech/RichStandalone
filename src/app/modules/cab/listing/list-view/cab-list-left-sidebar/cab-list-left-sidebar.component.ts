import { Component } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { CabSearchComponent } from '../../widgets/cab-search/cab-search.component';
import { FilterComponent } from '../../../../../shared/components/comman/filter/filter.component';
import { DetailsComponent } from '../../../../../shared/components/comman/details/details.component';
import { CabFilterComponent } from '../../../../../shared/components/comman/filter/cab-filter/cab-filter.component';
import { CabListDetailsComponent } from '../../../../../shared/components/comman/details/cab-list-details/cab-list-details.component';
import { CabService } from '../../../../../shared/services/cab.service';
import { GlobalService } from '../../../../../shared/services/global.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-cab-list-left-sidebar',
  standalone: true,
  imports: [
    CabSearchComponent,
    FilterComponent,
    DetailsComponent,
    CabListDetailsComponent,
    CabFilterComponent,

    CommonModule
  ],
  providers: [
    DatePipe,
  ],
  templateUrl: './cab-list-left-sidebar.component.html',
  styleUrl: './cab-list-left-sidebar.component.scss'
})
export class CabListLeftSidebarComponent {

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'cab_list.cab_search';
  public parent = 'menu.home';
  public child = 'cab_list.cab_search';

  public selectedTabValue: string;
  pageSize: number = 5;

  aggregateFilters: any = [];
  vehicleSearachResult: any = {
    vehicleMatches: [],
    ViewModel: {},
    aggregateFilters: {},
  };
  reLoadDetails: boolean = false;
  public params: Params;
  vehicleType: any = [];

  constructor(
    private route: ActivatedRoute,
    public cabService: CabService,
    private gs: GlobalService,
    private toast: ToastService,
    private datePipe: DatePipe,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      const searchInfo = this.gs.getLastSearch();
      if (Object.keys(this.params).length > 1) {
        this.searachVehicleResult(searchInfo, 'filter-search');
      } else {
        this.searachVehicleResult(searchInfo, 'main-search');
      }
    });
    document.documentElement.style.setProperty('--theme-color1', '233, 179, 14');
    document.documentElement.style.setProperty('--theme-color2', '233, 179, 14');
  }

  ngOnDestroy() {
    document.documentElement.style.removeProperty('--theme-color1');
    document.documentElement.style.removeProperty('--theme-color2');
  }

  async searachVehicleResult(obj: any, type: any) {

    console.log("obj >>>>>>", obj);
    let searchObj: any = {};
    if (!(obj && obj.searchObj)) {
      searchObj = obj;
    } else {
      searchObj = obj.searchObj;
    }

    let Body = {
      "SearchCriteria": {
        "PickUpLocation": searchObj.same_location,
        "PickUpTime": searchObj.pick_time ? this.datePipe.transform(searchObj.pick_time, 'MM/dd/yyyy') : null,
        "DropTime": searchObj.drop_time ? this.datePipe.transform(searchObj.drop_time, 'MM/dd/yyyy') : null,
        "RentType": searchObj.timeType || "Monthly",
        "PageNumber": this.params['page'] || 1,
        "Pagesize": this.pageSize
      },


      "FilterCriteria": {

        "carOwners": this.params['CAROWNERS'] ? JSON.stringify(this.params['CAROWNERS'].split(',')) : null,
        "location": this.params['LOCATION'] ? JSON.stringify(this.params['LOCATION'].split(',')) : null,
        "fleetCompany": this.params['FLEETCOMPANY'] ? JSON.stringify(this.params['FLEETCOMPANY'].split(',')) : null,
        "transmission": this.params['TRANSMISSION'] ? JSON.stringify(this.params['TRANSMISSION'].split(',')) : null,
        "fuelType": this.params['FUELTYPE'] ? JSON.stringify(this.params['FUELTYPE'].split(',')) : null,
        "seatingCapacity": this.params['SEATINGCAPACITY'] ? JSON.stringify([this.params['SEATINGCAPACITY']]) : null,
        "shift": this.params['SHIFTINFO'] ? JSON.stringify(this.params['SHIFTINFO'].split(',')) : null,
        "vehicleRating": this.params['VEHICLERATING'] ? JSON.stringify(this.params['VEHICLERATING'].split(',')) : null,
        "vehicleType": this.params['VEHICLETYPE'] ? JSON.stringify(this.params['VEHICLETYPE'].split(',')) : null,
      }
    }

    console.log("Body >>>>>", Body)
    // return;
    this.reLoadDetails = false;
    this.gs.isSpinnerShow = true;
    this.cabService.VehicleSearachResult(Body).subscribe((res: any) => {
      console.log("VehicleSearachResult >>>>>", res);
      console.log("vehicleMatches >>>>>", res.vehicleMatches);

      this.gs.isSpinnerShow = false;
      if (res && res.responseResultDtos && res.responseResultDtos.statusCode == "200") {
        if (!this.aggregateFilters.length || type == 'main-search') {
          console.log("yesssssssssssssss");
          const aggFilters = JSON.parse(res.aggregateFilters);
          this.aggregateFilters = Object.entries(aggFilters).map(([key, value]: any) => ({ ...value, key })).sort((a, b) => a.position - b.position);

          for (let af in this.aggregateFilters) {
            for (let fl in this.aggregateFilters[af].filterlist) {
              this.aggregateFilters[af].filterlist[fl].checkID = this.aggregateFilters[af].key + "_" + this.aggregateFilters[af].filterlist[fl].value.replaceAll(/\s/g, '')
            }
          }

          this.vehicleType = aggFilters['VEHICLETYPE'] ? aggFilters['VEHICLETYPE'].filterlist : [];
          console.log("this.aggregateFilters >>>>>", this.aggregateFilters);

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              ['CAROWNERS']: null,
              ['LOCATION']: null,
              ['FLEETCOMPANY']: null,
              ['TRANSMISSION']: null,
              ['FUELTYPE']: null,
              ['SEATINGCAPACITY']: null,
              ['SHIFTINFO']: null,
              ['VEHICLERATING']: null,
              ['VEHICLETYPE']: null,
            },
            queryParamsHandling: 'merge', // preserve the existing query params in the route
            skipLocationChange: false
          });

        }
        this.vehicleSearachResult = res;
      } else {
        this.vehicleSearachResult = {
          vehicleMatches: [],
          ViewModel: {},
        };
      }
      this.reLoadDetails = true;
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

}
