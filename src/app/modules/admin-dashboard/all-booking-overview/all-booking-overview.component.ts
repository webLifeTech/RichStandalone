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
import { BookingService } from '../../../shared/services/booking.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { DriversBookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/drivers-booking-details-modal/drivers-booking-details-modal.component';

@Component({
  selector: 'app-all-booking-overview',
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
  templateUrl: './all-booking-overview.component.html',
  styleUrl: './all-booking-overview.component.scss'
})
export class AllBookingOverviewComponent {
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

  public activeTab = '';
  public activeTypes = '';
  activeTabName: any = '';
  total_booking_amount: any = 1200;
  total_refunded_amount: any = 200;
  total_net_profit: any = 1000;
  editInfo: any = {};
  public searchFilter: any = {
    // user_type: 'all',
    status: 'all_bookings',
  };
  booktabs = [
    { id: 1, title: 'Car Owner', value: 'Car Owner' },
    { id: 2, title: 'Fleet Company', value: 'Fleet Company' },
    { id: 3, title: 'Driver Owned Car', value: 'Driver Owned Car' },
  ]
  bookTypes = [
    { title: "Cars", value: "cars" },
    { title: "Drivers", value: "drivers" },
  ]
  vehicleStatusList: any = [
    { name: "All Bookings", value: "all_bookings" },
    { name: "Upcoming", value: "Upcoming" },
    { name: "Inprogress", value: "Inprogress" },
    { name: "Completed", value: "Completed" },
  ]

  driverBooktabs = [
    { title: "All Bookings", value: "all_bookings" },
    { title: "Upcoming", value: "upcoming" },
    { title: "Inprogress", value: "inprogress" },
    { title: "Completed", value: "completed" },
  ]
  constructor(
    // private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    public cabService: CabService,
    public gs: GlobalService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private toast: ToastService,

  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTypes = params['activeTypes'] ? params['activeTypes'] : "cars";
      if (this.activeTypes === 'cars') {
        this.activeTab = params['activeTab'] ? params['activeTab'] : "Car Owner";
      }
      if (this.activeTypes === 'drivers') {
        this.activeTab = params['activeTab'] ? params['activeTab'] : "all_bookings";
      }
      this.getTableData(this.activeTab);
    })
  }

  getTableData(type: any) {
    let filteredData = [];

    if (this.activeTypes === 'cars') {
      let tabName = this.booktabs.find((item: any) => item.value === type)?.title;
      this.activeTabName = tabName;
      this.bookingService.getBookedCars().subscribe((apiRes: apiResultFormat) => {
        let allCars = apiRes.data;
        filteredData = allCars.filter((item: any) => {
          const matchesTab = type === 'all' ? item : item.ownerDetails.user_type === tabName;
          const matchesStatus = this.searchFilter.status === 'all_bookings' ? item : item.status === this.searchFilter.status;
          // const matchesBranch = this.searchFilter.branch === 'all' ? item : item.branch === this.searchFilter.branch;
          // && matchesBranch && matchesStatus
          return matchesTab && matchesStatus;
        });
        this.totalData = filteredData.length;
        this.tableData = filteredData;
      });
    }

    if (this.activeTypes === 'drivers') {
      let tabName = this.driverBooktabs.find((item: any) => item.value === type)?.title;
      this.activeTabName = tabName;
      this.bookingService.getBookedDrivers().subscribe((apiRes: apiResultFormat) => {
        let allCars = apiRes.data;
        filteredData = allCars.filter((item: any) => {
          const matchesTab = type === 'all_bookings' ? item : item.status === tabName;
          // const matchesStatus = this.searchFilter.status === 'all' ? item : item.status === this.searchFilter.status;
          // const matchesBranch = this.searchFilter.branch === 'all' ? item : item.branch === this.searchFilter.branch;
          // && matchesBranch && matchesStatus
          return matchesTab;
        });
        this.totalData = filteredData.length;
        this.tableData = filteredData;
      });
    }

  }


  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
  }
  initChecked = false;

  changeBookTab(item: any) {
    // item.isSelected = true;
    this.activeTab = item.value;
    // log
    let params = {
      activeTypes: this.activeTypes,
      activeTab: this.activeTab
    }
    this.getTableData(this.activeTab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

  changeTypes(item: any) {
    // item.isSelected = true;
    this.activeTypes = item.value;
    if (item.value === 'cars') {
      this.activeTab = "Car Owner";
    }
    if (item.value === 'drivers') {
      this.activeTab = "all_bookings";
    }
    let params = {
      activeTypes: this.activeTypes,
      activeTab: this.activeTab,
    }
    this.getTableData(this.activeTab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

  selectStatus() {
    this.getTableData(this.activeTab);
  }

  pageChanged(event: any) {
    this.currentPage = event;
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

  onViewDriversBooking(item: any) {
    const modalRef = this.modalService.open(DriversBookingDetailsModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.bookingDetails = item;
    modalRef.result.then((res: any) => {
    }, () => {
    });
  }

}
