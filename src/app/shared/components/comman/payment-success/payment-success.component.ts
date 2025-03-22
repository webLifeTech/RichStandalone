import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionTemplateComponent } from '../email-template/subscription-template/subscription-template.component';
import { PricingService } from '../../../services/pricing.service';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [
    SubscriptionTemplateComponent,

    CommonModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent {
  @Output() onHandleBack = new EventEmitter<any>();

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'booking success';
  public parent = 'Home';
  public child = 'booking success';
  public type = 'pricing';
  public isShowInvoice: boolean = false;
  currentPlan: any = {};

  constructor(
    public route: ActivatedRoute,
    public gs: GlobalService,
    private pricingS: PricingService,
    private router: Router,
  ) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getCurrentPackageDetails();
  }

  ngOnInit() {
    document.documentElement.style.setProperty('--theme-color1', '233, 179, 14');
    document.documentElement.style.setProperty('--theme-color2', '233, 179, 14');
  }

  ngOnDestroy() {
    document.documentElement.style.removeProperty('--theme-color1');
    document.documentElement.style.removeProperty('--theme-color2');
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

  downloadInvoice() {
    this.isShowInvoice = true;
  }

  backToPackage() {
    this.router.navigate(['/user/master-configuration', 'Upgrade'], {
      queryParams: { packageId: null },
      queryParamsHandling: "merge"
    });
    this.onHandleBack.emit(1)
  }
}
