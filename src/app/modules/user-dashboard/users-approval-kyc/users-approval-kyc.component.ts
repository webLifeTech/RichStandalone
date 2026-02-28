import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalService } from '../../../shared/services/global.service';
import { AdminService } from '../../../shared/services/admin.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ExcelExportService } from '../../../shared/services/excel-export.service';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { BookingService } from '../../../shared/services/booking.service';
import { DynamicInfoModalComponent } from '../comman/modal/dynamic-info-modal/dynamic-info-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProfileService } from '../../../shared/services/profile.service';
import { VendorServService } from '../../../shared/services/vendor-service.service';
import { ViewAllDocumentsModalComponent } from '../../../shared/components/comman/modal/booking-modals/view-alldocuments-modal/view-alldocuments-modal.component';

@Component({
  selector: 'app-users-approval-kyc',
  standalone: true,
  imports: [
    DynamicInfoModalComponent,
    CommonModule,
    FormsModule,
    RouterLink,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgSelectModule,
    MatExpansionModule
  ],
  providers: [DatePipe],
  templateUrl: './users-approval-kyc.component.html',
  styleUrl: './users-approval-kyc.component.scss'
})
export class UsersApprovalKycComponent {
  public tableData: any = [];
  public selectedFilter = null;
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  dateTimeRange: any = "";

  public tableDataSecond: any = [];
  public searchDataValueSecond = '';
  public pageSizeSecond = 10;
  public totalDataSecond = 0;
  public currentPageSecond = 1;

  public searchFilter: any = {
    status: 'All Status',
  };
  public activeTab = '';
  activeTabName: any = '';
  sortColumn: any = "userAccountNumber";
  sortOrder: any = "DESC";

  tabs: any = [];

  vehicleStatusList: any = [
    { id: 7, name: 'All Status', value: 'All Status' },
    { id: 1, name: "Review Pending", value: "Review Pending" },
    { id: 2, name: "KYC Revert Back", value: "KYC Revert Back" },
    { id: 3, name: "KYC Approved", value: "KYC Approved" },
    { id: 5, name: "KYC Declined", value: "KYC Declined" },
    { id: 6, name: "KYC Completed", value: "KYC Completed" },
    { id: 4, name: "KYC Pending", value: "KYC Pending" },
  ]
  filterTypes: any = [];

