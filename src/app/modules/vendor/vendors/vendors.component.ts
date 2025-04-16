import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GlobalService } from '../../../shared/services/global.service';

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
    private gs: GlobalService,
  ) {

  }
}
