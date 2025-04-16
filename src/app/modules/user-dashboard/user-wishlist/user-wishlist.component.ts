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
  ],
  templateUrl: './user-wishlist.component.html',
  styleUrl: './user-wishlist.component.scss'
})
export class UserWishlistComponent {

  public tableData: any = [];
  dataSource!: MatTableDataSource<userBookings>;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalRecord = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection = [];
  public totalPages = 0;

  editInfo: any = {};
  activeTab: any = "car";
  isLoader: boolean = false;

  cardLists: any = [];
  myWishlist: any = [];

  tabs = [
    { title: "Car", value: "car" },
    { title: "Driver", value: "driver" },
  ];

  constructor(
    private route: ActivatedRoute,
    public cabService: CabService,
    private gs: GlobalService,
    private modalService: NgbModal,
    private favoriteService: FavoriteService,

  ) {
    this.route.queryParams.subscribe((params) => {
      this.getTableData();
    })
  }

  getTableData() {
    // this.myWishlist = this.gs.getMyWishlistData();
    this.gs.isSpinnerShow = true;
    this.isLoader = true;
    this.favoriteService.getAllFavourite({
      "userId": this.gs.loggedInUserInfo.userId,
      "riskType": this.activeTab === 'car' ? 'Vehicle' : 'Driver',
    }).subscribe((response: any) => {
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        this.myWishlist = response.favoriteList;
        console.log("myWishlist >>>", this.myWishlist);
      }
      this.gs.isSpinnerShow = false;
      this.isLoader = false;
    })
  }

  pageChanged(event: any) {
    this.currentPage = event;
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
    this.getTableData();
  }

}
