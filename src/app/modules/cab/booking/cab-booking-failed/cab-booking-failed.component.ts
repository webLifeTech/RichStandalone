import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cab-booking-failed',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './cab-booking-failed.component.html',
  styleUrl: './cab-booking-failed.component.scss'
})
export class CabBookingFailedComponent {

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'payment failed';
  public parent = 'Home';
  public child = 'payment failed';

  public itemId = '';
  public params: Params;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.itemId = route.snapshot.params['id'];
    this.route.queryParams.subscribe((params) => {
      this.params = params;
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

  tryAgain() {
    this.router.navigate(['/cab/booking/booking-payment', this.itemId], {
      queryParams: this.params,
      queryParamsHandling: "merge"
    });
  }
}
