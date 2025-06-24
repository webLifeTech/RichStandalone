import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule, PaginationService } from 'ngx-pagination';
import { apiResultFormat, pageSelection, userBookings } from '../../../shared/services/model/model';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyCarsService } from '../../../shared/services/mycars.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { DeleteModalComponent } from '../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { CarStatusChangeModalComponent } from '../../../shared/components/comman/modal/my-car-modals/car-status-change-modal/car-status-change-modal.component';
import { ChangeCarPriceModalComponent } from '../../../shared/components/comman/modal/my-car-modals/change-car-price-modal/change-car-price-modal.component';

@Component({
  selector: 'app-my-cars',
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
  ],
  templateUrl: './my-cars.component.html',
  styleUrl: './my-cars.component.scss'
})
export class MyCarsComponent {
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

  public searchFilter: any = {
    branch: 'all',
    status: 'all',
  };
  public activeTab = '';
  activeTabName: any = '';
  total_booking_amount: any = 1200;
  total_refunded_amount: any = 200;
  total_net_profit: any = 1000;
  editInfo: any = {};
  booktabs = [
    { title: "All Cars", value: "all_cars" },
    { title: "Booked", value: "booked" },
    { title: "Available", value: "available" },
    { title: "KYC Pending", value: "kyc_pending" },
    // { title: "Cancelled", value: "cancelled" }
  ];

  vehicleStatusList: any = [
    { id: 1, name: 'All Status', value: 'all' },
    { id: 1, name: 'Active', value: 'Active' },
    { id: 2, name: 'Inactive', value: 'Inactive' },
    { id: 3, name: 'Repair', value: 'Repair' },
  ]

  branchList: any = [
    { id: 1, name: 'All Branch', value: 'all' },
    { id: 2, name: 'South zone', value: 'South zone' },
    { id: 3, name: 'Est zone', value: 'Est zone' },
  ]


  constructor(
    // private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private mycarsService: MyCarsService,
    public cabService: CabService,
    public gs: GlobalService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private toast: ToastService,

  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "all_cars";
      this.searchFilter.status = params['status'] ? params['status'] : 'all';
      this.getTableData(this.activeTab);
    })
  }

  getTableData(type: any) {
    let tabName = this.booktabs.find((item: any) => item.value === type)?.title;
    this.activeTabName = tabName;
    this.mycarsService.getMyCars().subscribe((apiRes: apiResultFormat) => {
      let allCars = apiRes.data;
      let filteredData = [];
      // if (type === "all_cars") {
      //   filteredData = allCars;
      //   if (this.searchFilter.status !== 'all') {
      //     filteredData = allCars.filter((item: any) => item.status === this.searchFilter.status);
      //   }
      // } else {
      //   if (this.searchFilter.status === 'all') {
      //     filteredData = allCars.filter((item: any) => item.vehicle_status === tabName);
      //   } else {
      //     filteredData = allCars.filter((item: any) => (item.vehicle_status === tabName && item.status === this.searchFilter.status));
      //   }
      // }

      filteredData = allCars.filter((item: any) => {
        const matchesTab = type === 'all_cars' ? item : item.vehicle_status === tabName;
        const matchesStatus = this.searchFilter.status === 'all' ? item : item.status === this.searchFilter.status;
        const matchesBranch = this.searchFilter.branch === 'all' ? item : item.branch === this.searchFilter.branch;

        return matchesTab && matchesStatus && matchesBranch;
      });

      this.totalData = filteredData.length;
      this.tableData = filteredData;

    });
  }

  selectStatus() {
    this.getTableData(this.activeTab);
  }

  selectBranch() {
    this.getTableData(this.activeTab);
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
  }
  initChecked = false;

  changeBookTab(item: any) {
    this.activeTab = item.value;
    let params = {
      activeTab: this.activeTab,
      status: "all"
    }
    this.getTableData(this.activeTab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

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


  updateCarPrice(item: any) {
    const modalRef = this.modalService.open(ChangeCarPriceModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.result.then((res: any) => {

      modalRef.result.then((res: any) => {
        if (res.confirmed) {
          item.price_per_day = res.pricing.price_per_day;
          item.price_per_week = res.pricing.price_per_week;
          item.price_per_month = res.pricing.price_per_month;
        }
      }, () => { });
    }, () => {
    });
  }

  onView(item: any) {
    const modalRef = this.modalService.open(BookingDetailsModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.bookingDetails = item;
    modalRef.result.then((res: any) => {

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
