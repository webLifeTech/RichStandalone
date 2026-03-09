import { Component, Input } from '@angular/core';
import { booking } from '../../../shared/interface/pages';
import { CabService } from '../../../shared/services/cab.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule, PaginationService } from 'ngx-pagination';
import { apiResultFormat, pageSelection, userBookings } from '../../../shared/services/model/model';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DeleteModalComponent } from '../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { CabCardViewComponent } from '../../../shared/components/comman/booking/cab-card-view/cab-card-view.component';
import { GlobalService } from '../../../shared/services/global.service';
import { CheckAvailabilityModalComponent } from '../../../shared/components/comman/modal/wishlist-modals/check-availability-modal/check-availability-modal.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-user-wishlist',
  standalone: true,
  imports: [
    DeleteModalComponent,
    CabCardViewComponent,

    CommonModule,
    FormsModule,
    RouterLink,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    CurrencySymbolPipe,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,

    // NgSelectModule,
    MatExpansionModule,
    TranslateModule,
  ],
  providers: [DatePipe],
  templateUrl: './user-wishlist.component.html',
  styleUrl: './user-wishlist.component.scss'
})
export class UserWishlistComponent {

  public tableData: any = [];
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;

  public tableDataSecond: any = [];
  public searchDataValueSecond = '';
  public pageSizeSecond = 10;
  public totalDataSecond = 0;
  public currentPageSecond = 1;

  editInfo: any = {};
  activeTab: any = "car";
  isLoader: boolean = false;

  cardLists: any = [];
  myWishlist: any = [];

  tabs: any = [];
  carOwnerTabs: any = [];

  todayDate = new Date();
  minStartDate: any = new Date(Date.now() - 86400000); // yesterday
  minEndDate: any = null; // yesterday
  searchFilter: any = {
    pickUpTime: null,
    dropTime: null
  }
  myWishlistTotalData: any = 0;

  constructor(
    private route: ActivatedRoute,
    public cabService: CabService,
    private gs: GlobalService,
    private modalService: NgbModal,
    private favoriteService: FavoriteService,
    private toast: ToastService,
    private datePipe: DatePipe,
  ) {
    if (this.gs.loggedInUserInfo['role'] === 'user') {
      this.tabs = [
        { title: "My favourite car", value: "car" },
        { title: "Car owner show interest", value: "car_owner_interest" },
      ];
    }
    if (this.gs.loggedInUserInfo['role'] === 'user_2') {
      this.tabs = [
        { title: "My favourite driver", value: "driver" },
        // { title: "Car owner show interest", value: "driver" },
      ];
      this.activeTab = "driver";
    }
    if (this.gs.loggedInUserInfo['role'] === 'user_3') {
      this.tabs = [
        { title: "My favourite driver", value: "driver" },
      ];
      this.activeTab = "driver";
    }
    if (this.gs.loggedInUserInfo['role'] === 'user_4') {
      this.tabs = [
        { title: "My favourite car", value: "car" },
        { title: "Car owner show interest", value: "car_owner_interest" },
        { title: "My favourite driver", value: "driver" },
      ];
    }
    this.route.queryParams.subscribe((params) => {
      const nextDay = new Date();
      const todDay = new Date();
      todDay.setHours(todDay.getHours() + 1);
      this.searchFilter.pickUpTime = todDay;
      this.onChangePickUpTime();
      nextDay.setDate(this.searchFilter.pickUpTime.getDate() + 1);
      nextDay.setHours(nextDay.getHours() + 1);
      this.searchFilter.dropTime = nextDay;
      this.getTableData();
    })
  }

