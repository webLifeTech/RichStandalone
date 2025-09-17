import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule } from '@angular/common';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { apiResultFormat } from '../../../shared/services/model/model';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyCarsService } from '../../../shared/services/mycars.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { DeleteModalComponent } from '../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { CarStatusChangeModalComponent } from '../../../shared/components/comman/modal/my-car-modals/car-status-change-modal/car-status-change-modal.component';
import { ChangeCarPriceModalComponent } from '../../../shared/components/comman/modal/my-car-modals/change-car-price-modal/change-car-price-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AdminService } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-user-cars-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    CurrencySymbolPipe,
    MatExpansionModule,
  ],
  templateUrl: './user-cars-listing.component.html',
  styleUrl: './user-cars-listing.component.scss'
})
export class UserCarsListingComponent {
  public tableData: any = [];
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public pageIndex = 0;
  public currentPage = 1;
  public currentPageSecond = 1;

  public searchFilter: any = {
    branch: 'all',
    status: 'all',
  };
  public activeTab = '';
  activeTabName: any = '';
  sortColumn: any = null;
  sortOrder: any = "DESC";

  tabs: any = [];

  vehicleStatusList: any = [
    { id: 1, name: 'All Status', value: 'all' },
    { id: 4, name: "Active", value: "Active" },
    { id: 3, name: 'Pending', value: 'Pending' },
    { id: 2, name: 'InActive', value: 'InActive' },
    // { id: 3, name: 'Repair', value: 'Repair' },
  ]
  carOwnerTabs: any = [];


  constructor(
    private route: ActivatedRoute,
    public cabService: CabService,
    private adminService: AdminService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private toast: ToastService,

  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "All Vehicles";
      this.searchFilter.status = params['status'] ? params['status'] : 'all';
      this.getTableData();
    })
  }

  getTableData() {
    let tabName = this.tabs.find((item: any) => item.value === this.activeTab)?.title;
    this.activeTabName = tabName;
    this.gs.isSpinnerShow = true;
    const body = {
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "userType": JSON.stringify([this.activeTab]),
      "status": (!this.searchFilter.status || this.searchFilter.status === 'all') ? null : JSON.stringify([this.searchFilter.status]),
    }
    this.adminService.GetAllVehiclesForAdmin(body).subscribe((response: any) => {
      this.carOwnerTabs = [];
      this.gs.isSpinnerShow = false;
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        this.carOwnerTabs = response.ownerVehicles;
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
    this.getTableData();
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getTableData();
  }

  pageChangedSecond(event: any) {
    this.currentPageSecond = event;
  }

  async changeStatus(item: any) {
    // let newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    const modalRef = this.modalService.open(CarStatusChangeModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.componentInstance.title = 'Are sure you want to change status ?';
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        item.status = res.status;
        this.toast.successToastr("Status successfully");
      }
    }, () => { });
  }

  onToggle(value: any, section: any) {
    section.isOpen = value;
    this.currentPage = 1;
  }

  searchData() {
    this.getTableData();
  }

}
