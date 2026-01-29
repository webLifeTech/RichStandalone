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
import { ToastService } from '../../../../../shared/services/toast.service';
import { MatTabsModule } from '@angular/material/tabs';

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
    MatTabsModule,
  ],
  providers: [DatePipe],
  templateUrl: './cab-search.component.html',
  styleUrl: './cab-search.component.scss'
})
export class CabSearchComponent {

  @Input() searchFrom: any;
  @Input() searchObj: any = {};
  @Output() searchEvent = new EventEmitter<any>();
  public params: Params;

  public isSearchVisible: boolean = true; // need to do
  public isShow: boolean = false;
  searchInfo: any = {}
  // searchObj: any = {
  //   pick_up_location: "",
  //   drop_location: "",
  //   same_location: "",
  //   pick_time: "",
  //   drop_time: "",
  //   type: "",
  //   timeType: "Daily",
  //   location_type: "option2",
  // };

  windowWidth: number;
  windowHeight: number;
  locationArray: any = [];
  rentTypeList: any = [];
  todayDate = new Date();
  minStartDate = new Date(Date.now() - 86400000); // yesterday
  isDriverHireSearch: boolean = false;
  activeTab: any = 'tab1';

  tabs = [
    {
      title: "One Way",
      value: "tab1",
      Code: "one_way",
      icon: "feather icon-arrow-right-circle"
    },
    {
      title: "Round Trip",
      value: "tab2",
      Code: "round_trip",
      icon: "feather icon-refresh-cw"
    },
    {
      title: "Outstation",
      value: "tab3",
      Code: "outstation",
      icon: "feather icon-navigation"
    }
  ]

  timeTypeList: any = [
    {
      "ID": "224",
      "StateCode": 0,
      "Code": "Now",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Now",
      "Description": "Now",
      "IsActive": true
    },
    {
      "ID": "225",
      "StateCode": 0,
      "Code": "Schedule for later",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Schedule for later",
      "Description": "Schedule for later",
      "IsActive": true
    }
  ];

  carTypeList: any = [
    {
      "ID": "224",
      "StateCode": 0,
      "Code": "Manual", // Manual, Automatic
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Manual",
      "Description": "Manual",
      "IsActive": true
    },
    {
      "ID": "225",
      "StateCode": 0,
      "Code": "Automatic",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Automatic",
      "Description": "Automatic",
      "IsActive": true
    }
  ];

  carCatTypeList: any = [
    {
      "ID": "224",
      "StateCode": 0,
      "Code": "Hatchback",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Hatchback",
      "Description": "Hatchback",
      "IsActive": true
    },
    {
      "ID": "225",
      "StateCode": 0,
      "Code": "Sedan",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Sedan",
      "Description": "Sedan",
      "IsActive": true
    },
    {
      "ID": "226",
      "StateCode": 0,
      "Code": "SUV",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "SUV",
      "Description": "SUV",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "Luxury",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Luxury",
      "Description": "Luxury",
      "IsActive": true
    }
  ];

  packageList: any = [
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "2 Hours",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "2 Hours",
      "Description": "2 Hours",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "4 Hours",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "4 Hours",
      "Description": "4 Hours",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "6 Hours",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "6 Hours",
      "Description": "6 Hours",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "8 Hours",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "8 Hours",
      "Description": "8 Hours",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "12 Hours",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "12 Hours",
      "Description": "12 Hours",
      "IsActive": true
    }
  ]

  tripTypeList: any = [
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "Round Trip",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Round Trip",
      "Description": "Round Trip",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "One Way Trip",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "One Way Trip",
      "Description": "One Way Trip",
      "IsActive": true
    },
  ]

  usageList: any = [
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "12 Hrs",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "12 Hrs",
      "Description": "12 Hrs",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "16 Hrs",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "16 Hrs",
      "Description": "16 Hrs",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "20 Hrs",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "20 Hrs",
      "Description": "20 Hrs",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "1 Day",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "1 Day",
      "Description": "1 Day",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "2 Days",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "2 Days",
      "Description": "2 Days",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "3 Days",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "3 Days",
      "Description": "3 Days",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "4 Days",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "4 Days",
      "Description": "4 Days",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "5 Days",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "5 Days",
      "Description": "5 Days",
      "IsActive": true
    },
  ]
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public gs: GlobalService,
    public cabService: CabService,
    private profileService: ProfileService,
    private datePipe: DatePipe,
    private toast: ToastService,
  ) {
    // use for continue seearch
    // this.searchInfo = this.gs.getLastSearch();
    // console.log("this.searchInfo >>>>>", this.searchInfo);
    // if (this.searchInfo.location_type) {
    //   this.searchObj = this.searchInfo;
    // }

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    console.log("this.route >>>>>>>", this.router.url);

    if (this.router.url.includes('hire-drivers')) {
      this.isDriverHireSearch = true;
    }

    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.searchObj.type = params['type'] ? params['type'] : (this.gs.loggedInUserInfo.role === 'user' || this.gs.loggedInUserInfo.role === 'user_4') ? "car" : "driver";


      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { type: this.searchObj.type },
        queryParamsHandling: 'merge', // preserve the existing query params in the route
        skipLocationChange: false  // do trigger navigation
      });

    })
    this.getRentType();
  }

  ngOnInit() {
    // this.searchObj.timeSchedule = "Now";
    this.searchObj.carType = "Manual";
    this.searchObj.carCatType = "Hatchback";
    this.searchObj.package = "2 Hours";
    this.searchObj.mainTripType = "one_way";

    console.log("eeeee .searchObj >>>>", this.searchObj);
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

  serachCarDetails(searchType?: any) {


    this.searchObj.isDriverHireSearch = false;
    if (this.isDriverHireSearch) { // need to do
      this.searchObj.isDriverHireSearch = true;
      this.searchObj.type = "driver";
      this.searchObj.timeType = "Daily";
      this.searchObj.pick_time = this.searchObj.timeSchedule == 'Now' ? this.todayDate.toISOString() : this.searchObj.pick_time;
      this.searchObj.drop_time = "2025-08-19T12:53:24.000Z";
    }
    if (searchType != "reset" && !this.isDriverHireSearch) {
      // if (!this.searchObj.same_location) {
      //   this.toast.errorToastr("Please enter location");
      //   return;
      // }
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
    }
    localStorage.setItem('lastSearch', JSON.stringify(this.searchObj));
    this.gs.lastSearch = this.searchObj;
    this.locationArray = [];
    this.searchEvent.emit({ searchObj: this.searchObj });
  }

  resetFilter() {
    this.searchObj = {
      pick_up_location: "",
      drop_location: "",
      same_location: "",
      pick_time: "",
      drop_time: "",
      type: this.params['type'] ? this.params['type'] : "car",
      timeType: "Daily",
      location_type: "option2",
    };
    // localStorage.removeItem('lastSearch'); // auto reset
    this.serachCarDetails("reset");
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
      "risktype": this.params['type'] === 'car' ? 'vehicle' : 'driver'
    }
    this.gs.isSpinnerShow = true;
    this.cabService.GetLocations(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response.response && response.response.statusCode == "200") {
        this.locationArray = response.gridList || [];
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

  onChangePickUpTime() {
    this.searchObj.drop_time = null;
  }

  changeTab(item: any) {
    // item.isSelected = true;
    this.activeTab = item.value;
    this.searchObj.mainTripType = item.Code;
  }
}
