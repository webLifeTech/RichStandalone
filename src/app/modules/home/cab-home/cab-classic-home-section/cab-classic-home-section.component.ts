import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalService } from '../../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { CabService } from '../../../../shared/services/cab.service';

@Component({
  selector: 'app-cab-classic-home-section',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule
  ],
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
  };

  public params: Params | any;
  locationArray: any = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public gs: GlobalService,
    public cabService: CabService,
  ) {
    this.searchInfo = this.gs.getLastSearch();
    if (this.searchInfo.location_type) {
      this.searchObj = this.searchInfo;
    }
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

  sameLocation(event: Event) {
    this.searchObj.location_type = (event.target as HTMLInputElement).value;
  }

  onChangeType() {
  }

  findToSearch() {
    console.log("this.searchObj >>>>>>>", this.searchObj);

    localStorage.setItem('lastSearch', JSON.stringify(this.searchObj));
    this.router.navigate(['/cab/listing/list-view'], {
      queryParams: {
        type: this.searchObj.type || null,
      },
    });
  }

}
