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
import { ExcelExportService } from '../../../shared/services/excel-export.service';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';

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
  public currentPage = 1;

  public tableDataSecond: any = [];
  public searchDataValueSecond = '';
  public pageSizeSecond = 10;
  public totalDataSecond = 0;
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
  ownerVehiclesData: any = [];


  constructor(
    private route: ActivatedRoute,
    public cabService: CabService,
    private adminService: AdminService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private toast: ToastService,
    private datePipe: DatePipe,
    private excelExport: ExcelExportService,
    public roleService: RolePermissionService,
  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.roleService.getButtons("AVEH");
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "All Vehicles";
      this.searchFilter.status = params['status'] ? params['status'] : 'All Status';
      this.getGridTabsDetails();
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
    this.adminService.GetAllVehicleOwners(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      this.tableData = [];
      if (response.response && response.response.statusCode == "200") {
        if (response.gridList.length) {
          response.gridList[0].isOpen = true;
        }
        this.tableData = response.gridList;
        this.totalData = response.viewModel?.totalCount || 0;
        // this.tabs = response.filterList ? JSON.parse(response.filterList) : [];
        this.getOwnerVehicles(this.tableData[0].userId)
      } else {
        this.toast.errorToastr(response.message);
      }
    });
  }

  getOwnerVehicles(ownerUserId: any) {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "pageNumber": this.currentPageSecond,
      "pagesize": this.pageSizeSecond,
      "globalSearch": this.searchDataValue?.trim() || "",
      "status": (!this.searchFilter.status || this.searchFilter.status === 'All Status') ? null : JSON.stringify([this.searchFilter.status]),
      "startDate": startDate,
      "endDate": endDate,
      "userId": ownerUserId,
    }
    this.tableDataSecond = [];
    this.gs.isSpinnerShow = true;
    this.adminService.GetAllOwnerVehicles(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response.response && response.response.statusCode == "200") {
        this.tableDataSecond = response.gridList;
        this.totalDataSecond = response.viewModel?.totalCount || 0;
      } else {
        this.toast.errorToastr(response.message);
      }
    });
  }

  getGridTabsDetails() {
    const body = {
      roleId: this.gs.loggedInUserInfo.roleName,
      menuId: "37",
    }
    this.roleService.GetGridTabsDetails(body).subscribe(async (response: any) => {
      this.tabs = response || [];
    })
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
    this.currentPageSecond = 1;
    this.getTableData();
  }

  pageChangedSecond(event: any, section: any) {
    this.currentPageSecond = event;
    this.getOwnerVehicles(section.userId);
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
    this.currentPageSecond = 1;
    if (section.isOpen) {
      this.getOwnerVehicles(section.userId);
    }
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
      "globalSearch": this.searchDataValue?.trim() || "",
      "userType": JSON.stringify([this.activeTab]),
      "status": (!this.searchFilter.status || this.searchFilter.status === 'All Status') ? null : JSON.stringify([this.searchFilter.status]),
      "startDate": startDate,
      "endDate": endDate,
    }
    this.gs.isSpinnerShow = true;
    this.excelExport.exportToExcelPost(body, 'ExportAllVehiclesToExcel').subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      let tableData = JSON.parse(response);
      let finalData: any = [];
      for (let i in tableData) {
        finalData.push({
          "SL": Number(i) + 1,
          "Name": tableData[i].ownerName + ' - ' + tableData[i].userStatus + ' - ' + tableData[i].roleName,
        });
      }
      let title = 'Vehicles - ' + this.activeTab + ' - ' + this.searchFilter.status;
      this.excelExport.exportToExcelWithNested(tableData, "Vehicles", title);

    });
  }

}
