import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnquiriesModalComponent } from '../../../shared/components/comman/modal/enquiries-modal/enquiries-modal.component';
import { OtpVerificationModalComponent } from '../../user-dashboard/user-settings/modals/otp-verification-modal/otp-verification-modal.component';
import { VerificationSuccessModalComponent } from '../../user-dashboard/user-settings/modals/verification-success-modal/verification-success-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { ToastService } from '../../../shared/services/toast.service';
import { VendorServService } from '../../../shared/services/vendor-service.service';
import { PaginationService } from '../../../shared/services/pagination.service';
import { pagination } from '../../../shared/interface/cab';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgxPaginationModule,
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent {

  @Input() servicSearchResult: any = [];
  @Input() searchDetails: any = {};

  currentPage: number = 1;
  pageSize: number = 1;

  providerCategories: any = [];
  searchObj: any = {
    location: "",
    category: "",
    subCategory: [],
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      console.log("params >>>>>", params);
      this.currentPage = params.currentPage;
    })
  }

  setPage(page: number) {
    this.currentPage = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { currentPage: page },
      queryParamsHandling: "merge"
    });
  }

  openEnquirieModal(providerDetails: any) {
    const modalRef = this.modalService.open(EnquiriesModalComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.providerDetails = providerDetails;
    modalRef.componentInstance.searchDetails = this.searchDetails.categoryInfo;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
      }
    }, () => {
    });
  }
}
