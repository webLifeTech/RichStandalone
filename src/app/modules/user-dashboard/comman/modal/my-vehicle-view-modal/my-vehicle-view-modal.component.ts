import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-vehicle-view-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './my-vehicle-view-modal.component.html',
  styleUrl: './my-vehicle-view-modal.component.scss'
})
export class MyVehicleViewModalComponent {
  @Input() singleDetails: any = {};

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService
  ) {
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
