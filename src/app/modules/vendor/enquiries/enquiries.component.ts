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
    providerName: null,
    globalSearch: null,
  };
  mainCatList: any = [];
  enquiries: any = [];
  filteredSubCategories: any = [
    // { Name: "All Sub Category", ID: "all" },
  ];
  providerList: any = [];

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

    })
  }

  getCategories() {
    this.vendorService.getMasterProviderCategories().subscribe((res: any) => {
      this.mainCatList = res;
      this.getProviderDetails();
    })
  }

  getProviderDetails() {
    const body = {
      userId: this.gs.loggedInUserInfo.userId,
    }
    this.gs.isSpinnerShow = true;
    this.vendorService.GetProviderDetails(body).subscribe(async (response: any) => {
      const slcdCat = this.mainCatList.find((item: any) => item.ID === Number(response.categoryCd)) || {};
      this.searchFilter.category = slcdCat.Name || null;
      if (this.searchFilter.category) {
        this.onChangeServices(slcdCat);
      }
      this.getTableData();
    })
  }

  getTableData() {
    console.log(".......startDate", this.searchFilter.startDate);
    console.log(".......endDate", this.searchFilter.endDate);

    const body = {
      "searchCriteria": {
        "userId": this.gs.loggedInUserInfo.userId,
        "pageNumber": this.currentPage,
        "pagesize": 10,
        "globalSearch": this.searchFilter.globalSearch || null
      },
      "filterCriteria": {
        "category": this.searchFilter.category || null, // "Mortgage brokers"
        "subCategory": this.searchFilter.subCategory ? JSON.stringify([this.searchFilter.subCategory]) : null, // "[\"Personal Loans\",\"Home Loans\"]"
        "startDate": this.searchFilter.startDate ? this.datePipe.transform(this.searchFilter.startDate, 'MM/dd/yyyy') : null,
        "endDate": this.searchFilter.endDate ? this.datePipe.transform(this.searchFilter.endDate, 'MM/dd/yyyy') : null,
        "companyName": this.searchFilter.providerName || null
      }
    }
    //  providerId: providerId
    this.gs.isSpinnerShow = true;
    this.vendorService.GetAllProviderEnquiry(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res && res.responseResultDtos && res.responseResultDtos.statusCode === "200") {
        const aggFilters = JSON.parse(res.aggregateFilters);
        console.log("aggFilters >>>>>", aggFilters);
        this.providerList = aggFilters.filter((item: any) => item.CompanyName);
        this.tableData = res.providerEnquiryMatches;
        this.totalData = res.viewModel.totalCount;
      }
    })
  }

  onChangeFilter() {
    setTimeout(() => {
      this.currentPage = 1;
      console.log("searchFilter.category >>>>", this.searchFilter.category);
      this.getTableData();
    }, 500);
  }

  resetFilter() {
    this.searchFilter.startDate = null;
    this.searchFilter.endDate = null;
    this.searchFilter.category = null;
    this.searchFilter.subCategory = null;
    this.searchFilter.providerName = null;
    this.searchFilter.globalSearch = null;
    this.onChangeFilter();
  }


  onChangeServices(event: any) {
    this.onChangeFilter();
    this.vendorService.getMasterProviderSubCategories({
      categoryId: event.ID
    }).subscribe((res: any) => {
      this.filteredSubCategories = res;
    })
  }

  selectProvider(event: any) {
    this.searchFilter.category = null;
    this.searchFilter.subCategory = null;
    this.searchFilter.category = event.Category || null;
    if (this.searchFilter.category) {
      this.onChangeServices({ ID: event.CategoryCd });
    }
  }


  applyFilters() {
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
    this.getTableData();
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
