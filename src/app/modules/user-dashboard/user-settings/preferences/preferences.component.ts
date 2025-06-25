import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../shared/services/toast.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { routes } from '../../../../app.routes';
import { MatSelectModule } from '@angular/material/select';
interface data {
  value: string;
}
@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgbModule,
    MatSelectModule
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss'
})
export class PreferencesComponent {
  public routes = routes;
  public selectedValue1!: string;
  public selectedValue2!: string;
  selectedList1: data[] = [
    { value: 'English' },
    { value: 'Japanese' },

  ];
  selectedList2: data[] = [
    { value: 'United States (English)' },
    { value: 'Japan (Japanese)' },

  ];

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
