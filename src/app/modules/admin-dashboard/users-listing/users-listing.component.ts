import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalService } from '../../../shared/services/global.service';
import { CarStatusChangeModalComponent } from '../../../shared/components/comman/modal/my-car-modals/car-status-change-modal/car-status-change-modal.component';
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
    status: 'All Status',
  };
  public activeTab = '';
  sortColumn: any = "";
  sortOrder: any = "DESC";

  tabs: any = [];

  vehicleStatusList: any = [
    { id: 1, name: 'All Status', value: 'All Status' },
    { id: 1, name: 'Active', value: 'Active' },
    { id: 3, name: 'Inactive', value: 'Inactive' },
    { id: 3, name: "KYC Pending", value: "KYC Pending" },
  ]


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    public cabService: CabService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private toast: ToastService,

  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "All Users";
      this.searchFilter.status = params['status'] ? params['status'] : 'All Status';
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
      "userStatus": this.searchFilter.status == 'All Status' ? null : JSON.stringify([this.searchFilter.status]),
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
      status: "All Status"
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
    const modalRef = this.modalService.open(CarStatusChangeModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.componentInstance.mainTitle = 'Change User Status';
    modalRef.componentInstance.title = 'Are sure you want to change status ?';
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        const body = {
          userId: item.userId,
          userStatus: res.status == "Active" ? true : false,
          reason: "",
        }
        this.gs.isSpinnerShow = true;
        this.adminService.UpdateUserStatus(body).subscribe((response) => {
          this.gs.isSpinnerShow = false;
          if (response && response.statusCode == "200") {
            this.toast.successToastr("Status successfully");
            this.getTableData();
          } else {
            this.toast.errorToastr(response.message);
          }
        })
      }
    }, () => { });
  }

  searchData() {
    this.currentPage = 1;
    this.getTableData();
  }

  exportToExcel() {
    const body = {
      "pageNumber": 1,
      "pagesize": this.totalData,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "userType": JSON.stringify([this.activeTab]),
      "userStatus": this.searchFilter.status == 'All Status' ? null : JSON.stringify([this.searchFilter.status]),
    }
    this.adminService.GetAllUsersForAdmin(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        let tableData = response.allUsers;
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
          "KYC Pending": "FF0000",
          "Completed": "1FBC2F"
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
            "User Name": {
              ...style,
              value: tableData[i].userName || '-',
            },
            "User Type": {
              ...style,
              value: tableData[i].rolename || '-',
            },
            "License Number": {
              ...style,
              value: tableData[i].licenseNumber || '-',
            },
            "KYC status": {
              ...style,
              value: tableData[i].kycStatus || '-',
              font: { bold: true, color: { argb: kycStatus[tableData[i].kycStatus] } },
            },
            "Email": {
              ...style,
              value: tableData[i].emailId || '-',
            },
            "Phone Number": {
              ...style,
              value: tableData[i].phoneNumber || '-',
            },
            "Category Name": {
              ...style,
              value: tableData[i].categoryName || '-',
            },
            "Sub Category": {
              ...style,
              value: tableData[i].subCategoryName || '-',
            },
            "Status": {
              ...style,
              value: tableData[i].status || '-',
              font: { bold: true, color: { argb: status[tableData[i].status] } },
            },
          });

          if (this.activeTab == 'Vendor') {
            delete finalData[i]['User Type'];
            delete finalData[i]['License Number'];
            delete finalData[i]['KYC status'];
          }
          if (this.activeTab != 'Vendor') {
            delete finalData[i]['Email'];
            delete finalData[i]['Phone Number'];
            delete finalData[i]['Category Name'];
            delete finalData[i]['Sub Category'];
          }
        }
        let title = this.activeTab + ' - ' + this.searchFilter.status;
        this.gs.exportToExcelCustom(finalData, "Users", title);
      } else {
        this.toast.errorToastr(response.message);
      }
    });
  }

}
