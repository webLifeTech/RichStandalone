import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../shared/services/global.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { PricingService } from '../../../../shared/services/pricing.service';
import { PricingComponent } from '../../../other/pricing/pricing.component';

@Component({
  selector: 'app-package-subscription',
  standalone: true,
  imports: [
    PricingComponent,

    CommonModule,
    TranslateModule,
    NgbModule,
    CurrencySymbolPipe,
    NgxPaginationModule
  ],
  templateUrl: './package-subscription.component.html',
  styleUrl: './package-subscription.component.scss'
})
export class PackageSubscriptionComponent {
  @Input() item: any = {};
  @Input() isUpgradePlan: boolean = false;
  @Output() onSubscribe = new EventEmitter<any>();
  @Output() onHandleSubscribed = new EventEmitter<any>();
  @Output() onHandleUpgradePlan = new EventEmitter<any>();
  params: any = {};

  // isUpgradePlan: boolean = true;
  // subscriptionStep: any = 1;

  public lastIndex = 0;
  public pageSize = 10;
  public totalRecord = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection = [];
  public tableData: any = [];
  public totalPages = 0;

  currentPlan: any = {}

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cabService: CabService,
    public gs: GlobalService,
    private pricingS: PricingService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.getCurrentPackageDetails();
    })
  }

  ngOnInit() {
    this.getSubcriptionHistory();
  }

  getCurrentPackageDetails() {
    let body = {
      "userId": this.gs.loggedInUserInfo.userId || null,
    }
    this.gs.isSpinnerShow = true;
    this.pricingS.getCurrentPackageDetails(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("getCurrentPackageDetails >>>>>", response);
      if (response && response.package) {
        this.currentPlan = response;
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
  }

  getSubcriptionHistory() {
    let body = {
      "userId": this.gs.loggedInUserInfo.userId || null,
    }
    this.gs.isSpinnerShow = true;
    this.pricingS.getSubcriptionHistory(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("getSubcriptionHistory >>>>>", response);
      if (response && response.length) {
        this.tableData = response;
        this.totalRecord = response.length;
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
  }

  subscribe(item: any) {
    this.onSubscribe.emit(item)
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }

  handleSubscribed() {
    this.onHandleSubscribed.emit(null);
  }

  handleRenew() {
    this.router.navigate(['/user/configuration'], { // , 'Renew'
      queryParams: { packageId: this.currentPlan?.package?.packageId, packageStatus: 'Renew' },
      queryParamsHandling: "merge"
    });
    this.onHandleSubscribed.emit(null);
  }

  onUpgradePlan() {
    this.onHandleUpgradePlan.emit(null);
  }
}
