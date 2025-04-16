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
  providers: [provideNativeDateAdapter()],
  templateUrl: './enquiries.component.html',
  styleUrl: './enquiries.component.scss'
})
export class EnquiriesComponent {

  public tableData: any = [];
  public totalData = 0;
  public currentPage = 1;
  public searchFilter: any = {
    dateRang: null,
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
    this.applyFilters();
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

    const { dateFrom, dateTo, category, subCategory, searchTerm } = this.searchFilter;

    this.tableData = this.enquiries.filter((enquiry: any) => {


      // const enquiryDate = new Date(enquiry.enquiryDate.split('/').reverse().join('-'));

      // // if (dateFrom && enquiryDate < new Date(dateFrom)) return false;
      // // if (dateTo && enquiryDate > new Date(dateTo)) return false;

      // if (category && enquiry.categoryCd != category) return false;
      // const catmatches = [
      //   enquiry.category,
      //   enquiry.categoryCd,
      // ].some(field => field.includes(category));

      // const subcatmatches = [
      //   enquiry.subCategoryCd,
      // ].some(field => field == subCategory);
      // // if (subCategory && enquiry.subCategoryCd != subCategory) return false;

      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        const matches = [
          enquiry.name,
          enquiry.phoneNumber,
          enquiry.emailId,
          enquiry.category,
          enquiry.subCategory,
          enquiry.enquiryDate
        ].some(field => field.toLowerCase().includes(lower));
        console.log("matches >>>>>>", matches);

        if (!matches) return false;
      }

      // const emailMatch = enquiry.toLowerCase().includes(lower)
      // const statusMatch = inv.status === filter.status
      // return emailMatch || statusMatch
      return true;
    });
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }

}
