import { Component, Input } from '@angular/core';
import { booking } from '../../../shared/interface/pages';
import { CabService } from '../../../shared/services/cab.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
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

  constructor(
    private route: ActivatedRoute,
    public cabService: CabService,
    private gs: GlobalService,
    private modalService: NgbModal,
    private favoriteService: FavoriteService,

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
      }).subscribe((response: any) => {
        this.gs.isSpinnerShow = false;
        this.isLoader = false;
        if (response.response && response.response.statusCode == "200") {
          this.myWishlist = response.gridList;
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
          response.gridList[0].isOpen = true;
          this.tableData = response.gridList;
          this.totalData = response.viewModel?.totalCount || 0;
          this.getCarOwnerVehicles(this.tableData[0].ownerId);
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

}
