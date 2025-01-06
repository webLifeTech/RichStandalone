import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionTemplateComponent } from '../email-template/subscription-template/subscription-template.component';

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

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'booking success';
  public parent = 'Home';
  public child = 'booking success';
  public type = 'pricing';
  public isShowInvoice: boolean = false;

  constructor(
    public route: ActivatedRoute
  ) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    document.documentElement.style.setProperty('--theme-color1', '233, 179, 14');
    document.documentElement.style.setProperty('--theme-color2', '233, 179, 14');
  }

  ngOnDestroy() {
    document.documentElement.style.removeProperty('--theme-color1');
    document.documentElement.style.removeProperty('--theme-color2');
  }

  downloadInvoice() {
    this.isShowInvoice = true;
  }
}
