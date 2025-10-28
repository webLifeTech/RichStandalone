import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalService } from '../../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { CabService } from '../../../../shared/services/cab.service';
import { ProfileService } from '../../../../shared/services/profile.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-cab-classic-home-section',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule,
    NgSelectModule,
  ],
  providers: [DatePipe],
  templateUrl: './cab-classic-home-section.component.html',
  styleUrls: ['./cab-classic-home-section.component.scss']
})
export class CabClassicHomeSectionComponent {

  // public location_type string = 'option2';

  public searchInfo: any = {};
  public searchObj: any = {
    pick_up_location: "",
    drop_location: "",
    same_location: "",
    pick_time: "",
    drop_time: "",
    type: "",
    timeType: "Daily",
    location_type: "option2",
    searchFrom: "home",
  };

  public params: Params | any;
  locationArray: any = [];
  rentTypeList: any = [];
  todayDate = new Date();

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public gs: GlobalService,
    public cabService: CabService,
    private datePipe: DatePipe,
    private profileService: ProfileService,
    private toast: ToastService,
  ) {
    // use for continue seearch
    // this.searchInfo = this.gs.getLastSearch();
    // if (this.searchInfo.location_type) {
    //   this.searchObj = this.searchInfo;
    // }
    this.getRentType();
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

  onSearchLocation() {
    console.log("this.searchObj.pick_up_location >>>>>", this.searchObj.same_location.length);

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
      if (response.response && response.response.statusCode == "200") {
        this.locationArray = response.gridList;
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
    // this.searchObj.location_type = (event.target as HTMLInputElement).value;
  }

  selectLocation(location: string) {
    this.searchObj.same_location = location;
    this.locationArray = []; // Hide dropdown after selection
  }

  sameLocation(event: Event) {
    this.searchObj.location_type = (event.target as HTMLInputElement).value;
  }

  onChangeType() {
  }

  findToSearch() {
    if (!this.searchObj.same_location) {
      this.toast.errorToastr("Please enter location");
      return;
    }
    if (!this.searchObj.timeType) {
      this.toast.errorToastr("Please enter type");
      return;
    }
    if (!this.searchObj.pick_time) {
      this.toast.errorToastr("Please enter pick up time");
      return;
    }
    if (!this.searchObj.drop_time) {
      this.toast.errorToastr("Please enter drop time");
      return;
    }
    if (!this.searchObj.type) {
      this.toast.errorToastr("Please enter rental type");
      return;
    }

    // localStorage.setItem('lastSearch', JSON.stringify(this.searchObj));
    this.gs.lastSearch = this.searchObj;
    this.router.navigate(['/cab/listing/list-view'], {
      queryParams: {
        type: this.searchObj.type || null,
      },
    });
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
