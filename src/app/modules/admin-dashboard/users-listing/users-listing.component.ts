import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { apiResultFormat } from '../../../shared/services/model/model';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { CarStatusChangeModalComponent } from '../../../shared/components/comman/modal/my-car-modals/car-status-change-modal/car-status-change-modal.component';
import { UsersService } from '../../../shared/services/users.service';
import { AdminService } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-users-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    // CurrencySymbolPipe,
  ],
  templateUrl: './users-listing.component.html',
  styleUrl: './users-listing.component.scss'
})
export class UsersListingComponent {
  public tableData: any = [];
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;

  public searchFilter: any = {
    status: 'all',
  };
  public activeTab = '';
  sortColumn: any = "";
  sortOrder: any = "DESC";

  tabs: any = [];

  vehicleStatusList: any = [
    { id: 1, name: 'All Status', value: 'all' },
    { id: 1, name: 'Active', value: 'Active' },
    { id: 3, name: 'Inactive', value: 'Inactive' },
    { id: 3, name: "KYC Pending", value: "KYC Pending" },
    // { id: 3, name: 'Repair', value: 'Repair' },
  ]


  constructor(
    // private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private adminService: AdminService,
    public cabService: CabService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private toast: ToastService,

  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "All Users";
      this.searchFilter.status = params['status'] ? params['status'] : 'all';
      this.getTableData();
    })
  }

  getTableData() {

    this.gs.isSpinnerShow = true;
    const body = {
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "userType": JSON.stringify([this.activeTab]),
      "userStatus": this.searchFilter.status == 'all' ? null : JSON.stringify([this.searchFilter.status]),
    }
    this.adminService.GetAllUsersForAdmin(body).subscribe((response: any) => {
      this.tableData = [];
      this.gs.isSpinnerShow = false;
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        this.tableData = response.allUsers;
        this.totalData = response.viewModel?.totalCount || 0;
        this.tabs = response.filterList ? JSON.parse(response.filterList) : [];
      } else {
        this.toast.errorToastr(response.message);
      }
    });
  }

  selectStatus() {
    this.getTableData();
  }

  selectBranch() {
    this.getTableData();
  }


  changeBookTab(item: any) {
    this.activeTab = item.name;
    this.currentPage = 1;
    let params = {
      activeTab: this.activeTab,
      status: "all"
    }
    this.getTableData();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getTableData();
  }

  onSort(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === "DESC" ? "ASC" : "DESC";
    this.getTableData();
  }

  async changeStatus(item: any) {
    // let newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    const modalRef = this.modalService.open(CarStatusChangeModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.componentInstance.mainTitle = 'Change User Status';
    modalRef.componentInstance.title = 'Are sure you want to change status ?';
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        item.status = res.status;
        this.toast.successToastr("Status successfully");
      }
    }, () => { });
  }

  searchData() {
    this.currentPage = 1;
    this.getTableData();
  }

}
