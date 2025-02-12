import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { HtmlTextComponent } from '../../html-text/html-text.component';
import { ProfileService } from '../../../../services/profile.service';
import { GlobalService } from '../../../../services/global.service';

@Component({
  selector: 'app-t-and-c-modal',
  standalone: true,
  imports: [
    HtmlTextComponent,
    CommonModule,
    NgSelectModule,
    FormsModule
  ],
  templateUrl: './t-and-c-modal.component.html',
  styleUrl: './t-and-c-modal.component.scss'
})
export class TermsAndCModalComponent {

  @Input() termCode: any;
  content: any = "";
  termsAndConditionsObj: any = {};

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private profileService: ProfileService,
    public gs: GlobalService,
  ) { }

  ngOnInit() {
    console.log("termCode >>>>>", this.termCode);

    this.getTermsAndConditions();
  }

  getTermsAndConditions() {
    let body = {
      "code": this.termCode,
    }
    this.profileService.getTermsAndConditions(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.id) {
        this.termsAndConditionsObj = response;
        this.content = response.description;
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onConfirm() {
    this.activeModal.close({ confirmed: true });
  }
}
