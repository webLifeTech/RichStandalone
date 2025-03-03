import { Component, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { id } from 'date-fns/locale';
import { GlobalService } from '../../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgSelectModule } from '@ng-select/ng-select';
import { CabService } from '../../../../../shared/services/cab.service';

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
  templateUrl: './cab-search.component.html',
  styleUrl: './cab-search.component.scss'
})
export class CabSearchComponent {

  @Input() searchFrom: any;

  public isSearchVisible: boolean = true; // need to do
  public isShow: boolean = false;
  searchInfo: any = {}
  public searchObj: any = {
    pick_up_location: "",
    drop_location: "",
    same_location: "",
    pick_time: "",
    drop_time: "",
    type: "",
    timeType: "",
    location_type: "option2",
  };

  windowWidth: number;
  windowHeight: number;
  // public selectedValue: string = 'option2';
  public params: Params;
  locationArray: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public gs: GlobalService,
    public cabService: CabService,
  ) {
    this.searchInfo = this.gs.getLastSearch();
    if (this.searchInfo.location_type) {
      this.searchObj = this.searchInfo;
    }

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.searchObj.type = params['type'] ? params['type'] : "car";
      this.searchObj.timeType = params['timeType'] ? params['timeType'] : "";

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { type: this.searchObj.type ? this.searchObj.type : "car" },
        queryParamsHandling: 'merge', // preserve the existing query params in the route
        skipLocationChange: false  // do trigger navigation
      });
    })
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
    if (this.windowWidth > 991) {
      this.isSearchVisible = false;
    }
    this.closeSearchBox()

  }

  applyFilter(event: Event) {
    // const index = this.selectedCarLocation.indexOf((event.target as HTMLInputElement).value);  // checked and unchecked value
    this.searchObj.type = ((event.target as HTMLInputElement).value);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: this.searchObj.type ? this.searchObj.type : "car" },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
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
      console.log("response >>>>>>", response);
      if (response && response.getLocations && response.getLocations.length) {
        this.locationArray = response.getLocations;
        console.log("this.locationArray >>>>>", this.locationArray);

        // console.log("this.termsAndConditionsObj >>>>>>", this.termsAndConditionsObj);
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
}
