import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { apiResultFormat, userBookings } from '../../../shared/services/model/model';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { DeleteModalComponent } from '../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { VendorServService } from '../../../shared/services/vendor-service.service';


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
  providers: [
    DatePipe,
    provideNativeDateAdapter()
  ],
  templateUrl: './enquiries.component.html',
  styleUrl: './enquiries.component.scss'
})
export class EnquiriesComponent {

  public tableData: any = [];
  public totalData = 0;
  public currentPage = 1;
  public searchFilter: any = {
    startDate: null,
    endDate: null,
    category: null,
    subCategory: null,
  };
  mainCatList: any = [];
  enquiries: any = [];
  filteredSubCategories: any = [
    // { Name: "All Sub Category", ID: "all" },
  ];

  constructor(
    private route: ActivatedRoute,
    public getPer: RolePermissionService,
    public cabService: CabService,
    public gs: GlobalService,
    private vendorService: VendorServService,
    private datePipe: DatePipe,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.getCategories();
      this.getProviderDetails();
    })
  }

  getCategories() {
    this.vendorService.getMasterProviderCategories().subscribe((res: any) => {
      this.mainCatList = res;
    })
  }

  getProviderDetails() {
    const body = {
      userId: this.gs.loggedInUserInfo.userId,
    }
    this.gs.isSpinnerShow = true;
    this.vendorService.GetProviderDetails(body).subscribe(async (response: any) => {
      this.getTableData(response.providerId)
    })
  }

  getTableData(providerId: any) {
    this.vendorService.GetAllProviderEnquiry({
      providerId: providerId
    }).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res && res.length) {
        this.totalData = res.length;
        this.tableData = res;
        this.enquiries = res;
      }
    })
  }

  onChangeFilter() {
    setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  resetFilter() {
    this.searchFilter.startDate = null;
    this.searchFilter.endDate = null;
    this.searchFilter.category = null;
    this.searchFilter.subCategory = null;
    setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  onChangeServices(catId: any) {
    this.applyFilters();
    this.vendorService.getMasterProviderSubCategories({
      categoryId: catId
    }).subscribe((res: any) => {
      this.filteredSubCategories = [...this.filteredSubCategories, ...res];
    })
  }


  applyFilters() {
    console.log("this.searchFilter >>>", this.searchFilter);
    console.log("this.enquiries >>>", this.enquiries);

    const { startDate, endDate, category, subCategory, searchTerm } = this.searchFilter;
    this.tableData = this.enquiries.filter((enquiry: any) => {
      let catFilter = true;
      let subCatFilter = true;
      let dateFilter = true;
      let matches = true;

      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        matches = [
          enquiry.name,
          enquiry.phoneNumber,
          enquiry.emailId,
          enquiry.category,
          enquiry.subCategory,
          enquiry.enquiryDate
        ].some(field => field.toLowerCase().includes(lower));
      }

      if (category) {
        catFilter = enquiry.categoryCd == category;
      }
      if (subCategory) {
        subCatFilter = enquiry.subCategoryCd == subCategory;
      }
      if (startDate && endDate) {
        enquiry.tempEnquiryDate = this.parseDate(enquiry.enquiryDate)
        dateFilter = (startDate <= enquiry.tempEnquiryDate && endDate >= enquiry.tempEnquiryDate);
      }

      return matches && catFilter && subCatFilter && dateFilter;
    });

    this.totalData = this.tableData.length;
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  parseDate(dateString: string) {
    if (dateString) {
      const [month, day, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    } else {
      return null;
    }
  }

}
