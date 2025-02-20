import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';
import { CabPromoCodeComponent } from '../../../cab/booking/widgets/cab-promo-code/cab-promo-code.component';
import { BookingCreditCardComponent } from '../../../../shared/components/comman/booking/booking-credit-card/booking-credit-card.component';
import { BookingMyWalletComponent } from '../../../../shared/components/comman/booking/booking-my-wallet/booking-my-wallet.component';
import { BookingNetBankingComponent } from '../../../../shared/components/comman/booking/booking-net-banking/booking-net-banking.component';
import { cabDetails } from '../../../../shared/interface/cab';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../shared/services/global.service';
import { PricingService } from '../../../../shared/services/pricing.service';
import { FormsModule } from '@angular/forms';
import { TermsAndCModalComponent } from '../../../../shared/components/comman/modal/t-and-c-modal/t-and-c-modal.component';

@Component({
  selector: 'app-plan-subscribe',
  standalone: true,
  imports: [
    CabPromoCodeComponent,
    BookingCreditCardComponent,
    BookingMyWalletComponent,
    BookingNetBankingComponent,
    CommonModule,
    TranslateModule,
    NgbModule,
    CurrencySymbolPipe,
    FormsModule
  ],
  templateUrl: './plan-subscribe.component.html',
  styleUrl: './plan-subscribe.component.scss'
})
export class PlanSubscribeComponent {
  @Input() from: string;
  @Output() onHandleBack = new EventEmitter<any>();
  @Output() onHandleSubmit = new EventEmitter<any>();

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'cab payment';
  public parent = 'Home';
  public child = 'cab payment';
  public packageId = '';
  public packageFor = '';
  public searchFrom = 'checkout';
  public params: Params;
  public cabDetail: cabDetails;
  isAgreeTerms: boolean = false;

  packageObj: any = {
    "plan_name": "Basic/Free Plan",
    "title": "Basic",
    "price": "Free",
    "color": "#888888",
    "package_for": "driver",
    "id": "11",
    "benefits": [
      {
        "name": "Searchable/Visibility",
        "value": "Last"
      },
      {
        "name": "Number of Days",
        "value": "30 days"
      },
      {
        "name": "No.Orders",
        "value": "10"
      },
      {
        "name": "Transaction Fees",
        "value": " 25 $/ Pre Order"
      }
    ]
  };

  constructor(
    public cabService: CabService,
    private router: Router,
    private route: ActivatedRoute,
    private pricingS: PricingService,
    public gs: GlobalService,
    private modalService: NgbModal,
  ) {
    this.packageId = route.snapshot.params['packageId'];
    this.packageFor = route.snapshot.params['packageFor'];
    this.route.queryParams.subscribe((params) => {
      this.params = params;

    })
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.getPricingDetails();
    this.cabService.getCabById().subscribe(response => {
      this.cabDetail = response;
    })
  }

  getPricingDetails() {
    this.pricingS.getPricingById({
      packageId: this.packageId,
      packageFor: this.packageFor
    }).subscribe((apiRes: any) => {
      // this.obj = apiRes;
      // this.pricingList = apiRes['driver_package'];
    });
  }


  viewTermsConditions() {
    const modalRef = this.modalService.open(TermsAndCModalComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.termCode = "D_KYC_TC";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.isAgreeTerms = true;
      }
    }, () => {
    });
  }

  payNow() {
    this.onHandleSubmit.emit(null)
    // this.router.navigate(['/pricing/payment-success']);
  }

  bookCancel() {
    this.router.navigate(['/pricing'], {
      queryParams: this.params,
      queryParamsHandling: "merge"
    });
  }

  backToPackage() {
    this.onHandleBack.emit(1)
  }
}
