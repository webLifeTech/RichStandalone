import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.scss'
})
export class VendorsComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      if (params && params.type) {
        this.router.navigate(['/auth/log-in'], {
          queryParams: params,
        });
      }
    })
    // this.router.navigateByUrl('/auth/log-in');
  }
}
