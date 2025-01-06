import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './company-info-modal.component.html',
  styleUrl: './company-info-modal.component.scss'
})
export class CompanyInfoModalComponent {
  @Input() fleetOwnerInfoData: any = {};

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService
  ) {
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
