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

@Component({
  selector: 'app-notification-view',
  standalone: true,
  imports: [
    DeleteModalComponent,
    BookingDetailsModalComponent,

    CommonModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    BarRating,
    SortDirective
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

  roles: any = {
    "user": "Drivers",
    "user_2": "CarOwner",
    "user_3": "FleetCompany",
    "user_4": "DriverOwnedCar",
    "admin": "Admin",
  }

  constructor(
    private route: ActivatedRoute,
    private toast: ToastService,
    public getPer: RolePermissionService,
    public cabService: CabService,
    public gs: GlobalService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private notifService: NotificationsService,

  ) {
    this.route.queryParams.subscribe((params) => {
      this.getTableData();
      // this.getTableData();
    })

    this.getPer.actionPermissions = {

    }
  }

  getTableData() {

    this.notifService.getAllNotifications().subscribe((apiRes: any) => {
      // this.notificationList = apiRes[this.roles[this.gs.loggedInUserInfo.role]]
      this.totalData = apiRes[this.roles[this.gs.loggedInUserInfo.role]].length;
      this.tableData = apiRes[this.roles[this.gs.loggedInUserInfo.role]];
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

  openImportantNoticeDialog(): void {
    this.dialog.open(DeleteModalComponent, {
      width: '100%',
      data: {}
    });
  }

  onEdit(item: any) {
    const modalRef = this.modalService.open(WriteReviewModalComponent, {
      // size: 'lg'
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then((res: any) => {

      item.review = res.form.review;
      item.rating = res.form.rating;
    }, () => {
    });
  }

  async onDelete(index: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.tableData.splice(index, 1);
        this.toast.successToastr("Deleted successfully");
      }
    }, () => {
    });
  }

}
