import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceTemplateComponent } from '../../../../shared/components/comman/email-template/invoice-template/invoice-template.component';

@Component({
  selector: 'app-cab-booking-success',
  standalone: true,
  imports: [
    InvoiceTemplateComponent,

    CommonModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './cab-booking-success.component.html',
  styleUrl: './cab-booking-success.component.scss'
})
export class CabBookingSuccessComponent {

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'booking success';
  public parent = 'Home';
  public child = 'booking success';
  public type = '';
  public params: any = {};
  public cryptoTransaction: any = {};
  public isShowInvoice: boolean = false;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
  ) {
    this.type = route.snapshot.params['type'];
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      if (this.params.paymentType === 'crypto') {
        this.cryptoTransaction = localStorage.getItem('cryptoTransaction') ? JSON.parse(localStorage.getItem('cryptoTransaction') || "{}") : {};
      }
    })
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
  checkCryptoStatus() {
    window.open(this.cryptoTransaction.status_url, "_blank");
  }

  back() {
    this.router.navigate(['/cab/listing/list-view'], {
      queryParams: {
        'type': this.type
      },
      queryParamsHandling: "merge"
    });
  }
}