  type: any = '';
  kycInfo: any = {
    reviewPending: 0,
    approved: 0,
    sentBack: 0,
    decline: 0
  };
  kycForm: any = {
    formName: ""
  }
  viewInfoDetails: any = {}
  isApproval: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    public cabService: CabService,
    public gs: GlobalService,
    private toast: ToastService,
    private datePipe: DatePipe,
    private excelExport: ExcelExportService,
    public roleService: RolePermissionService,
    private bookingService: BookingService,
    public profileService: ProfileService,
    private vendorService: VendorServService,
    private modalService: NgbModal,
  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.roleService.getButtons("APRVL");
    this.route.queryParams.subscribe((params) => {
      this.getGridTabsDetails(params);
    })
  }

  getUserKycOverviewDetails() {
    const body = {
      userId: this.gs.loggedInUserInfo.userId,
      userType: JSON.stringify([this.activeTab]),
    }
    this.gs.isSpinnerShow = true;
    this.profileService.GetUserKycOverviewDetails(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      this.kycInfo = JSON.parse(response);
    });
  }

  getTableData() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "userType": JSON.stringify([this.activeTab]),
      "userStatus": this.searchFilter.status == 'All Status' ? null : JSON.stringify([this.searchFilter.status]),
      "startDate": startDate,
      "endDate": endDate,
      "type": this.selectedFilter,
      "loginUserId": this.gs.loggedInUserInfo.userId,
    }
    this.gs.isSpinnerShow = true;
    this.adminService.GetAllUsers(body).subscribe((response: any) => {
      this.tableData = [];
      this.gs.isSpinnerShow = false;
      if (response.response && response.response.statusCode == "200") {
        this.tableData = response.gridList;
        this.totalData = response.viewModel?.totalCount || 0;
        if (this.activeTab == 'VENDOR') {
          this.tableData = this.tableData.map((x: any) => ({ ...x, subCategoryList: JSON.parse(x.subCategoryName || '[]') }));
        }
      } else {
        this.toast.errorToastr(response.message);
      }
    });
  }

  getFilterParameters() {
    this.activeTab
    const body = {
      menuId: "89",
      type: this.activeTab === 'VEHICLES' ? "Vehicles" : "KYC Approval",
    }
    this.bookingService.GetFilterParameters(body).subscribe(async (response: any) => {
      this.filterTypes = response || [];
    }, (err: any) => {
      console.log(err?.error?.message || "Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  getGridTabsDetails(params: any) {
    const body = {
      roleId: this.gs.loggedInUserInfo.roleName,
      menuId: "89",
    }
    this.gs.isSpinnerShow = true;
    this.roleService.GetGridTabsDetails(body).subscribe(async (response: any) => {
      this.tabs = response || [];
      this.activeTab = params['activeTab'] ? params['activeTab'] : this.tabs[0].menuName;
      this.activeTabName = this.tabs.find((m: any) => m.menuName === this.activeTab)?.name || '';
      if (this.activeTab === 'VEHICLES') {
        this.getVehiclesData();
      } else {
        this.getTableData();
      }
      this.getUserKycOverviewDetails();
      this.getFilterParameters();
    }, (err: any) => {
      console.log(err?.error?.message || "Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  getVehiclesData() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "userType": JSON.stringify(['ALL VEHICLES']),
      "status": (!this.searchFilter.status || this.searchFilter.status === 'All Status') ? null : JSON.stringify([this.searchFilter.status]),
      "startDate": startDate,
      "endDate": endDate,
      "type": this.selectedFilter,
      "loginUserId": this.gs.loggedInUserInfo.userId,
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
        this.activeTabName = response.viewModel?.pageHeading;
        // this.tabs = response.filterList ? JSON.parse(response.filterList) : [];
        this.getOwnerVehicles(this.tableData[0].userId);
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
      "type": this.selectedFilter,
      "loginUserId": this.gs.loggedInUserInfo.userId,
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

  selectStatus() {
    if (this.activeTab === 'VEHICLES') {
      this.getVehiclesData();
    } else {
      this.getTableData();
    }
  }

  changeBookTab(item: any) {
    this.activeTab = item.menuName;
    this.activeTabName = item.name;

    this.dateTimeRange = "";
    this.selectedFilter = null;
    this.searchDataValue = "";
    this.searchFilter.status = 'All Status';

    this.currentPage = 1;
    let params = {
      activeTab: this.activeTab,
      status: this.searchFilter.status
    }
    // this.getTableData();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

  pageChanged(event: any) {
    this.currentPage = event;
    if (this.activeTab === 'VEHICLES') {
      this.getVehiclesData();
    } else {
      this.getTableData();
    }
  }

  pageChangedSecond(event: any, section: any) {
    this.currentPageSecond = event;
    this.getOwnerVehicles(section.userId);
  }

  onSort(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === "DESC" ? "ASC" : "DESC";
    if (this.activeTab === 'VEHICLES') {
      this.getVehiclesData();
    } else {
      this.getTableData();
    }
  }

  searchData() {
    this.currentPage = 1;
    if (this.activeTab === 'VEHICLES') {
      this.getVehiclesData();
    } else {
      this.getTableData();
    }
  }

  checkKyc(data: any) {
    const openDtls = () => {
      this.kycForm.roleId = data.roleId;
      this.kycForm.userId = data.userId;
      this.kycForm.riskId = data.riskId;
      this.kycForm.riskType = data.riskType;
      this.isApproval = true;
      window.scrollTo({ top: 510, behavior: 'smooth' });
    }

    if (data.riskType === 'Driver') {
      const body = {
        userId: data.userId,
        driverId: data.riskId,
        loginUserId: this.gs.loggedInUserInfo.userId
      }

      this.profileService.getDriverDetails(body).subscribe(async (response: any) => {
        if (response && response.driverInfo.driverId) {
          this.viewInfoDetails = response;
          if (data.rolename === 'Driver' || data.rolename === 'Driver with owned car') {
            this.type = 'driver';
            this.kycForm.formName = 'Driver Information';
          } else {
            this.type = 'individualCarOwner';
            this.kycForm.formName = 'Car Owner Information';
          }
          openDtls();
        }
      })
    }

    if (data.riskType === 'Fleet') {
      const body = {
        userId: data.userId,
        fleetCompanyId: data.riskId,
        loginUserId: this.gs.loggedInUserInfo.userId
      }
      this.profileService.getCompanyDetailsByCompanyId(body).subscribe(async (response: any) => {
        if (response && response.response.statusCode == "200" && response.userId) {
          this.viewInfoDetails = response;
          this.type = 'fleetOwner';
          this.kycForm.formName = 'Company Information';
          openDtls();
        }
      })
    }

    if (data.riskType === 'Vendor') {
      const body = {
        userId: data.userId,
      }
      this.vendorService.GetProviderDetails(body).subscribe(async (response: any) => {
        this.type = 'vendor-profile';
        this.kycForm.formName = 'My Profile';
        this.viewInfoDetails = { providerRequest: response };
        openDtls();
      })
    }

    if (data.riskType === 'Vehicle') {
      const body = {
        userId: data.userId,
        vehicleId: data.riskId,
        loginUserId: this.gs.loggedInUserInfo.userId
      }
      this.profileService.getVehicleDetails(body).subscribe(async (response: any) => {
        if (response.response && response.response.statusCode == "200") {
          this.viewInfoDetails = response;
          this.type = 'my_vehicle';
          this.kycForm.formName = 'My Vehicles';
          openDtls();
        }
      })
    }
  }

  onViewDocument(item: any) {
    const modalRef = this.modalService.open(ViewAllDocumentsModalComponent, {
      size: 'xl'
    });
    modalRef.componentInstance.bookingDetails = item;
    modalRef.componentInstance.type = 'kycDocs';
  }

  cancelApproval() {
    this.isApproval = false;
    window.scrollTo({ top: 510, behavior: 'smooth' });
  }

  onConfirm(event: any) {
    this.isApproval = false;
    if (this.activeTab === 'VEHICLES') {
      this.getVehiclesData();
    } else {
      this.getTableData();
    }
    this.getUserKycOverviewDetails();
    window.scrollTo({ top: 510, behavior: 'smooth' });
  }

  onToggle(value: any, section: any) {
    section.isOpen = value;
    this.currentPageSecond = 1;
    if (section.isOpen) {
      this.getOwnerVehicles(section.userId);
    }
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  exportToExcel() {
    if (this.activeTab === 'VEHICLES') {
      this.exportAllVehiclesToExcel();
    } else {
      this.exportAllUsersToExcel();
    }
  }
  exportAllUsersToExcel() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "globalSearch": this.searchDataValue?.trim() || "",
      "userType": JSON.stringify([this.activeTab]),
      "status": this.searchFilter.status == 'All Status' ? null : JSON.stringify([this.searchFilter.status]),
      "startDate": startDate,
      "endDate": endDate,
      "type": this.selectedFilter,
      "loginUserId": this.gs.loggedInUserInfo.userId,
    }
    this.excelExport.exportToExcelPost(body, 'ExportAllUsersToExcel').subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      let tableData = JSON.parse(response);
      tableData = tableData.map((x: any) => ({ ...x, subCategoryList: JSON.parse(x.subCategoryName || '[]') }));
      let finalData: any = [];
      const style = {
        border: {
          top: { style: "medium" },
          left: { style: "medium" },
          bottom: { style: "medium" },
          right: { style: "medium" }
        },
        alignment: { vertical: 'middle', horizontal: 'left', wrapText: true }
      }
      const kycStatus: any = {
        "1": "ff9307",
        "2": "1fbc2f",
        "5": "1fbc2f",
        "3": "FF0000",
        "6": "FF0000",
        "4": "008B8B",
      }
      const status: any = {
        "InActive": "FF9307", // danger
        "Active": "1FBC2F", // success
      }

      for (let i in tableData) {
        finalData.push({
          "SL": {
            ...style,
            value: Number(i) + 1,
          },
          "Account Number": {
            ...style,
            value: tableData[i].userAccountNumber || '-',
          },
          "Name": {
            ...style,
            value: tableData[i].userName || '-',
          },
          "Date": {
            ...style,
            value: this.transformDate(tableData[i].createdDate, 'MM/dd/yyyy') || '-',
          },
          "Category Name": {
            ...style,
            value: tableData[i].categoryName || '-',
          },
          "Sub Category": {
            ...style,
            value: tableData[i].subCategoryName ? tableData[i].subCategoryList?.join(', ') : '-',
          },
          "KYC status": {
            ...style,
            value: tableData[i].kycStatus || '-',
            font: { bold: true, color: { argb: kycStatus[tableData[i].kycStatusCd] } },
          },
          "Status": {
            ...style,
            value: tableData[i].status || '-',
            font: { bold: true, color: { argb: status[tableData[i].status] } },
          },
        });

        if (this.activeTab != 'VENDOR') {
          delete finalData[i]['Email'];
          delete finalData[i]['Phone Number'];
          delete finalData[i]['Category Name'];
          delete finalData[i]['Sub Category'];
        }
      }
      let title = this.activeTabName + ' - ' + this.searchFilter.status;
      this.excelExport.exportToExcelCustom(finalData, "Users", title);

    });
  }

  exportAllVehiclesToExcel() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "globalSearch": this.searchDataValue?.trim() || "",
      "userType": JSON.stringify([this.activeTab]),
      "status": (!this.searchFilter.status || this.searchFilter.status === 'All Status') ? null : JSON.stringify([this.searchFilter.status]),
      "startDate": startDate,
      "endDate": endDate,
      "type": this.selectedFilter,
      "loginUserId": this.gs.loggedInUserInfo.userId,
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

      const columns = [
        { header: 'SL', key: 'sl' },
        { header: 'AC Number', key: 'userAccountNumber' },
        { header: 'Vin Number', key: 'vin' },
        { header: 'Car Name', key: 'carName' },
        { header: 'Date', key: 'createdDate' },
        { header: 'KYC status', key: 'kycStatus' },
      ];
      this.excelExport.exportToExcelWithNested(tableData, "Vehicles", title, columns);
    });
  }

}
