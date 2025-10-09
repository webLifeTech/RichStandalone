import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalService } from '../../../shared/services/global.service';
import { CarStatusChangeModalComponent } from '../../../shared/components/comman/modal/my-car-modals/car-status-change-modal/car-status-change-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AdminService } from '../../../shared/services/admin.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

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
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [DatePipe],
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
  dateTimeRange: any = "";

  public searchFilter: any = {
    branch: 'all',
    status: 'All Status',
  };
  public activeTab = '';
  activeTabName: any = '';
  sortColumn: any = null;
  sortOrder: any = "DESC";

  tabs: any = [];

  vehicleStatusList: any = [
    { id: 1, name: 'All Status', value: 'All Status' },
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
    private datePipe: DatePipe,
  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "All Vehicles";
      this.searchFilter.status = params['status'] ? params['status'] : 'All Status';
      this.getTableData();
    })
  }

  getTableData() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "userType": JSON.stringify([this.activeTab]),
      "status": (!this.searchFilter.status || this.searchFilter.status === 'All Status') ? null : JSON.stringify([this.searchFilter.status]),
      "startDate": startDate,
      "endDate": endDate,
    }
    this.gs.isSpinnerShow = true;
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

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  exportToExcel() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "pageNumber": 1,
      "pagesize": this.totalData,
      "globalSearch": this.searchDataValue?.trim() || "",
      "userType": JSON.stringify([this.activeTab]),
      "status": (!this.searchFilter.status || this.searchFilter.status === 'All Status') ? null : JSON.stringify([this.searchFilter.status]),
      "startDate": startDate,
      "endDate": endDate,
    }
    this.gs.isSpinnerShow = true;
    this.adminService.GetAllVehiclesForAdmin(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        let tableData = response.ownerVehicles;
        let finalData: any = [];
        for (let i in tableData) {
          finalData.push({
            "SL": Number(i) + 1,
            "Name": tableData[i].ownerName + ' - ' + tableData[i].userStatus + ' - ' + tableData[i].roleName,
          });
        }
        let title = 'Vehicles - ' + this.activeTab + ' - ' + this.searchFilter.status;
        this.gs.exportToExcelWithNested(tableData, "Vehicles", title);
      } else {
        this.toast.errorToastr(response.message);
      }
    });
  }

}
