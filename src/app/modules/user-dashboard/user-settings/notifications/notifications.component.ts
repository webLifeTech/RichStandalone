import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../shared/services/toast.service';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,
    RouterLink,
    NgbModule,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {


  constructor(
    // private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    public gs: GlobalService,
    private modalService: NgbModal,

  ) {
    this.route.queryParams.subscribe((params) => {
    })
  }

}
