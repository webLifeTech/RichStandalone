import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalService } from '../../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

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
    location_type: "option2",
  };

  public params: Params | any;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public gs: GlobalService
  ) {
    this.searchInfo = this.gs.getLastSearch();
    if (this.searchInfo.location_type) {
      this.searchObj = this.searchInfo;
    }
  }

  sameLocation(event: Event) {
    this.searchObj.location_type = (event.target as HTMLInputElement).value;
  }

  onChangeType() {
  }

  findToSearch() {
    localStorage.setItem('lastSearch', JSON.stringify(this.searchObj));
    this.router.navigate(['/cab/listing/list-view'], {
      queryParams: {
        type: this.searchObj.type || null,
      },
    });
  }
}
