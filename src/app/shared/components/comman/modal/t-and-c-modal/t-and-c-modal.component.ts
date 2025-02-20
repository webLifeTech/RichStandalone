import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { HtmlTextComponent } from '../../html-text/html-text.component';
import { ProfileService } from '../../../../services/profile.service';
import { GlobalService } from '../../../../services/global.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-t-and-c-modal',
  standalone: true,
  imports: [
    HtmlTextComponent,
    CommonModule,
    NgSelectModule,
    FormsModule,

    MatExpansionModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
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
      "city": null,
      "state": null,
      "country": null,
    }
    this.profileService.getTermsAndConditions(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.description) {
        this.termsAndConditionsObj = response;
        console.log("this.termsAndConditionsObj >>>>>>", this.termsAndConditionsObj);

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
