import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { id } from 'date-fns/locale';
import { GlobalService } from '../../../../../shared/services/global.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { CabService } from '../../../../../shared/services/cab.service';
import { ProfileService } from '../../../../../shared/services/profile.service';

@Component({
  selector: 'app-cab-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgSelectModule,
  ],
  providers: [DatePipe],
  templateUrl: './cab-search.component.html',
  styleUrl: './cab-search.component.scss'
})
export class CabSearchComponent {

  @Input() searchFrom: any;
  @Output() searchEvent = new EventEmitter<any>();
  public params: Params;

  public isSearchVisible: boolean = true; // need to do
  public isShow: boolean = false;
  searchInfo: any = {}
  searchObj: any = {
    pick_up_location: "",
    drop_location: "",
    same_location: "",
    pick_time: "",
    drop_time: "",
    type: "",
    timeType: "Daily",
    location_type: "option2",
  };

  windowWidth: number;
  windowHeight: number;
  locationArray: any = [];
  rentTypeList: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public gs: GlobalService,
    public cabService: CabService,
    private profileService: ProfileService,
    private datePipe: DatePipe,
  ) {
    this.searchInfo = this.gs.getLastSearch();
    if (this.searchInfo.location_type) {
      this.searchObj = this.searchInfo;
    }

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.searchObj.type = params['type'] ? params['type'] : this.gs.loggedInUserInfo.role === 'user' ? "car" : "driver";

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { type: this.searchObj.type },
        queryParamsHandling: 'merge', // preserve the existing query params in the route
        skipLocationChange: false  // do trigger navigation
      });

    })
    this.getRentType();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  openSearchBox() {
    this.isShow = true;
    this.isSearchVisible = true;
  }

  closeSearchBox() {
    this.isShow = false;
    this.isSearchVisible = false;
  }

  sameLocation(event: Event) {
    this.searchObj.location_type = (event.target as HTMLInputElement).value;
  }

  serachCarDetails() {
    // if (this.windowWidth > 991) {
    //   this.isSearchVisible = false;
    // }
    localStorage.setItem('lastSearch', JSON.stringify(this.searchObj));
    this.locationArray = [];
    this.searchEvent.emit({ searchObj: this.searchObj });
    // this.closeSearchBox();
  }

  resetFilter() {
    this.searchObj = {
      pick_up_location: "",
      drop_location: "",
      same_location: "",
      pick_time: "",
      drop_time: "",
      type: this.params['type'] ? this.params['type'] : "car",
      timeType: "ALL",
      location_type: "option2",
    };
    this.serachCarDetails();
  }

  applyFilter(event: Event) {
    this.searchObj.type = ((event.target as HTMLInputElement).value);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: this.searchObj.type ? this.searchObj.type : "car" },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
  }

  onSearchLocation() {
    if (this.searchObj.same_location.length < 2) {
      this.locationArray = [];
      return;
    }
    let body = {
      "location": this.searchObj.same_location,
      "risktype": 'vehicle'
    }
    this.gs.isSpinnerShow = true;
    this.cabService.GetLocations(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.getLocations && response.getLocations.length) {
        this.locationArray = response.getLocations;
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
  }

  selectLocation(location: string) {
    this.searchObj.same_location = location;
    this.locationArray = []; // Hide dropdown after selection
  }

  // Get All Dropdwon List
  getRentType() {
    let todayDate = new Date();
    const effectiveDate = this.transformDate(todayDate, 'MM/dd/yy');

    let body = {
      "stateCode": "0",
      "typeCode": 28,
      "effectiveDate": effectiveDate,
    }
    this.profileService.getMasterVehicleCodes(body).subscribe((res: any) => {
      if (res && res.length) {
        this.rentTypeList = this.gs.groupByMasterDropdown(res, 'TypeCode');
      } else {
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  onChangeRent() {
    this.searchObj.pick_time = null;
    this.searchObj.drop_time = null;
  }

  dropTimeFilter = (date: Date | null): boolean => {
    if (!date || !this.searchObj.pick_time) return false;

    const pickTime = new Date(this.searchObj.pick_time);

    switch (this.searchObj.timeType) {
      case 'Daily':
        return true; // Allow all dates

      case 'Weekly':
        // Allow same weekday in the upcoming weeks (e.g., if pickup is Monday, allow all future Mondays)
        return date.getDay() === pickTime.getDay() && date > pickTime;

      case 'Monthly':
        // Allow same day-of-month in future months (e.g., 5th of each month)
        return date.getDate() === pickTime.getDate() && date > pickTime;

      case 'Yearly':
        // Allow same month and day in future years (e.g., March 15 each year)
        return (
          date.getDate() === pickTime.getDate() &&
          date.getMonth() === pickTime.getMonth() &&
          date > pickTime
        );

      default:
        return true;
    }
  };
}
