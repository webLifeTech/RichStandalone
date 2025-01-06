import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-branch-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './branch-info-modal.component.html',
  styleUrl: './branch-info-modal.component.scss'
})
export class BranchInfoModalComponent {
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
