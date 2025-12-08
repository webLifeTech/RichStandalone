import { Component, Input } from '@angular/core';
import { CabService } from '../../../../../shared/services/cab.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule, PaginationService } from 'ngx-pagination';
import { apiResultFormat, userBookings } from '../../../../../shared/services/model/model';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../../../shared/services/toast.service';
import { DeleteModalComponent } from '../../../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { BookingDetailsModalComponent } from '../../../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { GlobalService } from '../../../../../shared/services/global.service';
import { ReviewService } from '../../../../../shared/services/review.service';
import { BarRating, BarRatingModule } from 'ngx-bar-rating';
import { WriteReviewModalComponent } from '../../../../../shared/components/comman/modal/booking-modals/write-review-modal/write-review-modal.component';
import { RolePermissionService } from '../../../../../shared/services/rolepermission.service';
import { NotificationsService } from '../../../../services/notifications.service';
import { SortDirective } from '../../../../directives/sort.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { SignalRService } from '../../../../services/signalr.service';
import { TimeAgoPipe } from '../../../../pipe/time-ago.pipe';

@Component({
  selector: 'app-notification-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    SortDirective,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TimeAgoPipe
  ],
  templateUrl: './notification-view.component.html',
  styleUrl: './notification-view.component.scss'
})
export class NotificationViewComponent {
  sortColumn: any = "";
  sortOrder: any = "DESC"; // ASC
  public tableData: any = [];
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  dateTimeRange: any = "";

  filterObj: any = {};
  sortFilter: any = [
    { value: "This Week" },
    { value: "This Month" },
    { value: "Last 30 Days" },
    { value: "Custom" },
  ]

  constructor(
    private route: ActivatedRoute,
    public getPer: RolePermissionService,
    public cabService: CabService,
    public gs: GlobalService,
    private notifService: NotificationsService,
    public signalR: SignalRService,
    public roleService: RolePermissionService,

  ) {
    // this.roleService.getButtons("");
    this.route.queryParams.subscribe((params) => {
      this.getTableData();
    })
  }

  getTableData() {

    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "pageNumber": this.currentPage,
      "pageSize": this.pageSize,
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "globalSearch": this.searchDataValue?.trim() || "",
      "startDate": startDate,
      "endDate": endDate,
      "channelId": 3,
    }
    this.gs.isSpinnerShow = true;
    this.notifService.GetUserNotifications(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response.response && response.response.statusCode == "200") {
        this.tableData = response.gridList;
        this.totalData = response.viewModel?.totalCount;
      }
    });
  }

  public searchData(): void {
    this.currentPage = 1;
    this.getTableData();
  }

  onSort(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === "DESC" ? "ASC" : "DESC";
    this.getTableData();
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }

  onChange() {
  }
}
