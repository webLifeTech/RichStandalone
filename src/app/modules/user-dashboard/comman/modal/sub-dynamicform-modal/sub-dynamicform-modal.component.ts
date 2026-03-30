import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';
import { FormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-sub-dynamicform-modal',
  standalone: true,
  imports: [
    forwardRef(() => DynamicFormComponent),
    CommonModule,
    TranslateModule,
    FormsModule,
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './sub-dynamicform-modal.component.html',
  styleUrl: './sub-dynamicform-modal.component.scss'
})
export class SubDynamicFormModalComponent {
  @Input() selectedTabObj: any = {};
  @Input() kycForm: any = {};
  @Input() formType: any = "";

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
    public activeModal: NgbActiveModal,
  ) {
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  handleSubmit() {
    this.modalService.dismissAll('confirmed');
    // this.activeModal.close({ confirmed: true });
  }
  handleCancel() {
    this.modalService.dismissAll();
  }

}
