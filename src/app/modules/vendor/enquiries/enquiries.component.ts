import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { apiResultFormat, userBookings } from '../../../shared/services/model/model';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { DeleteModalComponent } from '../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { ReviewService } from '../../../shared/services/review.service';
import { BarRating, BarRatingModule } from 'ngx-bar-rating';
import { WriteReviewModalComponent } from '../../../shared/components/comman/modal/booking-modals/write-review-modal/write-review-modal.component';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-enquiries',
  standalone: true,
  imports: [
    DeleteModalComponent,
    BookingDetailsModalComponent,

    CommonModule,
    FormsModule,
    NgbModule,
    MatButtonModule,
    NgxPaginationModule,
    MatFormFieldModule,
    MatDatepickerModule,
    NgSelectModule,
    TranslateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './enquiries.component.html',
  styleUrl: './enquiries.component.scss'
})
export class EnquiriesComponent {

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
    category: "5",
    sub_category: "all",
  };

  total_booking_amount: any = 1200;
  total_refunded_amount: any = 200;
  total_net_profit: any = 1000;
  editInfo: any = {};

  mainCatList = [
    {
      name: 'All Category',
      id: "5",
      logo: 'https://content.jdmagicbox.com/comp/vadodara/62/0265p265std160662/catalogue/kalpeshkumar-j-parekh-makarpura-vadodara-lawyers-0p6urwx8zi.jpg',
    },
    {
      name: 'Attorney',
      id: "1",
      logo: 'https://content.jdmagicbox.com/comp/vadodara/62/0265p265std160662/catalogue/kalpeshkumar-j-parekh-makarpura-vadodara-lawyers-0p6urwx8zi.jpg',
    },
    {
      name: 'Mortgage brokers',
      id: "2",
      logo: 'https://assets.bizclikmedia.net/668/033068c58c737acd3de0c69df92e5828:017186ccbc78d5d6b9ad8cb45995b45e/fannae-mae-1.jpg',
    },
    {
      name: 'Insurance Agent',
      id: "3",
      logo: 'https://cdn-icons-png.freepik.com/512/4599/4599163.png',
    },
    {
      name: 'Vehicle Inspections',
      id: "4",
      logo: 'https://static.thenounproject.com/png/1076534-200.png',
    },
  ]

  filteredSubCategories: any = [
    { parentId: null, name: "All Sub Category", value: "all" },
  ];
  subCategories = [
    { parentId: "1", name: "Bankruptcy", value: "Bankruptcy" },
    { parentId: "1", name: "Contracts", value: "Contracts" },
    { parentId: "1", name: "Criminal defense", value: "Criminal defense" },
    { parentId: "1", name: "Family and estate", value: "Family and estate" },
    { parentId: "1", name: "General litigation", value: "General litigation" },
    { parentId: "1", name: "Government", value: "Government" },
    { parentId: "1", name: "Health, injury and disability", value: "Health, injury and disability" },
    { parentId: "1", name: "Real estate", value: "Real estate" },
    { parentId: "1", name: "Vehicular", value: "Vehicular" },

    { parentId: "2", name: "Auto", value: "Auto" },
    { parentId: "2", name: "Business", value: "Business" },
    { parentId: "2", name: "Credit card", value: "Credit card" },
    { parentId: "2", name: "Mortgage", value: "Mortgage" },
    { parentId: "2", name: "Personal", value: "Personal" },
    { parentId: "2", name: "Student", value: "Student" },
    { parentId: "2", name: "Title", value: "Title" },


    { parentId: "3", name: "Business", value: "Business" },
    { parentId: "3", name: "Health", value: "Health" },
    { parentId: "3", name: "Identity protection", value: "Identity protection" },
    { parentId: "3", name: "Jewelry", value: "Jewelry" },
    { parentId: "3", name: "Life", value: "Life" },
    { parentId: "3", name: "Overseas", value: "Overseas" },
    { parentId: "3", name: "Pet", value: "Pet" },
    { parentId: "3", name: "Property", value: "Property" },
    { parentId: "3", name: "Travel", value: "Travel" },
    { parentId: "3", name: "Umbrella", value: "Umbrella" },
    { parentId: "3", name: "Vehicle", value: "Vehicle" },

    { parentId: "4", name: "Car Inspectors", value: "Car Inspectors" },
    { parentId: "4", name: "Oil Change Stations", value: "Oil Change Stations" },
    { parentId: "4", name: "Auto Repair", value: "Auto Repair" },
    { parentId: "4", name: "Transmission Repair", value: "Transmission Repair" },
    { parentId: "4", name: "Smog Check Stations", value: "Smog Check Stations" },
    { parentId: "4", name: "Tires", value: "Tires" },
  ]

  constructor(
    private route: ActivatedRoute,
    public getPer: RolePermissionService,
    public cabService: CabService,
    public gs: GlobalService,

  ) {
    this.route.queryParams.subscribe((params) => {
      this.getTableData();
    })
  }

  getTableData() {
    this.gs.getEnquiries().subscribe((apiRes: apiResultFormat) => {
      this.totalData = apiRes.totalData;
      this.tableData = apiRes.data;
    });
  }

  onChangeServices(value: any) {
    console.log("value >>>>", value);
    const selected: any = this.mainCatList.find((item: any) => item.id === value);
    this.filteredSubCategories = this.subCategories.filter((item: any) => item.parentId === selected.id);
    this.filteredSubCategories.unshift(
      { parentId: null, name: "All Sub Category", value: "all" },
    )
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }

  onView(item: any) {

  }

}
