import { Component } from '@angular/core';
import { SearchCatLoactionComponent } from './search-cat-loaction/search-cat-loaction.component';
import { CommonModule } from '@angular/common';
import { ServiceListComponent } from './service-list/service-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../shared/services/booking.service';
import { CabService } from '../../shared/services/cab.service';
import { GlobalService } from '../../shared/services/global.service';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { VendorServService } from '../../shared/services/vendor-service.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    SearchCatLoactionComponent,
    ServiceListComponent,
    AdvertisementComponent,

    CommonModule
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {

  bg_image = 'assets/images/cab/breadcrumb.jpg';
  reLoadDetails: boolean = false;
  aggregateFilters: any = {};
  servicSearchResult: any = [];
  totalDataCount: any = 0;
  currentPage: any = 1;
  selectedSubCats: string[] = [];
  searchObj: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cabService: CabService,
    public gs: GlobalService,
    private vendorService: VendorServService,
    private toast: ToastService,
  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params: any) => {
      console.log("params >>>>>", params);
      this.currentPage = params.currentPage || 1;
      if (params.currentPage) {
        this.searchVehicleResult();
      }
    })
  }

  changeBookTab(item: any) {
    let index = this.selectedSubCats.indexOf(item.value);
    if (index === -1) {
      this.selectedSubCats.push(item.value);
    } else {
      this.selectedSubCats.splice(index, 1);
    }
    this.searchVehicleResult();
  }

  onHandleSubmit(obj: any) {
    this.searchObj = obj;
    this.searchVehicleResult();
  }

  async searchVehicleResult() {
    let Body = {
      "searchCriteria": {
        "location": this.searchObj.location || null,
        "category": this.searchObj.selectedCategory || null,
        "pageNumber": this.currentPage,
        "pagesize": 5
      },
      "filterCriteria": { "subCategory": this.selectedSubCats.length ? JSON.stringify(this.selectedSubCats) : null }
    }

    this.reLoadDetails = false;
    this.gs.isSpinnerShow = true;
    this.vendorService.ProviderSearchResult(Body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      console.log("ProviderSearchResult >>>", res);
      this.aggregateFilters = {};
      this.servicSearchResult = [];
      if (res && res.responseResultDtos && res.responseResultDtos.statusCode == "200") {
        const aggFilters = JSON.parse(res.aggregateFilters);
        this.aggregateFilters = aggFilters.subCategoryInfo || {};
        console.log("this.aggregateFilters >>>", this.aggregateFilters);
        this.servicSearchResult = res.providerMatches;
        this.searchObj.totalDataCount = res.viewModel.totalCount;
        this.reLoadDetails = false;
      }
      this.reLoadDetails = true;
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

}
