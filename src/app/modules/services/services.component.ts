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
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    SearchCatLoactionComponent,
    ServiceListComponent,
    AdvertisementComponent,
    ServiceDetailsComponent,
    CommonModule,
    NgxPaginationModule,
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
  pageSize: any = 5;
  selectedSubCats: string[] = [];
  searchObj: any = {};
  isView: boolean = false;
  viewModel: any = {};
  singleDetailInfo: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cabService: CabService,
    public gs: GlobalService,
    private vendorService: VendorServService,
    private toast: ToastService,
  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: { currentPage: 1 },
    //   queryParamsHandling: "merge"
    // });
    this.searchVehicleResult();
    // this.route.queryParams.subscribe((params: any) => {
    //   console.log("params >>>>>", params);
    //   this.currentPage = params.currentPage || 1;
    //   if (params.currentPage) {
    //     this.searchVehicleResult();
    //   } else {
    //     this.onHandleSubmit({});
    //   }
    // })
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
    this.currentPage = 1;
    this.searchObj = obj;
    this.searchVehicleResult();
  }

  async searchVehicleResult() {
    let Body = {
      "searchCriteria": {
        "location": this.searchObj.location || null,
        "category": this.searchObj.selectedCategory || null,
        "pageNumber": this.currentPage,
        "pagesize": this.pageSize
      },
      "filterCriteria": { "subCategory": this.selectedSubCats.length ? JSON.stringify(this.selectedSubCats) : null }
    }

    this.reLoadDetails = false;
    this.gs.isSpinnerShow = true;
    this.vendorService.ProviderSearchResult(Body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      this.aggregateFilters = {};
      this.servicSearchResult = [];
      if (res.response && res.response.statusCode == "200") {
        const aggFilters = JSON.parse(res.aggregateFilters);
        this.aggregateFilters = aggFilters.subCategoryInfo || {};
        this.servicSearchResult = res.searchList;
        this.searchObj.totalDataCount = res.viewModel.totalCount;
        this.viewModel = res.viewModel;
        this.reLoadDetails = false;
      }
      this.reLoadDetails = true;
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  viewDetails(event: any) {
    console.log("event>>>", event);
    this.singleDetailInfo = event;
    this.isView = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  backAction() {
    this.isView = false;
  }

  setPage(page: number) {
    this.currentPage = page;
    this.searchVehicleResult();
  }

}
