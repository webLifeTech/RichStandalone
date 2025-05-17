import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { InformationModalComponent } from '../../../shared/components/comman/modal/information-modal/information-modal.component';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgxPaginationModule,
    RouterLink
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent {

  @Input() singleProvider: any = {};
  // @Input() servicSearchResult: any = [];
  @Input() searchDetails: any = {};
  @Output() viewAction = new EventEmitter<any>();

  currentPage: number = 1;
  pageSize: number = 5;

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
    public auth: AuthService,
  ) {
    // this.route.queryParams.subscribe((params: any) => {
    //   console.log("params >>>>>", params);
    //   this.currentPage = params.currentPage;
    // })
  }

  // setPage(page: number) {
  //   this.currentPage = page;
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: { currentPage: page },
  //     queryParamsHandling: "merge"
  //   });
  // }

  openEnquirieModal(providerDetails: any) {
    // if (!this.auth.isLoggedIn) {
    //   const modalRef = this.modalService.open(InformationModalComponent, {
    //     centered: true,
    //   });
    //   modalRef.componentInstance.title = "Please login to book";
    //   modalRef.result.then((res: any) => {
    //     if (res.confirmed) {
    //       this.router.navigateByUrl('/auth/log-in');
    //     }
    //   }, () => { });
    //   return;
    // }
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

  viewDetails(item: any) {
    this.viewAction.emit(item);
  }
}
