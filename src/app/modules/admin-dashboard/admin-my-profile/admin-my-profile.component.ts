import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalService } from '../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../../shared/services/profile.service';
import { DynamicFormComponent } from '../../user-dashboard/comman/dynamic-form/dynamic-form.component';
import { DynamicGridComponent } from '../../user-dashboard/comman/dynamic-grid/dynamic-grid.component';
import { DriverDetailsFormComponent } from '../../user-dashboard/comman/driver-details-form/driver-details-form.component';
import { PaymentOptionListComponent } from '../../user-dashboard/comman/account-info/payment-option-list/payment-option-list.component';
import { BranchbranchListComponent } from '../../user-dashboard/comman/branch-info/branch-list/branch-list.component';
import { PricingComponent } from '../../other/pricing/pricing.component';
import { PlanSubscribeComponent } from '../../other/pricing/plan-subscribe/plan-subscribe.component';
import { PackageCardComponent } from '../../other/pricing/package-card/package-card.component';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { PaymentSuccessComponent } from '../../../shared/components/comman/payment-success/payment-success.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PackageSubscriptionComponent } from '../../user-dashboard/comman/package-subscription/package-subscription.component';
import { BranchService } from '../../../shared/services/branch.service';
import { NftsInfoComponent } from '../../user-dashboard/comman/nfts-info/nfts-info.component';

@Component({
  selector: 'app-admin-my-profile',
  standalone: true,
  imports: [
    NftsInfoComponent,
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    NgxPaginationModule,
  ],
  templateUrl: './admin-my-profile.component.html',
  styleUrl: './admin-my-profile.component.scss'
})
export class AdminMyProfileComponent {
  activeKycTab: any = 13;
  sidebarTabs: any = [
    {
      "menuId": 0,
      "roleName": "B5107AB1-19BF-430B-9553-76F39DB1CDCD",
      "transactionId": 1,
      "languageId": "1",
      "formId": 13,
      "formName": "NFTS",
      "description": "NFTS",
      "formClass": null,
      "formIcon": "feather icon-cpu",
      "formAction": null,
      "isVisible": true,
      "isActive": false,
      "priority": 6
    }
  ];


  constructor(
    public gs: GlobalService,
  ) {

  }

  changeKycTab(tab: any) {

  }



}