  getTableData() {
    // this.myWishlist = this.gs.getMyWishlistData();
    this.gs.isSpinnerShow = true;
    this.isLoader = true;
    if (this.activeTab === 'car' || this.activeTab === 'driver') {
      this.favoriteService.getAllFavourite({
        "userId": this.gs.loggedInUserInfo.userId,
        "riskType": this.activeTab === 'car' ? 'Vehicle' : 'Driver',
        "pickUpTime": this.searchFilter.pickUpTime ? this.transformDate(this.searchFilter.pickUpTime, 'MM/dd/yyyy HH:mm:ss') : null, // "03-05-2026 04:06:25"
        "dropTime": this.searchFilter.dropTime ? this.transformDate(this.searchFilter.dropTime, 'MM/dd/yyyy HH:mm:ss') : null, // "03-05-2026 04:06:25"
        "pageNumber": this.currentPage,
        "pageSize": this.pageSize
      }).subscribe((response: any) => {
        this.gs.isSpinnerShow = false;
        this.isLoader = false;
        if (response.response && response.response.statusCode == "200") {
          this.myWishlist = response.gridList;
          this.myWishlistTotalData = response.viewModel?.totalCount || 0;
        }
      })
    }
    if (this.activeTab === 'car_owner_interest') {
      const body = {
        "userId": this.gs.loggedInUserInfo.userId,
        "pageNumber": this.currentPage,
        "pageSize": this.pageSize,
        "startDate": null,
        "endDate": null,
      }
      this.tableData = [];
      this.favoriteService.GetInterestOnDriverFavourites(body).subscribe((response: any) => {
        this.gs.isSpinnerShow = false;
        console.log("response >>>>>", response);
        if (response.response && response.response.statusCode == "200") {
          this.tableData = response.gridList;
          this.totalData = response.viewModel?.totalCount || 0;
          if (this.tableData.length) {
            this.tableData[0].isOpen = true;
            this.getCarOwnerVehicles(this.tableData[0].ownerId);
          }
          this.isLoader = false;
        }
      })
    }
  }

  getCarOwnerVehicles(ownerUserId: any) {
    const body = {
      "userId": ownerUserId,
      "pageNumber": this.currentPageSecond,
      "pageSize": this.pageSizeSecond,
      "pickUpTime": this.searchFilter.pickUpTime,
      "dropTime": this.searchFilter.dropTime,
    }
    this.tableDataSecond = [];
    this.gs.isSpinnerShow = true;
    this.favoriteService.GetCarOwnerVehicles(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      this.isLoader = false;
      if (response.response && response.response.statusCode == "200") {
        this.tableDataSecond = response.gridList;
        this.totalDataSecond = response.viewModel?.totalCount || 0;
      }
    })
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.currentPageSecond = 1;
    this.getTableData();
  }

  pageChangedSecond(event: any, section: any) {
    this.currentPageSecond = event;
    this.getCarOwnerVehicles(section.ownerId);
  }

  onCheckAvailability(item: any) {
    const modalRef = this.modalService.open(CheckAvailabilityModalComponent, {
      size: 'md'
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.componentInstance.type = this.activeTab;
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

  onChangeTab(item: any) {
    this.activeTab = item.value;
    this.myWishlist = [];
    this.currentPage = 1;
    this.currentPageSecond = 1;
    this.getTableData();
  }

  onToggle(value: any, section: any) {
    section.isOpen = value;
    if (section.isOpen) {
      this.currentPageSecond = 1;
      this.getCarOwnerVehicles(section.ownerId);
    }
  }

  searchData() {
    this.currentPage = 1;
    this.getTableData();
  }

  resetFilter() {
    this.currentPage = 1;
    this.searchFilter.pickUpTime = null;
    this.searchFilter.dropTime = null;
    this.getTableData();
  }

  dropTimeFilter = (date: Date | null): boolean => {
    if (!date || !this.searchFilter.pickUpTime) return false;
    return this.minEndDate || date.getTime() >= this.minEndDate.getTime(); // Allow all dates
  };

  onChangePickUpTime() {
    this.setDropMinDate();
    this.searchFilter.dropTime = null;
  }

  onChangeDropTime() {
    const drop = new Date(this.searchFilter.dropTime);
    const min = new Date(this.minEndDate);
    min.setMinutes(min.getMinutes() - 1);
    if (drop < min) {
      this.toast.errorToastr("Drop time must be at least 1 day after pickup time.");
      setTimeout(() => {
        this.searchFilter.dropTime = null;
      }, 100);
    }
  }

  setDropMinDate() {
    if (this.searchFilter.pickUpTime) {
      const pick = new Date(this.searchFilter.pickUpTime);
      const nextDay = new Date(pick);
      nextDay.setDate(pick.getDate() + 1);
      nextDay.setMinutes(nextDay.getMinutes()); // +1 minute
      this.minEndDate = nextDay;
    }
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

}
