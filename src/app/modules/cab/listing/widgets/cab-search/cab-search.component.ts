import { Component, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { id } from 'date-fns/locale';
import { GlobalService } from '../../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@Component({
  selector: 'app-cab-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  templateUrl: './cab-search.component.html',
  styleUrl: './cab-search.component.scss'
})
export class CabSearchComponent {

  @Input() searchFrom: any;

  public isSearchVisible: boolean = false;
  public isShow: boolean = false;
  searchInfo: any = {}
  public searchObj: any = {
    pick_up_location: "",
    drop_location: "",
    same_location: "",
    pick_time: "",
    drop_time: "",
    type: "",
    location_type: "option2",
  };

  windowWidth: number;
  windowHeight: number;
  // public selectedValue: string = 'option2';
  public params: Params;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public gs: GlobalService
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
}
