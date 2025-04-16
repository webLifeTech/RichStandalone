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
  ],
  templateUrl: './notification-view.component.html',
  styleUrl: './notification-view.component.scss'
})
export class NotificationViewComponent {

  public tableData: any = [];
  dataSource!: MatTableDataSource<userBookings>;
  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection = [];
  public totalPages = 0;

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

  ) {
    this.route.queryParams.subscribe((params) => {
      this.getTableData();
    })

    this.getPer.actionPermissions = {

    }
  }

  getTableData() {

    this.notifService.getAllNotifications().subscribe((apiRes: any) => {
      const roles: any = {
        "user": "Drivers",
        "user_2": "CarOwner",
        "user_3": "FleetCompany",
        "user_4": "DriverOwnedCar",
        "admin": "Admin",
      }
      this.totalData = apiRes[roles[this.gs.loggedInUserInfo.role]].length;
      this.tableData = apiRes[roles[this.gs.loggedInUserInfo.role]];
    });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
  }
  initChecked = false;

  selectAll(initChecked: boolean) {
    if (!initChecked) {
      this.tableData.forEach((f: any) => {
        f.isSelected = true;
      });
    } else {
      this.tableData.forEach((f: any) => {
        f.isSelected = false;
      });
    }
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }

  onChange() {
  }
}
